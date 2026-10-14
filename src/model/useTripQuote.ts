import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  FLAT, R, dl, pl, segPrice, statusStyles,
  type Activity, type Hotel, type Room, type Segment, type Status, type StatusKey, type Stop, type TripData,
} from './data';
import { daysBetween, fmtMoment, localToday } from './dates';
import { demoChanges } from './demoChanges';
import { acceptQuote, resetProgress, submitRevision, type SaveMode } from '../api/progressApi';
import type { Draft, Progress } from '../api/schema';
import type { Autosave } from '../api/useAutosave';

export interface HotelCfg { mode: 'one' | 'split'; hotel: string; room: string; rooms: number; split: string[] }
type View = 'trip' | 'changes' | 'review' | 'sent';
type CatId = 'flights' | 'hotels' | 'transfers' | 'activities';
type Drawer = null | { type: 'hotel'; stop: string } | { type: 'act'; stop: string; day: number };
interface Snapshot {
  hotels: Record<string, HotelCfg>; removed: Record<string, boolean>; added: Record<string, boolean>;
  notes: Record<string, string>; actDay: Record<string, number>;
}
interface State extends Snapshot {
  view: View; accepted: boolean; closedStops: Record<string, boolean>; editing: string | null; draft: string;
  drawer: Drawer; draftRooms: Record<string, string>; filter: string; collapsed: Record<CatId, boolean>;
  message: string; toast: null | { msg: string; snap: Snapshot; id: number }; photoIdx: Record<string, number>;
  /** When the revised quotation was sent, as recorded by the server. */
  sentAt: number | null;
  /** A request to the server that the UI is waiting on. */
  busy: null | 'send' | 'accept' | 'restart';
  actionError: null | { action: 'send' | 'accept'; message: string };
}
type Patch = Partial<State>;
type Updater = (st: State) => Patch;

export interface TripQuoteProps {
  /** Opens on the edited trip from the second PDF. */
  startWithChanges?: boolean;
  /** Opens with the price summary folded, as in the 02b PDF. */
  summaryCollapsed?: boolean;
}

interface Change {
  cat: 'hotels' | 'activities' | 'transfers'; stop?: string; seg?: string; head: string; detail: string;
  status: StatusKey; delta: number; act?: Activity; kind?: 'removed' | 'added';
}

const hotelOf = (s: Stop, id: string) => s.hotels.find(h => h.id === id)!;
const roomOf = (h: Hotel, id: string): Room => h.rooms.find(r => r.id === id) || h.rooms[0];
const price = (s: Stop, c: Pick<HotelCfg, 'mode' | 'hotel' | 'room' | 'rooms' | 'split'>) => {
  if (c.mode === 'split') return c.split.reduce((a, id) => a + hotelOf(s, id).rooms[0].rate, 0) * c.rooms;
  return roomOf(hotelOf(s, c.hotel), c.room).rate * s.nights * c.rooms;
};
const origPrice = (s: Stop) => price(s, { mode: 'one', hotel: s.orig.hotel, room: s.orig.room, rooms: 1, split: [] });
const origLabel = (s: Stop) => { const h = hotelOf(s, s.orig.hotel); return h.name + ' · ' + roomOf(h, s.orig.room).name; };
const changed = (s: Stop, c: HotelCfg) => {
  if (c.mode === 'split') return !(c.split.every(x => x === s.orig.hotel) && hotelOf(s, s.orig.hotel).rooms[0].id === s.orig.room && c.rooms === 1);
  return c.hotel !== s.orig.hotel || c.room !== s.orig.room || c.rooms !== 1;
};
const hLabel = (s: Stop, c: HotelCfg) => {
  if (c.mode === 'split') { const a = hotelOf(s, c.split[0]), b = hotelOf(s, c.split[1]); return a.id === b.id ? a.name + ' · ' + a.rooms[0].name : a.name + ' + ' + b.name + ' · Split stay'; }
  const h = hotelOf(s, c.hotel); return h.name + ' · ' + roomOf(h, c.room).name + (c.rooms > 1 ? ' × ' + c.rooms + ' rooms' : '');
};
const hStatus = (s: Stop, c: HotelCfg): 'confirm' | 'locked' => { const ids = c.mode === 'split' ? c.split : [c.hotel]; return ids.some(i => hotelOf(s, i).status === 'confirm') ? 'confirm' : 'locked'; };

export const cfg = (h: string, r: string): HotelCfg => ({ mode: 'one', hotel: h, room: r, rooms: 1, split: [h, h] });

/** Starting state: the saved draft and status if there is one, otherwise the quotation as sent. */
function init(D: TripData, w: boolean, c: boolean, saved: Progress | null): State {
  const d = saved?.draft, demo = !d && w ? demoChanges(D) : null;
  const done = saved && saved.status !== 'draft';
  return {
    view: done ? 'sent' : 'trip', accepted: saved?.status === 'accepted',
    hotels: { ...Object.fromEntries(D.stops.map(s => [s.id, cfg(s.orig.hotel, s.orig.room)])), ...demo?.hotels, ...d?.hotels },
    removed: d?.removed ?? demo?.removed ?? {}, added: d?.added ?? demo?.added ?? {}, notes: d?.notes ?? demo?.notes ?? {},
    closedStops: {}, editing: null, draft: '', drawer: null, draftRooms: {}, filter: 'all',
    collapsed: { flights: c, hotels: c, transfers: c, activities: c }, message: d?.message ?? '', toast: null, actDay: d?.actDay ?? {}, photoIdx: {},
    sentAt: saved?.sentAt ?? null, busy: null, actionError: null,
  };
}

