# 06 — Next move: context-aware advice engine and tab

Status: done (2026-10-23) · Depends on: – (the engine and tests stand alone; the tab is verified once 05 is done) · Suggested model: Sonnet · Est. size: M

## Why
The question learners ask most is "what do I do now?". This plan answers it from the live book: a pure
`deskAdvice()` reads the state, the mission and **today's** market, and returns an ordered list of advice
items ("Your net delta is −549 sh, outside the ±100 band: buy 549 shares before you step the day"). Each
item can carry one action: put a trade in the ticket, press a function key, open a screen, open another
help tab, or point at a panel.

## Current state (verified 2026-10-23)
- Engine (pure, `src/features/hedging-desk/engine/`):
  - `BookState` (`desk.types.ts`): `missionId, seed, day, positions: Record<InstrumentId, number>`
    (`"STOCK"` in shares, options such as `"C100"` in contracts), `cash, costsPaid, breaches,
    fills: Fill[]` (`Fill = Order & { day, price, cost }`, `Order = { id, side, qty, tag: "client"|"manual"|"auto" }`),
    `history: DayRecord[]`, `events` (newest first), `openDelta, settled`.
  - `MissionDef`: `id, greeks, market: MarketSpec, costs: { stockHalfSpread 0.01, optionHalfSpread 0.05, ticketFee }`,
    `band` (100 sh in every mission), `opening`, `objectives: ObjectiveDef[]`, `instruments: "stock"|"all"`,
    `maxTrades?`, `settlement: "cash"|"physical"`. `MarketSpec` has `gap?: { from, to, size }` and
    `ivSchedule?: { day, iv }[]`.
  - `Market`: `spot[], iv[]` (length `days + 1`), `rate, days, strikes, gapDay`.
  - `netDelta(positions, market, day)`, `bookGreeks(state, market)` → `{ delta, gamma, vega, theta,
    dollarDelta, dollarGamma1pct }` (`risk.math.ts`); `markToMarket(state, market)`;
    `autoHedgeOrder(state, market)` → stock `Order | null` (`book.math.ts`); `tradeCount(state)`;
    `evaluateObjectives(mission, state, market)` → `ObjectiveResult[]` (`{ def, status: "onTrack"|"atRisk"|"pass"|"fail", value }`);
    `quoteInstrument(id, S, tau, iv, rate, costs)` → per-unit `{ mid, bid, ask, half, mult, delta, gamma, vega, theta }`
    (`pricing.math.ts`; vega per vol point, theta per calendar day); `tauAt(day, days)`;
    `optionId(type, strike)`, `parseInstrument(id)` (`instruments.math.ts`).
  - `sidePanels.math.ts`: `breakevenMove(gamma, thetaPerDay)` (daily move where gamma loss = theta),
    `nearestStrike(strikes, S)`.
- Missions (`engine/missions.data.ts`), measured at day 0 with seed 7:

  | Mission | Book | Net Δ | Γ (sh per $1) | Vega ($/pt) | Θ ($/day) | Rules that matter for advice |
  |---|---|---|---|---|---|---|
  | M1 | short 10 C100 | −549 | −36 | −198 | +28 | maxBreaches 3, pnlWithin 400, costsBelow 300 |
  | M2 | same, $15 ticket, stock only | −549 | −36 | −198 | +28 | maxTrades 10 (enforced), pnlWithin 600, beatPolicy every 5 |
  | M3 | short 20 C100, 45 days, gap D25–D35 ±8% | −1083 | −85 | −335 | +65 | gammaLimitFrom 40 from D25, gapLoss 1500, maxBreaches 3 |
  | M4 | long 15 C105, short 5 P95, 40 days, IV 22%→30% on D20 | +609 | +43 | +152 | −34 | vegaLimitBy 1500 by D20, maxBreaches 3, pnlAbove −500 |
  | M5 | short 10 C100, 10 days, S0 100.2, physical | −538 | −90 | −79 | +65 | flatStock, maxBreaches 2, pnlWithin 300 |

  Per C100 contract at day 0 (M1): Δ 0.549 → 54.9 sh, Γ 3.6 sh per $1, vega $19.8/pt, θ −$2.80/day.
