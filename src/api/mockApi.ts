import { z } from 'zod';
import { FileSchemas, QuoteSchema, type QuoteDTO } from './schema';

/** Forces a response, so the loading, empty and error states can be seen. Set from the URL, e.g. ?scenario=error. */
export type Scenario = 'ok' | 'empty' | 'notfound' | 'error';

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

// Each quote's JSON files load lazily, the way they would arrive from a server.
const QUOTES: Record<string, () => Promise<unknown[]>> = {
  'Q-2481': () => Promise.all([
    import('../data/quotes/q-2481/trip.json'),
    import('../data/quotes/q-2481/stops.json'),
    import('../data/quotes/q-2481/activities.json'),
    import('../data/quotes/q-2481/segments.json'),
  ]).then(mods => mods.map(m => m.default)),
};

export const wait = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason); }, { once: true });
});

interface FetchOptions { signal?: AbortSignal; delayMs?: number; scenario?: Scenario }

/**
 * Mock of GET /quotes/:id. Waits a short, slightly random time like a network call,
 * then validates the JSON against the schema. Resolves to null when the quote doesn't exist.
 */
export async function fetchQuote(id: string, { signal, delayMs, scenario = 'ok' }: FetchOptions = {}): Promise<QuoteDTO | null> {
  await wait(delayMs ?? 400 + Math.random() * 300, signal);
  if (scenario === 'error') throw new ApiError(503, 'The quotation service is not responding.');
  if (scenario === 'notfound') return null;
  const q = await readQuote(id);
  if (q && scenario === 'empty') return { trip: { ...q.trip, itinerary: [] }, stops: [], activities: [], segments: [] };
  return q;
}

/** Server-side read of a quote's JSON files, validated against the schema. Null when the quote doesn't exist. */
export async function readQuote(id: string): Promise<QuoteDTO | null> {
  const load = QUOTES[id];
  if (!load) return null;
  const [tripRaw, stopsRaw, activitiesRaw, segmentsRaw] = await load();
  try {
    return QuoteSchema.parse({
      trip: FileSchemas.trip.parse(tripRaw),
      stops: FileSchemas.stops.parse(stopsRaw).stops,
      activities: FileSchemas.activities.parse(activitiesRaw).activities,
      segments: FileSchemas.segments.parse(segmentsRaw).segments,
    });
  } catch (e) {
    if (e instanceof z.ZodError) throw new ApiError(500, 'The quotation data is invalid. ' + e.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
    throw e;
  }
}
