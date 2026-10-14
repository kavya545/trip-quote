import type { TripData } from './data';
import type { HotelCfg } from './useTripQuote';

/**
 * The edited trip from the design's second PDF, used by the `startWithChanges` prop.
 * This is prototype state, not trip data, so it lives in code; each change is only applied
 * when the quote actually contains the hotel, room, activity or leg it refers to.
 */
const PRESET = {
  hotels: [{ stop: 'kochi', hotel: 'lagoon', room: 'std' }, { stop: 'munnar', hotel: 'misty', room: 'cottage' }],
  removed: ['heritage'],
  added: ['cooking'],
  notes: { f1: 'Our flight may move to the earlier 07:30 departure. Can the flight and pickup be flexible?' } as Record<string, string>,
};

export function demoChanges(D: TripData) {
  const hasRoom = (stop: string, hotel: string, room: string) =>
    !!D.stops.find(s => s.id === stop)?.hotels.find(h => h.id === hotel)?.rooms.some(r => r.id === room);
  const act = (id: string, included: boolean) => D.acts.some(a => a.id === id && !!a.included === included);
  const legs = new Set(D.segs.flatMap(g => g.legs.map(l => l.id)));
  const hotels: Record<string, HotelCfg> = {};
  for (const h of PRESET.hotels) if (hasRoom(h.stop, h.hotel, h.room)) hotels[h.stop] = { mode: 'one', hotel: h.hotel, room: h.room, rooms: 1, split: [h.hotel, h.hotel] };
  return {
    hotels,
    removed: Object.fromEntries(PRESET.removed.filter(id => act(id, true)).map(id => [id, true])),
    added: Object.fromEntries(PRESET.added.filter(id => act(id, false)).map(id => [id, true])),
    notes: Object.fromEntries(Object.entries(PRESET.notes).filter(([id]) => legs.has(id))),
  };
}
