# 02 — Shared hygiene: i18n, palette tokens, dead toggles, dock split

Status: done (2026-10-21) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The five labs break project rules in the same four ways: English strings in components, hex colours in
charts, an unreachable "collapse controls" feature, and one 351-line component. Fixing these once,
before the per-lab plans, keeps 03–06 small and stops them from conflicting in shared files.
**Nothing here changes what a user sees except the removal of the dead "-" button on phones.**

## Current state (verified 2026-10-21)

### English (or `language === "hu" ? … : …`) in components
| File | Lines | Text |
|---|---|---|
| `src/features/black-scholes/BlackScholesControls.tsx` | L20, L48, L66 | `years`/`év`, `curves`/`db` |
| `src/features/payoff-lab/Components/PayoffSummary.tsx` | L13–19 | `payoffNote`, `listTitle`, `countTitle` (EN + HU inline) |
| `src/features/payoff-lab/Components/builder/LegCard.tsx` | L34, L37 | `optgroup` labels `Vanilla`, `Exotics`/`Exotikusak` |
| `src/features/payoff-lab/Components/builder/legFields.ts` | L63–72 | `EXOTIC_TYPES` labels (`Digital Call` … `Supershare`) |
| `src/features/payoff-lab/Components/builder/PresetSelect.tsx` | L63 | `optgroup` `Exotics`/`Exotikusak` (option texts are strategy names; leave) |
| `src/features/payoff-lab/Components/PayoffDock.tsx` | L103–110 | the same exotic labels again |
| `src/features/payoff-lab/Components/PayoffChart.tsx` | L53 | fallback `"Synthetic Overlay"` |
| `src/features/heston/components/HestonGreeksChart.tsx` | L36, L38, L80, L89 | `Black–Scholes`, `Heston (MC)`, `Heston` |
| `src/features/heston/components/HestonPriceComparisonChart.tsx` | L14–15 | `Black–Scholes`, `Heston (MC, smoothed)` |
| `src/features/heston/components/HestonSmileChart.tsx` | L21–22 | `BS implied vol`, `Heston implied vol` |
| `src/features/heston/components/HestonGreeksSummary.tsx` | L27–28 | `<th>Black–Scholes</th>`, `<th>Heston (MC)</th>` |

Language tables: `src/Language/Payoff.ts` + `Payoff.hu.ts` (keys `payoffType*`, `payoffPresetGroup*`,
`payoffSummary*` exist), `BlackScholes.ts`/`.hu.ts`, `Heston.ts`/`.hu.ts` (`hestonYears` exists at L41).
All are already registered in `src/Language/index.en.ts` / `index.hu.ts`.

### Hex colours in 2D charts
- `src/features/black-scholes/useBlackScholesView.ts` L17–24 `lineColors` (6 hexes) → series at L228–236;
  reference line `#94a3b8` in `BlackScholesChart.tsx` L52.
- `src/features/heston/components/HestonPathsChart.tsx` L8–15 same six hexes; `HestonVarianceChart.tsx`
  (check for the same array); `HestonGreeksChart.tsx` L36/L38/L78/L87 (`#3b82f6`, `#f59e0b`);
  `HestonPriceComparisonChart.tsx` L14–15; `HestonSmileChart.tsx` L21–22; reference lines `#94a3b8`.
- `src/features/payoff-lab/Components/PayoffChart.tsx` L19–27 `lineColors` (7 hexes), total `#60a5fa`,
  `areaColor: "#ef4444"`, overlay `#fbbf24`, reference lines `#94a3b8` / `#ef4444` / `#64748b` (L46–60).
- `src/features/delta-hedging/DeltaHedgingView.tsx` L32–33 (`#22c55e`, `#38bdf8`).
- Available: `src/components/charts/chart.theme.ts` exports `SERIES_PALETTE` (`var(--chart-1…8)`),
  `SERIES_ROLE` (`empirical`, `reference`, `candidate`, `cloud`, `estimate`) and `CHART_COLORS.axis`
  (`#94a3b8`). Tokens `--positive`/`--negative` exist in `src/styles/tokens.scss` L78–79 (dark) and
  L147–148 (light). Both are re-exported from `src/components/charts/index.ts`.

