# 03 — `useDemo` controller, `DemoBar`, highlight styling, captions

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
This is the part the learner sees: the bar that narrates the run, the highlighted panel, the controls.
Everything it needs is already decided: the states come from plan 01's `runDemo`, the model fields from
plan 02. The controller only maps a step index to `restore`, screen, ticket and anchor.

## Current state (verified 2026-10-23; re-check after plans 01 and 02)
- From plan 01: `src/features/hedging-desk/demo/demo.types.ts` (`DemoAnchor`, `DEMO_ANCHORS`, `DemoStep { id, screen, anchor, actions, ticket?, holdMs }`, `DemoRun { steps, states }`),
  `demo/demo.math.ts` (`runDemo(mission, market): DemoRun`, `stepIndexById`), `demo/demo.config.ts`
  (`DEMO_MISSION`, `DEMO_SEED`, `DEMO_HOLD_MS`), engine action `{ type: "restore"; state }`. Sixteen
  steps with ids `welcome, clientFill, positions, riskBand, objectives, ticket, firstFill, dayStep, drift,
  autoHedge, scenarios, chain, toExpiry, attribution, policies, yourTurn`.
- From plan 02: `HedgingDeskModel` has `demo: boolean`, `seed`, `dispatch(action)`, `takeOver()`,
  `exitDemo()`, `setScreen`, `setTicketId/setSide/setQty`, `url.screen`. The view renders
  `<DemoBar desk={desk} />` (stub at `components/demo/DemoBar.tsx`) in place of the function keys on the
  desk screen and under the debrief screen while `desk.demo`; the root has `hdesk--demo`; anchors are
  `id="hd-<anchor>"`; strings `hdDemoStepOf, hdDemoPlay, hdDemoPause, hdDemoNext, hdDemoBack,
  hdDemoTakeOver, hdDemoExit, hdDemoMissions, hdDemoBarAria, hdDemoTakeOverHint, hdDemoKeysHint, hdDemoBadge`
  exist in `src/Language/HedgingDeskDemo.ts`.
- Reusable: `useTicker(running, ms, tick, onStop)` and `prefersReducedMotion()` from
  `src/components/playback/useTicker.ts` (re-exported by `src/components/playback/index.ts`);
  `isTyping(target)` from `src/components/layout/isTyping.ts`.
- Styles: `src/styles/_hedging-desk.scss` L262–322 is the function-key region (`.hdesk-footer`,
  `.hdesk-keys` grid 3/6 columns, `.hdesk-fkey` 44px tall, `.hdesk-fkey-code` amber 10px,
  `.hdesk-status`); L216–260 panel overrides (`.hdesk .panel-head` 26px, `.hdesk-panel .panel-body`);
  L347+ `.hdesk-cmd-btn` and `.hdesk:fullscreen`. `main.scss` L32–36 lists the desk partials.
- i18n registration: `index.en.ts` imports L53–58 and spreads L114–119 (plus plan 02's
  `hedgingDeskDemo` lines after them); `index.hu.ts` L53–58 / L115–120.

## Goal
1. `demo/useDemo.ts`: the controller hook.
2. `components/demo/DemoBar.tsx` (fills the stub) + `DemoControls.tsx` + `DemoCaption.tsx`.
3. `src/styles/_hedging-desk-demo.scss`: bar, highlight, dimming, badge; registered in `main.scss`.
4. `src/Language/HedgingDeskDemoSteps.ts` + `.hu.ts`: 16 titles and 16 captions.

## Non-goals
- No engine or script changes (plan 01); no new anchors or model fields (plan 02). If something is
  missing, stop and report rather than patching those files.

## Constraints
- `.tsx` ≤ ~150 lines each; the controller is a `.ts` hook with no JSX. No DOM mutation for the
  highlight: the root attribute + CSS do it. The only DOM access is `scrollIntoView` in an effect.
