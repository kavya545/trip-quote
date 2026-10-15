# How this was made

**Trip Quote** is a consumer-facing travel quotation customizer. I built it as an AI-native design + engineering exploration: I wrote the requirements, directed the AI tools, judged every result, and made the final calls.

**Live:** https://kavya545.github.io/trip-quote/
**Figma:** [AI-Native Workflow](https://www.figma.com/design/zumDgCHXNaI8hGBQOulLoy/AI-Native-Workflow?m=auto&t=bHx3LPDYL5z6C1oR-1)

## The idea

A customer gets a quotation from a travel agent. Instead of just accepting or rejecting it, they review the itinerary, change a few things, see the price impact, check every change against the original, and send it back.

## My requirements (written by me, before any design)

Core flow:

1. Customer opens the quotation
2. Reviews the itinerary day by day
3. Customizes selected parts
4. Sees price impact and the updated total
5. Reviews all changes against the original
6. Submits the revised quotation

First version should allow:

- Replacing a hotel from available alternatives
- Adding or removing activities from predefined options
- Showing price differences and the updated total
- Telling apart changes made directly from changes that need the agent to confirm
- Comparing the original with the modified quotation
- Final review and submission

Deliberately not built: login, payment, real inventory, agent dashboard, chatbot, AI recommendations, a huge travel platform.

Desktop-first responsive web app.

## What happened, in order

1. **First version (Claude Design).** I sent the requirements and a PDF of the source quotation. I got a first version in green.
2. **My critique and changes.** I tested it, listed what was wrong, and sent changes: a left side nav, a collapsible price summary, green and red arrows for lower and higher prices, accessibility fixes, tighter spacing, prices on transfer and activity cards.
3. **Figma refinement by hand.** I rebuilt the screens in Figma and edited them myself: moved the progress bar under the hero, made the hero full-bleed, trimmed the journey snapshot.
4. **Back into Claude Design from my Figma screens.** I exported the Figma screens as PDFs and asked for them to be built exactly as designed, as a working prototype (`chats/chat1.md`). Then I directed about 25 rounds of changes: spacing that suits the content instead of one spacing everywhere, IBM Plex Mono for numbers, pictures wherever there weren't any, feedback when something changes, a collapsible nav, hover and pressed states, correct photos per activity, and responsive fixes.
5. **Rebuilt as a real app (Claude Code).** Vite + React + TypeScript, split into components. Checked against the prototype with screenshot comparisons across 12 flows at 1440, 1024 and 390px.
6. **Real data.** Trip data moved into validated JSON, behind a mock API. Dates, nights and totals are calculated, not typed. Loading, empty, not-found and error states added.
7. **Fluid layout.** The page now fills any screen width and adapts down to phone size.
8. **Readability.** Nothing under 13px, and light-grey text darkened to pass contrast checks. This was my call, and it means the app no longer matches the first prototype pixel for pixel.
9. **Saving.** Changes survive a refresh. Send and Accept update the quote's status through the mock API.
10. **Deployed** on GitHub Pages.

## Decisions I made

- The agent stays in control. Nothing is final until the agent confirms.
- Price states, not just prices: locked, needs agent confirmation, or included.
- Changes shown as a comparison against the original quotation.
- Edge cases designed early: time clashes, split stays in one city, expired quotes.
- Scoped on purpose, so it stays a focused product and not a platform.

## What is real and what is simulated

- **Real:** the design, the component-based front end, the data schema, all the screens and states, responsive layout.
- **Simulated:** the "server." It is a mock API that stores changes in the browser, so there are no users, no live prices and no real agent. A developer would build the real backend to match the data schema in `src/data/`.

## A note on the history

The very first Claude Design conversation (steps 1 and 2) was lost, so those early prompts are not available. What I describe there is reconstructed by comparing the versions. The second Design conversation (step 4) is kept in `chats/chat1.md`; in that file my prompts have had spelling and grammar corrected, with the meaning unchanged. The requirements above are my own, and everything from the Figma stage onward is documented in order.

## Tools

Claude Design for drafting, Figma for refinement and tokens, Claude Code for the real build and deployment.

Made by Kavya Srivastava.