### Dead collapse feature
- `src/styles/layout.scss` L707–709: `.toggle-button{display:none}` (desktop). On phones the button
  renders as a lone full-width "-" (payoff 360 screenshot) above a leg list that `mobile.scss` L281–283
  hides anyway.
- State and props: `usePayoffView.ts` L28 (`controlsOpen`), L85–87 return; `StrategyLab.tsx` L10, L21–22;
  `PayoffBuilder.tsx` L14, L20, L26–33, L46–56 (`param-summary` branch); `useBinomialView.ts` L67;
  `BinomialView.tsx` L15–16, L22–23; `BinomialControls.tsx` L8, L10, L22–26, L48–63 (`param-summary`
  branch); `useBlackScholesView.ts` L133 and L330 (unused); `useHestonView.ts` (`controlsOpen` in the
  return at L467, unused). `src/features/diffusion/` also uses `param-summary` — **do not touch it**.
- Keys `binomialToggleControls` (`Binomial.ts` L7) and `payoffCollapsed*` (`Payoff.ts` L57–59) become
  unused.

### Other
- `src/features/payoff-lab/Components/PayoffDock.tsx` is 351 lines (rule: ≤ ~150). L17–37 define
  `DockField`; L90–244 build the field list per instrument type (pure data given `leg` and `t`);
  L246–350 render.
- `src/features/heston/components/HestonPathsChart.tsx` L27–37 re-implements a media query;
  `src/components/useMediaQuery.ts` exists and every other chart uses it.

## Goal
1. No user-visible English literal in derivatives `.tsx`/`.ts` outside `*.math.ts`.
2. No hex literal in derivatives `.tsx` except under `surface3d` usage.
3. `controlsOpen` and `.toggle-button` gone; `param-summary` CSS kept (diffusion uses it).
4. `PayoffDock.tsx` ≤ 150 lines, logic in a pure `payoffDock.fields.ts`.
5. One `INSTRUMENT_LABEL_KEYS` map used by LegCard, PayoffDock and PresetSelect.

## Non-goals
**`src/features/delta-hedging/` (rebuilt 2026-10-21 by the owner's session; already token-coloured and localised: skip every delta-hedging line above).** Visual changes, new controls, preset names, synthetic-match labels inside `payoff.math.ts` (note them in
Findings for the owner), 3D surfaces, any file under `src/features/diffusion/`.

## Constraints
CLAUDE.md rules (i18n, ≤150-line `.tsx`, DRY). Both language tables for every new key; HU strings are
drafts listed in Findings. Keep query-string behaviour untouched in this plan (05/04 handle URL state).

## Steps
1. **Instrument labels (DRY).** In `legFields.ts` add
   `export const INSTRUMENT_LABEL_KEYS: Record<InstrumentType, TranslationKey>` with the five vanilla
   keys plus new keys `payoffTypeDigitalCall`, `payoffTypeDigitalPut`, `payoffTypeAssetCall`,
   `payoffTypeAssetPut`, `payoffTypeGapCall`, `payoffTypeGapPut`, `payoffTypeDoubleDigital`,
   `payoffTypeSupershare`; derive `VANILLA_TYPES` / `EXOTIC_TYPES` as `{ value, label: TranslationKey }[]`
   from it. Add `payoffGroupVanilla: "Vanilla"`, `payoffGroupExotic: "Exotics"` (HU: `Vanília`,
   `Egzotikus`). Update `LegCard.tsx` L33–38, `PresetSelect.tsx` L63 and `PayoffDock` to call `t(...)`.
2. **Payoff summary strings.** Keys `payoffSummaryNote`, `payoffSummaryEquivalentsTitle`,
   `payoffSummaryEquivalentCount` with the current EN/HU texts moved verbatim from `PayoffSummary.tsx`
   L13–19; `payoffChartSyntheticFallback: "Synthetic overlay"` for `PayoffChart.tsx` L53.
3. **Black–Scholes units.** Keys `blackScholesYears: "years"` / HU `"év"`, `blackScholesCurvesUnit:
   "curves"` / HU `"db"`; replace L20/L48/L66 in `BlackScholesControls.tsx`; drop `language` from the
   destructuring if unused.
