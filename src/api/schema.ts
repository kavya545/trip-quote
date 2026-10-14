import { z } from 'zod';

/** Calendar date without a time zone, e.g. "2026-11-10". */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date like 2026-11-10');
/** 24-hour local clock time, e.g. "09:40". */
const clockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected a time like 09:40');
const id = z.string().min(1);
const money = z.number().int().nonnegative();
const priceStatus = z.enum(['locked', 'confirm']);

export const TripSchema = z.object({
  $schema: z.string().optional(),
  id,
  revision: z.number().int().positive().describe('Revision number of the quotation as sent by the agent'),
  title: z.string(),
  region: z.string(),
  heroImage: z.string(),
  homeCity: z.string(),
  startDate: isoDate,
  endDate: isoDate,
  sentAt: isoDate,
  validUntil: isoDate,
  includes: z.array(z.string()).min(1),
  travellers: z.array(z.object({
    name: z.string(),
    initials: z.string().max(3),
    type: z.enum(['adult', 'child']).default('adult'),
  })).min(1).describe('The first traveller is the account holder'),
  agent: z.object({
    name: z.string(),
    possessive: z.string().describe('Possessive pronoun used in copy, e.g. "her"'),
  }),
  itinerary: z.array(z.string().regex(/^(seg|stop):.+$/)).describe('Order of segments and stops, e.g. "seg:arr", "stop:kochi"'),
});

export const RoomSchema = z.object({ id, name: z.string(), rate: money.describe('Price per room per night') });

export const HotelSchema = z.object({
  id,
  name: z.string(),
  image: z.string(),
  meta: z.string(),
  meals: z.string(),
  status: priceStatus,
  blurb: z.string(),
  features: z.array(z.string()),
  rooms: z.array(RoomSchema).min(1),
});

export const StopSchema = z.object({
  id,
  name: z.string(),
  image: z.string(),
  checkIn: isoDate,
  checkOut: isoDate,
  kind: z.enum(['hotel', 'houseboat']),
  original: z.object({ hotel: id, room: id }).describe('Hotel and room in the quotation as sent'),
  dayTitles: z.array(z.string()).describe('One title per night, in order'),
  hotels: z.array(HotelSchema).min(1),
});

export const ActivitySchema = z.object({
  id,
  stop: id,
  date: isoDate.describe('Planned date; add-ons can be moved to any day of their stop'),
  name: z.string(),
  start: clockTime,
  end: clockTime,
  price: money.describe('Price for the whole group'),
  included: z.boolean().default(false),
  credit: money.optional().describe('Refund if an included activity is removed'),
  status: priceStatus.optional().describe('Price status of an add-on'),
  extra: z.string().optional(),
  warn: z.string().optional(),
  blurb: z.string(),
  images: z.array(z.string()).min(1),
});

const LegEndSchema = z.object({ code: z.string(), place: z.string(), time: clockTime });

export const SegmentSchema = z.object({
  id,
  date: isoDate,
  title: z.string(),
  mode: z.string(),
  category: z.enum(['flights', 'transfers']),
  summaryLabel: z.string(),
  strip: z.object({
    label: z.string(),
    durationLegs: z.array(id).describe('Legs whose durations add up to the route-strip duration'),
    timeLeg: z.object({ leg: id, at: z.enum(['departure', 'arrival']) }).optional(),
  }),
  legs: z.array(z.object({
    id,
    mode: z.string(),
    from: LegEndSchema,
    to: LegEndSchema,
    approximate: z.boolean().default(false).describe('Show the duration as "about N h"'),
    price: money,
    description: z.string(),
    comparison: z.string(),
  })).min(1),
});

