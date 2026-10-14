# Quote data

Each quotation lives in its own folder under `quotes/`, split into four JSON files:

| File | Holds |
| --- | --- |
| `trip.json` | Title, dates, travellers, agent, validity, and the itinerary order (`"seg:arr"`, `"stop:kochi"`, …) |
| `stops.json` | Each stop's check-in/out dates, day titles, the hotel in the original quotation, and the hotel options with their rooms and rates |
| `activities.json` | Included activities and add-ons, with their date, times, price, credit and photos |
| `segments.json` | Travel between stops: flights, cars, cruises and trains, with times and prices |

Only real values are stored: ISO dates (`2026-11-10`), 24-hour times (`09:40`) and rupee amounts. Everything shown on screen is computed from them in `src/model/derive.ts`, including weekday labels, day numbers, nights, durations, per-person prices and the original total.

## Schema

`src/api/schema.ts` defines the schema with [zod](https://zod.dev). The mock API validates every file against it when a quote loads, including cross-references such as an itinerary entry pointing at a stop that doesn't exist. Invalid data shows the error screen and names the problem.

Each JSON file points at a generated JSON Schema in `schema/` through its `"$schema"` key, so editors validate as you type. After changing `schema.ts`, regenerate those files:

```sh
npm run schema
```

## Mock API

`fetchQuote()` in `src/api/mockApi.ts` stands in for `GET /quotes/:id`. It waits a short random time (400–700 ms) before responding. URL parameters let you see every state:

| URL | Shows |
| --- | --- |
| `?delay=5000` | The loading state for 5 seconds |
| `?scenario=empty` | A quotation with nothing in it yet |
| `?scenario=notfound` | A quotation that doesn't exist |
| `?scenario=error` | A failed request, with **Try again** |
| `?quote=Q-2481` | Which quotation to load (the default) |
