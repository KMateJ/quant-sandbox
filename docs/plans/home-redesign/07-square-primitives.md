# 07 — Square, flat shared primitives app-wide

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
After plan 01 the radius tokens are 2px, but many styles hard-code radii, gradients and pill shapes.
The owner wants the whole site square and flat ("I do not need rounded edges"; no gradients, no neon),
so shared building blocks must follow the tokens.

## Current state (verified 2026-10-20)
- `border-radius` appears 209 times in `src/styles/*.scss`; 43 of those are literal `px` values.
- `--radius-pill` (999px) is used at `src/styles/layout.scss` lines ~225, ~614, ~1350 and
  `src/styles/_primitives.scss` ~108.
- Gradients (`linear-gradient` / `radial-gradient`) appear in `src/styles/layout.scss`,
  `src/styles/yieldcurve.scss`, `src/styles/_lab-primitives.scss`, `src/styles/_primitives.scss`.
- Shared primitives: `src/components/layout/` (`Panel`, `PageHeader`, `Workspace`, `ChartContainer`, …),
  `src/components/ui/` (`Tabs`, `SegmentedControl`, `InfoTooltip`, `Popover`, `HelpDrawer`, `StatCard`,
  `DataTable`, …), `src/components/SectionCard.tsx`, `src/components/SliderField.tsx`; their styles live
  in `_primitives.scss`, `_lab-primitives.scss`, `layout.scss`.
- Derivatives lab partials: `src/styles/payoff.scss`, `src/styles/binomial.scss` (and Black–Scholes /
  Heston / delta-hedging rules inside `layout.scss`, if any) — **owner-protected**, see Non-goals.

## Goal
1. Shared primitives (cards, panels, section cards, buttons, inputs, selects, tabs, segmented controls,
   tooltips, popovers, drawers, stat cards, tables, slider value boxes) use `var(--radius-xs)` (2px) or 0.
2. No gradient backgrounds or glow shadows in shared primitives; use flat `--surface`/`--bg` and 1px
   `--rule`/`--border` lines.
3. `--radius-pill` only where the shape carries meaning: slider thumbs, toggle-switch knobs, round dots.
   Status badges become square text labels (uppercase mono, `--text-dim`), matching the home page.

## Non-goals
- **Do not edit** `payoff.scss`, `binomial.scss` or derivatives-lab-specific rules. If a shared primitive
  restyle visibly changes a derivatives lab, that is expected (it uses the shared primitive); list the
  pages in Findings for the owner.
- Do not change chart rendering (`src/components/charts/**`) or chart area fills (gradients that encode
  data, e.g. density areas, stay).
- Do not touch guide styles (`guide.scss`, `_guide-*.scss`) — guides are owned by other sessions; post a
  note in `docs/GUIDES_PLAN.md` Log instead.

## Constraints
- Tokens only; no new hex. Circles stay circles (`50%` on dots/avatars/thumbs).
- No left-border accent bars when replacing card styling (owner dislikes them); use background tint.

## Steps
1. Baseline: record in Findings the output of
   `grep -rcn "border-radius" src/styles/*.scss` and
   `grep -rn "border-radius: [0-9]\+px\|gradient(" src/styles/*.scss | wc -l`.
2. For each hit in the **shared** files (`_primitives.scss`, `_lab-primitives.scss`, `layout.scss`,
   `_shell.scss`, `_intuition.scss`, `_playback.scss`, `mobile.scss`, `global.scss`):
   - literal radius ≥ 3px on a box → `var(--radius-xs)`; on round things (thumbs, dots, `50%`) → keep.
   - `var(--radius-pill)` → keep only for slider thumbs/switch knobs/dots; badges/chips → `var(--radius-xs)`
     and restyle as text labels.
   - `linear-gradient`/`radial-gradient` used as decoration → flat `var(--surface)`; keep data-encoding
     gradients and note each kept one in Findings.
   - `box-shadow` used for elevation → remove or `0 0 0 1px var(--rule)`; keep focus rings.
3. Non-derivatives lab partials (`bond.scss`, `capm.scss`, `duration.scss`, `immunization.scss`,
   `npv.scss`, `portfolio.scss`, `tvm.scss`, `yieldcurve.scss`, `_treasury-futures.scss`,
   `_stochastic-models.scss`, `surface3d.scss`): same rules.
4. Run the smoke over a broad page set (below) after each group of files; build stays green.

## Acceptance criteria
- `grep -rn "border-radius: \([4-9]\|[1-9][0-9]\)px" src/styles --include=*.scss | grep -v "payoff.scss\|binomial.scss\|guide"`
  returns nothing.
- `grep -rn "gradient(" src/styles/_primitives.scss src/styles/_lab-primitives.scss` returns only lines
  listed as data-encoding in Findings.
- Smoke shows no problems on every listed page; both themes still readable.

## Verification
```bash
npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/,/hu/,/black-scholes,/payoff,/yield-curve,/bond-pricing,/capm,/efficient-frontier,/npv-irr,/valuation,/stochastic-models,/monte-carlo,/guide/derivatives"
# expect: no problems
```
Stop the server and check the port is free.

## Pitfalls
- Some radius rules sit inside `@media` blocks or nested selectors in `mobile.scss`; grep, don't assume.
- A `border-radius` removed from a container whose child has `overflow: hidden` can expose square
  corners of inner elements — that's intended now, but check tooltips/popovers still clip correctly.
- Theme light: flat surfaces need the 1px rule to stay visible; check `/` and a lab with
  `data-theme="light"` (toggle via `localStorage.setItem('qs-theme','light')` — check `src/theme.tsx`
  for the real key).

## Findings (fill in during execution)
- Baseline counts: 209 `border-radius` rules; 46 literal-px-radius or gradient lines. Plan 01 had already squared every `var(--radius-*)` use, and `--shadow` is `none`, so the remaining work was literals.
- After counts: no `border-radius` of 3px or more outside payoff/binomial/guide files.
- Changed: `.nav-tab` pill, scrollbar thumbs, mobile `.card`, `.dock-chip`, `.slider-dock-handle` and `.csb-swatch`, `.stoch-cov-cell`, `.tf-*` controls, `.bond` legend swatch and `.tvm-seq-bar` now use `--radius-xs`. Removed the not-found radial glow, the slider-dock shadow and the sidebar flyout shadow.
- Kept: round dots (`.weight-dot`, `.weight-row-dot`, `.corr-head-dot`), slider track/thumb pills and thumb shadows, and the data-encoding gradients (slider fill in `layout.scss`, `--quote-fill` in `yieldcurve.scss`, hatch pattern in `_primitives.scss`).
- Not done: home selectors in `layout.scss` (`.mod-card`, `.mod-badge`, `.catalogue-search` focus ring) belong to plan 05's cleanup. Status badges elsewhere were not restyled as text labels.
- Derivatives pages visibly affected via shared primitives (for owner): none checked by eye; smoke shows no errors on /payoff and /black-scholes.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/07-square-primitives.md`, and confirm plan 01 is done (stop
> if not). Run `git status` and stop if the SCSS files you will edit have changes you didn't make. Implement
> plan 07: make shared primitives and non-derivatives lab styles square and flat (2px radii, no decorative
> gradients or elevation shadows, badges as text labels), leaving payoff/binomial and guide styles alone. Run
> the Verification commands and make them pass. Fill in Findings with before/after counts, set plan 07 to
> `done (<date>)` in the README table, and summarise.
