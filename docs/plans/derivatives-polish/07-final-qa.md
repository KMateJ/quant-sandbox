# 07 — Final cross-width / theme / language QA

Status: in progress (claimed 2026-10-21) · Depends on: 01–06 · Suggested model: Sonnet · Est. size: S

## Why
Plans 02–06 each verified their own pages. This plan runs everything together on one preview build,
in both themes and languages at six widths, looks at the screenshots, and records what is left for the
owner. It is the proof that the derivatives labs are clean without having been redesigned.

## Current state (verified 2026-10-21)
- Harness: `scripts/layout-audit.mjs` (after plan 01: scroll-to-top, clipped-content filter, `theme`
  kind), `scripts/cdp-smoke.mjs`. `--group derivatives` resolves `/payoff`, `/binomial`,
  `/black-scholes`, `/heston`, `/delta-hedging` and their `/hu/` twins from `src/modules/registry.ts`.
- Baseline before the pack (dev server): 80 page-states, 44 failing; real defects listed in README §1.
- Tests touching derivatives: `npm run test:payoff-replication`, `npm run test:payoff-positions`,
  `npm run test:url-state`, `npm run test:home`, `npm run test:seo` (sitemap/meta derive from the registry).
- `docs/LABS_PLAN.md` L104–109 describe the derivatives labs; L160–173 list on-hold interaction ideas.

## Goal
1. `layout-audit.mjs --group derivatives` exits 0 at 360, 390, 768, 1024, 1280, 1536, light and dark,
   with the Heston disclosure both closed and open, and with 8-step binomial trees.
2. Screenshots reviewed: light pages look light; no rounded tiles, no colour floods, no left borders.
3. All test scripts, lint, tsc and build green; smoke clean on all 11 paths plus `?lab=replicate`.
4. README status table complete; leftovers recorded for the owner; one Log line in `docs/LABS_PLAN.md`.

## Non-goals
New features. Fixing non-derivatives pages (note them in Findings instead).

## Constraints
README §4 rules. Any `data-layout-allow="reason"` added here needs the reason in Findings.

## Steps
1. `git status` must be clean apart from this pack's changes; list the derivatives files touched since
   commit `a750950` (`git diff --stat a750950 -- src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging} src/styles src/Language`).
2. Run the full verification block below. For each failing page-state, decide: fix in place (small
   CSS/i18n), or `data-layout-allow` with a written reason, or report. Prefer fixing.
3. Open at least these screenshots with the image viewer and note anything odd in Findings:
   `light-1280_payoff.png`, `light-1536_binomial.png`, `light-360_binomial.png`, `dark-1280_heston.png`,
   `light-1280_delta-hedging.png`, `dark-360_payoff.png`, `light-1280_hu_black-scholes.png`.
4. Grep gates (all must be empty):
   ```bash
   grep -rn "language === \"hu\"" src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging}
   grep -rnE "#[0-9a-fA-F]{6}" src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging} --include=*.tsx | grep -v surface3d
   grep -rn "controlsOpen\|toggle-button" src
   grep -rn "border-left" src/styles/payoff.scss src/styles/binomial.scss
   grep -rnE "border-radius: ([3-9]|[1-9][0-9])px" src/styles/payoff.scss src/styles/binomial.scss
   find src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging} -name "*.tsx" | xargs wc -l | awk '$1>150 && $2!="total"'
   ```
5. Append to `docs/LABS_PLAN.md` Log: `- HH:MM derivatives-polish 07: pack complete; derivatives
   audit green; v2 redesign not implemented (owner)`.
6. Fill in the README status rows that executors left stale (only `done (<date>)` values).

## Acceptance criteria
- `SUMMARY pages=120 failing=0` for the group run (10 paths × 6 widths × 2 themes), plus 0 failures on
  the extra `--after` runs.
- Smoke: no `problems` on any path, both languages.
- All grep gates empty; all tests green.
- Findings list every leftover with a file reference.

## Verification
```bash
npx tsc -b && npm run lint
npm run test:payoff-replication && npm run test:payoff-positions && npm run test:url-state && npm run test:home && npm run test:seo
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group derivatives --out .layout-audit/deriv-final
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 \
  --paths "/heston,/binomial?steps=8,/binomial?mode=rates&steps=8,/payoff?lab=replicate,/hu/payoff?lab=replicate" \
  --widths 360,768,1280,1536 --after "const d=document.querySelector('.control-disclosure'); if(d) d.open=true"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/payoff,/payoff?lab=replicate,/binomial,/black-scholes,/heston,/delta-hedging,/hu/payoff,/hu/binomial,/hu/black-scholes,/hu/heston,/hu/delta-hedging"
```
Stop the server; confirm port 4173 is free (`netstat -ano | grep :4173`).

## Pitfalls
- The audit's `--after` runs on every path in the list; a `null` query is fine (the snippet guards it).
- A `theme` failure means the preview build is stale or the `ThemeProvider` fix regressed; rebuild first.
- `tap-target` is a warning (not failing) unless `--strict`; do not pass `--strict` here, but list the
  shared-primitive tap targets (27 px `Tabs`, 18 px `InfoTooltip`) in Findings for the owner.
- Do not edit the other packs' READMEs.

## Findings (fill in during execution)
- Final audit summary line: …
- Screenshot review notes: …
- Leftovers for the owner (file:line): …
- Allowlist entries and reasons: …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/07-final-qa.md`; confirm plans 01–06 are `done` (stop
> and report if not). Implement plan 07: run the full verification on a preview build, fix small
> leftovers in place, review the listed screenshots, run the grep gates, append the LABS_PLAN log line,
> fill in Findings (leftovers with file:line), set plan 07 to `done` in the README table, and summarise.