- Styles use tokens inside `.hdesk`; no gradients, no pills, no left-border accents; respect
  `prefers-reduced-motion`.

## Steps

1. **Controller `demo/useDemo.ts`** (`export function useDemo(desk: HedgingDeskModel)`; returns `null`
   when `!desk.demo`, else a `DemoModel`):
   ```ts
   export type DemoModel = {
     steps: DemoStep[]; index: number; step: DemoStep; total: number; atStart: boolean; atEnd: boolean;
     playing: boolean; play(): void; pause(): void; toggle(): void; next(): void; back(): void; goTo(i: number): void;
     takeOver(): void; exit(): void;
   };
   ```
   - `run = useMemo(() => runDemo(desk.mission, desk.market), [desk.mission, desk.market])`.
   - `index` in `useState(0)`; `playing` in `useState(() => !prefersReducedMotion())` (auto-play unless the
     reader asked for reduced motion; they still get Next/Back).
   - Effect on `[index, run]`: `desk.dispatch({ type: "restore", state: run.states[index] })`; if
     `desk.url.screen !== step.screen` call `desk.setScreen(step.screen)`; if `step.ticket` call
     `setTicketId(id)`, `setSide(side)`, `setQty(String(qty))`; else `setTicketId(STOCK_ID)`. Then, after a
     frame (`requestAnimationFrame`), `document.getElementById(`hd-${step.anchor}`)?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" })`.
     Guard every `document` access with `typeof document !== "undefined"`.
   - `useTicker(playing && !atEnd, step.holdMs, () => { next(); }, () => setPlaying(false))`; `next()` at the
     last step sets `playing` false instead of advancing.
   - Window keydown effect (skip when `isTyping(e.target)` or any modifier): `ArrowRight` → next,
     `ArrowLeft` → back, `" "` → toggle, `Escape` → exit; `preventDefault` only for handled keys.
   - `takeOver = () => { setPlaying(false); desk.takeOver(); }`, `exit = () => desk.exitDemo()`.
   - Ignore F2–F9 here (plan 02 already blocks them).

2. **`DemoBar.tsx`** (replace the stub; ~60 lines): `const demo = useDemo(desk); if (!demo) return null;`
   Root `<footer id="hd-keys" className="hdesk-footer hdesk-demo-bar" role="region" aria-label={t("hdDemoBarAria")}>`
   containing `<DemoControls demo={demo} />` and `<DemoCaption demo={demo} />`, then a status line
   `p.hdesk-status` with `t("hdDemoKeysHint")`. On the last step (`yourTurn`) the controls row also shows
   `hdDemoMissions` (→ `desk.setScreen("missions")` after `exit()`).

3. **`DemoControls.tsx`** (~50 lines): buttons styled like function keys (`button.hdesk-fkey.hdesk-demo-key`):
   Back (disabled at start), Play/Pause (`aria-pressed={playing}`), Next (disabled at end), then a
   right-aligned group: Take the desk (`title={t("hdDemoTakeOverHint")}`), Exit. `aria-keyshortcuts`
   "ArrowLeft" / "Space" / "ArrowRight" / "Escape". Focus the Next button on mount so arrow keys work at
   once (the global handler works anyway; focus is for screen readers).

4. **`DemoCaption.tsx`** (~30 lines): `<div className="hdesk-demo-caption" aria-live="polite">`
   with `span.hdesk-label` = `t("hdDemoStepOf", { n: index + 1, total })`, `h2.hdesk-demo-title` =
   `t(stepTitleKey(step.id))`, `p.hdesk-demo-body` = `t(stepBodyKey(step.id))`. Key helpers in
   `demo/demoCopy.ts`: `stepTitleKey(id) = \`hdDemo${cap(id)}Title\` as TranslationKey`, same for Body.

