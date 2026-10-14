export type StatusKey = 'locked' | 'confirm' | 'included' | 'note';
export interface Status { label: string; bg: string; fg: string }

export interface Room { id: string; name: string; rate: number }
export interface Hotel {
  id: string; img: string; name: string; meta: string; meals: string; status: 'locked' | 'confirm';
  blurb: string; features: string[]; rooms: Room[];
}
export interface Stop {
  id: StopId; name: string; img: string; thumb: string; label: string; nights: number; dates: string; range: string;
  dayRange: string; subRange: string; nightDates: string[]; days: number[]; noun: 'hotel' | 'houseboat';
  orig: { hotel: string; room: string }; hotels: Hotel[];
}
export type StopId = 'kochi' | 'munnar' | 'alleppey';
export interface Day { n: number; date: string; title: string; stop: StopId }
export interface Activity {
  id: string; img: string; day: number; stop: StopId; name: string; start: string; end: string; price: number;
  included?: boolean; credit?: number; status?: 'locked' | 'confirm'; extra?: string; warn?: string; blurb: string;
}
export interface Leg {
  id: string; mode: string; fromCode: string; fromPlace: string; t1: string; toCode: string; toPlace: string; t2: string;
  dur: string; price: number; desc: string; cmp: string;
}
export interface Segment {
  id: string; title: string; kicker: string; mode: string; cat: 'flights' | 'transfers'; sumLabel: string; sumSub: string; legs: Leg[];
}

export const R = (n: number) => '₹' + Math.round(Math.abs(n)).toLocaleString('en-IN');
export const ORIG_TOTAL = 93200;
export const ST: Record<StatusKey, Status> = {
  locked: { label: 'Locked price', bg: '#EFEFEE', fg: '#1E1F21' },
  confirm: { label: 'Priya will confirm', bg: '#1E1F21', fg: '#FFFFFF' },
  included: { label: 'Included', bg: '#EBEBEA', fg: '#5F6266' },
  note: { label: 'Note sent', bg: '#EBEBEA', fg: '#5F6266' },
};
export const LOWER = '#197047', HIGHER = '#B8433B', FLAT = '#5F6266';
export interface Delta { txt: string; word: string; color: string; has: boolean }
export const dl = (d: number): Delta => !d ? { txt: '—', word: '', color: FLAT, has: false } : d < 0 ? { txt: '↓ ' + R(d), word: 'Lower', color: LOWER, has: true } : { txt: '↑ ' + R(d), word: 'Higher', color: HIGHER, has: true };
export const pl = (n: number) => n + ' night' + (n > 1 ? 's' : '');

