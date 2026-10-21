# 03 — Payoff lab: phone header, summary styling, dock clearance

Status: in progress (claimed 2026-10-21, other session) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
The Payoff lab is the first derivatives page in the nav and the only one whose header actions overlap
the title on phones. Its summary card is the one place in the derivatives labs with a colour flood,
inline styles and a forbidden left-border accent. These are visible defects; the lab's behaviour is fine.

## Current state (verified 2026-10-21)
- `src/features/payoff-lab/PayofView.tsx` L35–49: `PageHeader` with `actions={<Tabs segmented …/>}`;
  `PageHeader` (`src/components/layout/PageHeader.tsx`) also appends the Intuition button.
  `src/styles/_primitives.scss` L2–10 `.page-header{display:flex; justify-content:space-between}`,
  L50–56 `.page-header-actions{flex-shrink:0; flex-wrap:wrap}`. At 360 px the audit reports
  `h1.page-header-title "Payoff Lab" x button.tab.active "Strategy builder"`, and the screenshot shows
  the segmented control drawn over the title. Other derivatives pages only have the Intuition button
  in `actions`, which fits beside the title.
- `src/features/payoff-lab/Components/PayoffSummary.tsx` L36–80: four `.stat-card`s then a
  `.success-card` (`src/styles/payoff.scss` L150–175: `--success-bg` green fill, `--success-border`,
  title in `--success-title`), and per-match boxes with inline `style={{ border, borderRadius: 12,
  padding, background }}` (L63–70) plus inline `style` on the `<code>` (L71–77) and a wrapper
  `style={{ display: "grid", gap: 10 }}` (L59).
- `src/styles/payoff.scss` L503–510 `.repl-warning{border-left: 3px solid #f59e0b; border-radius: 4px}`
  (replication tab) — left-border accent, hex, literal radius. L463 `.repl-swatch{border-radius:2px}` fine.
- `src/styles/payoff.scss` L197–201 `.chart-wrap{height:380px}` (desktop); the builder column is
  ~1300 px tall with two legs, so the chart is not the dominant element.
- Phone dock clearance: `src/styles/mobile.scss` L276–279 `.view-main--dock-tall{padding-bottom:244px}`
  and L15–18 `.view-main--docked{padding-bottom:172px}`; the padding sits inside the grid, so the
  about section appears after a ~240 px blank band (360 px screenshot). The payoff dock
  (`.slider-dock.payoff-dock`) is three rows: leg chips, field chips, control.
- Tokens: `--radius-xs: 2px`, `--surface-soft`, `--border`, `--warning-bg`, `--warning-border`,
  `--warning-title` (`src/styles/tokens.scss` L99–101), `--code-text`.

## Goal
1. At ≤ 640 px the page header stacks: title row, then actions row; no overlap on any page.
2. Summary: neutral panel (surface + 1 px rule), no inline styles, square corners.
3. `.repl-warning` uses a warning background tint, no left border, token radius.
4. Payoff chart is taller on desktop so it reads as the dominant element.
5. Phone: the blank band under the Summary matches the dock height (no more than ~16 px extra).

## Non-goals
Changing which controls exist, the leg card layout, the dock's behaviour, replication math/charts,
preset names. No redesign.

## Constraints
CLAUDE.md rules; owner: no colour floods, no left borders, square corners, no pills. Shared
`_primitives.scss` and `mobile.scss` edits must be minimal and scoped (other labs share them).

## Steps
1. **Header stacking (shared, `_primitives.scss`).** Add
   ```scss
   @media (max-width: 640px) {
     .page-header { flex-direction: column; align-items: stretch; }
     .page-header-actions { justify-content: flex-start; }
   }
   ```
   Check `/black-scholes`, `/heston`, `/bond-pricing` and `/` at 360 px in the audit afterwards: the
   Intuition button now sits under the title; no page may regress.
2. **Summary styling.** In `PayoffSummary.tsx` replace inline styles with classes
   `.payoff-equivalents` (grid, gap `var(--space-3)`), `.payoff-equivalent` (border 1px `--border`,
   `var(--radius-xs)`, padding, background `--surface`), `.payoff-equivalent-title`, and let
   `.success-card code` keep its rule. Restyle `.success-card` in `payoff.scss` to
   `background: var(--surface-soft); border: 1px solid var(--border); border-radius: var(--radius-xs)`;
   `.success-title{color: var(--text)}`, `.success-text{color: var(--muted)}`. Remove the inline
   `marginTop: 16` → `.payoff-summary-equivalents{margin-top: var(--space-4)}`. Keep the four stat cards.
