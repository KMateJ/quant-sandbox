# 12 — Portfolio missions screen, help, demo, debrief

Status: done (2026-10-24) · Depends on: 11 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Makes the portfolio desk teach: briefings for P1–P5, advice when volatility drifts off target or one asset
dominates risk, what-if rebalances side by side, a guide, a playthrough and a debrief that shows which
asset classes made or lost the money and how simple policies did on the same returns.

## Current state (verified 2026-10-23, after plans 01–11)
- Stubs (plan 11): `src/features/portfolio-desk/components/PortfolioMissionsScreen.tsx`,
  `PortfolioDebriefScreen.tsx` (`{ desk: PortfolioDeskModel }`), `help/PortfolioNextMove.tsx`,
  `PortfolioWhatIf.tsx`, `PortfolioGuide.tsx` (`{ desk, help: GameHelp }`), `demo/demo.script.ts`
  (`buildPortfolioDemo(mission, seed)` → `[]`).
- Model `PortfolioDeskModel`: `mission`, `R`, `state: PortfolioState`, `S`, `exAnte`, `shares`, `sharpe`,
  `te`, `realized`, `objectives`, ticket `targets` + `setTarget`, `fillScale`, `fillParity`, `fillBench`,
  `submit`, `scaleNow`, `parityNow`, `step`, `dispatch`, screen/mission/demo setters, `demo`.
- Engine (plan 10): `reducePortfolio` (`rebalance`, `scaleToTarget`, `riskParity`, `step`, `restore`),
  `ewmaCov`, `exAnteVol`, `riskShares`, `exAnteSharpe`, `corrChange`, `evaluatePortfolio`,
  `replayPortfolio(mission, seed, "scaleQuarterly" | "parityMonthly" | "sixtyForty" | "buyHold")`,
  `PORTFOLIO_MISSIONS`; `riskParityWeights`, `scaleToVol` in `src/lib/finance/portfolio.ts`.
- Kit and lib as in plans 06/09. Progress store `PORTFOLIO_PROGRESS`. Design: `PortfolioDesk.dc.html`.

## Goal
Missions screen, debrief (progress recording), three help tabs and a six-step demo.

## Non-goals
- No engine edits (BLOCKED line in LOG.md if needed).

## Constraints
- Pure logic in `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`, `demo/demo.script.ts`.
- Copy in `src/Language/PortfolioDeskMissions.ts`, `PortfolioDeskHelp.ts` (+ `.hu.ts`), prefix `pmgr`;
  styles in `src/styles/_portfolio-desk-help.scss`.

## Steps

### Phase 1 — pure logic + tests
1. `portfolioAdvice(mission, state, R)`; actions `{ kind: "fill"; preset: "scale" | "parity" | "bench" } | { kind: "key"; code: "F2" | "F3" | "F4" | "F6" } | { kind: "screen"; screen: "debrief" } | { kind: "tab"; tab: "whatIf" | "guide" } | { kind: "point"; anchor: string }`.
   Rules: `ended`, `volOff` (urgent: ex-ante, band; fill scale when hot, parity when cold), `drawdownNear`
   (urgent within 5 pp of the limit), `concentrated` (suggest: asset, share > 50%; fill parity),
   `quarterEnd` (P2: info/urgent when next month is a quarter end and the top share exceeds the limit),
   `stressAhead` (P3: info before month 12), `correlationsUp` (info: mean change > 0.08), `costsHigh`
   (suggest > 80% of the budget), `onTarget` (info; key F2).
2. `portfolioWhatIf(mission, state, R)`: `doNothing`, `scale10`, `parity10`, `back6040`, `halfRisk`; each
   cost, ex-ante vol after, Sharpe after, largest risk share (asset), 1-in-20 monthly loss
   (`1.645 × vol/√12 × NAV`); verdicts `onTarget | offTarget | concentrated | spread | costly`.
3. `guide.data.ts`: playbooks P1–P5, panels (`mission, risk, events, nav, frontier, corr, positions,
   ticket, heat`), keys, mistakes (6), terms (`exAnteVol`, `realizedVol`, `riskShare`, `riskParity`,
   `drawdown`, `trackingError`, `ewma`, `correlation`).
4. `buildPortfolioDemo` for P1 (`PORTFOLIO_DEMO_SEED`): `welcome` → `scale` → `sixMonths` → `parity` →
   `sixMore` → `yourTurn`.
5. Tests `scripts/portfolio-desk-help.test.mjs`: P1 start → `volOff` first; after `scale` → `onTarget`;
   P3 shows `stressAhead` at month 10; ≤ 6 items in tone order; what-if no mutation and `parity10` shares
   near equal; demo folds deterministically; copy for every id, HU ≠ EN.

### Phase 2 — components, copy, styles
6. `PortfolioMissionsScreen`: list, briefing (setup: asset classes and long-run vols, target and band,
   months, stress (random window, or "months 12–17" for P3), cost bp, risk model λ), rules (one month per
   step, weights drift, the risk model learns from past months, costs on turnover).