/** The part of the state the server stores. */
const toDraft = (S: State): Draft => ({ hotels: S.hotels, removed: S.removed, added: S.added, actDay: S.actDay, notes: S.notes, message: S.message });

/** Connection to the mock API for saving the traveller's revision. */
export interface Remote { quoteId: string; saveMode: SaveMode; progress: Progress; autosave: Autosave }

const errorText = (e: unknown) => e instanceof Error ? e.message : String(e);

export function useTripQuote(D: TripData, props: TripQuoteProps, remote: Remote) {
  const [S, setS] = useState<State>(() => init(D, !!props.startWithChanges, !!props.summaryCollapsed, remote.progress));
  const { queue: queueSave, lock: lockSave } = remote.autosave;
  const autosave = remote.autosave;
  /** After a failed send or accept: autosave again, re-queuing the edits that request would have carried. */
  const resumeSaving = () => { autosave.unlock(); autosave.queue(toDraft(S)); };
  const ST = statusStyles(D.agentFirstName);
  const agent = D.agentFirstName, adults = D.adults, adultsLabel = D.adultsLabel;
  const stopOf = (id: string) => D.stops.find(s => s.id === id)!;
  const setState = useCallback((u: Patch | Updater) => setS(prev => ({ ...prev, ...(typeof u === 'function' ? u(prev) : u) })), []);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setS(st => st.drawer ? { ...st, drawer: null } : st); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer.current); };
  }, []);

  // Save every edit to the server while the quote is still a draft.
  useEffect(() => {
    if (S.view === 'sent') lockSave(); else queueSave(toDraft(S));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.hotels, S.removed, S.added, S.actDay, S.notes, S.message, S.view === 'sent', queueSave, lockSave]);

  const act = (msg: string, updater: Updater) => {
    if (!msg) { setState(updater); return; }
    clearTimeout(timer.current);
    setState(st => ({ ...updater(st), toast: { msg, snap: { hotels: st.hotels, removed: st.removed, added: st.added, notes: st.notes, actDay: st.actDay }, id: Date.now() } }));
    timer.current = setTimeout(() => setState({ toast: null }), 4500);
  };
  const setCfg = (id: string, patch: Partial<HotelCfg>, msg: string) => act(msg, st => ({ hotels: { ...st.hotels, [id]: { ...st.hotels[id], ...patch } } }));
  const openHotel = (id: string, split: boolean) => setState(st => {
    const s = stopOf(id), c = st.hotels[id];
    const hotels = split && s.nights > 1 && c.mode !== 'split' ? { ...st.hotels, [id]: { ...c, mode: 'split' as const, split: [c.hotel, c.hotel] } } : st.hotels;
    return { drawer: { type: 'hotel', stop: id }, draftRooms: {}, hotels };
  });

  const active = (a: Activity) => a.included ? !S.removed[a.id] : !!S.added[a.id];
  const actPrice = (stopId: string, orig?: boolean) => D.acts.filter(a => a.stop === stopId).reduce((t, a) => {
    if (orig) return t + (a.included ? a.price : 0);
    if (a.included) return t + a.price - (S.removed[a.id] ? a.credit || 0 : 0);
    return t + (S.added[a.id] ? a.price : 0);
  }, 0);
  const gallery = (a: Activity, s: Stop) => {
    const gal = a.images.length ? a.images : [s.img];
    const pi = (S.photoIdx[a.id] || 0) % gal.length;
    return { url: gal[pi], dots: gal.map((_, i) => ({ bg: i === pi ? '#FFFFFF' : 'rgba(255,255,255,.5)' })), next: () => setState(st => ({ photoIdx: { ...st.photoIdx, [a.id]: (pi + 1) % gal.length } })) };
  };
  const dayOf = (a: Activity) => a.included ? a.day : (S.actDay[a.id] || a.day);
  const conflict = (o: Activity, dd?: number) => { const d = dd || dayOf(o); return D.acts.find(a => dayOf(a) === d && a.id !== o.id && active(a) && a.start < o.end && o.start < a.end); };

  const getChanges = (): Change[] => {
    const out: Change[] = [];
    D.stops.forEach(s => {
      const c = S.hotels[s.id];
      if (changed(s, c)) out.push({ cat: 'hotels', stop: s.id, head: `${s.name} · ${pl(s.nights)} · ${s.noun === 'houseboat' ? 'Stay' : 'Hotel'} swapped`, detail: hLabel(s, c), status: hStatus(s, c), delta: price(s, c) - origPrice(s) });
      D.acts.filter(a => a.stop === s.id).forEach(a => {
        if (a.included && S.removed[a.id]) out.push({ cat: 'activities', stop: s.id, head: `${s.name} · Day ${a.day} · Activity removed`, detail: 'Remove ' + a.name, status: 'locked', delta: -(a.credit || 0), act: a, kind: 'removed' });
        if (!a.included && S.added[a.id]) out.push({ cat: 'activities', stop: s.id, head: `${s.name} · Day ${dayOf(a)} · Activity added`, detail: 'Add ' + a.name, status: a.status!, delta: a.price, act: a, kind: 'added' });
      });
    });
    D.segs.forEach(g => g.legs.forEach(l => { if (S.notes[l.id]) out.push({ cat: 'transfers', seg: g.id, head: `${g.title} · ${l.mode} · Note on fixed ${l.mode.toLowerCase()}`, detail: '“' + S.notes[l.id] + '”', status: 'note', delta: 0 }); }));
    const ord = { hotels: 0, activities: 1, transfers: 2 };
    return out.sort((a, b) => ord[a.cat] - ord[b.cat]);
  };

  const changes = getChanges();
  const nCh = changes.length;
  const hotelsTotal = D.stops.reduce((t, s) => t + price(s, S.hotels[s.id]), 0);
  const actsTotal = D.stops.reduce((t, s) => t + actPrice(s.id), 0);
  const total = D.segs.reduce((t, g) => t + segPrice(g), 0) + hotelsTotal + actsTotal;
  const d = total - D.origTotal, dd = dl(d);
  const awaiting = changes.filter(c => c.status === 'confirm' && c.delta > 0).reduce((t, c) => t + c.delta, 0);
  const hasCh = nCh > 0;
  const go = (view: View) => () => setState({ view, drawer: null, editing: null });

  const stepIdx = { trip: 0, changes: 0, review: 1, sent: 2 }[S.view];
  const steps = ['Make it yours', 'Review', `Sent to ${agent}`].map((label, i) => {
    const done = i < stepIdx, cur = i === stepIdx;
    return { label, mark: done ? '✓' : String(i + 1), bg: done || cur ? '#FFFFFF' : '#5F6266', fg: done || cur ? '#1E1F21' : '#E4E4E2', labelColor: cur || done ? '#FFFFFF' : '#B5B7BA', labelWeight: cur ? 700 : 500, notLast: i < 2 };
  });

  const stopCount = (id: string) => { const n = changes.filter(c => c.stop === id).length; return { has: n > 0, label: n + ' change' + (n > 1 ? 's' : '') }; };
  const route = D.order.map(key => {
    const [t, id] = key.split(':');
    if (t === 'seg') { const g = D.segs.find(x => x.id === id)!; return { kind: 'leg' as const, key, ...g.strip }; }
    const s = stopOf(id); return { kind: 'stop' as const, key, name: s.name, dates: s.routeDates, badge: stopCount(id) };
  });
  const catCount = (k: string) => changes.filter(c => c.cat === k).length;
  const filters = ([['all', 'All', nCh], ['hotels', 'Hotels', catCount('hotels')], ['transfers', 'Transfers', catCount('transfers')], ['activities', 'Activities', catCount('activities')]] as const)
    .map(([id, label, count]) => { const on = S.filter === id; return { id, label, count, hasCount: count > 0, active: on, bg: on ? '#1E1F21' : '#FFFFFF', fg: on ? '#FFFFFF' : '#1E1F21', bd: on ? '#1E1F21' : '#CFCFCD', badgeBg: on ? '#FFFFFF' : '#1E1F21', badgeFg: on ? '#1E1F21' : '#FFFFFF', pick: () => setState({ filter: id }) }; });
  const F = S.filter;

  const blocks = D.order.map(key => {
    const [t, id] = key.split(':');
    if (t === 'seg') {
      if (!(F === 'all' || F === 'transfers')) return null;
      const g = D.segs.find(x => x.id === id)!;
      return { isSeg: true as const, key, title: g.title, kicker: g.kicker, mode: g.mode, legs: g.legs.map(l => {
        const note = S.notes[l.id] || '', editing = S.editing === l.id;
        return { ...l, price: R(l.price), dur: `${l.mode} · ${l.dur}`, fromTime: `${l.t1} · ${l.fromPlace}`, toTime: `${l.toPlace} · ${l.t2}`, note, hasNote: !!note && !editing, isEditing: editing, showAdd: !note && !editing,
          onEdit: () => setState({ editing: l.id, draft: note }),
          onSave: () => act(S.draft.trim() ? `Note saved · ${agent} will see it with your changes` : 'Note removed', st => { const notes = { ...st.notes }; const v = st.draft.trim(); if (v) notes[l.id] = v; else delete notes[l.id]; return { notes, editing: null, draft: '' }; }),
          onRemove: () => act('Note removed', st => { const notes = { ...st.notes }; delete notes[l.id]; return { notes }; }) };
      }) };
    }
    const sid = id;
    const s = stopOf(sid), c = S.hotels[sid];
    const showHotel = F === 'all' || F === 'hotels', showDays = F === 'all' || F === 'activities';
    if (!showHotel && !showDays) return null;
    const h = c.mode === 'split' ? hotelOf(s, c.split[0]) : hotelOf(s, c.hotel);
    const ch = changed(s, c), hd = dl(price(s, c) - origPrice(s)), st = ST[hStatus(s, c)];
    const remaining = D.acts.filter(a => a.stop === sid && !a.included && !S.added[a.id]).length;
    const open = !S.closedStops[sid];
    return { isSeg: false as const, key, kicker: `${s.label} · ${pl(s.nights)}`, name: s.name, showHotel: showHotel && open, showDays: showDays && open, dates: s.dates, dayRange: `${pl(s.nights)} · ${s.dayRange}`,
      photo: `linear-gradient(180deg, rgba(30,31,33,0) 30%, rgba(30,31,33,.72) 100%), url(${s.img})`, chevRot: open ? 'none' : 'rotate(-90deg)',
      toggle: () => setState(st2 => ({ closedStops: { ...st2.closedStops, [sid]: !st2.closedStops[sid] } })),
      hotel: { name: c.mode === 'split' && c.split[0] !== c.split[1] ? hotelOf(s, c.split[0]).name + ' + ' + hotelOf(s, c.split[1]).name : h.name,
        meta: c.mode === 'split' && c.split[0] !== c.split[1] ? 'Split stay · one night each' : h.meta,
        room: c.mode === 'split' ? 'Standard room each night' : roomOf(h, c.room).name + (c.rooms > 1 ? ' × ' + c.rooms : ''),
        thumb: `#3E4145 center/cover url(${h.img || s.img})`, border: ch ? '#98989B' : '#E4E4E2', meals: h.meals, nightsTxt: `${pl(s.nights)} · ${s.range}`, changed: ch, was: origLabel(s), stLabel: st.label, stBg: st.bg, stFg: st.fg,
        canSplit: s.nights > 1, changeLabel: 'Change ' + s.noun,
        price: R(price(s, c)), hasDelta: hd.has, deltaTxt: hd.txt, deltaWord: hd.word, deltaColor: hd.color,
        open: () => openHotel(sid, false), openSplit: () => openHotel(sid, true) },
      days: D.dayList.filter(x => x.stop === sid).map(day => {
        const acts = D.acts.filter(a => dayOf(a) === day.n && (a.included || S.added[a.id])).sort((a, b) => a.start < b.start ? -1 : 1).map(a => {
          const rem = !!(a.included && S.removed[a.id]);
          const sa = ST[a.status || 'included'];
          return { id: a.id, thumb: `#3E4145 center/cover url(${a.images[0] || s.img})`, name: a.name, time: `${a.start}–${a.end}`, isIncluded: !!a.included, isAdded: !a.included,
            priceLabel: rem ? 'Removed · ' + (a.credit ? R(a.credit) + ' credit' : 'no credit') : R(a.price) + ' · Included',
            thumbOpacity: rem ? 0.45 : 1, nameColor: rem ? '#6B6E72' : '#1E1F21',
            stLabel: sa.label, stBg: sa.bg, stFg: sa.fg, deltaTxt: '↑ ' + R(a.price),
            actionLabel: rem ? 'Undo' : 'Remove',
            onAction: () => act(rem ? `${a.name} is back in your trip` : `${a.name} removed` + (a.included ? (a.credit ? ` · ${R(a.credit)} credit` : ' · no credit') : ''), st2 => a.included ? { removed: { ...st2.removed, [a.id]: !st2.removed[a.id] } } : { added: { ...st2.added, [a.id]: false } }) };
        });
        return { n: day.n, date: day.date, title: day.title, acts, empty: acts.length === 0 };
      }),
      hasAdd: remaining > 0, addLabel: `Add an activity · ${remaining} option${remaining > 1 ? 's' : ''}`,
      openAdd: () => setState({ drawer: { type: 'act', stop: sid, day: s.days[0] } }),
    };
  }).filter(b => b !== null);

  const line = (label: string, sub: string, p: number, o: number) => { const x = dl(p - o); return { label, sub, price: R(p), orig: R(o), changed: p !== o, wasHead: `${x.txt.slice(0, 1)} ${x.word}`, wasColor: x.color, diffTxt: x.txt, diffWord: x.word, diffColor: x.color }; };
  const noteFor = (g: Segment) => g.legs.filter(l => S.notes[l.id]).map(l => `Your note: “${S.notes[l.id]}”`).join(' ');
  type Line = ReturnType<typeof line> & { desc: string; forceChanged?: boolean; st?: Status | null };
  const catDefs: { id: CatId; title: string; lines: Line[] }[] = [
    { id: 'flights', title: 'Flights & arrival', lines: D.segs.filter(g => g.cat === 'flights').map(g => ({ ...line(g.sumLabel, g.sumSub, segPrice(g), segPrice(g)), desc: noteFor(g) })) },
    { id: 'hotels', title: 'Hotels', lines: D.stops.map(s => { const c = S.hotels[s.id], ch = changed(s, c), st = ST[hStatus(s, c)]; return { ...line(`${s.name} · ${pl(s.nights)}`, hLabel(s, c), price(s, c), origPrice(s)), forceChanged: ch, desc: ch ? `${s.noun === 'houseboat' ? 'Stay' : 'Hotel'} swapped (was ${origLabel(s)})` : '', st: ch ? st : null }; }) },
    { id: 'transfers', title: 'Getting around', lines: D.segs.filter(g => g.cat === 'transfers').map(g => ({ ...line(g.sumLabel, g.sumSub, segPrice(g), segPrice(g)), desc: noteFor(g) })) },
    { id: 'activities', title: 'Activities', lines: D.stops.map(s => {
      const n = D.acts.filter(a => a.stop === s.id && active(a)).length;
      const cs = changes.filter(c => c.cat === 'activities' && c.stop === s.id);
      const desc = cs.map(c => c.kind === 'added' ? 'Added ' + c.act!.name : 'Removed ' + c.act!.name + (c.act!.credit ? ` (${R(c.act!.credit)} credit)` : ' (no credit)')).join(' · ');
      const st = cs.length ? (cs.some(c => c.status === 'confirm') ? ST.confirm : ST.locked) : null;
      return { ...line('Activities in ' + s.name, n + ' activit' + (n === 1 ? 'y' : 'ies'), actPrice(s.id), actPrice(s.id, true)), forceChanged: cs.length > 0, desc, st };
    }) },
  ];
  const allCollapsed = Object.values(S.collapsed).every(Boolean);
  const cats = catDefs.map(k => ({ id: k.id, title: k.title, lines: k.lines, collapsed: S.collapsed[k.id], expanded: !S.collapsed[k.id], rot: S.collapsed[k.id] ? 'rotate(-90deg)' : 'none',
    total: R(k.lines.reduce((t, l) => t + Number(l.price.replace(/[^\d]/g, '')), 0)),
    toggle: () => setState(st => ({ collapsed: { ...st.collapsed, [k.id]: !st.collapsed[k.id] } })) }));
  const reviewCats = catDefs.map(k => ({ id: k.id, title: k.title, lines: k.lines.map(l => {
    const hl = l.forceChanged || !!l.desc;
    return { ...l, priceWeight: hl ? 700 : 400, hasDesc: !!l.desc, hasStatus: !!l.st, stLabel: l.st ? l.st.label : '', stBg: l.st ? l.st.bg : '', stFg: l.st ? l.st.fg : '', bg: hl ? '#F4F4F3' : 'transparent' };
  }) }));

  // comparison
  const compare: { kicker: string; title: string; dates: string; rows: {
    label: string; chip: string; hasChip: boolean; chipBg: string; chipFg: string; origDeco: string; orig: string; rev: string; revWeight: number;
    revNote: string; hasRevNote: boolean; diffTxt: string; diffWord: string; diffColor: string; bg: string;
  }[] }[] = [];
  let stopNo = 0;
  D.order.forEach(key => {
    const [t, id] = key.split(':');
    if (t === 'seg') {
      const g = D.segs.find(x => x.id === id)!;
      if (!g.legs.some(l => S.notes[l.id])) return;
      compare.push({ kicker: g.mode, title: g.title, dates: g.kicker.split(' · ').slice(0, 2).join(' · '), rows: g.legs.map(l => {
        const n = S.notes[l.id];
        return { label: `${l.mode} · ${l.t1}–${l.t2}`, chip: 'Note added', hasChip: !!n, chipBg: '#F2F2F0', chipFg: '#1E1F21', origDeco: 'none', orig: l.cmp, rev: l.cmp.split(' · ')[0], revWeight: n ? 500 : 400, revNote: n || '', hasRevNote: !!n, diffTxt: '', diffWord: '', diffColor: FLAT, bg: n ? '#F8F8F7' : '#FFFFFF' };
      }) });
      return;
    }
    stopNo++;
    const sid = id;
    const s = stopOf(sid), c = S.hotels[sid], ch = changed(s, c), hx = dl(price(s, c) - origPrice(s));
    const rows: (typeof compare)[number]['rows'] = [{ label: `${s.noun === 'houseboat' ? 'Houseboat' : 'Hotel'} · ${pl(s.nights)}`, chip: 'Changed', hasChip: ch, chipBg: '#1E1F21', chipFg: '#FFFFFF', origDeco: ch ? 'line-through' : 'none', orig: origLabel(s), rev: hLabel(s, c), revWeight: ch ? 500 : 400, revNote: '', hasRevNote: false, diffTxt: ch ? hx.txt : '', diffWord: ch ? hx.word : '', diffColor: hx.color, bg: ch ? '#F8F8F7' : '#FFFFFF' }];
    D.acts.filter(a => a.stop === sid && (a.included || S.added[a.id])).sort((a, b) => dayOf(a) - dayOf(b) || (a.start < b.start ? -1 : 1)).forEach(a => {
      const rem = !!(a.included && S.removed[a.id]), add = !a.included;
      const x = rem ? dl(-(a.credit || 0)) : add ? dl(a.price) : dl(0);
      rows.push({ label: `Day ${dayOf(a)} · ${a.start}–${a.end}`, chip: rem ? 'Removed' : 'Added', hasChip: rem || add, chipBg: '#F2F2F0', chipFg: '#1E1F21', origDeco: 'none', orig: add ? '—' : a.name, rev: rem ? '—' : a.name, revWeight: add ? 500 : 400, revNote: '', hasRevNote: false,
        diffTxt: rem ? (a.credit ? x.txt : '₹0') : add ? x.txt : '', diffWord: rem ? (a.credit ? x.word : '') : add ? x.word : '', diffColor: x.color, bg: rem || add ? '#F8F8F7' : '#FFFFFF' });
    });
    compare.push({ kicker: `Stop ${stopNo} · ${pl(s.nights)}`, title: s.name, dates: s.dates, rows });
  });

  // drawer
  const DR = S.drawer;
  let hd: HotelDrawerView | null = null, ad: ActDrawerView | null = null, drawerTitle = '', drawerSub = '';
  if (DR && DR.type === 'hotel') {
    const s = stopOf(DR.stop), c = S.hotels[DR.stop], cur = price(s, c), one = c.mode === 'one';
    drawerTitle = `Choose your stay in ${s.name}`;
    drawerSub = `${pl(s.nights)} · ${s.subRange} · ${adultsLabel}`;
    hd = { canSplit: s.nights > 1, modeOne: one, modeSplit: !one, oneBg: one ? '#FFFFFF' : 'transparent', splitBg: one ? 'transparent' : '#FFFFFF', rooms: c.rooms,
      splitHint: one ? `Staying in two places? Split the ${s.nights} nights.` : 'Pick a place for each night.',
      // Keep the room only if the first night's hotel has it; otherwise use that hotel's first room.
      setOne: () => one ? null : setCfg(DR.stop, { mode: 'one', hotel: c.split[0], room: roomOf(hotelOf(s, c.split[0]), c.room).id }, 'Back to one hotel'),
      setSplit: () => one ? setCfg(DR.stop, { mode: 'split', split: [c.hotel, c.hotel] }, 'Split stay on · pick a place for each night') : null,
      dec: () => c.rooms > 1 && setCfg(DR.stop, { rooms: c.rooms - 1 }, `${c.rooms - 1} room for ${adultsLabel}`),
      inc: () => c.rooms < adults ? setCfg(DR.stop, { rooms: c.rooms + 1 }, `${c.rooms + 1} rooms · price updated`) : act(`${adultsLabel} can book up to ${adults} room${adults === 1 ? '' : 's'}`, () => ({})),
      nightOpts: s.hotels.map(h => ({ id: h.id, label: `${h.name} · ${R(h.rooms[0].rate)}/night` })),
      nights: s.nightDates.map((dt, i) => ({ label: `Night ${i + 1} · ${dt}`, value: c.split[i], onChange: (e: ChangeEvent<HTMLSelectElement>) => { const v = e.target.value; const sp = [...c.split]; sp[i] = v; setCfg(DR.stop, { split: sp }, `Night ${i + 1} · ${hotelOf(s, v).name}`); } })),
      splitCalc: (() => { const x = dl(cur - origPrice(s)); return `${c.split.map(id => R(hotelOf(s, id).rooms[0].rate)).join(' + ')} × ${c.rooms} room${c.rooms > 1 ? 's' : ''} = ${R(cur)}` + (x.has ? ` (${x.txt} vs. ${agent}’s original)` : ''); })(),
      options: s.hotels.map(h => {
        const sel = one && c.hotel === h.id;
        const roomId = sel ? c.room : (S.draftRooms[h.id] || h.rooms[0].id);
        const room = roomOf(h, roomId), p = room.rate * s.nights * c.rooms;
        const vs = sel ? dl(p - origPrice(s)) : dl(p - cur);
        const st = ST[h.status];
        const isOrig = h.id === s.orig.hotel;
        const gal = [...new Set([h.img || s.img, s.img, D.heroImage])]; const pi = (S.photoIdx[h.id] || 0) % gal.length;
        return { id: h.id, photo: `url(${gal[pi]})`, dots: gal.map((_, i) => ({ bg: i === pi ? '#FFFFFF' : 'rgba(255,255,255,.5)' })), nextPhoto: () => setState(st2 => ({ photoIdx: { ...st2.photoIdx, [h.id]: (pi + 1) % gal.length } })), priceTotal: R(p), hasChip: sel || isOrig, chip: sel ? 'Selected' : 'In your quotation', hasVs: vs.has, border: sel ? '2px solid #1E1F21' : '1px solid #E4E4E2', name: h.name, meta: h.meta, meals: h.meals, blurb: h.blurb, features: h.features, stLabel: st.label, stBg: st.bg, stFg: st.fg, roomId, selected: sel, notSelected: !sel, chooseLabel: 'Choose this ' + s.noun,
          vsTxt: sel ? `${vs.txt} ${vs.word.toLowerCase()} than original` : `${vs.txt} ${vs.word.toLowerCase()}`, vsColor: vs.color,
          roomOpts: h.rooms.map(r => ({ id: r.id, label: `${r.name} · ${R(r.rate)}/night` })),
          onRoom: (e: ChangeEvent<HTMLSelectElement>) => { const v = e.target.value; if (sel) setCfg(DR.stop, { room: v }, 'Room type updated · ' + roomOf(h, v).name); else setState(st2 => ({ draftRooms: { ...st2.draftRooms, [h.id]: v } })); },
          choose: () => setCfg(DR.stop, { mode: 'one', hotel: h.id, room: roomId }, `${h.name} selected for ${s.name}`) };
      }) };
  }
  if (DR && DR.type === 'act') {
    const s = stopOf(DR.stop);
    const dys = D.dayList.filter(x => x.stop === s.id);
    const cur = dys.find(x => x.n === DR.day) || dys[0];
    drawerTitle = `Activities in ${s.name}`;
    drawerSub = `${s.dayRange} · ${s.dates} · prices for ${adultsLabel}`;
    const inc = D.acts.filter(a => a.stop === s.id && a.included), opts = D.acts.filter(a => a.stop === s.id && !a.included);
    ad = { city: s.name, multiDay: dys.length > 1,
      tabs: dys.map(x => ({ label: `Day ${x.n} · ${x.date}`, bg: x.n === cur.n ? '#FFFFFF' : 'transparent', pick: () => setState({ drawer: { ...DR, day: x.n } }) })),
      included: inc.map(a => { const rem = !!S.removed[a.id]; const g = gallery(a, s); return { id: a.id, photo: `url(${g.url})`, dots: g.dots, nextPhoto: g.next, photoOpacity: rem ? 0.5 : 1, dayLabel: `Day ${a.day}`, name: a.name, time: `${a.start}–${a.end}`, blurb: a.blurb, price: R(a.price), deco: rem ? 'line-through' : 'none',
        creditTxt: rem ? (a.credit ? `Removed · ${R(a.credit)} credit` : 'Removed · no credit') : (a.credit ? `${R(a.credit)} credit if removed` : 'No credit if removed'),
        btn: rem ? 'Undo' : 'Remove', onToggle: () => act(rem ? `${a.name} is back in your trip` : `${a.name} removed` + (a.credit ? ` · ${R(a.credit)} credit` : ' · no credit'), st2 => ({ removed: { ...st2.removed, [a.id]: !st2.removed[a.id] } })) }; }),
      options: opts.map(o => { const added = !!S.added[o.id], own = dayOf(o), here = added && own === cur.n, cf = conflict(o, cur.n), st = ST[o.status!];
        const g = gallery(o, s); return { id: o.id, photo: `url(${g.url})`, dots: g.dots, nextPhoto: g.next, border: here ? '2px solid #1E1F21' : '1px solid #E4E4E2', extraSuffix: o.extra ? ' · ' + o.extra : '', addBg: cf ? '#98989B' : '#1E1F21', addCursor: cf ? 'not-allowed' : 'pointer', name: o.name, time: `${o.start}–${o.end}`, blurb: o.blurb, stLabel: st.label, stBg: st.bg, stFg: st.fg, warn: o.warn || '', hasWarn: !!o.warn,
          dayShort: 'Day ' + own, deltaTxt: '↑ ' + R(o.price), added, notAdded: !added, canMove: added && !here, hasConflict: !!cf && !here,
          conflict: cf && !here ? `Overlaps with ${cf.name} on Day ${cur.n} (${cf.start}–${cf.end}). Try another day.` : '',
          onAdd: () => act(`${o.name} added to Day ${cur.n} · ↑ ${R(o.price)}`, st2 => ({ added: { ...st2.added, [o.id]: true }, actDay: { ...st2.actDay, [o.id]: cur.n } })),
          onMove: () => act(`${o.name} moved to Day ${cur.n}`, st2 => ({ actDay: { ...st2.actDay, [o.id]: cur.n } })),
          onRemove: () => act(`${o.name} removed`, st2 => ({ added: { ...st2.added, [o.id]: false } })) }; }) };
  }

  const nConfirm = changes.filter(c => c.status === 'confirm').length;
  const sentList = changes.map(c => { const x = dl(c.delta); const st = c.status === 'confirm' ? { label: 'Awaiting confirmation', bg: '#1E1F21', fg: '#FFFFFF' } : ST[c.status];
    return { head: c.head, detail: c.detail, stLabel: st.label, stBg: st.bg, stFg: st.fg, txt: c.status === 'note' ? '—' : (c.delta ? x.txt : '₹0'), word: x.word, color: x.color }; });

  return {
    trip: D, agent, agentPossessive: D.agentPossessive, adultsLabel, steps, route,
    daysLeft: daysBetween(localToday(new Date()), D.validUntilIso),
    quoteLabel: hasCh ? 'Estimated with your changes' : 'Your quotation',
    perPerson: R(total / adults), totalLine: `${R(total)} total · ${adultsLabel} · incl. GST`, total: R(total), origTotal: R(D.origTotal),
    totalWord: hasCh ? 'Estimated total' : 'Total',
    totalDelta: { ...dd, head: dd.has ? `${dd.txt} ${dd.word.toLowerCase()}` : '' },
    hasAwaiting: awaiting > 0, awaitingTxt: '↑ ' + R(awaiting),
    isPlanner: S.view === 'trip' || S.view === 'changes', isTrip: S.view === 'trip', isChanges: S.view === 'changes', isReview: S.view === 'review', isSent: S.view === 'sent',
    tabTripBg: S.view === 'trip' ? '#FFFFFF' : 'transparent', tabChangesBg: S.view === 'changes' ? '#FFFFFF' : 'transparent', tabTripSh: S.view === 'trip' ? '0 1px 3px rgba(30,31,33,.12)' : 'none', tabChangesSh: S.view === 'changes' ? '0 1px 3px rgba(30,31,33,.12)' : 'none',
    goTrip: go('trip'), goChanges: go('changes'), goReview: go('review'),
    hasChanges: hasCh, noChanges: !hasCh, changeCount: nCh, filters, blocks, compare, cats, reviewCats,
    toggleAllLabel: allCollapsed ? 'Expand all' : 'Collapse all',
    toggleAll: () => setState({ collapsed: { flights: !allCollapsed, hotels: !allCollapsed, transfers: !allCollapsed, activities: !allCollapsed } }),
    draft: S.draft, onDraft: (e: ChangeEvent<HTMLTextAreaElement>) => setState({ draft: e.target.value }), cancelNote: () => setState({ editing: null, draft: '' }),
    notesList: D.segs.flatMap(g => g.legs.filter(l => S.notes[l.id]).map(l => ({ id: l.id, where: `${g.title} · ${l.mode} · ${l.t1}–${l.t2}`, text: S.notes[l.id] }))),
    hasNotes: Object.keys(S.notes).length > 0,
    message: S.message, onMessage: (e: ChangeEvent<HTMLTextAreaElement>) => setState({ message: e.target.value }), hasMessage: !!S.message.trim(),
    send: async () => {
      if (S.busy) return;
      autosave.lock(); // this request carries the latest draft
      setState({ busy: 'send', actionError: null });
      try {
        const p = await submitRevision(remote.quoteId, toDraft(S), remote.saveMode);
        setState({ view: 'sent', accepted: false, sentAt: p.sentAt, busy: null }); window.scrollTo(0, 0);
      } catch (e) { resumeSaving(); setState({ busy: null, actionError: { action: 'send', message: errorText(e) } }); }
    },
    accept: async () => {
      if (S.busy) return;
      autosave.lock();
      setState({ busy: 'accept', actionError: null });
      try {
        await acceptQuote(remote.quoteId, remote.saveMode);
        setState({ view: 'sent', accepted: true, busy: null }); window.scrollTo(0, 0);
      } catch (e) { resumeSaving(); setState({ busy: null, actionError: { action: 'accept', message: errorText(e) } }); }
    },
    restart: async () => {
      if (S.busy) return;
      setState({ busy: 'restart' });
      await resetProgress(remote.quoteId, remote.saveMode);
      const fresh = init(D, false, !!props.summaryCollapsed, null);
      autosave.unlock(toDraft(fresh));
      setS(fresh); window.scrollTo(0, 0);
    },
    sending: S.busy === 'send', accepting: S.busy === 'accept', restarting: S.busy === 'restart',
    sendError: S.actionError?.action === 'send' ? S.actionError.message : '',
    acceptError: S.actionError?.action === 'accept' ? S.actionError.message : '',
    sentTitle: S.accepted ? `You’ve accepted ${agent}’s quotation` : `Your changes are with ${agent}`,
    sentPara: S.accepted ? `${agent} will start booking your trip as quoted and send payment details by email, usually within one working day.`
      : `Revision v${D.revision + 1} was sent on ${fmtMoment(new Date(S.sentAt ?? Date.now()))}. ` + (nConfirm ? `${agent} will check availability for ${nConfirm} change${nConfirm > 1 ? 's' : ''} marked “awaiting confirmation” and confirm the final price. ` : `Every change has a locked price, so ${agent} just needs to confirm. `) + 'You’ll get an email when the updated quotation is ready, usually within one working day.',
    sentList, sentTotalLabel: S.accepted ? 'Total' : `Estimated total (was ${R(D.origTotal)})`,
    drawerOpen: !!DR, isHotelDrawer: !!DR && DR.type === 'hotel', isActDrawer: !!DR && DR.type === 'act', drawerTitle, drawerSub, hd, ad,
    closeDrawer: () => setState({ drawer: null }),
    drawerW: '640px',
    hasToast: !!S.toast, toastMsg: S.toast ? S.toast.msg : '', toastTotal: R(total),
    undoToast: () => { clearTimeout(timer.current); setState(st => st.toast ? { ...st.toast.snap, toast: null } : {}); },
    closeToast: () => { clearTimeout(timer.current); setState({ toast: null }); },
  };
}

