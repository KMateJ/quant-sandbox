# Game desks — session log

Append-only. One line per entry, newest at the bottom. Never edit or reorder other lines.
Read this before you start and again before you run verification.

Format: `YYYY-MM-DD HH:MM · <plan> · <session> · <KIND> · <message>`
Kinds: `CONTRACT` (you changed something another plan imports), `BLOCKED`, `DEVIATION` (you left the plan
in a way others will feel), `DONE`. Routine progress belongs in your plan's Findings, not here.

2026-10-23 21:00 · pack · planner · CONTRACT · Pack written. Kit API in 01 and 02 is the contract every desk plan codes against.
2026-10-24 10:00 · pack · planner · CONTRACT · Plans 13–18 written; pack READY.
2026-10-24 00:07 · 01 · kit-core · CONTRACT · src/lib/game/* and cholesky in src/lib/math/matrix.ts landed with the API in plan 01 (plus internal storage.ts, CHALLENGES_KEY, ChallengeDef type).
2026-10-24 00:07 · 01 · kit-core · DONE · test:game-kit 10/10, guide-wave4 and hedging-desk green; 02, 04, 07, 10, 13, 17 may start.
2026-10-24 00:10 · 02 · kit-ui · CLAIM · Plan 02 claimed.
2026-10-24 00:08 · 07 · rates-engine · CLAIM · Plan 07 claimed.
2026-10-24 00:09 · 10 · portfolio-engine · DONE · Engine in src/features/portfolio-desk/engine; riskParityWeights/scaleToVol in lib/finance/portfolio.ts; mission limits recalibrated (see Findings); test:portfolio-desk.
2026-10-24 00:09 · 04 · alm-engine · CONTRACT · ALM engine API as in plan 04 plus exports almConfig, bandOf, gapsOf, AlmPolicy; benchmarkSeries returns { matchYearly, none }. immunization.math adds liabilityFlows + optional GameConfig.extraLiabilities.
2026-10-24 00:09 · 04 · alm-engine · DEVIATION · surplusAtEnd floor −10,000 (not 0); A5 convexity band 15 and its lesson is inverted (barbell fails, duration match passes). See 04 Findings.
2026-10-24 00:09 · 04 · alm-engine · DONE · test:alm-desk (14) green; immunization-lab, guide-interactive, game-kit green; tsc + eslint clean.
2026-10-24 00:09 · 13 · retirement-engine · CLAIM · Plan 13 claimed.
2026-10-24 00:09 · 13 · retirement-engine · CLAIM · Plan 13 claimed.
2026-10-24 00:11 · 13 · portfolio-engine · DEVIATION · Duplicate claim race on 13; this session withdraws, 13 belongs to the session now writing src/features/retirement-desk.
2026-10-24 00:11 · 17 · challenge-scores · CLAIM · Plan 17 claimed.
2026-10-24 00:15 · 07 · rates-engine · CONTRACT · rates engine in src/features/rates-desk/engine; startRates(mission, seed, path); krd misses on buckets 2y/5y/10y+30y (krdMiss.node = bucket); futures priced on clean prices; curve-risk helpers in src/lib/finance/curveRisk.ts (+ couponCashflows). See plan 07 Findings.
2026-10-24 00:15 · 07 · rates-engine · DONE · test:rates-desk 15/15, guide-wave4 and game-kit green; calibration in Findings. 08 can start once 02 is done.
2026-10-24 00:16 · 13 · retirement-engine · DEVIATION · successOdds defaults to rule "same" (keep taking the amount), not guardrails (always ~100%); mission limits loosened, see 13 Findings.
2026-10-24 00:16 · 13 · retirement-engine · DONE · Engine in src/features/retirement-desk/engine; test:retirement-desk (10) green; tsc + eslint clean.
2026-10-24 00:16 · 17 · challenge-scores · CONTRACT · PredictRevealState/RangeGuessState gain optional challengeId (hook option, recorded on reveal); PredictExplain gains onFirstPick; ChallengeRecord + useChallengeStats exported from components/ui.
2026-10-24 00:16 · 17 · challenge-scores · DONE · 16 sites record rounds; test:challenges green; labs/portfolio-labs/clt/yield-curve green; build + smoke clean.
2026-10-24 00:40 · 02 · kit-ui · CONTRACT · Kit API differs from plan 02 in: MissionPanel +heading, progress 0–1; ViewControls +deskId +helpId; useDemoPlayer +onTakeOver, DemoBar {id, player, caption, onMissions?}; HelpSheet +idPrefix (no title); AttributionBars total needs value; STATUS_KEY in gameCopy.ts; useProgress/useFunctionKeys/GameKey in gameHooks.ts. Barrel: src/components/game/index.ts. See 02 Findings.
2026-10-24 00:40 · 02 · kit-ui · DONE · tsc, kit lint, test:game-kit 14/14, test:hedging-desk 78/78, build green. 03, 16 may start; 05/08/11/14 once their engine is done.
2026-10-24 00:42 · 16 · sandbox-hub · CLAIM · Plan 16 claimed.
2026-10-24 00:17 · 05 · alm-screen · CLAIM · Plan 05 claimed.
2026-10-24 00:18 · 11 · portfolio-screen · CLAIM · Plan 11 claimed.
2026-10-24 00:18 · 08 · rates-screen · CLAIM · Plan 08 claimed.
2026-10-24 00:37 · 08 · rates-screen · CONTRACT · RatesDeskModel in src/features/rates-desk/useRatesDesk.ts; mission titles/briefs (ratdM_<id>Title|Brief) and objective labels (ratdObj_<kind>) already in RatesDesk.ts, so 09 should reuse them; stubs for 09 in place; no Watch button until 09 passes onDemo.
2026-10-24 00:37 · 08 · rates-screen · DEVIATION · test:seo initial-JS budget fails pack-wide (991,763 B vs 955,000 B): every desk's EN copy table ships in the initial bundle. Plan 18/owner: raise the budget or lazy-load desk copy. Also: run layout-audit/cdp-smoke with your own --port; the shared 9339 mixes up results between sessions.
2026-10-24 00:37 · 08 · rates-screen · DONE · /yield-curve/desk (+/hu) live with kit frame, panels and keys; test:rates-desk 18/18; build, smoke and acceptance green in a temp worktree. 09 can start.
2026-10-24 00:37 · 05 · alm-screen · CONTRACT · AlmDeskModel as plan 06 lists plus seed, run, cfg, parsed, preview, tradesLeft, newPath, restart, demoSteps; mission copy keys almdMission<Id>Title|Brief + objectiveViews() in alm-desk/missionCopy.ts; demo stub exports ALM_DEMO_MISSION/ALM_DEMO_SEED; immunization.math exports shiftCurve.
2026-10-24 00:37 · 05 · alm-screen · DEVIATION · test:seo initial JS 991,763 B > 955,000 B budget: every desk's EN table loads up front (this plan ~8 KB). Needs a pack-level fix (lazy desk tables); flagged for 18.
2026-10-24 00:37 · 05 · alm-screen · DONE · /immunization/desk + /hu live and pre-rendered; test:alm-desk 19/19; smoke + layout audit clean except the shared baselines (see 05 Findings). 06 may start.
2026-10-24 00:37 · 06 · alm-help · CLAIM · Plan 06 claimed.
2026-10-24 00:37 · 09 · rates-missions · CLAIM · Plan 09 claimed.
2026-10-24 00:39 · 11 · portfolio-screen · CONTRACT · PortfolioDeskModel in src/features/portfolio-desk/usePortfolioDesk.ts; mission copy via portfolioCopy.missionKeys (pmgrMs_<id>_title|_brief), objective labels via objectiveViews.objectiveView; stubs for 12 in place; no Watch button until buildPortfolioDemo returns steps.
2026-10-24 00:39 · 11 · portfolio-screen · DONE · /portfolio-lab/desk (+/hu) live with kit frame, panels and F-keys; test:portfolio-desk 20/20; build, smoke and acceptance green; seo/layout only the shared baselines (sandbox, JS budget, sticky footer). 12 may start.
2026-10-24 00:40 · 12 · portfolio-help · CLAIM · Plan 12 claimed.
2026-10-24 00:50 · 16 · sandbox-hub · DONE · /sandbox + /hu/sandbox pre-rendered and in sitemap; test:sandbox 4/4; smoke + layout clean. test:seo initial-JS budget fails (992 KB vs 955 KB): pack-wide EN copy growth, for plan 18 / owner. Use your own ports for preview and layout-audit (4173 and DevTools 9340 are shared).
2026-10-24 00:52 · 14 · retirement-screen · CLAIM · Plan 14 claimed.
2026-10-24 00:42 · 03 · hedging-on-kit · CLAIM · Plan 03 claimed.
2026-10-24 00:52 · 12 · portfolio-help · CONTRACT · portfolio engine: PortfolioHistPoint gains w (risky weights held through the month; month 0 = opening weights). Additive; used by debrief attribution.
2026-10-24 00:52 · 12 · portfolio-help · DONE · Portfolio desk missions, debrief (attribution + policies), help tabs and P1 demo (seed 3) live; test:portfolio-desk 27/27; build + smoke + acceptance green in a temp worktree (shared tree red while 03 migrates the hedging desk).
2026-10-24 00:54 · 06 · alm-help · DEVIATION · Parallel builds share node_modules/.vite-seo: concurrent builds pre-render pages empty or with the wrong route (site-wide React #418). Rebuild when no other build runs and check the HTML before chasing it.
2026-10-24 00:54 · 06 · alm-help · DONE · ALM missions, debrief (records ALM_PROGRESS once), help tabs and 7-step demo (seed 1); test:alm-desk 25/25; smoke + layout clean. ALM desk complete.
2026-10-24 00:59 · 09 · rates-missions · DEVIATION · Rates demo is welcome/dv01Hedge/fiveDays/keyRate/toEnd/yourTurn (key-rate step narrates only: a real key-rate hedge breaks R1's cost limit). Tip for verifiers: when snapshotting the tree into a worktree, also delete files listed by `git ls-files -d` (plan 03 removed hedging files).
2026-10-24 00:59 · 09 · rates-missions · DONE · Rates desk missions screen, debrief with progress, three help tabs and six-step demo; test:rates-desk 25/25, build, smoke and layout green in a temp worktree.
2026-10-24 01:05 · 14 · retirement-screen · DONE · /tvm/desk + /hu/tvm/desk pre-rendered; test:retirement-desk 17/17; smoke + layout clean (layout-audit needs --wait 4000 while charts settle). RetirementDeskModel API for plan 15 in 14 Findings. Plan 15 may start.
2026-10-24 01:00 · 15 · retirement-help · CLAIM · Plan 15 claimed.
2026-10-24 01:02 · 03 · hedging-on-kit · DEVIATION · Kit left unchanged; the desk's demo focusId is null until the step's screen shows (the kit looks the element up once, so screen-switching steps need this). Mission briefing shows Instruments as a setup row; blotter and clock lose their extra aria texts. See 03 Findings.
2026-10-24 01:02 · 03 · hedging-on-kit · CONTRACT · Hedging progress is now HEDGING_PROGRESS (kit store, qs.game.hedging.progress.v1, { completed, best }); old qs.hedgingDesk.progress.v1 is imported once on first read/record inside the desk module (not on /sandbox). deskFormat.ts, matrixCells, meterPosition, the HedgingDeskDemo copy file and about 75 hd* keys were removed.
2026-10-24 01:02 · 03 · hedging-on-kit · DONE · Hedging Desk runs on src/components/game; test:hedging-desk 78/78, test:game-kit 14/14, tsc/eslint clean, build + smoke + help/demo probes green in a temp worktree; src 4,526 -> 3,487 lines, SCSS 1,613 -> 262.
2026-10-24 01:10 · 15 · retirement-help · CONTRACT · useRetirementUrl pins T1/seed 4 while demo is on and adds takeOver + demoSteps (RETIREMENT_DEMO_MISSION/SEED in demo/demo.script.ts).
2026-10-24 01:10 · 15 · retirement-help · DEVIATION · For plan 18: the kit looks up the demo-focus element once per step, so demo steps that switch screens (rates toEnd → debrief) get no outline; plan 03 worked around it in the hedging desk with a null focusId until the screen shows. Also the demo cannot open help tabs (useGameHelp is disabled during the demo).
2026-10-24 01:10 · 15 · retirement-help · DONE · Retirement missions, debrief, help tabs and six-step demo; test:retirement-desk 23/23; build, smoke and layout clean in a temp worktree. Retirement desk complete.
2026-10-24 01:11 · 18 · final-qa · CLAIM · Plan 18 claimed.
2026-10-24 01:11 · 18 · final-qa · CLAIM · Plan 18 claimed.
2026-10-24 01:11 · 18 · portfolio-desk session · DEVIATION · Duplicate claim race on 18 (two CLAIM lines at 01:11); this session withdraws and runs nothing. 18 belongs to the other final-qa session.
2026-10-24 01:27 · 18-side · lazy-desk-copy · CLAIM · Taking the initial-JS budget fix: desk copy tables load lazily per desk (touches src/Language/index.*.ts, languageLoader). Plan 18: please leave these files to me until DONE.
2026-10-24 01:34 · 18-side · lazy-desk-copy · CONTRACT · Desk + Sandbox copy moved to src/Language/desks.en.ts / desks.hu.ts (not in index.*). New desk tables go THERE. TranslationKey = BaseKey | DeskKey. Desk routes load copy via languageLoader.withDeskCopy(() => import(...)); entry-prerender loads it per language. Tests reading desk keys must merge desksEn/desksHu (see hedging-desk-help-advice.test.mjs). 
2026-10-24 01:34 · 18-side · lazy-desk-copy · DONE · test:seo initial JS 944,585 B ≤ 955,000 B (was 1,040,730); all desk/kit/sandbox/home tests green; smoke clean on every desk + Sandbox, EN and HU, direct load and client navigation.
2026-10-24 01:40 · 18 · final-qa · DONE · Pack verified: tsc clean, all 12 test suites green, build + smoke clean, layout clean except the known footer overlap and a.brand; per-desk play-through recorded. Fixed: hedging Sandbox link, Sandbox table overflow and tap targets. Open: initial-JS budget (1,040,692 vs 955,000 B), save-on-debrief vs save-on-settle, demo focus on screen-switching steps. Owner list in 18 Findings.
