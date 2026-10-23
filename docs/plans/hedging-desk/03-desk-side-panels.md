# 03 — Desk side columns: mission, risk, blotter, order ticket, option chain

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
These panels are how the learner trades and reads the book: what the mission asks, how far net delta is
from the band, what each trade will do before it is sent, and the option chain to hedge gamma with.
They are the interactive heart of the desk.

## Current state (verified 2026-10-23, after plans 01–02)
- Stubs to fill (plan 02 created them; each is `export default function X({ desk }: { desk: HedgingDeskModel })`):
  `src/features/hedging-desk/components/MissionPanel.tsx`, `RiskPanel.tsx`, `Blotter.tsx`,
  `OrderTicket.tsx`, `OptionChain.tsx`.
- Model from `src/features/hedging-desk/useHedgingDesk.ts`: `mission`, `market`, `state`
  (`BookState`), `S`, `tau`, `greeks` (`delta`, `gamma`, `vega`, `theta`, `dollarDelta`,
  `dollarGamma1pct`), `pnl`, `objectives` (`ObjectiveResult[]`), `quote(id)`, ticket state
  (`ticketId`, `side`, `qty` + setters), actions `submit()`, `autoHedge()`, `step(n)`.
- Engine helpers: `optionId(type, strike)`, `parseInstrument(id)`, `isStock(id)`, `STOCK_ID`,
  `CONTRACT_MULT`, `realizedVol`, `positionValue` (`src/features/hedging-desk/engine/`).
- Shared helpers (plan 02): `missionCopy.ts` (`missionTitleKey`, `missionBriefKey`, `objectiveText`,
  `objectiveValueText`, `statusKey`), `deskFormat.ts` (`num`, `signed`, `money`, `toneClass`).
- Theme helpers in `src/styles/_hedging-desk.scss`: `.hdesk-panel`, `.hdesk-up`, `.hdesk-down`,
  `.hdesk-num`, `.hdesk-label`. Tokens inside `.hdesk`: `--primary` amber, `--positive` blue,
  `--negative` red, `--surface-soft`, `--border`, `--muted`.
- Design reference: canvas board `Main.dc.html` (left column: Mission, Portfolio risk, Blotter/events;
  right column: Order ticket, OMON option chain).

## Goal
1. **MissionPanel**: mission title, brief, clock bar (`day / days`, amber fill), and one row per
   objective: label, live value line and status (On track = muted, At risk = amber, Pass = blue,
   Fail = red; the status word is always shown, so colour is never the only signal).
2. **RiskPanel**: net delta (big number, shares) with "In band" / "Out of band"; `$Δ`; a horizontal
   meter from −400 to +400 with the ±band region tinted and a marker at net delta; a 2×2 grid of Gamma
   (sh/$1), Vega ($/vol pt), Theta ($/day), $Gamma 1% move; then key–value rows: Cash, Book market value,
   Spread costs paid, Band breaches (`n / limit`), Breakeven move per day
   (`√(2·θ_day·365/252 / −Γ)` when Γ < 0 and θ > 0, else "—").
3. **Blotter**: newest 14 events. Columns: `D07`, kind (FILL / BRCH / EXP / INFO), text formatted from
   the structured event, e.g. "SELL 10 QSBX 100C @ 4.81 · client trade", "Close Δ −184 sh outside ±100".
4. **OrderTicket**: instrument name + "Underlying" button; hint "Pick an option from the chain to trade
   it"; Buy/Sell segmented (`aria-pressed`); quantity `<input type="number" min="1" step="1">` with a
   `<label>`; four presets (stock 100/250/500/1000, options 1/5/10/20); preview rows Mid, Est. fill,
   Notional, Spread cost, Δ impact, Γ impact, Net Δ after (blue if inside band, red if not); submit
   button "BUY 500 QSBX US <GO>" coloured by side. After expiry: a notice with a button to the Debrief
   screen instead of the submit button. If `mission.instruments === "stock"`, the chain is read-only and
   only the stock can be selected.