export const STOPS: Stop[] = [
  { id: 'kochi', name: 'Kochi', img: 'assets/stop-kochi.jpg', thumb: 'linear-gradient(90deg,#3E4145,#B08A5A)', label: 'First stop', nights: 2, dates: 'Tue 10 – Thu 12 Nov', range: '10 Nov–12 Nov', dayRange: 'Days 1–2', subRange: 'Tue 10 Nov to Thu 12 Nov', nightDates: ['Tue 10 Nov', 'Wed 11 Nov'], days: [1, 2], noun: 'hotel', orig: { hotel: 'harbour', room: 'deluxe' },
    hotels: [
      { id: 'harbour', img: 'assets/hotel-harbour-house.jpg', name: 'Harbour House', meta: '4★ heritage · Fort Kochi heritage quarter', meals: 'Breakfast', status: 'locked', blurb: 'A restored colonial house a short walk from the Chinese fishing nets.', features: ['Sea view', 'Walk to sights'], rooms: [{ id: 'deluxe', name: 'Deluxe sea-facing', rate: 9500 }, { id: 'court', name: 'Heritage courtyard room', rate: 8200 }] },
      { id: 'lagoon', img: 'assets/hotel-lagoon-view.jpg', name: 'Lagoon View Inn', meta: '3★ · Willingdon Island, 10 min drive', meals: 'Breakfast', status: 'locked', blurb: 'A quiet, modern inn on the island with a pool, a short drive from the old town.', features: ['Pool', 'Quiet'], rooms: [{ id: 'std', name: 'Standard double', rate: 7400 }, { id: 'sup', name: 'Superior lagoon-facing', rate: 8600 }] },
      { id: 'spiceQuay', img: 'assets/stop-kochi.jpg', name: 'Spice Quay Residency', meta: '4★ · Mattancherry, by the old spice warehouses', meals: 'Breakfast', status: 'confirm', blurb: 'A converted spice godown on the water, a short walk from Jew Town and the Dutch Palace.', features: ['Waterfront', 'Pool'], rooms: [{ id: 'quay', name: 'Quay-view room', rate: 10800 }, { id: 'loft', name: 'Warehouse loft', rate: 12400 }] },
    ] },
  { id: 'munnar', name: 'Munnar', img: 'assets/stop-munnar.jpg', thumb: 'linear-gradient(90deg,#3B4A40,#7FA585)', label: 'Next stop', nights: 2, dates: 'Thu 12 – Sat 14 Nov', range: '12 Nov–14 Nov', dayRange: 'Days 3–4', subRange: 'Thu 12 Nov to Sat 14 Nov', nightDates: ['Thu 12 Nov', 'Fri 13 Nov'], days: [3, 4], noun: 'hotel', orig: { hotel: 'teaRidge', room: 'valley' },
    hotels: [
      { id: 'teaRidge', img: 'assets/act-eravikulam.jpg', name: 'Tea Ridge Resort', meta: '4★ · Chithirapuram, 15 min from town', meals: 'Breakfast', status: 'locked', blurb: 'A hillside resort with terraced rooms looking over the tea valley.', features: ['Valley view', 'Restaurant'], rooms: [{ id: 'valley', name: 'Valley-view room', rate: 11000 }, { id: 'suite', name: 'Valley suite', rate: 13800 }] },
      { id: 'misty', img: 'assets/stop-munnar.jpg', name: 'Misty Hills Plantation Bungalow', meta: 'Boutique · Pothamedu, on a cardamom estate', meals: 'Breakfast & dinner', status: 'confirm', blurb: 'Four cottages on a working cardamom estate, with estate walks and dinner on the verandah.', features: ['Estate walks', 'Very quiet'], rooms: [{ id: 'cottage', name: 'Private cottage', rate: 16800 }] },
      { id: 'copperHill', img: 'assets/act-sunrise-jeep.jpg', name: 'Copper Hill Retreat', meta: '3★ · Anachal, 20 min from town', meals: 'Breakfast', status: 'locked', blurb: 'A simple, friendly hillside stay with balconies facing the sunrise over the valley.', features: ['Sunrise view', 'Good value'], rooms: [{ id: 'std', name: 'Standard room', rate: 7600 }, { id: 'view', name: 'Valley balcony room', rate: 8900 }] },
    ] },
  { id: 'alleppey', name: 'Alleppey', img: 'assets/stop-alleppey.jpg', thumb: 'linear-gradient(90deg,#2C4446,#5E8C88)', label: 'Last stop', nights: 1, dates: 'Sat 14 – Sun 15 Nov', range: '14 Nov–15 Nov', dayRange: 'Day 5', subRange: 'Sat 14 Nov to Sun 15 Nov', nightDates: ['Sat 14 Nov'], days: [5], noun: 'houseboat', orig: { hotel: 'kettu', room: 'one' },
    hotels: [
      { id: 'kettu', img: 'assets/hero-backwaters.jpg', name: 'Kettuvallam houseboat', meta: 'Private boat · Vembanad Lake', meals: 'All meals', status: 'locked', blurb: 'A private rice-barge houseboat with its own crew and cook, moored overnight on the lake.', features: ['Private crew', 'Lake views'], rooms: [{ id: 'one', name: '1-bedroom boat', rate: 12500 }, { id: 'deck', name: '1-bedroom boat with upper deck', rate: 15200 }] },
      { id: 'kayal', img: 'assets/stop-alleppey.jpg', name: 'Kayal Lakeside Villas', meta: '4★ · Punnamada, on the lakefront', meals: 'Breakfast', status: 'confirm', blurb: 'Stay on land instead: villas on the lake edge, with a sunset shikara ride included.', features: ['Pool', 'Shikara ride'], rooms: [{ id: 'villa', name: 'Lake-view villa', rate: 11200 }] },
      { id: 'kainakary', img: 'assets/hotel-lagoon-view.jpg', name: 'Kainakary Island Homestay', meta: 'Homestay · Kainakary, reached by boat', meals: 'All meals', status: 'locked', blurb: 'A family-run homestay on a paddy island, with home-cooked Kerala meals and village walks.', features: ['Home cooking', 'Village walks'], rooms: [{ id: 'garden', name: 'Garden room', rate: 6800 }] },
    ] },
];

export const DAYS: Day[] = [
  { n: 1, date: 'Tue 10 Nov', title: 'Arrive and settle in', stop: 'kochi' },
  { n: 2, date: 'Wed 11 Nov', title: 'Old Fort Kochi', stop: 'kochi' },
  { n: 3, date: 'Thu 12 Nov', title: 'Afternoon in the tea hills', stop: 'munnar' },
  { n: 4, date: 'Fri 13 Nov', title: 'Parks and plantations', stop: 'munnar' },
  { n: 5, date: 'Sat 14 Nov', title: 'On the backwaters', stop: 'alleppey' },
];