4. **Heston series labels.** Keys `hestonSeriesBs: "Black–Scholes"`, `hestonSeriesHestonMc: "Heston (MC)"`,
   `hestonSeriesHestonMcSmoothed: "Heston (MC, smoothed)"`, `hestonSeriesBsIv: "BS implied vol"`,
   `hestonSeriesHestonIv: "Heston implied vol"`, `hestonSeriesHeston: "Heston"`; HU drafts:
   `Black–Scholes`, `Heston (MC)`, `Heston (MC, simított)`, `BS implicit vol`, `Heston implicit vol`,
   `Heston`. Module-level `const series` arrays in `HestonPriceComparisonChart.tsx` and
   `HestonSmileChart.tsx` must move inside the component (or a `useMemo`) to use `t`.
5. **Colours.** Replace every hex above:
   - multi-maturity / multi-path series → `SERIES_PALETTE[index % SERIES_PALETTE.length]`;
   - Heston "Black–Scholes" series → `SERIES_ROLE.reference`, "Heston" → `SERIES_ROLE.candidate`
     (also the `.series-toggle-dot` inline backgrounds in `HestonGreeksChart.tsx` L78/L87);
   - payoff total → `SERIES_PALETTE[0]`, components → `SERIES_PALETTE[(index + 1) % …]`, synthetic overlay
     → `SERIES_ROLE.candidate`, profit area → `"var(--negative)"`, zero line in profit mode →
     `"var(--negative)"`, in payoff mode → `CHART_COLORS.axis`;
   - delta hedging option → `SERIES_ROLE.reference`, replicating → `SERIES_ROLE.candidate`;
   - every `#94a3b8` reference line → `CHART_COLORS.axis`.
   Delete the now-unused `lineColors` arrays. `var(--chart-n)` strings are valid SVG `stroke`/`fill`
   values; the shared `LineChart` already receives them from other labs.
6. **Dead toggle.** Remove the state, props, buttons and `param-summary` branches listed above; delete
   `.toggle-button` rules from `layout.scss` L707–713 and `payoff.scss` L80–90 (keep
   `.delete-leg-button`); delete keys `binomialToggleControls`, `payoffCollapsedLegCount`,
   `payoffCollapsedComponentsVisible`, `payoffCollapsedComponentsHidden` from both tables. Keep
   `.param-summary` CSS.
7. **Dock split.** New `src/features/payoff-lab/Components/payoffDock.fields.ts` (no React):
   ```ts
   export type DockField = …;            // moved from PayoffDock.tsx L17–37
   /// Chips and the active control for one leg, in display order.
   export function buildDockFields(leg: StrategyLeg, t: (key: TranslationKey, vars?: Record<string, string | number>) => string): DockField[]
   ```
   `PayoffDock.tsx` keeps state and rendering; move the leg-chip row (L271–301) into
   `PayoffDockLegs.tsx` (`legs`, `activeId`, `onSelect`, `onAdd`, `onRemove`). Each file ≤ 150 lines.
   Behaviour identical: same chip order, same defaults (`strike` 100, `premium` 0, `payout` 10 …).
8. `HestonPathsChart.tsx`: replace L27–37 with `const isMobile = useMediaQuery("(max-width: 640px)")`.
9. Lint/tsc; then run the audit and smoke (README §4). The audit must show the **same or fewer** failures
   than plan 01's baseline for every page-state; no new kinds.

## Acceptance criteria
- `grep -rn "language === \"hu\"" src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging}` → nothing.
- `grep -rnE "#[0-9a-fA-F]{6}" src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging} --include=*.tsx --include=*.ts | grep -v "math.ts\|surface3d\|BinomialLattice"` → nothing (`BinomialLattice` is plan 04).
- `grep -rn "controlsOpen\|toggle-button" src` → nothing.
- `wc -l src/features/payoff-lab/Components/*.tsx` → all ≤ 150.
- HU pages (`/hu/payoff`, `/hu/heston`) show the HU drafts in the leg type dropdown and chart legends.
- Smoke: no console errors on the 11 paths in README §4.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:payoff-replication && npm run test:payoff-positions
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group derivatives
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/payoff,/payoff?lab=replicate,/binomial,/black-scholes,/heston,/delta-hedging,/hu/payoff,/hu/heston" \
  --after "/payoff|(async()=>{const s=document.querySelector('select.payoff-select');s.value='digital-call';s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,400));return [...document.querySelectorAll('.payoff-label')].map(e=>e.textContent)})()"