5. **OptionChain**: rows for `market.strikes`; each row = call button (bid, ask, Δ) | strike | put
   button (bid, ask, Δ). Clicking a side selects that option in the ticket. The strike nearest spot is
   highlighted (amber text, `--surface-soft` background); the selected instrument has an amber-tinted
   background. Header shows `IV {iv%} · T {tau}Y`.

## Non-goals
- Charts, scenario matrix, risk profile, positions table (plan 04). Missions/Debrief screens (05/06).
- No engine changes: if a number is missing from the model, compute it in a small pure helper in
  `src/features/hedging-desk/sidePanels.math.ts` (this plan owns that file).

## Constraints
- Each `.tsx` ≤ ~150 lines: split `OrderTicket` into `OrderTicket.tsx` + `TicketPreview.tsx` +
  `QtyPresets.tsx` if needed; chain rows into `ChainRow.tsx`.
- Strings in a new table `src/Language/HedgingDeskSide.ts` (`hedgingDeskSideEn`) + `.hu.ts`, registered
  by appending to `index.en.ts` / `index.hu.ts`. Keys prefixed `hdSide`.
- Styles in a new partial `src/styles/_hedging-desk-side.scss`, added as `@use "hedging-desk-side";`
  directly after `@use "hedging-desk";` in `main.scss` (append; if 04–06 already added lines there, add
  yours after theirs). Scope every rule under `.hdesk`.
- Real `<button>`, `<input>`, `<label>`; icon-only buttons get `aria-label`. Touch targets ≥ 44px for the
  submit button and side toggles; chain rows may be 28px (dense terminal) but have visible focus.
- No pills, no left borders; selected states use background tint.

## Steps
1. `sidePanels.math.ts` (pure): `ticketPreview(model-like inputs) → { mid, fill, notional, cost,
   deltaImpact, gammaImpact, netAfter, inBand }`, `breakevenMove(gamma, thetaPerDay)`,
   `meterPosition(delta, range = 400) → percent 0..100`, `nearestStrike(strikes, S)`.
   Add unit tests in a new file `scripts/hedging-desk-side.test.mjs` (load with
   `importSrc` from `scripts/lib/load-ts.mjs`); `npm run test:hedging-desk` picks it up by glob.