- A breach is counted at the **close** (`closeDay` compares `|closeDelta| > band`), so a delta outside
  the band before stepping can still be fixed today.
- `missionCopy.ts` has the `Translate` type and `objectiveText(t, def, band)`; `deskFormat.ts` has
  `num, signed, money, signedMoney, pct`.
- Tests: `scripts/hedging-desk-*.test.mjs`, run by `npm run test:hedging-desk`. They load pure `.ts`
  through `importSrc` from `scripts/lib/load-ts.mjs` (relative imports only; no React, no `.tsx`). See
  `scripts/hedging-desk-demo.test.mjs` for the header pattern.
- Plan 05 (help shell) defines `HelpTab = "next" | "whatIf" | "guide"`, `HelpAnchor`, `DeskHelp`
  (`help.show(tab)`, `help.point(anchor)`, `help.close()`), the stub `components/help/NextMoveTab.tsx`
  with props `{ desk: HedgingDeskModel; help: DeskHelp }`, the shared classes
  (`.hdesk-help-section/-h/-p/-actions/-kv`, `.hdesk-help-tone--urgent|suggest|info|done`) and the shared
  labels `hdHelpShowMe`, `hdHelpUseTicket`, `hdHelpOpenWhatIf`, `hdHelpOpenGuide`.

## Goal
1. `help/advice.math.ts` exports a pure `deskAdvice(mission, state, market)`, tested in
   `scripts/hedging-desk-help-advice.test.mjs`.
2. `NextMoveTab` lists the advice grouped by tone, with numbers filled in and one action button each.
3. Every rule has EN copy and a HU draft.

## Non-goals
- **Never read the future.** Advice may use `market.spot[d]`, `market.iv[d]` for `d <= state.day` and the
  mission spec (`gap.from/to`, `ivSchedule`, which the briefing reveals), but **never** `market.gapDay`,
  `market.spot[state.day + 1…]` or `replayPolicy` (that replays the whole hidden path).
- No what-if simulation (plan 07), no long-form explanations (plan 08). Do not change engine files.

## Constraints
README §4. Math in `help/*.math.ts` with `///` docs and no React; types in `help/advice.types.ts`; copy
only in `src/Language/HedgingDeskHelpAdvice*.ts`.

## Steps
1. `help/advice.types.ts`:
   ```ts
   export type AdviceTone = "urgent" | "suggest" | "info" | "done";
   export type AdviceAction =
     | { kind: "ticket"; id: InstrumentId; side: Side; qty: number }
     | { kind: "key"; code: "F2" | "F3" | "F4" | "F5" | "F8" | "F9" }
     | { kind: "screen"; screen: "debrief" | "missions" }
     | { kind: "tab"; tab: "whatIf" | "guide" }
     | { kind: "point"; anchor: "risk" | "delta" | "mission" | "ticket" | "chain" | "matrix" | "profile" | "blotter" };
   export type AdviceId = /* the ids in the table below */;
   export type Advice = { id: AdviceId; tone: AdviceTone; vars: Record<string, number>; action?: AdviceAction };
   ```
   The literal unions match plan 05's `HelpTab` / `HelpAnchor` without importing them, so this plan does
   not depend on 05.