# expect: no problems; the --after value lists the digital-call fields (Strike, Premium, Payout labels)
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `t()` in this repo is `useI18n().t`; `TranslationKey` is exported from `src/i18n.tsx`. Adding a key to
  only one table fails `tsc` (the key union is derived from the EN table) or shows the key name at
  runtime (HU); add both.
- `PayoffDock` calls `onClearPreset()` before every edit; keep that in the component, not in the
  pure fields file.
- `PayoffChart` uses `area: mode === "profit"` with `areaColor`; the area fill expects a colour string,
  `var(--negative)` works there too (it is an SVG `fill`).
- `HESTON_GREEKS` (`heston.greeks.ts`) already holds label keys; reuse it rather than adding a parallel list.
- Don't rename query keys or change slider ranges here; plans 04/05 depend on the current values.

## Findings (fill in during execution)
- New keys and HU drafts (for owner review):
  - Payoff: `payoffTypeDigitalCall` Digitális call, `payoffTypeDigitalPut` Digitális put, `payoffTypeAssetCall`
    Eszköz-vagy-semmi call, `payoffTypeAssetPut` Eszköz-vagy-semmi put, `payoffTypeGapCall` Gap call,
    `payoffTypeGapPut` Gap put, `payoffTypeDoubleDigital` Dupla digitális, `payoffTypeSupershare` Supershare,
    `payoffGroupVanilla` Vanília, `payoffGroupExotic` Egzotikus, `payoffChartSyntheticFallback` Szintetikus overlay;
    `payoffSummaryNote` / `payoffSummaryEquivalentsTitle` / `payoffSummaryEquivalentCount` moved verbatim.
  - Black–Scholes: `blackScholesYears` év, `blackScholesCurvesUnit` db.
  - Heston: `hestonSeriesBs` Black–Scholes, `hestonSeriesHestonMc` Heston (MC), `hestonSeriesHestonMcSmoothed`
    Heston (MC, simított), `hestonSeriesBsIv` BS implicit vol, `hestonSeriesHestonIv` Heston implicit vol,
    `hestonSeriesHeston` Heston.
  - Removed: `binomialToggleControls`, `payoffCollapsed*`.
- Audit: see the README run on preview (port 4174, `--port 9482`); same or fewer failures than the 01 baseline.
- Left for the owner: synthetic labels in `payoff.math.ts`; preset names in `PresetSelect.tsx`.
- Deviations:
  - `.toggle-button` CSS in `layout.scss` **kept**: `src/features/diffusion/` still renders a toggle button and
    is out of scope; deleting the rule would show it unstyled on desktop. Only the payoff.scss selectors were removed.
  - The phone dock's instrument labels now share `INSTRUMENT_LABEL_KEYS`, so "Asset Call" there reads
    "Asset-or-Nothing Call" like the sidebar picker (DRY).
  - Replication charts (`DensityChart`, `ReplicationChart`) also had `#94a3b8`/`#64748b` reference lines → `CHART_COLORS.axis`.
  - `CHART_COLORS` is not in the charts barrel; imported from `components/charts/chart.theme` (as delta-hedging does).
  - The payoff builder card keeps `SectionCard title=""` with an empty header; plan 03 owns that card's layout.
  - Lint: 12 errors, all pre-existing `set-state-in-effect` etc.; none new.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/02-shared-hygiene.md`; confirm plan 01 is `done` (stop if
> not). Implement plan 02 across the five derivatives labs: move every English literal into the
> language tables (both EN and HU), replace hex chart colours with `SERIES_PALETTE` / `SERIES_ROLE` /
> `CHART_COLORS`, remove the dead `controlsOpen` collapse feature and `.toggle-button`, split
> `PayoffDock.tsx` into a pure `payoffDock.fields.ts` + two ≤150-line components, and use
> `useMediaQuery` in `HestonPathsChart`. Run the Verification commands, fill in Findings (list every HU
> draft), set plan 02 to `done` in the README table, and summarise. Do not change behaviour or visuals
> beyond removing the "-" toggle.
