# 08 — Historical episodes page

Status: done (2026-10-28, session ea82) · Depends on: 04, 05 · Suggested model: Sonnet · Est. size: M

## Why
Theory lands when it is tied to events the reader has heard of. This page replays four real crises on a
**stylised** network: the reader walks through the real timeline, the model plays the matching shocks and
interventions, and switches let them remove an intervention ("no liquidity facilities", "no deposit
guarantee") to see the model's counterfactual. Every chart is labelled as a stylised model, and no figures
are attached to real firms (owner decision).

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 04: stub `src/features/systemic-risk/pages/EpisodesPage.tsx` (yours), copy table
  `src/Language/SystemicRiskEpisodes.ts`/`.hu.ts` (prefix `syrEp`), partial `src/styles/_systemic-risk-episodes.scss`,
  `NetworkGraph` chart, shared URL keys (`net`, `seed`, `edits`; this page ignores `edits`).
- After plan 05: `engine/systemic.types.ts` (`Shock` incl. `run` with `deposits`/`shortFunding`; `Intervention`
  kinds `capital`, `liquidity`, `guarantee`, `parLending`, `assetPurchases`), `simulate`, `presetNetwork`,
  `DEFAULT_PARAMS`. Read plan 05's Findings.
- Primitives: `usePlayback`/`PlaybackControls`, `LineChart`, `usePinnedSeries`, `SwitchRow`, `SegmentedControl`,
  `PredictReveal`/`usePredictReveal`, `PredictExplain`, `ChallengeRecord`, `StatCard`.

## Goal
1. Four episodes, each with a real-date event timeline, a stylised network, a scripted model run, and
   intervention switches with an as-happened vs what-if comparison.
2. Predict `syr-without` (guess).

## Non-goals
- No historical market data series (no LIBOR–OIS, no index levels); only model outputs.
- No balance-sheet figures for real firms; event text may name firms and public programmes.

## Steps
1. **Episode data** (`episodes/episodes.data.ts`, pure): `type Episode = { id; net: "core-periphery" | "starter";
   seed: number; params?: Partial<SimParams>; events: EpisodeEvent[]; switches: EpisodeSwitch[] }`, `EpisodeEvent =
   { date: "YYYY-MM-DD"; key: string /* copy key */; day: number /* model day */; shocks: Shock[]; interventions:
   Intervention[] }`, `EpisodeSwitch = { key: string; interventions: string[] /* event keys whose interventions
   it removes */ }`. Model actors are archetypes ("the troubled investment bank", "the large insurer", "a prime
   money market fund", "the leveraged macro fund", "a regional bank with long bonds"); pick them by kind/tag in
   the preset. Events (verify every date against a primary source — Fed, FDIC, Treasury, BIS press releases —
   and list the sources in Findings; if a date differs, use the source):
   - **gfc** (2007–2009): 2007-08-09 BNP Paribas freezes three funds, interbank stress begins (short-funding run
     on dealers); 2008-03-16 Bear Stearns rescued in a Fed-assisted sale (capital to the troubled dealer); 2008-09-07
     Fannie Mae and Freddie Mac placed into conservatorship (MBS price shock); 2008-09-15 Lehman Brothers files for
     bankruptcy (default of the troubled investment bank, no rescue); 2008-09-16 Fed lends to AIG (capital to the
     insurer); 2008-09-16 the Reserve Primary Fund breaks the buck (MMF fails, repo run); 2008-10-03 TARP enacted
     (capital to banks); late 2008 Fed liquidity facilities (liquidity). Switches: "No AIG loan", "No TARP", "No
     liquidity facilities".
   - **ltcm** (1998): 1998-08-17 Russia devalues and defaults on domestic debt (spread shock to corp/equity held
     by the macro fund); late Aug–Sep 1998 LTCM's losses mount (fire sales by the leveraged fund); 1998-09-23 a
     private recapitalisation by 14 banks organised by the New York Fed (capital); 1998-09-29, 10-15, 11-17 Fed rate
     cuts (liquidity). Switch: "No recapitalisation".
   - **covid2020** (March 2020): early-to-mid March "dash for cash", Treasury market stress (gov price shock and
     funding runs on funds); 2020-03-15 Fed cuts to 0–0.25% and announces Treasury/MBS purchases (assetPurchases);
     2020-03-17/18 CPFF, PDCF and MMLF announced (liquidity); 2020-03-23 open-ended purchases and corporate credit
     facilities (assetPurchases corp). Switch: "No Fed purchases", "No liquidity facilities".
   - **svb2023** (March 2023): 2023-03-08 SVB announces a loss on securities sales and a capital raise; 2023-03-09
     a large deposit run (run on the regional bank's deposits); 2023-03-10 SVB placed into FDIC receivership;
     2023-03-12 Signature Bank closed, systemic-risk exception (guarantee) and the Bank Term Funding Program
     (parLending); 2023-03-19 UBS agrees to acquire Credit Suisse; 2023-05-01 First Republic seized and sold.
     Switches: "No deposit guarantee", "No par lending (BTFP)".
2. **Copy** (`SystemicRiskEpisodes.ts`): per episode a title, period, two-sentence summary and a "what the model
   shows" sentence; per event a short title and 1–2 factual sentences; switch labels; a fixed caption "Stylised
   model: archetype institutions, illustrative numbers". HU drafts follow the glossary; list them for review.
3. **Maths** (`episodes/episodes.math.ts`): `episodeRun(ep, removed: Set<string>)` → `SimResult` (collect shocks
   and interventions from events, drop removed ones, `simulate`); `eventAtDay(ep, day)`; `counterfactualDelta(ep,
   switchKey)` → `{ defaults, totalLoss }` difference.
4. **Hook/UI** `useEpisodesPage.ts` + `episodes.url.ts` (`ep`, `off` = comma list of switch keys, `day`):
   - `EpisodePicker.tsx` — four rows (title + period), selected row with a background tint.
   - `EpisodeTimeline.tsx` — vertical list of events with date and title; the current event (by playback day)
     tinted; click an event to jump; arrow keys move between events.
   - `EpisodeGraph.tsx` — `NetworkGraph` showing statuses at the cursor day, the actor of the current event
     selected, and a one-line caption naming the archetype ("Troubled investment bank — stands in for Lehman
     Brothers in this episode").
   - `WhatIfPanel.tsx` — `SwitchRow` per intervention switch; changing one re-runs; `CompareChart.tsx` overlays
     defaults and total losses over days for "as happened (model)" and the current what-if (pinned runs for
     more); a delta line ("Without the AIG loan the model has 4 more failures").
   - `EventDetail.tsx` — the current event's text.
5. **Predict `syr-without`** (guess): "In the model, how many institutions fail without {{switch}}?" — the reader
   types a number; `usePredictReveal({ truth, tolerance: 2, resetKey: ep + switch, challengeId: "syr-without" })`.
   `PredictExplain`: "In 2023, the run was on deposits, not on interbank loans. Which tool stopped it in the
   model?" (*the deposit guarantee; par lending removed the need to sell bonds at a loss*).
6. **View** (`pages/EpisodesPage.tsx`, compose only): `PageHeader` (+ Reset); `Workspace columns="thirds"`:
   picker + timeline | graph + playback + event detail (dominant) | what-if + compare chart.
7. **Wiring**: append `{ id: "syr-without", area: "portfolio", moduleId: "systemic-risk", kind: "guess",
   tolerance: "±2 failures" }`; `sbxCh_syr-without` "Crisis without the rescue" / HU "Válság mentés nélkül". If
   plans 06 and 07 are both `done`, set the registry `status` to `"beta"`.
8. **Tests** `scripts/systemic-episodes.test.mjs`: every event date parses and events are in date order; each
   episode's model run is deterministic; removing each switch changes the result in the intended direction
   (more failures or more loss; record numbers; if a switch has no effect, change the episode script, not the
   test); no balance-sheet numbers appear in episode copy (regex for `\$\d` or `bn` near firm names — keep public
   programme names only).

## Acceptance criteria
- Each episode plays end to end; clicking an event jumps the model; every switch changes the comparison.
- Captions mark all charts as stylised; Findings list sources for every date.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:systemic-risk && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/systemic-risk/episodes,/systemic-risk/episodes?ep=svb2023,/systemic-risk/episodes?ep=gfc&off=noAig,/hu/systemic-risk/episodes?ep=ltcm"
node scripts/layout-audit.mjs   # /systemic-risk/episodes at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Model day vs calendar date:** episodes span months or years; map events to model days in order and show the
  real date in copy, never a fake "day 18 = 15 Sep" precision claim.
- **Historical accuracy is owner-review content:** draft the event texts, list them with sources in Findings,
  and keep them short and factual.
- **No invented firm figures** (owner decision): don't write dollar amounts next to firm names.

## Findings (filled in 2026-10-28, session ea82)
- **Event sources (date -> source).** Verified against Federal Reserve / FDIC pages fetched on 2026-10-28:
  2008-03-16 Bear Stearns/JPMorgan financing and Primary Dealer Credit Facility (federalreserve.gov/newsevents/pressreleases/monetary20080316a.htm);
  2008-09-16 Fed authorises the AIG loan (.../other20080916a.htm); 2008-10-03 EESA/TARP statement (.../other20081003a.htm);
  2008-10-07 Commercial Paper Funding Facility announced (.../monetary20081007c.htm);
  1998-08-17 Russia, 1998-08-21 worst LTCM losses, 1998-09-23 fourteen firms recapitalise LTCM, Fed did not lend (federalreservehistory.org/essays/ltcm-near-failure);
  2020-03-15 cut to 0-1/4% plus Treasury/MBS purchases (.../monetary20200315a.htm); 2020-03-17 CPFF (.../monetary20200317a.htm); 2020-03-23 open-ended purchases and corporate facilities (.../monetary20200323b.htm);
  2023-03-10 SVB closed, FDIC receiver (fdic.gov/news/press-releases/2023/pr23016.html); 2023-03-12 BTFP at par and depositors of both banks protected (.../monetary20230312a.htm).
  **Not verified against a primary source, from memory, owner please check:** 2007-08-09 BNP Paribas freezes three funds; 2008-09-07 FHFA conservatorship; 2008-09-15 Lehman Chapter 11; 2008-09-16 Reserve Primary Fund breaks the buck; 2008-10-10 "stock markets fall sharply in the week to 10 October" (wording is deliberately vague); 1998-09-29/10-15/11-17 Fed cuts; 2020-03-09 date of the first stock-market halt (the page says only "trading is halted"; the event is dated 2020-03-09, the dash for cash ran over the following days) and the 2020-03-18 MMLF ("follows the next day" in copy); 2023-03-08 SVB announcement and 2023-03-09 run; 2023-03-12 Signature Bank closure by New York regulators; 2023-03-19 UBS/Credit Suisse; 2023-05-01 First Republic (sold to JPMorgan). The Fed page for 2023-03-12 does not use the words "systemic risk exception", so the copy does not either.
- **Switch effects (core-periphery seed 1 unless noted; as happened = defaults / total loss in $bn, illustrative):**
  gfc (CCP channel off, 2008 derivatives were mostly bilateral): 2 / 64.1. Without AIG loan: 2 / 65.3 (+1.2 loss); without TARP capital: 9 failures / 83.3; all switches off: 11 / 89.0.
  ltcm: 0 / 31.3; without the recapitalisation: 0 / 33.0 (+1.7 loss).
  covid2020: 0 / 23.1; without Fed purchases: 0 / 27.8 (+4.7); without lending facilities: 2 failures (both money market funds) / 22.7; all off: 2 / 29.5.
  svb2023 (core-periphery, not starter): 1 / 30.5; without deposit guarantee: 6 / 46.4; without par lending: 1 / 31.2 (+0.7, the weakest switch effect).
  Interventions only help while stress is still running, so days are compressed (a few model days between events) and the stress waves continue past the rescue events. Several first attempts (late interventions, runs on dealers) had no effect at all: dealers are very robust to funding runs in the engine (deleveraging repays their short funding early, gov depth is 400).
- **New HU keys for owner review:** all 126 keys of `src/Language/SystemicRiskEpisodes.hu.ts` (drafts), especially episode summaries and event texts (`syrEpEp_*`, `syrEpEv_*`), switch names (`syrEpSw_*`) and `syrEpDelta`. Added `sbxCh_syr-without` HU "Válság mentés nélkül".
- **Deviations:**
  - GFC has two switches (AIG loan, TARP capital), not three: the planned "No liquidity facilities" had no effect in the right direction (the CPFF event, 2008-10-07, remains in the timeline and runs as a non-switchable liquidity intervention). A deposit guarantee would have overlapped with TARP, so the 2008-09-19 Treasury money market guarantee was left out.
  - Event shape: `EpisodeEvent` has `role`, optional `actor`, no `switch`; `EpisodeSwitch.events` lists event keys. Copy keys are `syrEpEv_<key>_title|text|actor`, `syrEpSw_<switchKey>`, `syrEpRole_<role>`; switch keys are `noAig noTarp noRecap noPurchases noFacilities noGuarantee noPar` (URL `off=`). `day` defaults to 60 (the end) so the pre-rendered page shows the full run.
  - SVB uses the `core-periphery` network (six regional banks), not `starter`; the regional bank is `r1`, and the receivership is a scripted default of `r1`. The fund-recapitalisation in 1998 goes to `h1` only.
  - The `syr-without` explain step (deposit guarantee vs par lending vs capital) shows only for the 2023 episode; the other episodes ask only the number.
  - Graph labels are short ids ("D3") with a one-line key under the graph: 30 full-name labels collided at every width in the layout audit.
  - Reuses `graphNodes`/`graphEdges` from plan 07's `shocks/shockGraph.logic.ts`; if that moves, change one import in `EpisodeGraph.tsx`.
  - `registry.ts` status set to `"beta"` (plans 06 and 07 are done).
- **Verification:** `tsc -b` clean apart from `fama-french/.../FundPicker.tsx` (plan 02/03 work); eslint clean on touched files; `test:systemic-risk` engine/episodes/wiring/chart, `test:challenges`, `test:sandbox`, `test:home` green. Built to `node_modules/.p-sys08` (the SEO prerender wrote the pages; `test:seo` itself reads a hard-coded `dist/` and could not be run there, so the prerendered page was counted by hand with the test's own `visibleText`/`wordCount`: 490 words EN, 465 HU, above the 400 floor). `cdp-smoke` clean on the four planned paths; a scripted click on a timeline event plus a "Without TARP capital" toggle moved the day to 24, updated the URL and showed "9 failures instead of 2". `layout-audit` at 360/768/1280/1536, light and dark, EN and HU: no failures, only tap-target warnings at 360 (SwitchRow, zoom buttons, slider; shared components). Server stopped, outDir deleted.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/08-historical-episodes.md`; confirm
> plans 04 and 05 are done and read their Findings. Implement plan 08: four stylised crisis episodes (GFC, LTCM,
> March 2020, SVB) with real-date timelines verified against primary sources, scripted model runs, intervention
> switches with an as-happened vs what-if comparison, the `syr-without` predict and tests. Never attach figures
> to real firms. Run the verification block, fill in Findings (with sources), append DONE to LOG.md, set plan 08
> to `done`, and summarise.