export const ACTS: Activity[] = [
  { id: 'kathakali', img: 'assets/a/kathakali.jpg', day: 1, stop: 'kochi', name: 'Kathakali performance', start: '18:00', end: '19:30', price: 2400, credit: 0, included: true, blurb: 'Classical dance-drama at a small Fort Kochi theatre; come early to watch the make-up.' },
  { id: 'harbourCruise', img: 'assets/a/harbourCruise.jpg', day: 1, stop: 'kochi', name: 'Sunset harbour cruise', start: '16:30', end: '17:45', price: 2200, status: 'locked', blurb: 'An hour on the harbour, past the Chinese fishing nets as the light goes.' },
  { id: 'heritage', img: 'assets/a/heritage.jpg', day: 2, stop: 'kochi', name: 'Fort Kochi heritage walk', start: '08:30', end: '11:00', price: 1800, credit: 0, included: true, blurb: 'A guided walk through the Dutch Palace lanes, old churches and spice warehouses.' },
  { id: 'cooking', img: 'assets/a/cooking.jpg', day: 2, stop: 'kochi', name: 'Kerala home cooking class', start: '17:00', end: '19:30', price: 3200, status: 'locked', blurb: 'Cook and share a Kerala dinner with a family in Mattancherry.' },
  { id: 'tea', img: 'assets/a/tea.jpg', day: 3, stop: 'munnar', name: 'Tea museum & factory visit', start: '15:00', end: '16:30', price: 1000, credit: 1000, included: true, blurb: 'See leaf turn into tea at a working factory, then taste the estate’s grades.' },
  { id: 'eravikulam', img: 'assets/a/eravikulam.jpg', day: 4, stop: 'munnar', name: 'Eravikulam National Park', start: '09:00', end: '12:00', price: 1600, credit: 1600, included: true, blurb: 'Park shuttle and entry to the Nilgiri tahr grasslands.' },
  { id: 'jeep', img: 'assets/a/sunrise-jeep.jpg', day: 4, stop: 'munnar', name: 'Sunrise jeep & trek, Kolukkumalai', start: '04:30', end: '10:00', price: 6400, status: 'confirm', extra: 'few spots', warn: 'Weather-dependent; the operator confirms the day before.', blurb: 'A jeep up to Kolukkumalai for sunrise over the tea estates, then a guided trek.' },
  { id: 'spice', img: 'assets/a/spice.jpg', day: 4, stop: 'munnar', name: 'Cardamom estate walk', start: '15:00', end: '17:00', price: 1400, status: 'locked', blurb: 'A planter walks you through cardamom, pepper and coffee growing under shade trees.' },
  { id: 'chinesenets', img: 'assets/a/chinesenets.jpg', day: 1, stop: 'kochi', name: 'Chinese fishing nets at dawn', start: '06:00', end: '07:30', price: 1200, status: 'locked', blurb: 'Help the fishermen haul the giant cantilevered nets, then breakfast on the beach.' },
  { id: 'spicemarket', img: 'assets/a/spicemarket.jpg', day: 2, stop: 'kochi', name: 'Jew Town spice market trail', start: '12:00', end: '14:00', price: 1600, status: 'locked', blurb: 'Taste pepper, cardamom and cinnamon with a local guide, ending at the Paradesi synagogue.' },
  { id: 'mattupetty', img: 'assets/a/mattupetty.jpg', day: 3, stop: 'munnar', name: 'Mattupetty dam & echo point', start: '09:30', end: '12:30', price: 2200, status: 'locked', blurb: 'A drive up to the lake for a short boat ride and a walk to the echo point.' },
  { id: 'ayurveda', img: 'assets/a/ayurveda.jpg', day: 4, stop: 'munnar', name: 'Ayurvedic massage', start: '18:00', end: '19:30', price: 4800, status: 'confirm', extra: 'pick a time slot', blurb: 'A 75-minute abhyanga oil massage for two at a certified centre near town.' },
  { id: 'toddy', img: 'assets/a/toddy.jpg', day: 5, stop: 'alleppey', name: 'Toddy shop lunch', start: '12:30', end: '14:00', price: 1400, status: 'locked', blurb: 'Karimeen fry, tapioca and fish curry at a canal-side toddy shop, reached by boat.' },
  { id: 'sunsetshikara', img: 'assets/a/sunsetshikara.jpg', day: 5, stop: 'alleppey', name: 'Sunset shikara ride', start: '17:30', end: '18:30', price: 2000, status: 'confirm', extra: 'weather-dependent', blurb: 'A covered shikara out to Vembanad Lake to watch the sun go down over the paddy fields.' },
  { id: 'canoe', img: 'assets/a/canoe.jpg', day: 5, stop: 'alleppey', name: 'Village canoe ride', start: '16:00', end: '17:30', price: 1800, status: 'confirm', extra: 'paddled by a local boatman', blurb: 'A narrow canoe through village canals too small for the houseboats.' },
];