3. **Replication warning.** `.repl-warning`: `background: var(--warning-bg); border: 1px solid
   var(--warning-border); border-radius: var(--radius-xs)`; delete `border-left`.
4. **Chart height.** Give the chart's `SectionCard` a class `payoff-chart-card` (`PayoffChart.tsx` L108)
   and add `.payoff-chart-card .chart-wrap{height: clamp(380px, 52vh, 560px)}` next to the existing
   `.chart-wrap` rule in `payoff.scss`; the ≤ 820 / ≤ 640 rules in the same file keep overriding
   (they come later in the cascade — verify order, or add the same breakpoints to the new rule).
5. **Dock clearance.** Measure the real dock heights with the smoke `--after`
   (`document.querySelector('.slider-dock').getBoundingClientRect().height`) at 360 px on `/payoff` and
   `/binomial`; set `.view-main--dock-tall` and `.view-main--docked` padding to `height + 16px`
   (expect roughly 200 / 150). Keep the `(max-height: 720px)` variant in proportion.
6. Run the audit for `/payoff`, `/payoff?lab=replicate`, `/hu/payoff` and the four other derivatives
   pages (for the shared header change).

## Acceptance criteria
- Audit: `/payoff` and `/hu/payoff` have zero `overlap` at 360/390/768/1024/1280/1536, both themes.
- `grep -n "style={{" src/features/payoff-lab/Components/PayoffSummary.tsx` → nothing.
- `grep -n "border-left" src/styles/payoff.scss` → nothing.
- Light-theme screenshot: the summary has no green area; equivalents list reads as plain cards.
- 360 px screenshot: the gap between Summary and "About this tool" ≤ dock height + 16 px.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:payoff-replication && npm run test:payoff-positions
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 \
  --paths "/payoff,/payoff?lab=replicate,/hu/payoff,/binomial,/black-scholes,/heston,/delta-hedging,/bond-pricing,/" \
  --widths 360,390,768,1024,1280,1536
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/payoff,/hu/payoff" \
  --after "/payoff|(()=>{const t=[...document.querySelectorAll('.page-header .tab')].find(b=>b.textContent.includes('Replicate'));t.click();return location.search})()"
# expect: no problems; --after returns "?lab=replicate"
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `.success-card` is also used by other features? Run `grep -rn "success-card" src` first; if another
  feature uses it, scope the restyle as `.payoff-summary .success-card` (add the class to the
  `SectionCard`) instead of changing the global rule.
- `payoff.scss` has its own `@media (max-width: 1180px)` and `(max-width: 820px)` rules for
  `.view-layout` / `.chart-wrap`; the new chart-height rule must not win over them on tablets.
- `mobile.scss` clearances also serve `/binomial`, `/black-scholes` (`.view-main--docked`); measure
  both docks, do not guess.
- Do not change `PageHeader.tsx` props; only SCSS.

## Findings (fill in during execution)
- Measured dock heights (360 px): payoff 188, binomial 142 (clearances set to 204 / 158; short-viewport 156 left as is)
- Pages checked for the header change: /payoff, /hu/payoff, /binomial, /black-scholes, /heston, /delta-hedging, /bond-pricing, / at 360–1536, both themes: no overlap
- Deviations: /payoff?lab=replicate still fails the audit (not in this plan): overlap at 768/1280 (section titles vs "Show legs" / info tooltip) and svg-text-clipped x2 at 360/390. Gap under Summary at 360 still looks ~250 px in the full-page screenshot (204 padding + margins); not re-measured. Lint: 2 pre-existing set-state-in-effect errors (NumericInput.tsx, usePayoffView.ts).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/03-payoff-polish.md`; confirm plans 01 and 02 are
> `done` (stop if not). Implement plan 03: stack the page header on phones, restyle the payoff summary
> (no inline styles, no green flood, square), replace the `.repl-warning` left border with a tint,
> make the payoff chart taller on desktop, and size the phone dock clearance from measurement. Run the
> Verification commands, fill in Findings, set plan 03 to `done` in the README table, and summarise.