5. **Styles `src/styles/_hedging-desk-demo.scss`**, appended to `main.scss` as `@use "hedging-desk-demo";`
   after the `hedging-desk-missions` line:
   - `.hdesk-demo-bar { position: sticky; bottom: 0; z-index: 1; background: var(--surface); border-top: 1px solid var(--border); }`
     with a `.hdesk-demo-row` grid: controls (auto) | caption (1fr) at ≥ 768px; stacked below.
   - `.hdesk-demo-caption { padding: 8px 12px; } .hdesk-demo-title { margin: 0; font: inherit; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: .06em; } .hdesk-demo-body { margin: 2px 0 0; max-width: 72ch; line-height: 1.45; }`
   - Highlight, generated with a Sass `@each` over the anchor list (keep the list in one `$hd-demo-anchors`
     variable that mirrors `DEMO_ANCHORS`):
     ```scss
     .hdesk--demo .hdesk-panel, .hdesk--demo .hdesk-quotes, .hdesk--demo .hdesk-tabsrow { opacity: .55; transition: opacity var(--transition-base); }
     @each $a in $hd-demo-anchors {
       .hdesk--demo[data-demo-anchor="#{$a}"] #hd-#{$a} { opacity: 1; outline: 2px solid var(--primary); outline-offset: -2px; }
       .hdesk--demo[data-demo-anchor="#{$a}"] #hd-#{$a} > .panel-head { background: color-mix(in srgb, var(--primary) 18%, var(--surface-soft)); }
     }
     .hdesk--demo #hd-submit { opacity: 1; } // nested in the ticket; lifted with it
     @media (prefers-reduced-motion: reduce) { .hdesk--demo .hdesk-panel { transition: none; } }
     ```
     The attribute is set by the view root: plan 02 added `hdesk--demo`; here `DemoBar` cannot set an
     attribute on its parent, so expose the anchor through the model-free route: `useDemo` writes
     `data-demo-anchor` on the closest `.hdesk` ancestor in the same effect that scrolls
     (`bar.closest(".hdesk")?.setAttribute(...)`, removed on unmount). This is the one allowed DOM write;
     say so in a comment. (If the executor prefers, lift `index` into the view through a small context in
     `demo/DemoContext.ts`; either is acceptable, but do not edit `HedgingDeskView.tsx`.)
   - `.hdesk-cmd-badge { margin-left: 12px; padding: 0 6px; background: var(--hdesk-on-accent); color: var(--primary); font-size: 10px; letter-spacing: .12em; }` (square, no radius).
   - The bar must look right in `.hdesk--expanded` and `.hdesk:fullscreen` (sticky bottom works in both).

6. **Captions `src/Language/HedgingDeskDemoSteps.ts`** (`hedgingDeskDemoStepsEn`) and `.hu.ts`
   (`hedgingDeskDemoStepsHu`), registered after plan 02's `hedgingDeskDemo` lines. English copy (final
   unless the owner edits it; `{{q}}` is not available, so keep numbers out of the captions):
   - `Welcome` — "You are the market maker" / "A client just bought ten at-the-money calls from you. You keep the premium and the risk. The clock top right counts the trading days until they expire."
   - `ClientFill` — "The opening trade" / "The blotter records every event. The first line is the client's fill: you sold ten calls at the bid."
   - `Positions` — "What you hold" / "Ten short calls behave like being short about five hundred shares. That exposure is the delta, measured in shares."
   - `RiskBand` — "The delta band" / "The mission allows net delta to drift only inside the band at each close. Right now you are far outside it."
   - `Objectives` — "Three objectives" / "Few breaches, a hedge P&L close to zero at expiry, and limited spread costs. Every close is judged against them."
   - `Ticket` — "Fill the ticket" / "To neutralise delta you buy shares: the ticket shows the estimated fill, the spread you will pay and the net delta after the trade."
   - `FirstFill` — "The first hedge" / "The buy crosses the ask, so the cost appears at once. A square marks the fill on the price chart; net delta is now near zero."
   - `DayStep` — "One day later" / "Each step moves the simulated price one day. Delta drifts with the price and with time, so the hedge decays."
   - `Drift` — "Five days unhedged" / "Left alone for a week, net delta crossed the band at a close: that is a breach, and it counts against the first objective."
   - `AutoHedge` — "Auto-hedge" / "F4 trades the exact number of shares that brings net delta back to zero. The blotter tags the fill as automatic."
   - `Scenarios` — "What if" / "The matrix revalues the book for spot and volatility shocks; the profile shows P&L across spot today and at expiry."
   - `Chain` — "Hedging with options" / "You can also trade listed options. Picking a strike loads it into the ticket; options change gamma and vega, not only delta."
   - `ToExpiry` — "Through expiry" / "Hedged every day to the end, the book's P&L stays close to zero while the unhedged line swings. Fills accumulate along the path."
   - `Attribution` — "Where the money came from" / "Premium received, settlement paid, stock P&L, financing and costs add up to the final number."
   - `Policies` — "Rules compared" / "The same path replayed with daily, weekly, monthly and no hedging. Fewer rebalances cost less but breach more."
   - `YourTurn` — "Your turn" / "Take the desk to continue this book by hand, open Missions to start fresh, or exit to your own path."
   HU: draft all 32 strings; list them in Findings for review.