export const QuoteSchema = z.object({
  trip: TripSchema,
  stops: z.array(StopSchema),
  activities: z.array(ActivitySchema),
  segments: z.array(SegmentSchema),
}).superRefine((q, ctx) => {
  const issue = (message: string, path: (string | number)[]) => ctx.addIssue({ code: 'custom', message, path });
  const stopIds = new Set(q.stops.map(s => s.id)), segIds = new Set(q.segments.map(s => s.id));
  q.trip.itinerary.forEach((key, i) => {
    const [kind, ref] = key.split(':');
    if (!(kind === 'seg' ? segIds : stopIds).has(ref)) issue(`Unknown ${kind} "${ref}"`, ['trip', 'itinerary', i]);
  });
  q.stops.forEach((s, i) => {
    const nights = (Date.parse(s.checkOut) - Date.parse(s.checkIn)) / 864e5;
    if (nights < 1) issue('checkOut must be after checkIn', ['stops', i, 'checkOut']);
    if (s.dayTitles.length !== nights) issue(`Expected ${nights} day title${nights === 1 ? '' : 's'}`, ['stops', i, 'dayTitles']);
    const h = s.hotels.find(x => x.id === s.original.hotel);
    if (!h) issue(`Unknown hotel "${s.original.hotel}"`, ['stops', i, 'original', 'hotel']);
    else if (!h.rooms.some(r => r.id === s.original.room)) issue(`Unknown room "${s.original.room}"`, ['stops', i, 'original', 'room']);
  });
  q.activities.forEach((a, i) => {
    if (!stopIds.has(a.stop)) issue(`Unknown stop "${a.stop}"`, ['activities', i, 'stop']);
    if (!a.included && !a.status) issue('Add-ons need a price status', ['activities', i, 'status']);
  });
  q.segments.forEach((g, i) => {
    const legIds = new Set(g.legs.map(l => l.id));
    g.strip.durationLegs.forEach((l, j) => { if (!legIds.has(l)) issue(`Unknown leg "${l}"`, ['segments', i, 'strip', 'durationLegs', j]); });
    if (g.strip.timeLeg && !legIds.has(g.strip.timeLeg.leg)) issue(`Unknown leg "${g.strip.timeLeg.leg}"`, ['segments', i, 'strip', 'timeLeg', 'leg']);
  });
});

export type Trip = z.infer<typeof TripSchema>;
export type StopDTO = z.infer<typeof StopSchema>;
export type HotelDTO = z.infer<typeof HotelSchema>;
export type ActivityDTO = z.infer<typeof ActivitySchema>;
export type SegmentDTO = z.infer<typeof SegmentSchema>;
export type QuoteDTO = z.infer<typeof QuoteSchema>;

/** Shapes of the JSON files on disk. Each file is an object so it can point at its JSON Schema via "$schema". */
const file = <T extends z.ZodRawShape>(shape: T) => z.object({ $schema: z.string().optional(), ...shape });
export const FileSchemas = {
  trip: TripSchema,
  stops: file({ stops: z.array(StopSchema) }),
  activities: file({ activities: z.array(ActivitySchema) }),
  segments: file({ segments: z.array(SegmentSchema) }),
};

/** The traveller's edits to a quotation, saved as they make them. */
export const DraftSchema = z.object({
  hotels: z.record(id, z.object({
    mode: z.enum(['one', 'split']),
    hotel: id,
    room: id,
    rooms: z.number().int().min(1),
    split: z.array(id),
  })),
  removed: z.record(id, z.boolean()).describe('Included activities the traveller removed'),
  added: z.record(id, z.boolean()).describe('Add-on activities the traveller added'),
  actDay: z.record(id, z.number().int().positive()).describe('Day an add-on was moved to'),
  notes: z.record(id, z.string()).describe('Notes on travel legs, by leg id'),
  message: z.string().default('').describe('Message to the agent, sent with the revision'),
});

/** Where the quotation stands, as stored by the server. */
export const ProgressSchema = z.object({
  status: z.enum(['draft', 'sent', 'accepted']),
  draft: DraftSchema.nullable(),
  savedAt: z.number().nullable(),
  sentAt: z.number().nullable().describe('When the revision was sent (ms since epoch)'),
  acceptedAt: z.number().nullable(),
});

export type Draft = z.infer<typeof DraftSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
