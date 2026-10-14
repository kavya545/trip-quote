import { ApiError, readQuote, wait } from './mockApi';
import { DraftSchema, ProgressSchema, type Draft, type Progress, type QuoteDTO } from './schema';

/**
 * Mock of the endpoints that store a traveller's revision of a quotation:
 *   GET    /quotes/:id/progress          fetchProgress
 *   PUT    /quotes/:id/draft             saveDraft
 *   POST   /quotes/:id/revisions         submitRevision   ("Send to <agent>")
 *   POST   /quotes/:id/accept            acceptQuote      ("Accept quotation as sent")
 *   DELETE /quotes/:id/progress          resetProgress    ("Restart prototype")
 *
 * The "server's database" is localStorage, so saved work survives a page refresh. Every write is
 * validated against the quote the way a real backend would, and rejected with 409 once the quote
 * has been sent or accepted.
 */

/** Simulated write behaviour, set from the URL (?save=slow), so the saving and failed states can be seen. */
export type SaveMode = 'ok' | 'slow' | 'fail' | 'flaky';

const KEY = (id: string) => `trip-quote:progress:${id}`;
const memory = new Map<string, string>(); // used when localStorage is unavailable (e.g. blocked storage)
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return memory.get(k) ?? null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { memory.set(k, v); } },
  remove(k: string) { try { localStorage.removeItem(k); } catch { memory.delete(k); } },
};

const EMPTY: Progress = { status: 'draft', draft: null, savedAt: null, sentAt: null, acceptedAt: null };

function read(id: string): Progress {
  const raw = store.get(KEY(id));
  if (!raw) return EMPTY;
  try { return ProgressSchema.parse(JSON.parse(raw)); }
  catch { return EMPTY; } // unreadable or from an older format: start fresh rather than break the page
}
const write = (id: string, p: Progress) => store.set(KEY(id), JSON.stringify(p));

let writes = 0;
/** Network delay plus the failure modes. `flaky` fails every other write, so Retry succeeds. */
async function network(mode: SaveMode) {
  await wait(mode === 'slow' ? 2500 : 300 + Math.random() * 200);
  writes++;
  if (mode === 'fail' || (mode === 'flaky' && writes % 2 === 1)) throw new ApiError(503, 'The server didn’t respond.');
}

async function quoteOrThrow(id: string) {
  const q = await readQuote(id);
  if (!q) throw new ApiError(404, 'This quotation doesn’t exist.');
  return q;
}

/** Checks that a draft only refers to things in this quote. Returns the problems found. */
export function draftProblems(q: QuoteDTO, d: Draft): string[] {
  const out: string[] = [];
  const adults = q.trip.travellers.filter(t => t.type === 'adult').length;
  const nights = (s: QuoteDTO['stops'][number]) => Math.round((Date.parse(s.checkOut) - Date.parse(s.checkIn)) / 864e5);
  const dayNo = (iso: string) => Math.round((Date.parse(iso) - Date.parse(q.trip.startDate)) / 864e5) + 1;
  for (const [stopId, c] of Object.entries(d.hotels)) {
    const s = q.stops.find(x => x.id === stopId);
    if (!s) { out.push(`hotels.${stopId}: unknown stop`); continue; }
    const hotel = (hid: string) => s.hotels.find(h => h.id === hid);
    const h = hotel(c.hotel);
    if (!h) out.push(`hotels.${stopId}.hotel: unknown hotel "${c.hotel}"`);
    else if (c.mode === 'one' && !h.rooms.some(r => r.id === c.room)) out.push(`hotels.${stopId}.room: unknown room "${c.room}"`);
    if (c.mode === 'split' && (c.split.length !== nights(s) || c.split.some(x => !hotel(x)))) out.push(`hotels.${stopId}.split: needs one known hotel per night`);
    if (c.rooms > adults) out.push(`hotels.${stopId}.rooms: at most ${adults}`);
  }
  const acts = new Map(q.activities.map(a => [a.id, a]));
  for (const k of Object.keys(d.removed)) if (!acts.get(k)?.included) out.push(`removed.${k}: not an included activity`);
  for (const k of Object.keys(d.added)) if (!acts.has(k) || acts.get(k)!.included) out.push(`added.${k}: not an add-on`);
  for (const [k, day] of Object.entries(d.actDay)) {
    const a = acts.get(k), s = a && q.stops.find(x => x.id === a.stop);
    if (!a || !s) { out.push(`actDay.${k}: unknown activity`); continue; }
    const first = dayNo(s.checkIn);
    if (day < first || day >= first + nights(s)) out.push(`actDay.${k}: day ${day} is outside ${s.name}`);
  }
  const legs = new Set(q.segments.flatMap(g => g.legs.map(l => l.id)));
  for (const [k, text] of Object.entries(d.notes)) {
    if (!legs.has(k)) out.push(`notes.${k}: unknown travel leg`);
    if (text.length > 1000) out.push(`notes.${k}: longer than 1000 characters`);
  }
  if (d.message.length > 2000) out.push('message: longer than 2000 characters');
  return out;
}

async function validDraft(id: string, draft: Draft) {
  const parsed = DraftSchema.safeParse(draft);
  if (!parsed.success) throw new ApiError(422, 'Invalid changes: ' + parsed.error.issues.map(i => i.path.join('.') + ': ' + i.message).join('; '));
  const problems = draftProblems(await quoteOrThrow(id), parsed.data);
  if (problems.length) throw new ApiError(422, 'Invalid changes: ' + problems.join('; '));
  return parsed.data;
}

function assertEditable(p: Progress) {
  if (p.status !== 'draft') throw new ApiError(409, `This quotation has already been ${p.status}.`);
}

export async function fetchProgress(id: string, { signal }: { signal?: AbortSignal } = {}): Promise<Progress> {
  await wait(50, signal);
  return read(id);
}

export async function saveDraft(id: string, draft: Draft, mode: SaveMode = 'ok'): Promise<Progress> {
  await network(mode);
  const p = read(id); assertEditable(p);
  const next: Progress = { ...p, draft: await validDraft(id, draft), savedAt: Date.now() };
  write(id, next);
  return next;
}

export async function submitRevision(id: string, draft: Draft, mode: SaveMode = 'ok'): Promise<Progress> {
  await network(mode);
  const p = read(id); assertEditable(p);
  const now = Date.now();
  const next: Progress = { ...p, status: 'sent', draft: await validDraft(id, draft), savedAt: now, sentAt: now };
  write(id, next);
  return next;
}

export async function acceptQuote(id: string, mode: SaveMode = 'ok'): Promise<Progress> {
  await network(mode);
  const p = read(id); assertEditable(p);
  const next: Progress = { ...p, status: 'accepted', acceptedAt: Date.now() };
  write(id, next);
  return next;
}

export async function resetProgress(id: string, mode: SaveMode = 'ok'): Promise<void> {
  await network(mode === 'slow' ? 'slow' : 'ok'); // restarting the prototype never fails
  store.remove(KEY(id));
}
