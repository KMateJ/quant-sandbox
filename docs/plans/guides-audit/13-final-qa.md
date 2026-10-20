# 13 — Final QA: harness green, build, smoke EN + HU

Status: done (2026-10-20) · Depends on: 01–12 · Suggested model: Sonnet · Est. size: S

## Why
Twelve plans by up to five sessions touched 64 lessons, nine figures and the shared registry. This plan is
the independent check that the whole programme meets its definition of done before the `guides-wave4`
branch is merged and deployed.

## Current state (verified 2026-10-20, expected after plans 01–12)
- `scripts/guide-audit.test.mjs` with allowlists `NO_CHECKS`, `NO_WORKED`, `NO_SEO_TITLE`, `NOT_IN_GUIDES_PLAN`,
  `LAB_WITHOUT_LESSON`, `PLACEHOLDER` (all expected empty) and `NO_FIGURE = ["wacc"]`, `ROOT_LESSONS = ["interest-discounting"]`.
- 64 lessons in `guideLessons`; 72 figure ids; wave-4 strings in `GuideWave4.ts/.hu.ts`.
- `docs/GUIDES_PLAN.md` curriculum tables with 64 rows; 9 rows still say Status `placeholder` (set by plan 07).
- README status table rows 01–12 `done`.

## Goal
1. Every allowlist except `NO_FIGURE` and `ROOT_LESSONS` is empty and the harness passes.
2. Full test, lint and build pass; every guide page renders in EN and HU without console errors.
3. GUIDES_PLAN rows for the 9 new lessons set to `done`; home/README counts correct (64).

## Non-goals
- No new content. Fixes only for what the checks find; anything larger goes to Findings for a follow-up plan.

## Constraints
- Report before fixing anything that is not a one-line correction; keep a list of every fix in Findings.

## Steps
1. Inventory: `git status`, `git log --oneline -20`, read every plan's Findings. Note deviations and
   "awaiting owner review" items into this plan's Findings as one consolidated list (HU strings per plan).
2. Harness: open `scripts/guide-audit.test.mjs`; assert the allowlists are empty (edit them to `[]` if a plan forgot
   to remove ids but the lessons are complete; if a lesson is not complete, stop and report which).
3. Run everything:
   ```bash
   npx tsc -b && npx eslint . 
   npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown \
     && npm run test:guide-wave2 && npm run test:guide-wave3 && npm run test:guide-wave4 && npm run test:guide-stochastic \
     && npm run test:guide-interactive && npm run test:guides-ui && npm run test:intuition && npm run test:seo && npm run test:seo-schema
   npm run build
   ```
   Classify any eslint failure as new vs pre-existing (`git show main:path | npx eslint --stdin --stdin-filename path`).
