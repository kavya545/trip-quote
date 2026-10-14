# Monsoon Trails: Trip Quote

A customer gets a travel quotation from their agent. Usually they can only accept it or reject it. Trip Quote lets them do what they actually want: go through the itinerary day by day, swap a hotel, add or drop an activity, see what each change does to the price, compare everything against the original, and send the revised quote back to the agent.

I designed and built it as an AI-native design and engineering project. I wrote the requirements, directed Claude Design, Figma and Claude Code, judged every result, and made the final calls.

**Live app:** https://kavya545.github.io/trip-quote/
**Figma:** [Fleeguide file, Trip Quote (built) page](https://www.figma.com/design/FFULIvAdvUc29HzIiLXXla/Untitled?node-id=6-2), with editable screens, components and a clickable prototype of the core flow

## A note on the design history

The first part of this project happened in Claude Design: turning a PDF quotation and my requirements into a first version, then my critique and the changes I asked for. That conversation was later deleted, and I couldn't recover it. What survived was the exported HTML, which I took into Figma and kept working from.

So the chat in this repo (`chats/chat1.md`) starts in the middle, at the point where my Figma screens became a working prototype. Everything before it is described below from my own notes, not from a transcript.

## What I set out to build

I wrote the requirements before any design.

**The core flow**

1. The customer opens the quotation.
2. They review the itinerary day by day.
3. They customise selected parts.
4. They see the price impact and the updated total.
5. They review every change against the original.
6. They submit the revised quotation.

**What the first version had to do**

- Replace a hotel with one of the available alternatives.
- Add or remove activities from predefined options.
- Show price differences and the updated total.
- Separate changes the customer can make directly from changes the agent has to confirm.
- Compare the original and modified quotations.
- Finish with a final review and a send step.

**What I left out on purpose:** login, payment, real inventory, an agent dashboard, a chatbot, AI recommendations, and anything that would turn it into a full travel platform. It's a desktop-first web app that still works on a phone.

## Decisions that shaped it

- **The agent stays in control.** The customer proposes changes and nothing is final until the agent confirms.
- **Every price has a state, not just a number.** It's either locked, waiting for the agent to confirm, or already included.
- **Changes are shown against the original.** The customer can always see what they had, what they have now, and the difference.
- **Edge cases were designed early, not patched later:**
  - activities that clash in time
  - splitting a stay between two hotels in one city
  - quotes past their validity date, with a countdown in the top bar that turns into "Expired" once the date has passed
- **The scope stayed small on purpose,** so it's a focused product and not a platform.

## How it came together

**Design**

1. **First version in Claude Design.** I gave it my requirements and a PDF of a real quotation, and got a first version back in green.
2. **Critique.** I tested that version and sent back a list of changes: a left side nav, a collapsible price summary, green and red arrows for lower and higher prices, accessibility fixes, tighter spacing, and prices on transfer and activity cards.
3. **Refining it in Figma by hand.** I rebuilt the screens in Figma and reworked them myself. I moved the progress bar under the hero, made the hero full-bleed and trimmed the journey snapshot.
4. **Back into the prototype.** I carried those Figma decisions back into the HTML prototype in Claude Design. This is the chat in `chats/chat1.md`.

**Engineering**

5. **Rebuilt as a real app with Claude Code.** I rebuilt it in Vite, React and TypeScript, split into components. I checked the build against the prototype with screenshot comparisons of 12 flows at 1440, 1024 and 390px wide.
6. **Real data.** The trip moved into validated JSON behind a mock API. Dates, nights and totals are calculated, never typed in. I added loading, empty, not-found and error states.
7. **Fluid layout.** The page fills any screen width and adapts down to phone size.
8. **Readability.** No text is smaller than 13px, and light-grey text was darkened to pass contrast checks. This was a deliberate choice, so the app no longer matches the first prototype pixel for pixel.
9. **Saving.** Changes survive a page refresh. Send and Accept update the quote's status through the mock API.
10. **Deployed** on GitHub Pages. Every push to `real-data` redeploys the site.

**Closing the loop**

11. **Back into Figma.** The finished app was rebuilt in Figma as editable screens made from components, not screenshots. It includes a 7-screen clickable prototype of the core flow: swap a hotel, review the change and send it to the agent.
12. **Design tokens.** Every colour now lives in one tokens file, and each colour is tied to its Figma variable, so design and code use the same names and values. The build fails if a hard-coded colour appears anywhere else.

## What's in this repo

| Path | What it is |
| --- | --- |
| `src/` | The app: components, trip state and the mock API |
| `src/tokens.ts` | Design tokens: every colour, each tied to a Figma variable |
| `src/data/` | The quote data as JSON, its schema, and how the mock API works |
| `chats/chat1.md` | The Claude Design conversation from step 4, where the Figma screens became a working prototype |
| `project/` | The prototype and screen exports from Claude Design, kept for reference |
| `CLAUDE.md` | Conventions for working on the code with Claude Code |

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` checks the colour tokens and types, then builds to `dist/`.
