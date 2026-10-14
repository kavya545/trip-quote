import type { QuoteDTO } from '../api/schema';
import type { Activity, Segment, Stop, TripData } from './data';
import {
  addDays, daysBetween, fmtDay, fmtDayMonth, fmtLegDuration, fmtRange, fmtShortRange, fmtStripDuration, minutesBetween,
} from './dates';

/** Turns the API response into display-ready data: dates, day numbers, durations and the original total are computed here. */
export function deriveTrip(q: QuoteDTO): TripData {
  const { trip } = q;
  const dayNo = (iso: string) => daysBetween(trip.startDate, iso) + 1;
  const adults = trip.travellers.filter(t => t.type === 'adult').length;
  const names = trip.travellers.map(t => t.name);

  const stops: Stop[] = q.stops.map((s, i) => {
    const nights = daysBetween(s.checkIn, s.checkOut);
    const nightIsos = Array.from({ length: nights }, (_, k) => addDays(s.checkIn, k));
    const days = nightIsos.map(dayNo);
    return {
      id: s.id, name: s.name, img: s.image, nights, noun: s.kind, orig: s.original,
      label: i === 0 ? 'First stop' : i === q.stops.length - 1 ? 'Last stop' : 'Next stop',
      dates: fmtRange(s.checkIn, s.checkOut),
      range: `${fmtDayMonth(s.checkIn)}–${fmtDayMonth(s.checkOut)}`,
      routeDates: fmtShortRange(s.checkIn, s.checkOut),
      dayRange: days.length > 1 ? `Days ${days[0]}–${days[days.length - 1]}` : `Day ${days[0]}`,
      subRange: `${fmtDay(s.checkIn)} to ${fmtDay(s.checkOut)}`,
      nightDates: nightIsos.map(fmtDay), days,
      hotels: s.hotels.map(h => ({ id: h.id, img: h.image, name: h.name, meta: h.meta, meals: h.meals, status: h.status, blurb: h.blurb, features: h.features, rooms: h.rooms })),
    };
  });

  const dayList = q.stops.flatMap(s => s.dayTitles.map((title, k) => {
    const iso = addDays(s.checkIn, k);
    return { n: dayNo(iso), date: fmtDay(iso), title, stop: s.id };
  }));

  const acts: Activity[] = q.activities.map(a => ({
    id: a.id, images: a.images, day: dayNo(a.date), stop: a.stop, name: a.name, start: a.start, end: a.end, price: a.price,
    included: a.included || undefined, credit: a.credit, status: a.status, extra: a.extra, warn: a.warn, blurb: a.blurb,
  }));

  const segs: Segment[] = q.segments.map(g => {
    const legMin = (id: string) => { const l = g.legs.find(x => x.id === id)!; return minutesBetween(l.from.time, l.to.time); };
    const stripMin = g.strip.durationLegs.reduce((t, id) => t + legMin(id), 0);
    const tl = g.strip.timeLeg, tLeg = tl && g.legs.find(l => l.id === tl.leg)!;
    const modes = [...new Set(g.legs.map(l => l.mode))];
    return {
      id: g.id, title: g.title, mode: g.mode, cat: g.category, sumLabel: g.summaryLabel,
      kicker: `Day ${dayNo(g.date)} · ${fmtDay(g.date)} · Included in your trip`,
      sumSub: `${modes.join(' + ')} · Day ${dayNo(g.date)}`,
      strip: {
        label: g.strip.label + (stripMin ? ' · ' + fmtStripDuration(stripMin) : ''),
        when: fmtDayMonth(g.date) + (tLeg ? ' · ' + (tl.at === 'arrival' ? tLeg.to.time : tLeg.from.time) : ''),
        hasTime: !!tLeg,
      },
      legs: g.legs.map(l => ({
        id: l.id, mode: l.mode, fromCode: l.from.code, fromPlace: l.from.place, t1: l.from.time, toCode: l.to.code, toPlace: l.to.place, t2: l.to.time,
        dur: fmtLegDuration(minutesBetween(l.from.time, l.to.time), l.approximate), price: l.price, desc: l.description, cmp: l.comparison,
      })),
    };
  });

  const nights = daysBetween(trip.startDate, trip.endDate);
  const origHotels = stops.reduce((t, s) => t + s.hotels.find(h => h.id === s.orig.hotel)!.rooms.find(r => r.id === s.orig.room)!.rate * s.nights, 0);
  const origTotal = segs.reduce((t, g) => t + g.legs.reduce((u, l) => u + l.price, 0), 0) + origHotels
    + acts.filter(a => a.included).reduce((t, a) => t + a.price, 0);

  return {
    id: trip.id, revision: trip.revision, title: trip.title, region: trip.region, heroImage: trip.heroImage, homeCity: trip.homeCity,
    dates: fmtRange(trip.startDate, trip.endDate, true), startDay: fmtDay(trip.startDate), endDay: fmtDay(trip.endDate),
    days: nights + 1, nights,
    includes: trip.includes.join(', '),
    validUntil: fmtDay(trip.validUntil), validUntilIso: trip.validUntil, sentOn: fmtDay(trip.sentAt),
    agentName: trip.agent.name, agentFirstName: trip.agent.name.split(' ')[0], agentPossessive: trip.agent.possessive,
    user: { name: trip.travellers[0].name, initials: trip.travellers[0].initials },
    travellerNames: names.length > 1 ? names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1] : names[0],
    adults, adultsLabel: `${adults} adult${adults === 1 ? '' : 's'}`,
    stops, dayList, acts, segs, order: trip.itinerary, origTotal,
    isEmpty: trip.itinerary.length === 0,
  };
}