export const SEGS: Segment[] = [
  { id: 'arr', title: 'Arrive in Kochi', kicker: 'Day 1 · Tue 10 Nov · Included in your trip', mode: 'Flight + airport pickup', cat: 'flights', sumLabel: 'Arrival in Kochi', sumSub: 'Flight + Car · Day 1', legs: [
    { id: 'f1', mode: 'Flight', fromCode: 'BLR', fromPlace: 'Bengaluru', t1: '09:40', toCode: 'COK', toPlace: 'Kochi', t2: '10:50', dur: '1 h 10 min', price: 8600, desc: 'IndiGo · 6E 614 · Economy', cmp: 'Bengaluru → Kochi, IndiGo 6E 614 · economy' },
    { id: 'c1', mode: 'Car', fromCode: 'COK', fromPlace: 'Kochi airport', t1: '11:30', toCode: 'Fort Kochi', toPlace: 'Your hotel', t2: '12:30', dur: 'about 1 h', price: 1900, desc: 'Sedan · English-speaking driver', cmp: 'Private car, Kochi airport → your hotel' } ] },
  { id: 'km', title: 'Kochi → Munnar', kicker: 'Day 3 · Thu 12 Nov · Included in your trip', mode: 'By private car', cat: 'transfers', sumLabel: 'Kochi → Munnar', sumSub: 'Car · Day 3', legs: [
    { id: 'c2', mode: 'Car', fromCode: 'Kochi', fromPlace: 'Your hotel', t1: '08:30', toCode: 'Munnar', toPlace: 'Your hotel', t2: '13:00', dur: '4 h 30 min', price: 4800, desc: 'Private SUV · Waterfall + lunch stop', cmp: 'Private SUV, Kochi → Munnar' } ] },
  { id: 'ma', title: 'Munnar → Alleppey', kicker: 'Day 5 · Sat 14 Nov · Included in your trip', mode: 'By car, then a backwater cruise', cat: 'transfers', sumLabel: 'Munnar → Alleppey', sumSub: 'Car + Cruise · Day 5', legs: [
    { id: 'c3', mode: 'Car', fromCode: 'Munnar', fromPlace: 'Your hotel', t1: '07:30', toCode: 'Kottayam', toPlace: 'Boat jetty', t2: '11:00', dur: '3 h 30 min', price: 3600, desc: 'Private SUV · Tea break', cmp: 'Private SUV, Munnar → Kottayam jetty' },
    { id: 'b1', mode: 'Cruise', fromCode: 'Kottayam', fromPlace: 'Boat jetty', t1: '11:30', toCode: 'Alleppey', toPlace: 'Houseboat', t2: '14:00', dur: '2 h 30 min', price: 1400, desc: 'Shared cruiser · Lunch on board', cmp: 'Shared cruiser, Kottayam → Alleppey' } ] },
  { id: 'dep', title: 'Fly home from Kochi', kicker: 'Day 6 · Sun 15 Nov · Included in your trip', mode: 'Train, car + flight home', cat: 'flights', sumLabel: 'Departure from Kochi', sumSub: 'Train + Car + Flight · Day 6', legs: [
    { id: 't1', mode: 'Train', fromCode: 'ALLP', fromPlace: 'Alleppey', t1: '09:05', toCode: 'ERS', toPlace: 'Ernakulam Jn', t2: '10:15', dur: '1 h 10 min', price: 900, desc: 'Intercity Express · AC chair car', cmp: 'Intercity Express, Alleppey → Ernakulam' },
    { id: 'c4', mode: 'Car', fromCode: 'ERS', fromPlace: 'Ernakulam Jn', t1: '10:30', toCode: 'COK', toPlace: 'Kochi airport', t2: '11:30', dur: 'about 1 h', price: 1600, desc: 'Sedan · English-speaking driver', cmp: 'Private car, Ernakulam → Kochi airport' },
    { id: 'f2', mode: 'Flight', fromCode: 'COK', fromPlace: 'Kochi', t1: '14:20', toCode: 'BLR', toPlace: 'Bengaluru', t2: '15:30', dur: '1 h 10 min', price: 10100, desc: 'IndiGo · 6E 615 · Economy', cmp: 'Kochi → Bengaluru, IndiGo 6E 615 · economy' } ] },
];

export const ORDER = ['seg:arr', 'stop:kochi', 'seg:km', 'stop:munnar', 'seg:ma', 'stop:alleppey', 'seg:dep'] as const;
export const segPrice = (g: Segment) => g.legs.reduce((t, l) => t + l.price, 0);
