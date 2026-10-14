# Trip Quote

A traveller reviews a travel agent's quotation for a Kerala trip, edits it (hotels, activities, notes) and sends it back or accepts it. Built from a Claude Design prototype (`project/`, `chats/`, kept for reference; don't edit).

## Stack and commands
Vite 8 + React 19 + TypeScript 5.9, zod 4. Styling is inline `style` objects plus a few classes in `src/index.css` (hover states, layout breakpoints, skeleton/spinner). No CSS framework, no router, no test runner.
- `npm run dev` (dev server) · `npm run build` (type-check + build to `dist/`) · `npm run preview` (serve the build)
- `npm run schema` regenerates `src/data/schema/*.schema.json` after editing `src/api/schema.ts`.

## Layout
- `src/api/`: `schema.ts` (zod: quote files, draft, progress) · `mockApi.ts` (quote loading) · `progressApi.ts` (saving) · `useQuote.ts`, `useAutosave.ts`
- `src/model/`: `data.ts` (display types, `R()`, status styles) · `derive.ts` (JSON → display data) · `dates.ts` · `useTripQuote.ts` (all trip state and the view model) · `demoChanges.ts`
- `src/components/`: one file per page section; `TripQuote.tsx` assembles the loaded page, `App.tsx` handles loading/empty/error and the menu.
- `src/data/quotes/<id>/{trip,stops,activities,segments}.json`: quote data. `src/data/README.md` documents the data, the mock API and the URL switches in full.
- `public/assets/`: photos (`a/credits.txt` holds licences that need credit lines before public promotion).

## Data and mock API contract
- JSON stores only raw values: ISO dates (`2026-11-10`), 24-hour times, rupee integers, ids. Never store display text such as "Tue 10 Nov", "Days 1–2", durations or totals; compute them in `derive.ts`. Date helpers in `dates.ts` work in UTC so weekdays never shift with the viewer's time zone.
- Every file is validated by `src/api/schema.ts` on load, including cross-references (itinerary → stops/segments, original hotel/room, activity → stop). Invalid data shows the error screen.
- `fetchQuote` (≈400–700 ms delay). URL switches: `?delay=ms`, `?scenario=empty|notfound|error`.
- `progressApi` stores the traveller's draft and status in `localStorage` (`trip-quote:progress:<id>`): `fetchProgress`, `saveDraft`, `submitRevision` (status `sent`), `acceptQuote` (`accepted`), `resetProgress`. Writes are validated against the quote: `422` for unknown hotels, rooms, activities, legs or days, `409` once sent/accepted. `?save=slow|fail|flaky` simulates slow and failing writes.
- `useAutosave` debounces 400 ms, sends one request at a time (newest draft wins), shows "Saving…" only after 0.8 s, and a Retry pill on failure. Normal saves must stay invisible.

## Deploy
Push to `real-data` (the default branch) → `.github/workflows/deploy-pages.yml` builds and publishes https://kavya545.github.io/trip-quote/. Also runnable from Actions → **Run workflow**. `vite.config.ts` uses `base: './'` so the build works from the `/trip-quote/` sub-path.

## Standing rules
1. **Design tokens, no new hardcoded colours.** Use only the palette below by its token name. Known debt: the existing components still inline these hex values and there is no `src/tokens.ts` yet; moving them there is a separate change that must pass the screenshot comparison.
2. **Rupees** always go through `R()` in `src/model/data.ts` (`₹` + `toLocaleString('en-IN')`, rounded, e.g. ₹1,02,400). Never format amounts by hand. Differences use `dl()`.
3. **Every change goes on a new branch** cut from `real-data`, then is merged into `real-data` only when asked. Commit messages explain why, not just what.
4. **Re-run the screenshot comparison before every push** and report the result.

## Palette (tokens)
| Token | Hex | Use |
| --- | --- | --- |
| ink | `#1E1F21` | primary text, dark buttons, step bar, toast |
| text-secondary | `#5F6266` | secondary text (4.8–6.1:1 on light surfaces) |
| text-muted | `#6B6E72` | lightest grey allowed for text (≥ 4.57:1 on white, `#FAFAF9`, `#F2F2F2`) |
| disabled | `#98989B` | disabled controls and borders only, never readable text |
| on-dark-muted | `#B5B7BA` | muted text on `ink` |
| border / border-strong | `#E4E4E2` / `#CFCFCD` | card and input borders |
| surface | `#FFFFFF`, `#FAFAF9`, `#F2F2F2` (page), `#EBEBEA`, `#F2F2F0` | cards, panels, chips |
| lower / higher | `#197047` / `#B8433B` (error bg `#FBE9E7`) | cheaper / costlier, errors |
| success | `#3DAA4F` | confirmation icons |

## Type scale and contrast
- Font sizes in `rem` (px ÷ 16) so the reader's browser text size applies. Fonts: Manrope (text), Instrument Serif (headings), IBM Plex Mono (prices, times).
- Minimum 13 px (`0.8125rem`) only for compact labels: pills, count badges, avatar initials, step numbers, mono captions. All other text ≥ 14 px; helper text and field labels 13–14 px. Don't change heading or price sizes.
- Text contrast ≥ 4.5:1 (≥ 3:1 for 24 px+, or 18.66 px+ bold). Only genuinely disabled controls are exempt.
- Build sentences that mix copy and data as one template string (`{`Message ${agent}`}`), not adjacent JSX text nodes; split text nodes change kerning by a pixel.

## Screenshot comparison
Baseline: the current `real-data` build. Candidate: the branch build. Scripts are not in the repo; recreate with Playwright (Chromium at `/opt/pw-browsers`).
- Serve both builds; for each width 1440, 1024 and 390 run 12 flows in a fresh browser context (clean `localStorage`): initial, menu open, hotel panel, next photo + choose hotel, split stay, activity panel (Day 4), activity added + toast, note added then removed + summary collapsed, What's changed, Review, Sent, Accepted.
- Freeze the clock (`page.clock.setFixedTime('2026-09-29T14:05:00+05:30')`, timezone `Asia/Kolkata`), wait for fonts, take full-page screenshots, and diff per pixel (a pixel differs when the RGB channel difference sums to more than 30).
- Expect 0 differing pixels. Small diffs (≈130–1,100 px) on photo thumbnails or sub-pixel text are rendering noise: re-run them. A diff that repeats is real; find the cause before pushing.
- Intended behaviour to keep: activity rows are keyed by index (avoids scroll anchoring), the route strip, step bar and Review table scroll sideways inside their cards on narrow screens, and the Sent page keeps its centred 780 px column.
