# 03 — FI layout pass + treasury cleanup

Status: todo · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
After the shared fixes, each FI lab still has its own defects, and the treasury lab breaks project rules
(business logic in the view, English hard-coded text, a 144-line view). Plans 04–05 add features to these
views, so they must start clean.

## Current state (verified 2026-10-19)
- `src/features/treasury-futures/TreasuryFuturesView.tsx` (144 lines): `updateBond` and `updateSetting`
  (≈ L18–75) recompute accrued interest / conversion factors per scenario (`bund`, `amortizing`) inline;
  `onAdd` builds a bond with `id: String.fromCharCode(65 + d.bonds.length)` → **duplicate ids after a
  removal** (remove A of A,B,C then add → second "C"); error fallbacks `"Invalid bond input."`,
  `"Invalid model input."` are English; `Metric` shows `` `Bond ${ctd.id}` `` (English).
- `src/features/treasury-futures/scenarios.ts`: `note:` strings (L40, L81) are English prose shown in the
  "Convention and worksheet assumptions" panel; `SCENARIO_LABELS` exists.
- `treasuryFutures.math.ts` throws English `RangeError` messages (L37–97) which the view shows verbatim.
- `components/BondBasket.tsx`: F as both a NumberInput (0–500) and a slider (50–200) with the same label.
- Treasury 360 px: cash-flow tables (`CashFlowPanel.tsx`) are cut at the right edge with no visible scroll
  affordance; `.tf-factor-strip` cramped. Styles: `src/styles/_treasury-futures.scss`.
- Duration 360 px: chart header wraps title / Pin / Formulas onto three lines
  (`DurationConvexityView.tsx` `ChartContainer actions`); `.dc-main-row` stacks chart + result.
- Yield curve: `.yc-node-row`-style selected row uses `border-left: 2px` + `is-selected`
  (`src/styles/yieldcurve.scss:141–143`) — **forbidden left-border accent**.
- Bond lab: looks clean in screenshots; rely on the audit.

## Goal
1. Audit (plan 01) green for all four FI pages at all widths, both themes, EN and HU, with zero
   `data-layout-allow` unless justified in Findings.
2. Treasury: logic moved out of the view; ids unique; all user-facing text localised; view ≤ 150 lines.
3. Yield curve selected row uses background/colour only.

## Non-goals
New interactions (plans 04–06). Changing treasury math results.

## Steps
1. Run the audit; list every failure per page in Findings as the to-do list.
2. Treasury refactor:
   - New `src/features/treasury-futures/basket.math.ts` (pure):
     ```ts
     /// Applies a bond patch and recomputes scenario-dependent fields (accrued, CF, principal).
     export function patchBond(data: ScenarioData, index: number, patch: Partial<DeliverableBond>): ScenarioData
     /// Applies notional coupon / delivery / market-yield changes to every bond.
     export function patchSettings(data: ScenarioData, patch: SettingsPatch): ScenarioData
     /// Next unused single-letter id (A…Z, then A2…).
     export function nextBondId(bonds: DeliverableBond[]): string
     export function newBond(bonds: DeliverableBond[]): DeliverableBond
     ```
     Move the bodies of `updateBond`/`updateSetting` there verbatim first (behaviour-preserving), then fix
     the id. `ScenarioData` = the return type of `loadScenario` (export it from `scenarios.ts` or a new
     `treasuryFutures.types.ts`).
   - New hook `useTreasuryFutures.ts` holding `data`, `error`, `results`, `ctd`, `ranked` and the handlers.
   - Errors: give math errors a code (`class TfInputError extends RangeError { constructor(public code: string) }`
     or a `code` property) and map codes to i18n keys `tfErr_<code>` in the view; fallback key
     `tfErrInvalid`. Keep the English message for developers.
   - Scenario notes: replace prose in `scenarios.ts` with i18n keys `tfNote_<scenarioId>`; move the text to
     `src/Language/TreasuryFutures.ts` (find the file: grep `tfScenario` under `src/Language`) and draft HU
     into the `.hu.ts` file (list in Findings for review). `Bond ${id}` → `t("tfBondId", { id })`.
   - Split the view: `components/TfMetrics.tsx`, `components/ResultsTable.tsx`; view ≤ 150 lines.
   - F input: keep one control: NumberInput with the slider as its companion using the same range (50–200),
     single label; inputs outside clamp. (This matches what `SliderField` does elsewhere — reuse it if it fits.)
   - Tables: wrap `CashFlowPanel` tables in the same scroller as `.tf-table-scroll`, and at phone width
     show a subtle right-edge fade (CSS mask on the scroller when it overflows) so cut-off reads as
     scrollable. Prefer fewer columns at phone width if the table can drop a derived column (state which).
3. Duration header: at phone width move Pin/Formulas into a single compact action row under the title
   (`ChartContainer` actions wrap rule in `layout.scss` or a modifier class); no three-line wrapping.
4. Yield curve: replace the left border with `background: var(--surface-soft)` + `color: var(--primary)` on
   the label; keep focus ring visible.
5. Fix the remaining audit items one by one; prefer token/spacing fixes in SCSS over component changes.
   Alignment checks while you are there: numeric columns right-aligned with `font-variant-numeric:
   tabular-nums`; inputs in a form column share one left edge; panel paddings identical across FI panels.
6. Unit test for `nextBondId` and one `patchBond` regression (same output as before for the bund
   scenario) in `scripts/treasury-futures.test.mjs`.

## Acceptance criteria
- Audit: `SUMMARY … failing=0` for `--group fixed-income`.
- `TreasuryFuturesView.tsx` ≤ 150 lines, no math in it; `grep -n '"[A-Z][a-z]* [a-z]' src/features/treasury-futures/*.tsx src/features/treasury-futures/components/*.tsx` shows no user-facing English.
- Remove-then-add yields unique ids (test).
- `/hu/treasury-futures` shows Hungarian notes.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:treasury-futures && npm run test:yield-curve && npm run test:labs
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/treasury-futures,/hu/treasury-futures,/yield-curve,/duration-convexity" \
  --after "/treasury-futures|(async()=>{const s=document.querySelector('.tf-scenario select');s.value=s.options[1].value;s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,500));return document.querySelectorAll('.tf-table tbody tr').length})()"
```

## Pitfalls
- `bund` hides net basis / CTD (`data.id === "bund"` branches); keep those branches identical.
- Changing scenario via `select` resets error; preserve.
- i18n: string tables must be registered in `src/i18n.tsx`; existing TreasuryFutures tables already are.

## Findings (fill in during execution)
- Audit to-do list and resolution: …
- HU strings drafted (for owner review): …
- Deviations: …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/03-fi-layout-pass-and-treasury-cleanup.md`; confirm plans
> 01 and 02 are done (stop if not). Implement plan 03: drive the FI layout audit to zero failures, refactor
> the treasury view (logic to basket.math.ts + hook, unique ids, localised errors and notes, split
> components), and remove the yield-curve left-border accent. Run the verification commands, fill in
> Findings (including drafted HU strings), set plan 03 to done in the README table, and summarise.
