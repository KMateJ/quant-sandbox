# 06 — Heston: Model / Simulation control groups

Status: done (2026-10-21)· Depends on: 01, 02 · Suggested model: Sonnet · Est. size: S

## Why
The Heston sidebar lists 13 sliders and 3 reference cards in one column (≈ 1600 px). At the common
1280×900 size the sticky panel scrolls internally and hides 8 sliders, so the four simulation-quality
settings (path steps, visual paths, pricing steps, pricing paths) bury the model parameters. Grouping
them, with the simulation group collapsed by default, makes the panel fit without touching any chart.

## Current state (verified 2026-10-21)
- `src/features/heston/heston.controls.ts` L17–31: `controls` array of 13 `ControlDefinition`s
  (`key`, `field`, `setter`, `symbol`, `labelKey`, `min`, `max`, `step`, `decimals`, `sectionId`);
  order: `S0, K, r, v0, theta, kappa, xi, rho, T, steps, paths, pSteps, pPaths`. L34–47
  `createHestonSliders(values, setters, t): SliderDescriptor[]`.
- `src/features/heston/useHestonView.ts` L464 `const sliders = createHestonSliders(...)`, returned at
  L467 and consumed by `HestonView.tsx` L47 (`HestonControls values sliders feller`) and, on phones,
  by whichever dock the view renders (check for a `SliderDock` usage; `HestonView.tsx` currently has
  none — phones use the same `Panel`).
- `src/features/heston/components/HestonControls.tsx` (63 lines): one `ControlGroup`
  `hestonControlsParams` with all sliders in `.controls-grid`, then `ControlGroup`
  `hestonControlsReference` with three `.stat-card`s.
- Sticky panel: `src/styles/_primitives.scss` L89–99 (`max-height: calc(100vh - topnav - space-6)`,
  `overflow-y: auto`).
- `ControlGroup` (`src/components/ui/ControlGroup.tsx`): `label`, `hint`, `children`. There is no
  disclosure primitive; `<details>` is styled only inside guide prose (`src/styles/layout.scss` L164–176).
- Language: `src/Language/Heston.ts` L59–61 `hestonControlsTitle/Params/Reference`; `.hu.ts` mirrors.
- Measured: at 1280×900 the panel's `scrollHeight` ≈ 1600 px vs `clientHeight` ≈ 820 px.

## Goal
1. Controls panel at 1280×900 fits without an inner scrollbar when the Simulation group is collapsed.
2. The four simulation sliders live in a collapsed `<details>` "Simulation settings"; model sliders and
   the Reference group are unchanged.
3. One reusable `.control-disclosure` style in `_primitives.scss`.

## Non-goals
Changing ranges, defaults, debouncing, workers, charts, tabs; presets; a new React primitive.

## Constraints
CLAUDE.md; i18n; square, no pills; the disclosure uses a native `<details>`/`<summary>` (keyboard
accessible by default); `prefers-reduced-motion` irrelevant (no animation).

## Steps
1. `heston.controls.ts`: add `group: "model" | "simulation"` to `ControlDefinition`; mark `steps`,
   `paths`, `pSteps`, `pPaths` as `simulation`. Change the factory to
   ```ts
   /// Model sliders and simulation-quality sliders, each in display order.
   export function createHestonSliders(values, setters, t): { model: SliderDescriptor[]; simulation: SliderDescriptor[] }
   ```
2. `useHestonView.ts`: `const sliders = createHestonSliders(...)` unchanged; return `sliders` (now an
   object). If any consumer expects an array (grep `sliders` in `src/features/heston`), pass
   `[...sliders.model, ...sliders.simulation]` there.
3. `HestonControls.tsx`: first `ControlGroup label={t("hestonControlsModel")}` with `sliders.model`;
   then
   ```tsx
   <details className="control-disclosure">
     <summary className="control-disclosure-summary">{t("hestonControlsSimulation")}</summary>
     <div className="controls-grid">{sliders.simulation.map(…)}</div>
   </details>
   ```
   then the Reference group as today. Keys: `hestonControlsModel: "Model parameters"` /
   HU `"Modellparaméterek"`, `hestonControlsSimulation: "Simulation settings"` / HU
   `"Szimulációs beállítások"`. Remove `hestonControlsParams` if unused.
4. `_primitives.scss` (next to `.control-group`, L220–250): 
   ```scss
   .control-disclosure { border-top: 1px solid var(--rule); padding-top: var(--space-3); }
   .control-disclosure-summary {
     cursor: pointer; list-style: none; display: flex; align-items: center; gap: var(--space-2);
     font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted);
     &::-webkit-details-marker { display: none; }
     &::before { content: "+"; font-family: var(--font-mono); }
   }
   .control-disclosure[open] > .control-disclosure-summary::before { content: "−"; }
   .control-disclosure[open] > .control-disclosure-summary { margin-bottom: var(--space-3); }
   ```
5. Measure: smoke `--after` returning `{sh: p.scrollHeight, ch: p.clientHeight}` for
   `document.querySelector('.workspace.cols-sidebar > .panel')` at 1280 px; expect `sh <= ch`.

## Acceptance criteria
- At 1280×900 (default audit height) the panel has no inner scroll with the disclosure closed; opening
  it shows the four sliders and the panel scrolls as before.
- Changing a simulation slider still re-runs the worker (chart updates); tab state unaffected.
- Audit `/heston`, `/hu/heston` at 360/768/1280/1536, both themes: 0 failures.
- `grep -n "hestonControlsParams" src` → nothing (or justified in Findings).

## Verification
```bash
npx tsc -b && npm run lint
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/heston,/hu/heston" --widths 360,768,1280,1536 \
  --after "document.querySelector('.control-disclosure').open=true"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "/heston,/hu/heston" \
  --after "/heston|(()=>{const p=document.querySelector('.workspace.cols-sidebar > .panel');return {sh:p.scrollHeight,ch:p.clientHeight,open:document.querySelector('.control-disclosure').open}})()"
# expect: no problems; sh <= ch and open:false
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `cdp-smoke` runs at its default viewport; pass the check at 1280 wide (the script's default is
  desktop-sized; if not, use the audit's `--after` step and read the JSON line for step 1).
- `SliderDescriptor` (`src/components/SliderDock.tsx`) is shared; do not add fields to it — the
  grouping lives in `heston.controls.ts`.
- Safari ignores `list-style: none` on `summary`; `::-webkit-details-marker{display:none}` handles it.
- The `IntuitionTrigger` per slider (`sectionId`) must keep working inside the `<details>` (it is a
  normal child; nothing special).

## Findings (fill in during execution)
- Panel scrollHeight/clientHeight before/after at 1280: …
- HU drafts: …
- Deviations: …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/06-heston-controls.md`; confirm plans 01 and 02 are
> `done` (stop if not). Implement plan 06: split the Heston sliders into a "Model parameters" group and
> a collapsed native `<details>` "Simulation settings" group, styled once as `.control-disclosure` in
> `_primitives.scss`, so the controls panel fits a 900 px viewport. Run the Verification commands,
> fill in Findings, set plan 06 to `done` in the README table, and summarise. Do not change ranges,
> charts or tabs.