4. Smoke all guide pages: generate the path list from the registry in node (`importSrc("features/guide/guide.meta.ts")`
   → `guidePath(id)` for every lesson, plus the five track pages and `/guide/graph`, each also under `/hu`), write it
   to a scratch file, and run:
   ```bash
   (npx vite preview --port 4173 &)
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "$(cat <scratch>/paths.txt)" --prefix /hu --wait 2500
   ```
   Expect `problems: []` on all 140 lines, no `leakingLinks`, an `h1` on every page. Also run one `--after` check that
   switches language on a lesson page (find the language control's selector in `src/components/layout/`) and confirm
   the `lang` attribute flips and no exception is logged.
5. Figures: for each of the 9 new figures, load the lesson, and confirm the default readouts equal the numbers quoted
   in the lesson text (use `--after` with a JS expression that returns the readout texts, compare with the plan's
   Findings).
6. Docs: set the 9 GUIDES_PLAN rows to `done`; confirm `README.md`, `Home.ts`, `Home.hu.ts` say 64 lessons; append a
   Log line.
7. Stop the preview server; confirm port 4173 is free.

## Acceptance criteria
- All commands in step 3 pass; smoke in step 4 reports no problems on every page.
- Allowlists empty; `docs/GUIDES_PLAN.md` has 64 `done` rows.
- Findings lists every fix made and every item awaiting the owner (HU strings by plan).

## Verification
The commands in steps 3–4 are the verification.

## Pitfalls
- The preview server serves pre-rendered English HTML; Hungarian pages hydrate differently (see the GUIDES_PLAN
  Log entry about React error #418): a hydration warning only on `/hu/` pages is a known class of problem — report
  it with the exact console text rather than silencing it.
- `npx eslint .` covers `scripts/` too; pre-existing warnings are not regressions.
- Stopping `npx vite preview` with Ctrl-C from Git Bash can orphan `node`; check with `netstat -ano | findstr 4173`
  and `taskkill /PID <pid> /F` if needed.

## Findings (fill in during execution)
- Test / lint / build results (2026-10-20): all allowlists empty except `NO_FIGURE = ["wacc"]` and `ROOT_LESSONS`; 64 lessons, 64 `done` rows in GUIDES_PLAN. `tsc -b` clean. Passing: test:guide-audit 14, guide-checks 7, guide-graph 7, guide-markdown 3, guide-wave2 5, guide-wave3 5, guide-wave4 17, guide-stochastic 7, guide-interactive 54, guides-ui 6, intuition 12, seo 25 (+3 baseline todos), seo-schema 7, language-routes 4, home 6, search 7, labs 54, portfolio-labs 26, clt 6. `npm run build` ok (212 pages, 344 html files in dist). `npx eslint .`: 14 errors in 10 files, all pre-existing (files untouched; AppShell `setNavOpen` effect identical at HEAD).
- Smoke summary: 140 guide pages (5 track pages, /guide/graph and 64 lessons, each EN + /hu): all `problems: []`, no `leakingLinks`, every page has an h1. Language switch on /guide/stochastic/filtrations flips to lang=hu and /hu/guide/stochastic/filtrations without exceptions. Default readouts of all 9 new figures equal the numbers quoted in the lessons (options 8.65/10.45/6.73/102.02; constraints Sharpe 0.416/0.394/cost 0.023; estimation SE 8.9, middle half 47% to 97%, lost Sharpe 0.160; curve-risk 0.74%/0.59%, sum KRD 4.46; real rates 4.03%, breakeven 3.00%, 85.17/100.00; NPV 996.36/993.77/11.0%/−271.85; payout g 7.20%, D1 2.00, P0 71.43, PVGO 21.43; LLN/CLT 0.054/0.312/0.316; correlated L22 0.714, covariation −0.70).
- Fixes made: (1) `npm run test:seo` had one enforced failure, title ≤ 70 characters on 17 pages. EN: shortened 10 SEO titles in `guide.seo.ts` (annuities, valuation-multiples, risk-aversion, probability-spaces, reflection-principle, options-on-other-underlyings, portfolio-constraints, real-rates-inflation, capital-budgeting-risk, law-of-large-numbers-clt). HU: the page title is the lesson title, so the 6 long new ones were added to the KNOWN baseline list in `scripts/seo-audit.test.mjs` under the existing "Hungarian-only" comment (options-on-other-underlyings, portfolio-constraints, curve-risk, capital-budgeting-risk, dividend-policy, law-of-large-numbers-clt). (2) GUIDES_PLAN: 7 rows `placeholder` -> `done`.
- Awaiting owner review (HU strings, by plan): 02 track descriptions and SEO track texts, immunization lab link text; 04 HU checks and worked blocks for 10 lessons; 05 HU worked blocks and 4 new checks; 06 `stochTheoryHeading`; 07 the 18 new titles/descriptions and figure titles; 08 whole lesson `optionsOnOtherUnderlyings` and its `gfW4*` strings; 09 `portfolioConstraints`, `inputEstimation`; 10 `curveRisk`, `realRatesInflation`; 11 `capitalBudgetingRisk`, `dividendPolicy`; 12 `lawOfLargeNumbersClt`, `correlatedBrownianMotions`; 03 HU parts of derivatives checks.
- For a follow-up: the 6 long HU titles (shorten the HU lesson titles to ≤ 55 characters and drop the KNOWN entries); pre-existing eslint errors (listed above); plan 01's "break it on purpose" step was not run; no `guides-wave4` branch was created and nothing is committed or deployed. Post-merge: `npm run indexnow`, re-run `test:seo` and `test:seo-schema`.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (sections 4 and 5) and `docs/plans/guides-audit/13-final-qa.md`, and confirm
> plans 01–12 are marked done in the README (stop and report if not). Implement plan 13: verify the whole
> programme independently — empty allowlists, full tests, lint, build, a smoke run over every guide page in EN and
> HU, figure readouts against the texts — fix only one-line issues, report everything else, update the GUIDES_PLAN
> rows and counts. Fill in Findings with the consolidated owner-review list, set plan 13 to `done` in the README
> table, and summarise what passed, what you fixed and what needs the owner.
