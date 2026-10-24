# 18 — Final QA across desks, Sandbox and the Hedging Desk

Status: done (2026-10-24) · Depends on: all (01–17) · Suggested model: Sonnet · Est. size: M

## Why
Seventeen plans by separate sessions touch one kit, five desks, the registry and shared i18n tables. This
plan checks the pack's definition of done (README §5) end to end, fixes small cross-plan gaps and leaves a
single report for the owner.

## Current state
- Read README §3 (every row should be `done`) and `LOG.md` (every `CONTRACT`, `BLOCKED`, `DEVIATION`).
  Any `BLOCKED` without a later resolution: stop and report instead of running this plan.
- Test scripts expected: `test:game-kit`, `test:hedging-desk`, `test:alm-desk`, `test:rates-desk`,
  `test:portfolio-desk`, `test:retirement-desk`, `test:sandbox`, `test:challenges`, plus existing
  `test:seo`, `test:labs`, `test:portfolio-labs`, `test:guide-wave4`, `test:language-routes`.
- Audit tools: `scripts/cdp-smoke.mjs`, `scripts/layout-audit.mjs`.

## Goal
Every DoD item verified with a command or a recorded browser check; small fixes applied; a Findings report.

## Non-goals
- No new features, missions or redesigns. Larger problems become a `BLOCKED`/follow-up note, not a rewrite.

## Steps
1. **Static:** `npx tsc -b && npm run lint`; all test scripts above. For each failure, check whether it also
   fails at the commit before the pack (`git diff --quiet <rev> -- <file>`, never stash) and record new vs
   pre-existing.
2. **Hygiene greps:**
   - `.tsx` over 150 lines: `find src/components/game src/features/*-desk src/features/sandbox -name "*.tsx" | xargs wc -l | awk '$1>150'`.
   - Leftovers: `grep -rn "Stub: filled by" src` (must be empty); `grep -rn "hdesk\|qs.hedgingDesk" src` (only
     the plan 03 legacy-key read may remain); `grep -rn "Math.random\|Date.now" src/features/*-desk src/lib/game`
     (only event handlers in plan 17 sites are allowed, none here).
   - Kit independence: `grep -rn "features/" src/components/game src/lib/game` must be empty.
   - Amber scope: `grep -rn "#FB8B1E\|--amber" src/styles | grep -v "_game-kit\|_hedging-desk"` must be empty.
3. **Build and SEO:** `npm run build && npm run test:seo && npm run test:language-routes`; confirm
   `dist/{immunization,yield-curve,portfolio-lab,tvm}/desk`, `dist/sandbox`, the `/hu/` copies and their
   sitemap entries exist.