2. `help/advice.math.ts`: `/// Ordered advice for the current book (urgent first, at most 6 items).`
   `export function deskAdvice(mission: MissionDef, state: BookState, market: Market): Advice[]`.
   Compute once: `d = state.day`, `S = market.spot[d]`, `g = bookGreeks(state, market)`,
   `delta = g.delta`, `daysLeft = market.days - d`, `sigmaDay = market.iv[d] / Math.sqrt(252)`,
   `objectives = evaluateObjectives(...)`, `atm = nearestStrike(market.strikes, S)`, and the ATM call
   quote `qc = quoteInstrument(optionId("C", atm), S, tauAt(d, market.days), market.iv[d], market.rate, mission.costs)`.
   Emit the rules below whose condition holds, in this order; then sort stably by tone
   (urgent < suggest < info < done) and keep the first 6. Round every var to the precision the copy shows.

   | id | Condition | Tone | vars | Action |
   |---|---|---|---|---|
   | `expired` | `state.settled` | done | `pnl` | screen debrief |
   | `noTradesLeft` | `maxTrades` set and `tradeCount >= maxTrades` | urgent | `max` | point mission |
   | `outsideBand` | `abs(delta) > band` | urgent | `delta, band, qty = round(abs(delta))` | ticket STOCK, side `delta < 0 ? buy : sell`, qty (if `maxTrades` is exhausted, no action) |
   | `wrongWay` | the newest event is a `fill` with tag `manual` on day `d`, and `abs(delta) > abs(delta without that fill)` by more than 20 sh (recompute `netDelta` with the fill's qty removed from `positions`) | urgent | `before, after, qty` | point blotter |
   | `lastBreach` | a `maxBreaches` objective and `breaches === limit` and not settled | urgent | `limit` | point risk |
   | `gammaDeadline` | a `gammaLimitFrom` objective, `d < fromDay`, `abs(g.gamma) > limit` | urgent if `fromDay - d <= 5`, else suggest | `gamma, limit, fromDay, daysLeftTo, contracts` | ticket `optionId("C", atm)` buy `contracts` (only if `mission.instruments === "all"`) |
   | `vegaDeadline` | a `vegaLimitBy` objective, `d < byDay`, `abs(g.vega) > limit` | same rule with `byDay` | `vega, limit, byDay, daysLeftTo, contracts` | ticket ATM call, side `g.vega > 0 ? sell : buy`, `contracts` |
   | `pinRisk` | `settlement === "physical"`, `daysLeft <= 3`, holds short calls | urgent | `shares` (delivered if expiry were today: ITM contracts × 100), `held` (stock), `net = held - shares` | point positions |
   | `nearBand` | `abs(delta) > 0.7 * band` and in band | suggest | `delta, band, qty` | ticket STOCK as for `outsideBand` |
   | `oneBreachLeft` | `maxBreaches` and `breaches === limit - 1` | suggest | `limit` | point risk |
   | `costsHigh` | a `costsBelow` objective with status `atRisk` | suggest | `costs, limit` | tab guide |
   | `tradesLow` | `maxTrades` and `1 <= remaining <= 2` | suggest | `left` | – |
   | `pnlDrift` | a `pnlWithin` objective, `abs(pnl) > 0.75 * limit` | suggest | `pnl, limit` | tab whatIf |
   | `expirySoon` | `daysLeft <= 5`, not settled, `g.gamma < 0` | suggest | `daysLeft, swing = round(abs(g.gamma) * S * sigmaDay)` | key F2 |
   | `gapWindow` | `mission.market.gap`, `d >= gap.from - 3`, `d <= gap.to` | info | `from, to, sizePct, loss = round(abs(0.5 * g.gamma * (gap.size * S) ** 2 + delta * gap.size * S))` | tab whatIf |
   | `ivShiftAhead` | an `ivSchedule` entry with `day > d` | info | `day, iv, vegaPnl = round(g.vega * (iv - market.iv[d]) * 100)` | tab whatIf |
   | `firstHedge` | `d === 0`, no manual/auto fills | info | `delta, perDollar = round(delta)` | point delta |
   | `inBand` | `abs(delta) <= 0.7 * band`, not settled | info | `swing = round(abs(g.gamma) * S * sigmaDay)` (Δ change for a 1σ day), `band` | key F2 |
   | `thetaVsGamma` | `breakevenMove(g.gamma, g.theta)` not null | info | `breakeven` (dollars), `implied = S * sigmaDay` | point profile |
   | `optionsLocked` | `mission.instruments === "stock"` | info | – | – |
   | `ticketFee` | `mission.costs.ticketFee > 0` | info | `fee` | – |

   `contracts` for the gamma rule: `ceil((abs(g.gamma) - 0.8 * limit) / (qc.gamma * qc.mult))`. For vega:
   `ceil((abs(g.vega) - 0.8 * limit) / (qc.vega * qc.mult))`. Never return a qty of 0 or a negative qty;
   drop the action instead.
3. Copy: `src/Language/HedgingDeskHelpAdvice.ts` (`hedgingDeskHelpAdviceEn`) and `.hu.ts`
   (`hedgingDeskHelpAdviceHu`). For each id, write `hdAdv<Id>Title` and `hdAdv<Id>Body`, plus a key
   helper `adviceTitleKey(id)` / `adviceBodyKey(id)` in `help/adviceCopy.ts` (same shape as
   `demo/demoCopy.ts`). Also add `hdAdvHeadUrgent` "Do this now", `hdAdvHeadSuggest` "Worth doing",
   `hdAdvHeadInfo` "Good to know", `hdAdvHeadDone` "Finished", `hdAdvEmpty` "Nothing pressing. Step a day
   with F2 and watch the risk panel.", and action labels `hdAdvActKey` "Press {{code}}", `hdAdvActDebrief`
   "Open the debrief". Draft English (keep each body to 1–3 sentences, numbers in, plain words):
   - `outsideBand`: "Net delta is {{delta}} sh, outside ±{{band}}." / "A close outside the band counts as a breach. Buy (or sell) about {{qty}} shares now; F4 does the same at the nearest whole share."
   - `wrongWay`: "Your last trade made delta worse." / "Delta went from {{before}} to {{after}} sh. To reduce a negative delta you buy shares (or buy calls); to reduce a positive one you sell."
   - `gammaDeadline`: "Gamma {{gamma}} must be inside ±{{limit}} from D{{fromDay}}." / "Shares have no gamma, so stock cannot fix this. Buying about {{contracts}} at-the-money calls adds positive gamma; then re-hedge delta with stock. {{daysLeftTo}} days left."
   - `vegaDeadline`: "Vega ${{vega}}/pt must be inside ${{limit}} by D{{byDay}}." / "Only options carry vega. Trade about {{contracts}} at-the-money calls against it, then re-hedge delta."
   - `pinRisk`: "Physical settlement in {{daysLeft}} days." / "If spot stays above the strike, your short calls deliver {{shares}} shares. You hold {{held}}; after delivery you would hold {{net}}. Plan to end flat."
   - `gapWindow`: "A {{sizePct}}% jump can come between D{{from}} and D{{to}}." / "A jump is too fast to hedge after it happens. At today's Greeks an {{sizePct}}% jump against you costs about ${{loss}}. Less short gamma means a smaller loss."
   - `ivShiftAhead`: "Implied vol moves to {{iv}} on D{{day}}." / "With vega ${{vega}}/pt the repricing alone is worth about ${{vegaPnl}}."
   - `firstHedge`: "You start short delta." / "Delta {{delta}} sh means the book loses about ${{perDollar}} for every $1 the stock rises. The usual first move is to buy that many shares."
   - `inBand`: "You are inside the band." / "A typical one-day move shifts your delta by about {{swing}} sh. Step a day (F2), or five (F3) if you are well inside ±{{band}}."
   - `thetaVsGamma`: "Theta pays you while the stock is quiet." / "You earn theta each day, and lose on moves bigger than about ${{breakeven}}. A typical day moves ${{implied}}."
   - `optionsLocked`: "Stock only in this mission." / "Options are locked here; you can only hedge delta with shares."
   - `ticketFee`: "Each ticket costs ${{fee}}." / "Fewer, larger hedges beat many small ones. Hedge when delta nears the band, not every day."
   Write the remaining ids in the same style. HU: a draft for every key, listed in Findings.
4. Tab: replace `components/help/NextMoveTab.tsx` (keep the props `{ desk, help }`):
   `const items = useMemo(() => deskAdvice(desk.mission, desk.state, desk.market), [desk.mission, desk.state, desk.market])`.
   Group the items by tone under `hdesk-help-h` headings, and render each through
   `components/help/AdviceItem.tsx` (`{ advice, desk, help }`): title (strong), body (`hdesk-help-p`), and
   a tone class on the item wrapper. Pass every var through the formatter it needs (`signed` for
   deltas, `money` for dollars, `pct` for vols; format in a pure `help/adviceVars.ts` helper
   `formatAdviceVars(advice): Record<string, string>` so the `.tsx` stays thin). The action button:
   - `ticket` → `desk.setTicketId(id); desk.setSide(side); desk.setQty(String(qty)); help.point("ticket")`, label `hdHelpUseTicket`;
   - `key` → run the matching `FUNCTION_KEYS` entry from `useFunctionKeys.ts` (`find(k => k.code === code)?.run(desk)`), label `hdAdvActKey`;
   - `screen` → `help.close(); desk.setScreen(screen)`;
   - `tab` → `help.show(tab)` with `hdHelpOpenWhatIf` / `hdHelpOpenGuide`;
   - `point` → `help.point(anchor)` with `hdHelpShowMe`.
   The list updates live as the learner trades and steps (the drawer is non-modal on wide screens).
   Wrap the list in `aria-live="polite"` only around the heading counts, not the whole list (too chatty).
   If 05 is not in place yet, write the component against the contract above and verify it after 05.
5. Styles: `src/styles/_hedging-desk-help-next.scss`, appended to `main.scss` **after**
   `@use "hedging-desk-help";` if it exists (otherwise after `@use "hedging-desk-demo";`), with only the
   layout this tab adds (item spacing, the action row). Reuse the plan-05 classes for tones and text.
6. Test `scripts/hedging-desk-help-advice.test.mjs` (≥ 8 tests):
   - M1 day 0, seed 7: the first item is `outsideBand` with `qty` 549 and a `buy` ticket action; `firstHedge` is present.
   - After `autoHedge`: no `outsideBand`; `inBand` is present.
   - After a manual `sell 300 STOCK` on day 0: `wrongWay` is present.
   - M2: `optionsLocked` and `ticketFee` are present; after 10 `autoHedge`+`step` pairs, `noTradesLeft` is urgent with no ticket action.
   - M3 day 20 with only stock hedges: `gammaDeadline` (urgent, `contracts > 0`, ticket id `C<atm>`), and `gapWindow` from day 22.
   - M4 day 0: `ivShiftAhead` with `day` 20.
   - M5 stepped to day 8: `pinRisk` is present.
   - A settled book returns `expired` first.
   - **No future reads:** build two markets that share `spot[0..d]` but differ after `d` (copy a market
     and overwrite `spot[d+1..]`, `iv[d+1..]` and `gapDay`). `deskAdvice` must return deep-equal results.
   - At most 6 items, tones in non-decreasing order.

## Acceptance criteria
- `npm run test:hedging-desk` passes, including the new file; breaking the "no future reads" rule on
  purpose (e.g. reading `market.gapDay` in `gapWindow`) makes the test fail.
- On `/delta-hedging/desk`, opening help shows `outsideBand` first with "549"; clicking "Put in ticket"
  fills the ticket with BUY 549 STOCK and outlines it; after F4 the list changes to `inBand`.
- Every `AdviceId` has EN and HU title and body keys (parity check in the test, or a small node script).

## Verification
Run the README §4 standard commands, then:
```bash
(npx vite preview --port 4173 --strictPort &) && sleep 4
W='(ms)=>new Promise(r=>setTimeout(r,ms))'
N="(async()=>{const w=${W};document.querySelector('[aria-controls=hd-help]').click();await w(250);const first=document.querySelector('#hd-help .hdesk-help-tone--urgent')?.textContent||'';const btn=[...document.querySelectorAll('#hd-help button')].find(b=>/ticket|jegy/i.test(b.textContent));btn?.click();await w(200);const sub=document.getElementById('hd-submit')?.textContent;window.dispatchEvent(new KeyboardEvent('keydown',{key:'F4',bubbles:true}));await w(250);return {first:first.slice(0,80),sub,urgentAfter:document.querySelectorAll('#hd-help .hdesk-help-tone--urgent').length}})()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/hu/delta-hedging/desk,/delta-hedging/desk?m=M3" \
  --after "/delta-hedging/desk|$N" --after "/hu/delta-hedging/desk|$N"
# expect: first contains 549; sub mentions BUY/VÉTEL 549; urgentAfter 0
```
Stop the server and confirm port 4173 is free.

## Pitfalls
- `market.gapDay` is the real hidden jump day. Use `mission.market.gap.from/to` only.
- `bookGreeks` uses `DEFAULT_COSTS` internally (irrelevant for Greeks); quotes for **trades** must use
  `mission.costs` (M2 has a $15 fee).
- `delta` is in shares: a negative delta is fixed by **buying** shares. Get the sign right in
  `outsideBand`, and test it.
- `setTicketId` resets the quantity when switching between stock and option (`defaultQty`). Call
  `setQty` **after** `setTicketId`.
- Theta from `bookGreeks` is per **calendar** day; `breakevenMove` already converts it. Do not convert
  twice.
- Keep `.tsx` thin: formatting goes in `adviceVars.ts`, rules in `advice.math.ts`.

## Findings
- Measured values used in tests (seed 7): M1 day 0 `outsideBand` qty 549 (buy STOCK); manual sell 300 gives before -549, after -849, hedge qty 849; M3 stepped to day 20 then auto-hedged: `gammaDeadline` urgent, buy ATM call, `gapWindow` absent at day 20 and present at day 22; M4 day 0 `ivShiftAhead` day 20, iv 30; M5 day 8 `pinRisk`; M1 after step 63 is settled and returns only `expired`. 13 tests in `scripts/hedging-desk-help-advice.test.mjs` (full suite: 78 pass).
- No-future test: five missions x days 0/3/22/30, second market with `spot`/`iv` rewritten after today and a different `gapDay`; deep-equal. Mutating `gapWindow` to read `market.gapDay` makes it fail (verified, then reverted).
- Smoke (preview on its own port because 4173 was held by another session): EN and HU both show "-549 ... outside +/-100" first, "Put in ticket" gives `BUY 549 QSBX US` / `VETEL 549 QSBX US`, after F4 the urgent count is 0.
- Deviations and why:
  - A settled book returns only `expired` (not sorted with info items), so "expired first" holds; tone order would otherwise put `done` last.
  - `evaluateObjectives` is called on a copy of the mission holding only the `costsBelow` objective, because `gapLoss` reads `market.gapDay` and `beatPolicy` replays the hidden path.
  - `pinRisk` points at the `positions` anchor (plan 05's `HelpAnchor` includes it); `AdviceAction` screen is narrowed to `"debrief"` (no rule opens `missions`).
  - `firstHedge` `perDollar` is `abs(delta)` and its copy is sign neutral (M4 starts long delta). `ivShiftAhead` also carries `vega`; `iv` is stored in percent points and formatted with `pct`.
  - `NextMoveTab` live region announces only the urgent count; AdviceItem and NextMoveTab are separate files under `components/help/`.
- Open: `npm run test:seo` is red on the shared `dist` (other sessions rebuild it concurrently; page set changed between runs) and its initial-JS budget reports 968,736 B vs 955,000 B; the EN tables of the whole help pack are part of that (this plan adds about 4.7 KB source).
- HU drafts for owner review (all in `src/Language/HedgingDeskHelpAdvice.hu.ts`): hdAdvHeadUrgent, hdAdvHeadSuggest, hdAdvHeadInfo, hdAdvHeadDone, hdAdvEmpty, hdAdvActKey, hdAdvActDebrief, and hdAdv<Id>Title / hdAdv<Id>Body for Expired, NoTradesLeft, OutsideBand, WrongWay, LastBreach, GammaDeadline, VegaDeadline, PinRisk, NearBand, OneBreachLeft, CostsHigh, TradesLow, PnlDrift, ExpirySoon, GapWindow, IvShiftAhead, FirstHedge, InBand, ThetaVsGamma, OptionsLocked, TicketFee.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/06-next-move.md`. Implement plan 06: `help/advice.types.ts`,
> the pure `help/advice.math.ts` with every rule in the table (never reading the hidden future path),
> `help/adviceCopy.ts`, `help/adviceVars.ts`, the EN/HU `HedgingDeskHelpAdvice` tables, `NextMoveTab` +
> `AdviceItem`, `_hedging-desk-help-next.scss`, and `scripts/hedging-desk-help-advice.test.mjs`. If plan 05
> is not done yet, build and test the engine first and verify the tab once 05 lands (say so in Findings).
> Run the standard verification and the plan's smoke command. Fill in Findings (HU keys as drafts), set
> plan 06 to `done` in the README table, and summarise. Do not run `git stash`. Stop the preview server
> and confirm port 4173 is free.
