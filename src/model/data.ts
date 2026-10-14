import { color } from '../tokens';
// Display-ready shapes of the quote, built from the API data by derive.ts, plus formatting helpers.

export type StatusKey = 'locked' | 'confirm' | 'included' | 'note';
export interface Status { label: string; bg: string; fg: string }

export interface Room { id: string; name: string; rate: number }
export interface Hotel {
  id: string; img: string; name: string; meta: string; meals: string; status: 'locked' | 'confirm';
  blurb: string; features: string[]; rooms: Room[];
}
export interface Stop {
  id: string; name: string; img: string;
  /** "First stop", "Next stop", "Last stop" */
  label: string; nights: number;
  /** "Tue 10 – Thu 12 Nov" */
  dates: string;
  /** "10 Nov–12 Nov" */
  range: string;
  /** "10–12 Nov" for the route strip */
  routeDates: string;
  /** "Days 1–2" */
  dayRange: string;
  /** "Tue 10 Nov to Thu 12 Nov" */
  subRange: string;
  nightDates: string[]; days: number[]; noun: 'hotel' | 'houseboat';
  orig: { hotel: string; room: string }; hotels: Hotel[];
}
export interface Day { n: number; date: string; title: string; stop: string }
export interface Activity {
  id: string; images: string[]; day: number; stop: string; name: string; start: string; end: string; price: number;
  included?: boolean; credit?: number; status?: 'locked' | 'confirm'; extra?: string; warn?: string; blurb: string;
}
export interface Leg {
  id: string; mode: string; fromCode: string; fromPlace: string; t1: string; toCode: string; toPlace: string; t2: string;
  dur: string; price: number; desc: string; cmp: string;
}
export interface Segment {
  id: string; title: string; kicker: string; mode: string; cat: 'flights' | 'transfers'; sumLabel: string; sumSub: string; legs: Leg[];
  /** Route-strip connector: "Flight · 1h 10m" over "10 Nov · 10:50" */
  strip: { label: string; when: string; hasTime: boolean };
}

export interface TripData {
  id: string; revision: number; title: string; region: string; heroImage: string; homeCity: string;
  /** "Tue 10 – Sun 15 Nov 2026" */
  dates: string; startDay: string; endDay: string; days: number; nights: number;
  includes: string; validUntil: string; validUntilIso: string; sentOn: string;
  agentName: string; agentFirstName: string; agentPossessive: string;
  user: { name: string; initials: string }; travellerNames: string; adults: number; adultsLabel: string;
  stops: Stop[]; dayList: Day[]; acts: Activity[]; segs: Segment[]; order: string[];
  /** Total of the quotation as sent, computed from the original picks. */
  origTotal: number;
  isEmpty: boolean;
}

export const R = (n: number) => '₹' + Math.round(Math.abs(n)).toLocaleString('en-IN');
export const statusStyles = (agent: string): Record<StatusKey, Status> => ({
  locked: { label: 'Locked price', bg: color.pillLocked, fg: color.ink },
  confirm: { label: `${agent} will confirm`, bg: color.ink, fg: color.white },
  included: { label: 'Included', bg: color.chip, fg: color.textSecondary },
  note: { label: 'Note sent', bg: color.chip, fg: color.textSecondary },
});
export const LOWER = color.lower, HIGHER = color.higher, FLAT = color.textSecondary;
export interface Delta { txt: string; word: string; color: string; has: boolean }
export const dl = (d: number): Delta => !d ? { txt: '—', word: '', color: FLAT, has: false } : d < 0 ? { txt: '↓ ' + R(d), word: 'Lower', color: LOWER, has: true } : { txt: '↑ ' + R(d), word: 'Higher', color: HIGHER, has: true };
export const pl = (n: number) => n + ' night' + (n > 1 ? 's' : '');
export const segPrice = (g: Segment) => g.legs.reduce((t, l) => t + l.price, 0);
