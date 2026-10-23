# 07 — What if: compare hedges before trading (stock, options, do nothing, close out, the ticket)

Status: done (2026-10-23) · Depends on: – (the engine and tests stand alone; the tab is verified once 05 is done) · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Learners want to try ideas without spending a run: "what happens if I hedge with options instead of
stock?", "what if I do nothing today?", "what does the trade in my ticket do?". This plan adds a pure
scenario engine that applies a candidate trade to a **copy** of the book and reports, using only today's
market: cost, the Greeks before and after, whether delta lands in the band, the chance of a breach at
tomorrow's close, one-day P&L for typical moves, a vol-shock P&L, and the effect on the mission's
objectives. The tab shows the scenarios side by side, explains each in plain words, and can load a
scenario's trade into the ticket.

## Current state (verified 2026-10-23)
- `applyOrder(state, market, mission, order)` (`engine/book.math.ts`) is pure and returns a new state.
  It fills at ask (buy) or bid (sell), charges `half × mult` per unit plus `ticketFee` on desk trades,
  and is a **no-op** after expiry, for a non-integer or non-positive qty, or for an option in a
  stock-only mission. Past `maxTrades` it only adds a `rejected` event.
  `autoHedgeOrder(state, market)` gives the stock order that flattens delta. `tradeCount(state)`.
- `bookGreeks(state, market)` → `{ delta, gamma, vega, theta, dollarDelta, dollarGamma1pct }`;
  `positionValue(positions, S, tau, iv, rate)` (mid, no cash); `markToMarket(state, market)`;
  `scenarioGrid(state, market, spotShocks, volShifts)` (`engine/risk.math.ts`).
- `quoteInstrument(id, S, tau, iv, rate, costs)` → `{ mid, bid, ask, half, mult, delta, gamma, vega, theta }`
  (vega per vol point, theta per calendar day); `tauAt(day, days) = (days - day) / 252`
  (`engine/pricing.math.ts`). `optionId("C", 100)` → `"C100"`, `parseInstrument(id)`
  (`engine/instruments.math.ts`). `nearestStrike(strikes, S)` (`sidePanels.math.ts`).
- `evaluateObjectives(mission, state, market)` → `ObjectiveResult[]`. Careful: `beatPolicy` calls
  `replayPolicy` only once settled, so it is safe on an unsettled copy.
- `normCdf(x)` in `src/lib/stats/distributions.ts` (pure).
- Strikes in every mission: 90, 92.5, …, 110. Costs: stock half-spread $0.01, option half-spread $0.05
  (= $5 per contract per side), M2 ticket fee $15. Band ±100 sh.
