// Calendar dates are "YYYY-MM-DD" strings handled in UTC, so a weekday never shifts with the viewer's time zone.
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 864e5;

export const parseDay = (iso: string) => new Date(iso + 'T00:00:00Z');
export const addDays = (iso: string, n: number) => new Date(parseDay(iso).getTime() + n * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (from: string, to: string) => Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / DAY_MS);

const parts = (iso: string) => { const d = parseDay(iso); return { wd: WD[d.getUTCDay()], day: d.getUTCDate(), mon: MON[d.getUTCMonth()], year: d.getUTCFullYear() }; };
const sameMonth = (a: string, b: string) => a.slice(0, 7) === b.slice(0, 7);

/** "Tue 10 Nov" */
export const fmtDay = (iso: string) => { const p = parts(iso); return `${p.wd} ${p.day} ${p.mon}`; };
/** "10 Nov" */
export const fmtDayMonth = (iso: string) => { const p = parts(iso); return `${p.day} ${p.mon}`; };
/** "Tue 10 – Thu 12 Nov", or "Sat 31 Oct – Mon 2 Nov" across months; optionally with the year. */
export const fmtRange = (a: string, b: string, withYear = false) => {
  const pa = parts(a), pb = parts(b);
  return `${pa.wd} ${pa.day}${sameMonth(a, b) ? '' : ' ' + pa.mon} – ${fmtDay(b)}${withYear ? ' ' + pb.year : ''}`;
};
/** "10–12 Nov", or "31 Oct–2 Nov" across months. */
export const fmtShortRange = (a: string, b: string) => sameMonth(a, b) ? `${parts(a).day}–${fmtDayMonth(b)}` : `${fmtDayMonth(a)}–${fmtDayMonth(b)}`;

/** Today's calendar date in the viewer's local time zone, as "YYYY-MM-DD". */
export const localToday = (now: Date) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
/** "Tue 29 Sep at 14:05" in the viewer's local time. */
export const fmtMoment = (d: Date) => `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} at ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/** Minutes between two "HH:MM" clock times; an end before the start is taken to be the next day. */
export const minutesBetween = (start: string, end: string) => {
  const m = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  return (m(end) - m(start) + 1440) % 1440;
};
/** Leg duration: "1 h 10 min", "4 h", or "about 1 h" when approximate. */
export const fmtLegDuration = (min: number, approximate: boolean) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (approximate) return `about ${Math.max(1, Math.round(min / 60))} h`;
  return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
};
/** Route-strip duration: "4.5 h" for whole or half hours, otherwise "1h 10m". */
export const fmtStripDuration = (min: number) => min % 30 === 0 ? `${min / 60} h` : `${Math.floor(min / 60)}h ${min % 60}m`;