export interface HotelDrawerView {
  canSplit: boolean; modeOne: boolean; modeSplit: boolean; oneBg: string; splitBg: string; rooms: number; splitHint: string;
  setOne: () => void; setSplit: () => void; dec: () => void; inc: () => void;
  nightOpts: { id: string; label: string }[];
  nights: { label: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void }[];
  splitCalc: string;
  options: {
    id: string; photo: string; dots: { bg: string }[]; nextPhoto: () => void; priceTotal: string; hasChip: boolean; chip: string; hasVs: boolean;
    border: string; name: string; meta: string; meals: string; blurb: string; features: string[]; stLabel: string; stBg: string; stFg: string;
    roomId: string; selected: boolean; notSelected: boolean; chooseLabel: string; vsTxt: string; vsColor: string;
    roomOpts: { id: string; label: string }[]; onRoom: (e: ChangeEvent<HTMLSelectElement>) => void; choose: () => void;
  }[];
}

export interface ActDrawerView {
  city: string; multiDay: boolean;
  tabs: { label: string; bg: string; pick: () => void }[];
  included: {
    id: string; photo: string; dots: { bg: string }[]; nextPhoto: () => void; photoOpacity: number; dayLabel: string; name: string; time: string;
    blurb: string; price: string; deco: string; creditTxt: string; btn: string; onToggle: () => void;
  }[];
  options: {
    id: string; photo: string; dots: { bg: string }[]; nextPhoto: () => void; border: string; extraSuffix: string; addBg: string; addCursor: string;
    name: string; time: string; blurb: string; stLabel: string; stBg: string; stFg: string; warn: string; hasWarn: boolean; dayShort: string;
    deltaTxt: string; added: boolean; notAdded: boolean; canMove: boolean; hasConflict: boolean; conflict: string;
    onAdd: () => void; onMove: () => void; onRemove: () => void;
  }[];
}

export type TripView = ReturnType<typeof useTripQuote>;
export type Block = TripView['blocks'][number];
export type SegBlock = Extract<Block, { isSeg: true }>;
export type StopBlock = Extract<Block, { isSeg: false }>;