4. **Browser smoke** (preview server):
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "/sandbox,/delta-hedging/desk,/immunization/desk,/yield-curve/desk,/portfolio-lab/desk,/tvm/desk,/delta-hedging/desk?demo=1,/immunization/desk?demo=1,/yield-curve/desk?demo=1,/portfolio-lab/desk?demo=1,/tvm/desk?demo=1,/hu/sandbox,/hu/immunization/desk,/hu/yield-curve/desk,/hu/portfolio-lab/desk,/hu/tvm/desk"
   MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/sandbox,/delta-hedging/desk,/immunization/desk,/yield-curve/desk,/portfolio-lab/desk,/tvm/desk,/hu/tvm/desk"
   ```
   Layout audit at 360/768/1280/1536 (the script's default widths; pass them explicitly if not).
5. **Play-through per desk** (by hand or a CDP script, record the result per desk in Findings): start
   mission 1, run to the end with the function keys, open the debrief, confirm progress is saved (reload
   `/sandbox`: missions done increments); start the demo, take over mid-way; open each help tab and use one
   "Put in ticket" / "Show me" action; toggle Expand and Full screen; switch to HU.
6. **Hedging regression:** `npm run test:hedging-desk` green; the old saved progress key still shows as
   completed after plan 03's migration (seed `qs.hedgingDesk.progress.v1` in the console, reload).
7. **Challenges:** reveal one round on three labs, reload, confirm `ChallengeRecord` and the Sandbox row.
8. **Cross-plan consistency:** every desk's command bar has the Sandbox link; every desk's sidebar has
   Lab + Desk; progress keys follow `qs.game.<deskId>.progress.v1`; every desk table's HU ≠ EN test exists.
9. Collect every plan's "HU strings added" and mission-limit Findings into one list for the owner below.
10. Fix only small, local issues (missing key, broken link, overflow); note anything bigger as a follow-up.
    Stop the server; confirm the port is free.

## Acceptance criteria
- All commands in steps 1–4 pass (or failures are proven pre-existing); steps 5–8 recorded per desk.
- Findings hold the owner review list (HU drafts, mission limits, Sandbox desk order, `beta` status).

## Verification
The commands in steps 1–4, re-run after any fix.

## Pitfalls
- Audit on `vite preview`, never the dev server.
- Other sessions may still be editing; if the tree is red because of unrelated half-done work, verify in a
  temporary `git worktree add --detach` copy (junction `node_modules`) and remove it afterwards.

## Findings (fill in during execution)
- Static (shared tree, no other plan in progress): `tsc -b` 0 errors. `npm run lint`: 12 errors, all pre-existing
  in files the pack did not touch (AppShell, diffusion, heston ×3, HomeHeroFigure, payoff-lab ×2,
  PortfolioUniverseContext, i18n, theme; the same list plan 02 recorded). Tests, all green: game-kit 14,
  hedging-desk 78, alm-desk 25, rates-desk 25, portfolio-desk 27, retirement-desk 23, sandbox 4, challenges 3,
  labs 59, portfolio-labs 26, guide-wave4 17, language-routes 4.
- Hygiene: no `.tsx` over 150 lines in the kit, desks or sandbox; no `Stub: filled by`; no `Math.random` /
  `Date.now` in desk or kit code; no `features/` import in `src/components/game` or `src/lib/game`; amber only in
  `_game-kit` / `_hedging-desk`. `hdesk` remains only as the hedging desk's own `deskClass` (like `ratd`, `almd`),
  and the legacy key is read only by `deskProgress.ts` (migration) and `sandbox.data.ts` (`LEGACY_KEYS`).
- Build/SEO: build green; `dist/{immunization,yield-curve,portfolio-lab,tvm,delta-hedging}/desk.html`,
  `dist/sandbox.html` and every `/hu/` copy exist, and each is in the sitemap in both languages. `test:seo` 24 pass /
  1 fail: **initial JS 1,040,692 B vs budget 955,000 B** (see Follow-ups). The h1 / title / description items are the
  test's own known baselines.
- Smoke (17 paths: Sandbox, all five desks, all five demos, HU Sandbox and HU desks): no console errors or
  exceptions. Layout audit (`--wait 4000`, private DevTools port) on the Sandbox, the five desks and HU retirement,
  360–1536 px, light and dark: only the known overlaps with the sticky function-key bar and the site-wide `a.brand`
  tap target. No overflow, clipping or theme failures.
- Per-desk play-through (scripted CDP on `vite preview`, one browser profile so saved progress reaches `/sandbox`):

  | Desk | Mission 1 to the end | Saved | Demo take-over | Help tabs / Show me | Expand / Full screen | Sandbox link |
  |---|---|---|---|---|---|---|
  | Hedging | M1, F4 + F2 daily: default seed fails (P&L −$893 vs ±$400); seeds 1 and 5 pass | yes, when the debrief opens (`M1`, best −$351) | keeps book, keys back | 3 tabs, Show me outlines | yes / button shown | **was missing; fixed** |
  | ALM | A1, F4 + F2 each year: passed | yes (`A1`) | keeps book | 3 tabs, Show me outlines | yes / yes | yes |
  | Rates | R1, F4 then F3 × 4: passed (+$18,305) | yes (`R1`) | keeps day 5 | 3 tabs, Show me outlines | yes / yes | yes |
  | Portfolio | P1, Run to the end: passed | yes (`P1`) | keeps book | 3 tabs, Show me outlines | yes / yes | yes |
  | Retirement | T1, 35,000 a year: default seed runs out in year 27; seeds 1 and 2 pass | yes, on settle (`T1`) | keeps year 6 | 3 tabs, Show me outlines | yes / yes | yes |

  `/sandbox` then showed 1 / 5 with the mission id for each saved desk. HU: every desk and the Sandbox render in
  Hungarian (h1s checked), and the HU Sandbox link points to `/hu/sandbox`.
- Hedging regression: `test:hedging-desk` 78/78. Seeding `qs.hedgingDesk.progress.v1 = {M2:{completed:true,bestPnl:-123}}`
  shows "Completed · best −$123" on the missions screen and copies it to `qs.game.hedging.progress.v1`. `/sandbox`
  shows hedging 1 / 5 · M2 even before the desk page is opened, because it reads the legacy key itself.
- Challenges: one round revealed on TVM (`doubling-time`), GBM (`gbm-median`) and Brownian motion (`barrier-hit`).
  Each is in `qs.game.challenges.v1` and shows on `/sandbox` after a reload (played 1, hits 0%). Reveal stays
  disabled until a guess is entered (expected). The NPV/IRR round sits on a tab and was not clicked.
- Cross-plan: every desk module has `subNav` Lab + Desk; progress keys are
  `qs.game.{hedging,alm,rates,portfolio,retirement}.progress.v1`; every desk has HU ≠ EN copy tests (screen and help
  test files per desk, plus the kit and the Sandbox).
- Fixes applied:
  - The hedging desk command bar had no Sandbox link: added `gkSandboxLink` → `/sandbox` in
    `src/features/hedging-desk/HedgingDeskView.tsx`, the same pattern as the other desks (hedging tests 78/78).
  - The Sandbox desk table overflowed its column at 1280 px (the "Open desk" link scrolled under the challenge
    table), and the challenge table's module links were 27 px wide on phones. `src/styles/_sandbox.scss` now lets
    `.sbx-table` cells wrap and gives its links a 44 px minimum width on touch. The Sandbox layout audit is clean in
    EN and HU apart from `a.brand`.
- Follow-ups:
  - **Initial JS budget** (`test:seo`): 1,040,692 B vs 955,000 B. About 74 KB of that is the desks' and kit's EN
    copy tables (`GameKit`, `Challenges`, `Sandbox`, `AlmDesk*`, `RatesDesk*`, `PortfolioDesk*`,
    `RetirementDesk*`), which `index.en.ts` ships up front. Either raise the budget, or have each lazy desk chunk
    register its own tables before it renders (an i18n change, too large for QA).
  - **Desks save progress at different moments:** hedging, ALM, rates and portfolio record when the debrief opens;
    retirement records when the run settles. On those four desks, a finished run whose debrief is never opened is
    not saved. Recommend recording on settle everywhere (in the session hook), as retirement does.
  - **Demo focus on screen-switching steps:** the kit looks the focus element up once per step, so steps that change
    screen (rates `toEnd` → debrief, and the ALM and portfolio debrief steps) get no outline. Plan 03 worked around it
    in the hedging desk only. Fix in `useDemoPlayer` by looking the element up after the screen renders.
  - The demo cannot open help tabs (help is disabled while it runs), so the "what-if" demo steps narrate instead
    (rates, retirement).
  - Parallel builds share `node_modules/.vite-seo` (plan 06 LOG): concurrent builds can pre-render the wrong pages.
- Owner review list:
  - **Hungarian drafts** (every key is a draft; glossary followed): `GameKit.hu.ts`, `Challenges.hu.ts`,
    `Sandbox.hu.ts` (16 challenge names), `AlmDesk.hu.ts`, `AlmDeskMissions.hu.ts`, `AlmDeskHelp.hu.ts`,
    `RatesDesk.hu.ts`, `RatesDeskMissions.hu.ts`, `RatesDeskHelp.hu.ts`, `PortfolioDesk.hu.ts`,
    `PortfolioDeskMissions.hu.ts`, `PortfolioDeskHelp.hu.ts`, `RetirementDesk.hu.ts`, `RetirementDeskMissions.hu.ts`,
    `RetirementDeskHelp.hu.ts`. Also the nav labels (`navImmunizationLab`, `navYieldCurveLab`, `navPortfolioLabLab`,
    `navTvmLab` "Labor"; `navAlmDesk` "ALM desk"; `navRatesDesk` "Rates desk"; `navPortfolioDesk`;
    `navRetirementDesk` "Nyugdíjdesk") and the five `seoDesc*Desk` lines. Terms to confirm: "korlátos szabály"
    (guardrails), "kivételi ráta", "sorrendi kockázat", KÉNYELMES / FESZÍTETT / VESZÉLYBEN, "konverziós faktor",
    "kulcskamat", "meredekedés", "görgetés", "Rates desk (kamatdesk)", "Sandbox oldal <GO>".
  - **Mission limits changed from the plans** (are they solvable, or too easy?):
    - ALM: the `surplusAtEnd` floor is −10,000 (was 0) on A1, A3, A4 and A5. A5's convexity band is 15 and its lesson
      is inverted: duration matching passes and the 2y/12y barbell fails (plan 04).
    - Rates: R2's P&L band is ±100,000 (was ±60,000), because the key-rate hedge costs about 46k. R3 starts at a 5.5%
      level with a +3 bp/day drift (CTD switch between day 4 and 20, median 12). R5 opens short 481 front contracts
      and a simple DV01 rule passes it 20/20; a tighter cost limit would make the roll matter. R4 needs a curve trade
      (a 100-lot steepener passes 14/20).
    - Portfolio: P1 max drawdown 18% (was 15%); P2 vol band 6–11% (was 8.5–11.5%) with 2 misses (was 1); P3 max
      drawdown 12% (was 10%) and vol low 6% (was 7%); P5's "beat" is strict.
    - Retirement: T1 average 34,000 (was 38,000); T2 33,000 (was 34,000); T3 odds floor 50% (was 60%); T4 30,000
      (was 34,000); T5 34,000 (was 36,000) with legacy 300,000 (was 400,000). The odds assume you repeat this year's
      amount, not the guardrail rule.
  - **Sandbox desk order** (currently Hedging, Rates, ALM, Portfolio, Retirement), and whether the four new desks'
    modules stay `beta`.
  - The budget decision and the save-on-settle recommendation above.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (all),
> `LOG.md` and `docs/plans/game-desks/18-final-qa.md`; confirm plans 01–17 are `done`. Execute plan 18:
> static checks, hygiene greps, build/SEO, browser smoke and layout audit, a play-through per desk, the
> hedging regression and challenge checks. Fix only small issues, record everything in Findings including
> the owner review list, append DONE to LOG.md, set plan 18 to `done`, and summarise. Do not stash or check out.
