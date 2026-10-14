# Monsoon Trails: Trip Quote

**Live:** https://kavya545.github.io/trip-quote/
<!-- Figma: add link -->

## How this was made

Monsoon Trails (Trip Quote) is a consumer-facing travel quotation customizer. I built it as an AI-native design and engineering exploration: I wrote the requirements, directed the AI tools, judged every result, and made the final calls.

### The idea

A customer gets a quotation from a travel agent. Instead of just accepting or rejecting it, they review the itinerary, change a few things, see the price impact, check every change against the original, and send it back.

### My requirements (written by me, before any design)

Core flow:

1. Customer opens the quotation
2. Reviews the itinerary day by day
3. Customizes selected parts
4. Sees the price impact and the updated total
5. Reviews all changes against the original
6. Submits the revised quotation

The first version should allow:

- Replacing a hotel from available alternatives
- Adding or removing activities from predefined options
- Showing price differences and the updated total
- Telling apart changes made directly from changes that need the agent to confirm
- Comparing the original with the modified quotation
- Final review and submission

Deliberately not built: login, payment, real inventory, agent dashboard, chatbot, AI recommendations, a huge travel platform.

Desktop-first responsive web app.

### What happened, in order

1. **First version (Claude Design).** I sent the requirements and a PDF of the source quotation. I got a first version in green.
2. **My critique and changes.** I tested it, listed what was wrong, and sent changes: a left side nav, a collapsible price summary, green and red arrows for lower and higher prices, accessibility fixes, tighter spacing, prices on transfer and activity cards.
3. **Figma refinement by hand.** I rebuilt the screens in Figma and edited them myself: moved the progress bar under the hero, made the hero full-bleed, trimmed the journey snapshot.
4. **Carried back into code.** The decisions from Figma went back into the HTML prototype.
5. **Rebuilt as a real app (Claude Code).** Vite + React + TypeScript, split into components. Checked against the prototype with screenshot comparisons across 12 flows at 1440, 1024 and 390px.
6. **Real data.** Trip data moved into validated JSON, behind a mock API. Dates, nights and totals are calculated, not typed. Loading, empty, not-found and error states added.
7. **Fluid layout.** The page now fills any screen width and adapts down to phone size.
8. **Readability.** Nothing under 13px, and light-grey text darkened to pass contrast checks. This was my call, and it means the app no longer matches the first prototype pixel for pixel.
9. **Saving.** Changes survive a refresh. Send and Accept update the quote's status through the mock API.
10. **Deployed** on GitHub Pages.

### Decisions I made

- **The agent stays in control.** Nothing is final until the agent confirms.
- **Price states, not just prices:** locked, needs agent confirmation, or included.
- **Changes shown as a comparison** against the original quotation.
- **Edge cases designed early:** time clashes, split stays in one city, expired quotes.
- **Scoped on purpose,** so it stays a focused product and not a platform.

## In this repo

| Path | What it is |
| --- | --- |
| `src/` | The app: components, trip state, mock API |
| `src/data/` | Quote data as JSON, its schema, and how the mock API works |
| `chats/chat1.md` | The Claude Design conversation from step 4, where the Figma screens became a working prototype. The chat from steps 1–2 was lost. |
| `project/` | The prototype and screen exports from Claude Design, kept for reference |
| `CLAUDE.md` | Conventions for working on the code with Claude Code |

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`. Every push to `real-data` redeploys the live site.