7. **Reduced motion and focus.** With `prefers-reduced-motion`, no auto-play, no smooth scroll, no
   opacity transition. On exit, focus returns to the command-bar demo button if present
   (`document.querySelector<HTMLElement>(".hdesk-cmd-btn")?.focus()` in the exit handler).

## Acceptance criteria
- On `?demo=1` the bar shows "Step 1 of 16", the quote strip is highlighted; Next moves the highlight and
  the book (`#hd-positions` after step 7 shows a long stock position); Back returns exactly; step 14
  switches to the debrief screen and step 16 back to the desk.
- Space toggles play; ArrowRight/ArrowLeft move; Escape exits and `?demo` disappears; "Take the desk"
  keeps the current P&L and brings the function keys back.
- `localStorage.getItem("qs.hedgingDesk.progress.v1")` is unchanged after stepping through all 16.
- No `.tsx` over 150 lines; captions all through i18n; no hex colours in `.tsx`.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
NEXT='(async(n)=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const out=[];for(let i=0;i<n;i++){document.querySelector("[aria-keyshortcuts=ArrowRight]").click();await w(250);out.push([document.querySelector(".hdesk").dataset.demoAnchor,new URLSearchParams(location.search).get("screen")])}return out})'
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk?demo=1,/hu/delta-hedging/desk?demo=1" \
  --after "/delta-hedging/desk?demo=1|(()=>({step:document.querySelector('.hdesk-demo-caption .hdesk-label').textContent,anchor:document.querySelector('.hdesk').dataset.demoAnchor,progress:localStorage.getItem('qs.hedgingDesk.progress.v1')}))()" \
  --after "/delta-hedging/desk?demo=1|${NEXT}(15)" \
  --after "/delta-hedging/desk?demo=1|(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<6;i++){document.querySelector('[aria-keyshortcuts=ArrowRight]').click();await w(200)}const pnl=document.querySelector('.hdesk-quote--pnl dd').textContent;document.querySelector('.hdesk-demo-bar button[title]').click();await w(400);return {pnl,after:document.querySelector('.hdesk-quote--pnl dd').textContent,keys:document.querySelectorAll('.hdesk-fkey').length,search:location.search}})()"