- Measured, M1 at day 0 with seed 7: book Δ −549, Γ −36, vega −$198/pt, θ +$28/day, cash +$4,704 (the
  premium received, after the client fill's $50 half-spread). C100: mid 4.75, Δ 0.549, Γ 0.036/sh,
  vega $0.198/pt per share. **Buying 10 C100 back** flattens every Greek, costs another $50 of spread
  and locks the P&L near −$100, which passes all three M1 objectives without any hedging. The help must
  say this honestly ("closing the trade is not hedging it"); whether M1 should forbid it is an
  owner question (README §6). Do not change the engine.
- Plan 05 provides `DeskHelp` (`show`, `point`, `close`), the stub `components/help/WhatIfTab.tsx`
  (props `{ desk: HedgingDeskModel; help: DeskHelp }`), shared classes (`.hdesk-help-section/-h/-p/-actions/-kv`,
  `.hdesk-help-tone--*`) and labels `hdHelpUseTicket`, `hdHelpShowMe`.
- `HedgingDeskModel` (`useHedgingDesk.ts`) exposes `state, market, mission, day, S, iv, greeks, pnl,
  ticket: { id, side, qty: string }, setTicketId, setSide, setQty, trades`.

## Goal
1. A pure `help/whatIf.math.ts` with `whatIfScenarios(mission, state, market, ticket?)` and
   `simulateOrders(...)`, tested in `scripts/hedging-desk-help-whatif.test.mjs`.
2. `WhatIfTab` shows a compact card per scenario, an expandable detail with explanation, a shock table,
   objective impact and a "Put in ticket" action.
3. Every scenario and verdict has EN copy and a HU draft.

## Non-goals
- **No future data.** Use only `market.spot[state.day]`, `market.iv[state.day]`, `market.rate`, `market.days`
  and `market.strikes`. Never `market.spot[d + k]`, `market.gapDay` or `replayPolicy`.
- No multi-day simulation of a hedging policy (that needs the hidden path), no new charts, no engine edits.

## Constraints
README §4. Math and types in `help/whatIf.math.ts` and `help/whatIf.types.ts`; copy in
`src/Language/HedgingDeskHelpWhatIf*.ts`; `.tsx` ≤ ~150 lines each.

## Steps — phase A: engine (tests green before phase B)
1. `help/whatIf.types.ts`:
   ```ts
   export type WhatIfId = "ticket" | "doNothing" | "stockHedge" | "optionDelta" | "otmOptionDelta"
     | "gammaNeutral" | "vegaNeutral" | "shortOptionDelta" | "closeOut";
   export type WhatIfBlock = "expired" | "stockOnly" | "tradeLimit" | "emptyTicket" | "nothingToDo";
   export type ShockRow = { sigmas: number; move: number; pnl: number };
   export type WhatIfVerdict = "fixesDelta" | "missesBand" | "addsShortGamma" | "cutsGamma" | "flipsGamma"
     | "addsVega" | "cutsVega" | "losesTheta" | "closesBook" | "wrongWay" | "costly";
   export type WhatIfResult = {
     id: WhatIfId; orders: Order[]; block?: WhatIfBlock;
     cost: number;        // half-spreads + fees of these orders
     premium: number;     // cash out (+) / in (−) for option legs, excluding cost
     before: Greeks; after: Greeks;
     inBand: boolean;     // |after.delta| <= band
     breachChance: number;// P(|Δ at tomorrow's close| > band), 0..1
     shocks: ShockRow[];  // one day ahead at −2σ, −1σ, 0, +1σ, +2σ
     volUp: number;       // P&L of an instant +2 vol-point move after the trade
     objectives: ObjectiveResult[]; // evaluated on the copy after the orders
     verdicts: WhatIfVerdict[];
   };
   ```
2. `help/whatIf.math.ts`:
   - `/// Applies orders to a copy of the book and measures it with today's market only.`
     `export function simulateOrders(mission, state, market, id: WhatIfId, orders: Order[]): WhatIfResult`.
     Steps: `blocked` checks (settled → `expired`; any option order and `instruments === "stock"` →
     `stockOnly`; `maxTrades` set and `tradeCount + orders.length > maxTrades` → `tradeLimit`). Then
     `after = orders.reduce((s, o) => applyOrder(s, market, mission, o), state)`, with
     `cost = after.costsPaid - state.costsPaid` and `premium` = the sum over option fills of
     `±qty × price × mult` (buy positive), using `after.fills.slice(state.fills.length)`.
   - `breachChance(delta, gamma, S, sigmaDay, band)`: delta after a move x is `delta + gamma·x` with
     `x ~ N(0, (S·sigmaDay)²)`, `sigmaDay = iv / √252`. If `|gamma| < 1e-9`, return `|delta| > band ? 1 : 0`.
     Otherwise the safe interval is between `(−band − delta)/gamma` and `(band − delta)/gamma` (sorted), and
     `P = 1 − (Φ(hi/s) − Φ(lo/s))` with `s = S·sigmaDay`. Export it; it is tested on its own.
   - `shocks`: for k in [−2, −1, 0, 1, 2]: `S1 = S·(1 + k·sigmaDay)`,
     `tau1 = max(0, tauAt(d + 1, market.days))`, `pnl = positionValue(after.positions, S1, tau1, iv, rate)
     − positionValue(after.positions, S, tau, iv, rate)`. Positions are unchanged and cash interest is
     ignored. State in the JSDoc that this is "one day of theta plus the move".
   - `volUp = positionValue(…, S, tau, iv + 0.02, …) − positionValue(…, S, tau, iv, …)`.
   - `verdicts`: `fixesDelta` if `|before.delta| > band` and `inBand`; `missesBand` if not `inBand`;
     `wrongWay` if `|after.delta| > |before.delta| + 20`; `addsShortGamma` if `after.gamma < before.gamma − 1`
     and `after.gamma < 0`; `cutsGamma` if `|after.gamma| < |before.gamma| − 1`; `flipsGamma` if the sign
     changes and `|after.gamma| > 5`; `addsVega` / `cutsVega` the same with a threshold of $20/pt;
     `losesTheta` if `after.theta < before.theta − 5`; `closesBook` if every option position is 0 and
     `|after.delta| < 1`; `costly` if `cost > 0.5 ×` the `costsBelow` limit when that objective exists.
   - `/// The standard scenarios for this book, then the ticket if it is valid.`
     `export function whatIfScenarios(mission, state, market, ticket?: { id: InstrumentId; side: Side; qty: number }): WhatIfResult[]`.
     Let `d, S, tau, iv`, `atm = nearestStrike(strikes, S)`, `g = bookGreeks(state, market)`,
     `q(id) = quoteInstrument(id, S, tau, iv, rate, mission.costs)`, and let `next` be the strike one step
     out of the money (the next strike above `atm` for calls, below for puts; clamp at the ends).

     | id | Orders |
     |---|---|
     | `doNothing` | none (`block: undefined`; just measures the current book) |
     | `stockHedge` | `autoHedgeOrder(state, market)` (if null → `nothingToDo`), tag `manual` |
     | `optionDelta` | if `g.delta < 0`: buy calls at `atm`; else buy puts at `atm`. `qty = round(abs(g.delta) / (abs(q.delta) × 100))` |
     | `otmOptionDelta` | the same at `next` (more contracts, each with less delta) |
     | `gammaNeutral` | buy (if `g.gamma < 0`) or sell calls at `atm`, `n = round(abs(g.gamma) / (q.gamma × 100))`, then the stock order that flattens the delta of the resulting copy |
     | `vegaNeutral` | only if `mission.greeks` includes `"vega"`: ATM calls, `n = round(abs(g.vega) / (q.vega × 100))`, side opposite to the vega sign, then stock to flatten delta |
     | `shortOptionDelta` | the "wrong tool" example: if `g.delta < 0` sell puts at `atm`, else sell calls at `atm`, sized like `optionDelta`. It fixes delta but adds short gamma and short vega |
     | `closeOut` | for each non-zero option position, the opposite order of the same size; then flatten stock (sell held shares or buy them back) |
     | `ticket` | the ticket's order (`tag: "manual"`) when `qty` is a positive integer, else `emptyTicket` |

     Order tags for desk legs are `"manual"`. Skip a leg whose qty rounds to 0. Return `ticket` first,
     then `doNothing`, `stockHedge`, then the rest in the table order.
3. Test `scripts/hedging-desk-help-whatif.test.mjs` (≥ 10 tests):
   - `breachChance`: gamma 0 cases; symmetric case `delta 0, band 100, gamma −36, S 100, sigmaDay 0.0139`
     → about 0.045 (100 sh of drift needs a $2.78 move; one daily σ is 100 × 0.22 / √252 ≈ $1.39, so that is
     a 2σ day either way: 2 × (1 − Φ(2.0)) ≈ 0.0455). Assert between 0.04 and 0.05.
   - M1 day 0: `stockHedge` orders `buy 549 STOCK`, `inBand`, `fixesDelta`, cost ≈ $5.49.
   - M1 day 0: `optionDelta` buys 10 C100 → every Greek ≈ 0, verdict includes `closesBook`.
   - M1 day 0: `otmOptionDelta` uses C102.5 with qty > 10, `after.gamma > −36` (`cutsGamma`), `after.vega`
     less negative.
   - M1 day 0: `shortOptionDelta` sells P100 → `inBand`, `addsShortGamma`, `after.vega < before.vega`.
   - M1 day 0: `gammaNeutral` → `|after.gamma| < 3`, `inBand`, `losesTheta`.
   - M2: every option scenario has `block: "stockOnly"`; `stockHedge` cost includes the $15 fee.
   - Settled book: every scenario `expired`.
   - `doNothing` at day 0: `breachChance` 1 (already outside the band).
   - Purity: `state` is deep-equal before and after `whatIfScenarios` (no mutation).
   - **No future reads**: two markets equal up to day d and different afterwards (spot, iv, gapDay) give
     deep-equal results.
   - `vegaNeutral` exists only for M4.

## Steps — phase B: copy, tab, styles
4. Copy `src/Language/HedgingDeskHelpWhatIf.ts` (`hedgingDeskHelpWhatIfEn`) and `.hu.ts`
   (`hedgingDeskHelpWhatIfHu`), registered after the last `hedgingDeskHelp…` line in both index files
   (re-read; keep other plans' lines). Keys and draft English:
   - Intro `hdWiIntro`: "Each card applies a trade to a copy of your book, priced with today's market. Nothing is traded until you submit the ticket. The tomorrow numbers use typical moves, not the real path."
   - Per scenario `hdWi<Id>Title` / `hdWi<Id>Body`:
     - `ticket`: "Your ticket" / "What the order in the ticket would do right now."
     - `doNothing`: "Do nothing today" / "Keep the book as it is and step the day."
     - `stockHedge`: "Hedge with stock (F4)" / "Buy or sell shares until delta is flat. Cheap and exact for today, but gamma stays: tomorrow's move pushes delta away again."
     - `optionDelta`: "Hedge delta with at-the-money options" / "Buy {{qty}} {{inst}}. Options have delta too, so this can flatten delta, but it also changes gamma, vega and theta, and costs more spread than shares."
     - `otmOptionDelta`: "Hedge delta with out-of-the-money options" / "Each {{inst}} carries less delta, so you need {{qty}}. You get a different gamma and vega mix for a different premium."
     - `gammaNeutral`: "Neutralise gamma, then delta" / "Buy {{qty}} {{inst}} so that tomorrow's moves stop changing your delta, then flatten delta with shares. You give up most of the theta you were earning."
     - `vegaNeutral`: "Neutralise vega, then delta" / "Trade {{qty}} {{inst}} against your vega, then flatten delta with shares."
     - `shortOptionDelta`: "Fix delta by selling options" / "Selling {{qty}} {{inst}} also flattens delta and even collects premium, but it adds short gamma and short vega: bigger losses on big moves and on vol spikes."
     - `closeOut`: "Close the whole book" / "Buy back every option and flatten the stock. All risk goes, the spread is paid, and the P&L is locked. This ends the trade; it is not hedging it."
   - Verdicts `hdWiV<Verdict>`: e.g. `fixesDelta` "Brings delta inside the band", `missesBand` "Delta still outside the band", `wrongWay` "Makes delta worse", `addsShortGamma` "Adds short gamma", `cutsGamma` "Cuts gamma", `flipsGamma` "Turns you long gamma", `addsVega` "Adds vega exposure", `cutsVega` "Cuts vega", `losesTheta` "Gives up theta income", `closesBook` "Closes the book", `costly` "Uses over half your cost budget".
   - Blocks `hdWiB<Block>`: `expired` "Expired: nothing to trade.", `stockOnly` "Options are locked in this mission.", `tradeLimit` "Not enough trades left.", `emptyTicket` "Fill the ticket to see its effect.", `nothingToDo` "Delta is already flat."
   - Labels: `hdWiCost` "Cost", `hdWiPremium` "Premium", `hdWiDeltaAfter` "Δ after", `hdWiGammaAfter` "Γ after", `hdWiVegaAfter` "Vega after", `hdWiThetaAfter` "Θ/day after", `hdWiBreach` "Breach chance at tomorrow's close", `hdWiShocks` "Tomorrow's P&L if spot moves", `hdWiSigma` "{{n}}σ ({{move}})", `hdWiVolUp` "If implied vol jumps 2 pts", `hdWiObjectives` "Objectives after this trade", `hdWiDetails` "Details", `hdWiStep` "Leg {{n}} of {{total}}", `hdWiMultiLeg` "Two legs: load the first, submit, then come back for the second.".
5. Tab: replace `components/help/WhatIfTab.tsx` (props `{ desk, help }`). `useMemo` over
   `whatIfScenarios(desk.mission, desk.state, desk.market, ticketOrNull)`, where `ticketOrNull` comes from
   `parseQty(desk.ticket.qty)` (`sidePanels.math.ts`). Render the intro, then one
   `components/help/WhatIfCard.tsx` per result: title; a `hdesk-help-kv` with cost, Δ after, Γ after,
   breach chance (`pct`); and verdict chips. **Verdicts are plain text lines with a tone background,
   not pills.** A "Details" toggle (`aria-expanded`) opens `components/help/WhatIfDetail.tsx`: body copy
   with `{{qty}}`/`{{inst}}` from the first option leg (`instrumentLabel` from `sidePanels.math.ts`),
   the before → after Greeks, the shock table (5 rows, `signedMoney`, up/down tone classes), the vol-up
   line, and the objectives after the trade (reuse `objectiveText` / `statusKey` from `missionCopy.ts`).
   Then a "Put in ticket" button that loads the first leg (`setTicketId`, then `setSide`, then
   `setQty`) and calls `help.point("ticket")`. Multi-leg scenarios also show `hdWiMultiLeg`; after the
   first leg fills, the scenario recomputes and its remaining leg becomes the first. Blocked cards show
   the block text and no button.
6. Styles: `src/styles/_hedging-desk-help-whatif.scss`, appended in `main.scss` after the other help
   partials (re-read first). Only card layout and the shock table go here; reuse plan 05's classes.

## Acceptance criteria
- `npm run test:hedging-desk` passes; breaking purity (e.g. reading `market.spot[d + 1]`) makes the
  "no future reads" test fail.
- On M1 day 0 the tab shows the ticket card first, then do nothing (breach chance 100%), stock hedge
  (cost $5), ATM options (closes the book), OTM options, gamma-neutral, selling puts (adds short gamma)
  and close out.
- "Put in ticket" on the OTM card fills BUY n C102.5; submitting it and reopening the tab updates the
  numbers.
- On `?m=M2` every option card shows "Options are locked in this mission."

## Verification
Run the README §4 standard commands, then:
```bash
(npx vite preview --port 4173 --strictPort &) && sleep 4
W='(ms)=>new Promise(r=>setTimeout(r,ms))'
WI="(async()=>{const w=${W};document.querySelector('[aria-controls=hd-help]').click();await w(200);const tab=[...document.querySelectorAll('#hd-help [role=tab]')][1];tab.click();await w(300);const cards=document.querySelectorAll('#hd-help .hdesk-wi-card').length;const det=document.querySelector('#hd-help .hdesk-wi-card [aria-expanded]');det?.click();await w(150);const rows=document.querySelectorAll('#hd-help .hdesk-wi-shocks tr').length;return {cards,rows}})()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/hu/delta-hedging/desk,/delta-hedging/desk?m=M2,/delta-hedging/desk?m=M4" \
  --after "/delta-hedging/desk|$WI" --after "/delta-hedging/desk?m=M4|$WI"
# expect: cards >= 8 (M1) and 9 (M4, adds vegaNeutral); rows >= 5
```
(Use the class names `hdesk-wi-card` and `hdesk-wi-shocks` so this command works.) Stop the server and
confirm port 4173 is free.

## Pitfalls
- `applyOrder` silently returns the same state for blocked trades. Check the block conditions **before**
  applying, or a stock-only mission would show "options do nothing" instead of "locked".
- Theta is per calendar day, but one step is a trading day. The shock rows already include the decay by
  repricing at `tauAt(d + 1)`; do not add theta separately.
- On the last day `tauAt(d + 1)` is 0 and the option value becomes intrinsic; that is correct.
- `optionDelta` for M1 at day 0 equals "buy back the client's calls". Show it, label it `closesBook`, and
  do not special-case it away.
- `gammaNeutral` needs the delta of the copy **after** the option leg, not before.
- Sorting or filtering the cards differently per language breaks the smoke counts; keep a fixed order.
- Keep the copy honest about the approximation: the tomorrow numbers are typical moves at today's
  implied vol, not the mission's real path.

## Findings (fill in during execution)
- Measured values used in tests: M1 day 0 seed 7: stock hedge buys 549 STOCK, cost about $5.49, delta lands in band and keeps gamma about -36; optionDelta buys 10 C100 (every Greek about 0, `closesBook`); OTM option uses C102.5 with qty > 10; shortOptionDelta sells P100 (in band, `addsShortGamma`, vega more negative); doNothing breach chance > 0.999; breachChance(0, -36, 100, 0.0139, 100) is between 0.04 and 0.05. M2 stockHedge cost includes the $15 fee. 14 tests in `scripts/hedging-desk-help-whatif.test.mjs`, including purity and a "no future reads" test (spot, iv and gapDay changed after today give deep-equal results).
- Deviations and why: (1) On M1 the `gammaNeutral` scenario is the same single order as `optionDelta` (buy 10 C100; delta is already flat after it, so no stock leg) and the two cards show the same numbers; kept as specified. (2) `flipsGamma` fires only for short to long gamma (matches the copy "Turns you long gamma"); long to short is covered by `addsShortGamma`. (3) The ticket card is always present (`emptyTicket` block when the ticket qty is not a positive integer) so the card count is fixed: 8 cards, 9 on M4. (4) `doNothing` has no block except `expired`. (5) Extra copy keys beyond the plan: `hdWiNow`. (6) Components: `WhatIfTab`, `WhatIfCard`, `WhatIfDetail`, `WhatIfShocks`; copy helpers in `help/whatIfCopy.ts`. (7) Smoke run on a private DevTools port (`--port 9473`) and preview port 4187, because other sessions use the defaults. On the smoke: M1 8 cards and 5 shock rows, M4 9 cards, M2 five cards say "Options are locked in this mission.", HU renders. The "Put in ticket" click path was not clicked through in a browser.
- HU drafts for owner review: every key in `src/Language/HedgingDeskHelpWhatIf.hu.ts` (`hdWi*`, about 55 keys).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/07-what-if.md`. Implement plan 07 in two phases. Phase A:
> `help/whatIf.types.ts`, the pure `help/whatIf.math.ts` (`simulateOrders`, `breachChance`,
> `whatIfScenarios`; today's market only) and `scripts/hedging-desk-help-whatif.test.mjs`, green before you
> continue. Phase B: the EN/HU `HedgingDeskHelpWhatIf` tables, `WhatIfTab`, `WhatIfCard`, `WhatIfDetail` and
> `_hedging-desk-help-whatif.scss`. If plan 05 is not done, finish phase A and phase B's code and verify the
> UI once 05 lands (note it in Findings). Run the standard verification and the plan's smoke command. Fill
> in Findings (HU keys as drafts), set plan 07 to `done` in the README table, and summarise. Do not run
> `git stash`. Stop the preview server and confirm port 4173 is free.