7. `PortfolioDebriefScreen`: pending state; banner (NAV, vs 60/40, realised vol, max drawdown); objectives;
   `AttributionBars` (return contribution per asset class over the run, cash, costs; sums to NAV change);
   NAV chart (reuse `NavChart`); `PolicyTable` (Scale quarterly, Risk parity monthly, 60/40, Buy & hold,
   **Your run**: final NAV, realised vol, max drawdown, costs bp); record progress once
   (`PORTFOLIO_PROGRESS.record(id, allPassed, nav − bench)`), skip demo, ref guard.
8. Help tabs and demo wiring (`deskId: "portfolio"`), "Put in ticket" fills the targets.
9. Copy tables for missions, setup, rules, objectives, advice, what-if, guide, demo, debrief.

## Acceptance criteria
- Missions P1–P5 startable; attribution sums to the NAV change within 0.01m; policy table correct.
- Help actions, "Show me" and the demo (with take-over) work; `npm run test:portfolio-desk` green; smoke clean.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:portfolio-desk && npm run test:game-kit
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/portfolio-lab/desk?screen=missions,/portfolio-lab/desk?screen=debrief,/portfolio-lab/desk?demo=1,/hu/portfolio-lab/desk?screen=missions"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/portfolio-lab/desk?screen=missions,/portfolio-lab/desk?screen=debrief"
```
Stop the server; confirm the port is free.

## Pitfalls
- **Attribution:** weights drift inside a month; use start-of-month weights × month returns × start NAV,
  then add cash and subtract costs, so the parts sum exactly.
- **Record once**, skip in demo.

## Findings (fill in during execution)
- Demo seed: `PORTFOLIO_DEMO_SEED = 3` on P1 (`demo/demo.script.ts`); steps welcome → scale → sixMonths → parity →
  sixMore → yourTurn, months 0, 0, 6, 6, 12, 12. In demo mode `usePortfolioUrl` pins P1 + seed 3; "Take the desk"
  keeps mission, seed and run, so the book the demo built carries on.
- Files: pure `help/advice.math.ts` (`portfolioAdvice`, `volBandOf`, `ADVICE_IDS`), `help/whatIf.math.ts` (reuses
  `ticketPreview`), `help/guide.data.ts`, `help/adviceText.ts` (copy + number formatting), `demo/demo.script.ts`
  (`buildPortfolioDemo`, `demoStates`), `debrief.math.ts` (`attribution`, `policyRows`), `missionSetup.ts`;
  components `PortfolioNextMove`, `PortfolioWhatIf`, `PortfolioGuide`, `PortfolioMissionsScreen`,
  `PortfolioDebriefScreen`; hook `usePortfolioDemo.ts`; copy `PortfolioDeskMissions.ts`, `PortfolioDeskHelp.ts`
  (+ `.hu`); `_portfolio-desk-help.scss`; tests `scripts/portfolio-desk-help.test.mjs` (7).
- Deviations:
  - **Engine (plan 10, same author):** `PortfolioHistPoint` gains `w` (risky weights held through that month) so the
    debrief can attribute exactly; logged as CONTRACT. Start-of-month NAV is taken as `nav / (1 + rp)` (after that
    month's rebalance cost), which makes assets + cash − costs equal NAV − 1 to 1e-10.
  - Progress is recorded in `usePortfolioSession` (plan 11) once per settled, non-demo run, not in the debrief
    component, so a run counts even if the debrief is never opened.
  - Advice `volOff` and `quarterEnd` have a second body (`_bodyCold`, `_bodyOk`). Asset vars are indices, named in
    `adviceText`. Debrief adds three buttons (same path, new path, missions).
  - "Watch first" is offered only on the P1 briefing (the demo plays P1).
- Verification (the shared tree did not build while plan 03 was mid-migration, so build/smoke ran in a temporary
  worktree with the hedging desk at HEAD): `tsc -b` clean for portfolio files; eslint clean; `test:portfolio-desk`
  27/27; `test:game-kit` 14/14; build green. Smoke clean on `?screen=missions`, `?screen=debrief`, `?demo=1`,
  `/hu/…?screen=missions`. Acceptance: debrief "Run to the end" → Mission passed, 8 attribution rows (5 assets, cash,
  costs, NAV change), 5 policy rows; demo captions advance with → and "Take the desk" leaves month 6 with the keys
  back; F1 → advice, a fill action changes the ticket, What-if shows 5 cards with "Put in ticket", Guide 5 sections;
  missions list → P3 → Start opens `?m=P3`. Layout audit on missions and debrief: only the site-wide `a.brand` tap
  target at 360/390.
- Items awaiting owner approval: HU strings added: all of `src/Language/PortfolioDeskMissions.hu.ts` and
  `PortfolioDeskHelp.hu.ts` (advice, what-if, guide playbooks, mistakes, terms, demo captions, debrief and policy
  names). Wording choices: "Húszból egyszer előforduló havi veszteség" (1-in-20 monthly loss), "Vedd meg és tartsd"
  (buy and hold), "EWMA (exponenciális súlyozás)".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/12-portfolio-missions-help-demo.md`; confirm plan 11 is done.
> Implement plan 12: pure advice/what-if/guide/demo logic with tests, then missions screen, debrief with
> progress recording, help tabs, demo wiring, copy and styles. Run the verification block, fill in Findings,
> append DONE to LOG.md, set plan 12 to `done`, and summarise.