2. `eventText(t, event, mission)` in `src/features/hedging-desk/blotterText.ts`: switch on **every**
   `DeskEvent` kind declared in `engine/desk.types.ts` (fill → side, qty, instrument label, price, tag;
   breach → delta and band; expiry; start; gap → "Overnight gap {{move}}%"; ivShift → "Implied vol now
   {{iv}}%"; rejected → "Order rejected: trade limit reached"; assignment → "{{id}} exercised: {{shares}}
   shares"), with a `never` check. M1 emits only the first four; the rest appear once plan 07 lands.
   Kind tags: FILL, BRCH, EXP, INFO (start), GAP, IV, REJ, ASGN.
   If `mission.maxTrades` is set, the ticket also shows "Trades left: n" (`maxTrades − tradeCount(state)`). Instrument label: `"QSBX US"` for stock, `"QSBX 100C"` for options.
3. Fill the five stubs as described in Goal, reading only from `desk`.
4. Styles: meter, objective rows, chain grid (`grid-template-columns: minmax(0,1fr) 52px minmax(0,1fr)`),
   ticket rows (`.kv` style key–value lines with 1px bottom rules), buy/sell colours from
   `--positive` / `--negative` with black text when active.

## Acceptance criteria
- Selecting `C105` in the chain then Buy 5 → the ticket preview's Δ impact equals
  `5·100·Δ(C105)` (rounded) and Net Δ after = current net Δ + impact; after submit the blotter shows the
  fill and the risk panel's net delta matches the preview.
- F4 auto-hedge brings net delta to within ±1 share and the band tag turns "In band".
- After stepping to expiry the submit button is replaced by the expiry notice; the chain shows 0.00 bids
  for out-of-the-money options and no errors.
- Keyboard: Tab reaches Underlying, Buy, Sell, quantity, presets, submit, each chain side, in order.
- Smoke clean; `test:hedging-desk` includes and passes the new side-panel tests.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/hu/delta-hedging/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk"
```
Run `node scripts/cdp-smoke.mjs --help` for its `--after` click option and use it to click the C105 call
button, the Buy button and the submit button, then check the blotter text appears. Stop the server and
confirm port 4173 is free.

## Pitfalls
- **Quantity is a string** in the ticket state; parse with `Math.floor(Math.abs(Number(qty)))` and treat
  `NaN`/0 as "no order" (disable submit).
- **Put deltas are negative**; Δ impact for selling puts is positive. Use the quote's delta, never
  `1 − Δcall`.
- **True minus sign.** Use `signed()` from `deskFormat.ts`; do not mix `-` and `−` in the same column.
- **Bid floors at 0** for far out-of-the-money options; do not show negative bids.
- Do not format numbers with `toLocaleString()` without a locale; HU would switch the decimal comma
  inconsistently across panels. Use `deskFormat.ts` everywhere.

## Findings (fill in during execution)
- Baseline / measurements (vite preview, M1 seed 7): picking C105, Buy 5 shows Δ impact +187 sh and
  Net Δ after −362 sh (from −549); after submit the risk panel shows −362 sh and the blotter shows
  "BUY 5 QSBX 105C @ 2.73 · manual". F4 brings net Δ to 0 sh, "In band". At expiry the submit button
  is replaced by the notice and out-of-the-money bids show 0.00. Smoke clean on `/delta-hedging`,
  `/delta-hedging/desk` and `/hu/delta-hedging/desk`. `test:hedging-desk` 40/40, `test:labs` 59/59,
  `test:seo` 25/25, lab files unchanged against `b0f23d3`.
- Layout audit (360/768/1280/1536, dark): side-panel tap targets are fixed (44px buttons below 768px
  and on touch screens). What is left belongs to other plans: SVG axis-label collisions and clipping
  in the charts (plan 04); the scenario matrix caption ("Instant shock, revalued …") overlapping the
  option chain at 768 and 1280 (plan 04); 28px screen tabs and the brand link at 360 (plan 02 / site).
- Deviations and why:
  - `parseQty` accepts positive integers only ("2.5" means no order), to match the hook's `submit`
    rule. Flooring would let the preview show an order that `submit` then drops.
  - New files beyond those named: `DeltaMeter.tsx` (split out of RiskPanel), plus `QtyPresets.tsx`,
    `TicketPreview.tsx` and `ChainRow.tsx` as the plan suggested. `instrumentLabel` and `parseQty` live
    in `sidePanels.math.ts`.
  - The chain header uses `pct()`, so it reads "IV 22.00% · T 0.250Y".
  - The ticket's spread cost includes the ticket fee (M2), matching the engine's `Fill.cost`.
- Items awaiting owner approval: every key in `src/Language/HedgingDeskSide.hu.ts` (all `hdSide*`,
  70 keys) is a draft. Points to check: blotter tags KÖTÉS / SÉRT / LEJ / RÉS / ELUT / LEHÍV, and
  "Fedezeti napi mozgás" for breakeven move.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/03-desk-side-panels.md`, and confirm plans 01 and 02 are
> marked done (stop and report if not). Implement plan 03: fill the MissionPanel, RiskPanel, Blotter,
> OrderTicket and OptionChain stubs, add `sidePanels.math.ts` (+ tests), `blotterText.ts`, the
> `HedgingDeskSide` i18n table and the `_hedging-desk-side.scss` partial. Run the verification block
> and make it pass. Fill in Findings (list HU strings), set plan 03 to `done` in the README table, and
> summarise. Edit only the files this plan names, plus additive lines in `index.en.ts`, `index.hu.ts`
> and `main.scss`.
