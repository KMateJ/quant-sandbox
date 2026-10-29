# 10 — Final cross-width, theme and language QA

Status: done (2026-10-29, session fi-qa) · Depends on: 01–09 · Suggested model: Sonnet · Est. size: S

## Why
Each plan audited its own pages. This pass checks the whole Fixed Income category together, after all
shared changes, and closes the programme against the README's definition of done.

## Current state
Seven FI modules expected: `bond-pricing`, `yield-curve`, `duration-convexity`, `treasury-futures`,
`immunization`, `interest-rate-swap`, `callable-bond` (registry `category: "fixed-income"`).
`scripts/layout-audit.mjs --group fixed-income` reads them from the registry.

## Steps
1. Full audit, strict, both themes, both languages, default widths plus 412 and 1920:
   `--group fixed-income --widths 360,390,412,768,1024,1280,1536,1920 --strict`.
2. Also audit the FI sidebar + home teaser: `--paths "/,/hu/"` (home lists FI modules).
3. Review every `data-layout-allow` in `src/` (`grep -rn data-layout-allow src`): each needs a reason that
   holds up; remove the rest and fix.
4. Open 6 screenshots yourself with an image viewer/Read: each new lab at 360 light and 1280 dark. Look
   for what the audit can't see: inconsistent paddings between panels, misaligned baselines in readout
   rows, colours that don't follow tokens, pills/capsules, left-border accents. Fix.
5. Rules sweep for FI folders: `.tsx` line counts (`wc -l src/features/{bond-pricing,yield-curve,duration-convexity,treasury-futures,immunization,interest-rate-swap,callable-bond}/**/*.tsx`),
   no React imports in `*.math.ts`, no hard-coded English in FI `.tsx`.
6. Append one summary line to `docs/LABS_PLAN.md` Log and set the FI per-lab rows (L184–189 at snapshot
   time) to their real status.

## Acceptance criteria
README §5 definition of done holds, item by item, with evidence in Findings.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:labs && npm run test:yield-curve && npm run test:treasury-futures \
  && npm run test:duration-lab && npm run test:immunization-lab && npm run test:swap-lab && npm run test:callable-lab \
  && npm run test:chart-layout && npm run test:seo && npm run test:guide-interactive
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income --widths 360,390,412,768,1024,1280,1536,1920 --strict
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/,/hu/,/bond-pricing,/immunization,/interest-rate-swap,/callable-bond,/hu/callable-bond"
```

## Findings (fill in during execution)
- Definition-of-done evidence: strict audit `--group fixed-income`, widths 360–1920, both themes and languages: 224/224 pages pass (was 84 failing, all phone tap targets). Home `/`, `/hu/`: 32/32 pass. cdp-smoke on the 7 listed paths: no problems apart from the local `/_vercel/insights` 404. tsc, all FI lab tests, chart-layout and guide-interactive pass. FI `.tsx` files are all at most 150 lines, and no FI `*.math.ts` imports React. Screenshots checked: callable 360 light, swap 1280 dark.
- Fix: `_primitives.scss` region "Phone tap targets" sets a 32px min-height on controls at phone width, gives `.brand` and `.home-link` a 32px box with padding cancelled by negative margin, and gives `.home-filter` a 32px min-width.
- Outside FI and not fixed here: `npm run lint` has 12 errors in non-FI files (AppShell, heston, diffusion, payoff-lab, i18n, theme). In `test:seo`, the gbm/ito description lengths fail (stochastic pack), and the initial-JS budget fails at 1.09 MB against 1.0 MB.
- Remaining allowlist entries with reasons: info-tooltip trigger (the coarse-pointer `::after` gives a 34px hit area); range inputs in SliderField, NumberStepper, SliderDock, YieldShockControl, BondBasket and NodeTable (the 22px coarse-pointer thumb is the target); radios in PredictExplain and CallablePredict and the FactorsView checkbox (the whole label is the target); RangeGuess dual thumbs (both inputs share one track; this entry was already there).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> and `docs/plans/fixed-income-labs/10-final-qa.md`; confirm plans 01–09 are done (stop if not). Run the
> full strict audit and all tests, fix what fails, review screenshots by eye for issues the audit can't
> detect, sweep the project rules over the FI folders, and record evidence for each definition-of-done
> item in Findings. Set plan 10 to done in the README table and summarise.