# expect: first --after: "Step 1 of 16", anchor "quotes", progress null; second: 15 pairs ending with
# ["debrief-attribution","debrief"], ["debrief-policies","debrief"], ["tabs", null]; third: pnl === after,
# keys 6, search without demo=1 (seed=<DEMO_SEED> present)
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk?demo=1,/hu/delta-hedging/desk?demo=1" --after "${NEXT}(8)"
```
Then stop the server and confirm port 4173 is free.

## Pitfalls
- **Restore order.** Dispatch `restore` *before* `setScreen`, so the debrief mounts with a settled state and
  `useDebrief` sees `desk.demo` (plan 02's guard) and does not record.
- **`useTicker` interval resets** when `holdMs` changes between steps; that is intended.
- **Do not store the whole `DemoRun` in state**; it is memoised from `mission` and `market`, which are
  stable for a session.
- **StrictMode double effects** in dev: the restore effect is idempotent; the attribute write is too.
- **Keyboard conflicts.** Space must not toggle play while a button in the bar has focus and the key
  would activate it; check `isTyping` and let native button activation win (`if (e.target instanceof HTMLButtonElement && e.key === " ") return;`).
- **HU length.** Captions are longer in Hungarian; the body wraps at 72ch and the bar grows in height;
  the layout audit at 360px must stay clean (no overlap with the sticky bar: the grid above gets
  `padding-bottom` equal to nothing; the bar is in flow, sticky only when the desk is taller than the
  viewport).

## Findings (fill in during execution)
- Baseline / measurements: smoke on vite preview: `?demo=1` opens at "Step 1 of 16" with anchor `quotes`; Next walks blotter → positions → risk → mission → ticket → price → delta → risk → keys → matrix → chain → pnl → debrief-attribution (screen=debrief) → debrief-policies → tabs (back on desk); Space toggles play, ←/→ step, Escape exits (URL drops `demo`); Take the desk after step 7 keeps P&L (−$55 → −$55) and brings the 6 function keys back; progress key stays `null` through all 16 steps. Layout audit (360–1536, light+dark, EN+HU, steps 1 and 9): 48 pages, 0 failing (only the site-wide 22px brand link flagged). `DemoBar.tsx` 27 lines, `DemoControls.tsx` 43, `DemoCaption.tsx` 17.
- Deviations and why:
  - The playback position lives in a tiny external store `demo/demoStore.ts` (`useSyncExternalStore`), not in `useState`: the view mounts one `DemoBar` under the desk and another under the debrief, so local state reset to step 1 on the switch to the debrief.
  - Take the desk / Exit mark the run `ended` instead of resetting the index; resetting first restored step 1's book before the URL left demo mode (take-over showed −$50 instead of −$55). A new demo starts at step 1 when its bar mounts.
  - The bar is **in flow, not sticky**: the sticky dock overlapped the panels it narrates (layout audit 48/48 failing); controls and caption sit side by side from 1024 px (not 768) so the HU labels fit.
  - The anchor attribute is written on the closest `.hdesk` from the bar's ref (the one DOM write, as the plan allows); `useDemo(desk, barRef)` takes that ref.
  - `runDemo` is called with `desk.seed` (plan 01's signature has a seed parameter).
- Items awaiting owner approval: English captions as given in the plan (16 titles + 16 bodies, `HedgingDeskDemoSteps.ts`); HU drafts, all 32 strings in `HedgingDeskDemoSteps.hu.ts`, e.g. "Te vagy az árjegyző", "A delta-sáv", "Öt nap fedezés nélkül", "Rajtad a sor".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (sections 2 and 4) and `docs/plans/hedging-desk-demo/03-demo-bar.md`, and confirm plans 01 and 02 are
> marked done (stop and report if not). Implement plan 03: `demo/useDemo.ts`, `demo/demoCopy.ts`, the
> `DemoBar`/`DemoControls`/`DemoCaption` components, `src/styles/_hedging-desk-demo.scss` registered in
> `main.scss`, and the `HedgingDeskDemoSteps` i18n tables with the captions given. Run the Verification
> block and make it pass. Fill in Findings (list every HU string), set plan 03 to `done` in the README
> table, and summarise. Do not edit `engine/`, `demo/demo.*.ts` from plan 01, `useHedgingDesk.ts`,
> `HedgingDeskView.tsx` or `src/features/delta-hedging/`. Do not run `git stash`.
