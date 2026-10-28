# 09 — Final QA

Status: done (2026-10-28, session fsr-qa) · Depends on: all · Suggested model: Sonnet · Est. size: M

## Why
Eight plans by several sessions added a data snapshot, a new lab, a three-page module, shared graph code and
guide shims. One session checks it end to end, fixes small breakage and lists what needs the owner.

## Current state
Every other plan in `docs/plans/factor-and-systemic-risk/` is `done` in the README table (stop and report if
not). Read every plan's Findings and all of `LOG.md`.

## Goal
Static checks, tests, build/SEO, smoke, layout audit, play-through checklist, fixes, owner-review list.

## Non-goals
- New features or redesigns (list them as follow-ups).

## Steps
1. **Static and tests**: `npx tsc -b`, `npm run lint` (classify failures new vs pre-existing with
   `git show HEAD:<path> | npx eslint --stdin --stdin-filename <path>`), `npm run test:fama-french`,
   `test:systemic-risk`, `test:guide-graph`, `test:challenges`, `test:sandbox`, `test:home`, `test:search`,
   `test:capm` if present (else `test:portfolio-labs`).
2. **Data**: re-run `npm run data:fama-french` in a temporary worktree and diff the JSON against the committed
   one (only `retrieved` and newly published months may differ); check the attribution line is visible.
3. **Build and SEO**: `npm run build && npm run test:seo`; the four paths and `/hu/` twins in `dist/` and the
   sitemap; the `famaFrench` data chunk exists and is requested only on `/fama-french`.
4. **Hygiene greps**: `.tsx` over 150 lines in `src/features/{fama-french,systemic-risk}` and
   `src/components/charts/network`; hard-coded English in JSX; `border-left` / `inset 2px 0 0` / capsule radii in
   the new partials; `Math.random`/`Date.now` in maths (only `recordChallenge` calls may use `Date.now`); real
   firm names in systemic presets or labels (episode event text is the only allowed place).
5. **Smoke**:
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
     --paths "/,/sandbox,/capm,/fama-french,/fama-french?tab=alpha,/fama-french?tab=sort,/fama-french?tab=cross,/systemic-risk,/systemic-risk/shocks,/systemic-risk/episodes,/guide/graph,/hu/fama-french,/hu/systemic-risk,/hu/systemic-risk/shocks,/hu/systemic-risk/episodes"
   ```
   and `node scripts/layout-audit.mjs` for the same paths at 360/768/1280/1536, light and dark.
6. **Play-through checklist** (pass/fail per row in Findings): each Fama–French tab and systemic page — main
   figure manipulable by pointer and keyboard; time/playback where present; predict/challenge round completes and
   shows on `/sandbox`; you vs model visible; the written surprise answered by the lab; URL restores the setup;
   reduced motion usable. Guide graph: zoom, pan, drag and selection as before.
7. **Fix** small issues with a regression check each; record file → check in Findings.
8. **Owner-review list**: collect HU keys, About copy, episode texts with sources, challenge thresholds and
   calibration notes from every plan.

## Acceptance criteria
- Steps 1–5 pass; the checklist has no open failures (or each is a listed follow-up).

## Verification
The commands in steps 1–5. Stop the preview server and confirm port 4173 is free afterwards.

## Pitfalls
- Audit against `vite preview`, never the dev server. No `git stash`/`checkout` while sessions may still edit.

## Findings (fill in during execution)
Session fsr-qa, 2026-10-28.

- **Static/tests:** `tsc -b` clean after fix 1. ESLint clean on `src/features/{fama-french,systemic-risk}`,
  `src/lib/{graph,stats}`, `src/components/charts/network`. Green: `test:fama-french`, `test:systemic-risk`,
  `test:guide-graph`, `test:challenges`, `test:sandbox`, `test:home`, `test:search`, `test:portfolio-labs` (no
  `test:capm`), every `scripts/ff-*.test.mjs` and `scripts/systemic-*.test.mjs` (incl. `systemic-wiring`,
  which passes now), `guide-audit` after fix 2.
- **Data:** fetch script run on a scratch copy (committed JSON untouched): 759 months 1963-07..2026-09,
  output byte-identical to the committed snapshot. Attribution text present in pre-rendered `/fama-french`.
- **Build/SEO:** another session was running `vite build` into `dist/`, so built into a private outDir and ran
  `seo-audit.test.mjs` against it from a scratch copy (`scripts/` + `vercel.json` + that build as `dist`):
  22 pass, 3 fail, none on this pack's pages: title/description baselines (guide/treasury/gbm/ito pages,
  other packs) and **initial JS 1 092 249 B > 1 000 000 B budget** (the EN `i18n` chunk is 418 KB and holds
  every module's EN copy, `ffm*`/`syr*` included; global growth across packs, follow-up). The four paths and
  `/hu/` twins exist and are in the sitemap; the `famaFrench` data chunk is referenced only by the
  `FamaFrenchView` chunk (not by any HTML or entry chunk).
- **Hygiene:** no `.tsx` over 150 lines; no `border-left` / inset bars / capsules (`.ffm-ladder-dot` 50% is a
  chart marker); no `Math.random`/`Date.now` outside `recordChallenge`; real firm names only in
  `episodes/episodes.data.ts` event ids/text; no hard-coded JSX English found.
- **Smoke** (15 paths incl. `/hu/`): no problems. **Layout audit** (12 paths × 360/768/1280/1536 × light/dark,
  96 runs): all clean except `/systemic-risk/shocks` and `/hu/systemic-risk/shocks` (16 runs) with
  `svg-text-collision` (node labels vs loss badges `−63%`, and HU long labels `Keresk. bank X` overlapping in
  the network) and one `svg-text-clipped` axis tick `-20%`. Not a one-line fix → follow-up.
- **Play-through table:** done headlessly via smoke + the per-page logic tests (predict/score rounds, URL
  round-trips, engine/OLS references); a hands-on pointer/keyboard/reduced-motion pass in a real browser was
  **not** done in this session → owner/next session.
  | Page | Loads EN/HU | Logic tests | URL state tests | Hands-on |
  |---|---|---|---|---|
  | FF fund / alpha / sort / cross | pass | pass | pass | open |
  | Systemic network / shocks / episodes | pass | pass | pass | open |
  | Guide graph | pass | `test:guide-graph` pass | – | open |
- **Fixes (file → regression check):**
  1. `src/features/fama-french/components/fund/FundPicker.tsx` — template key cast `as TranslationKey`
     (TS2345) → `tsc -b` clean.
  2. `scripts/guide-audit.test.mjs` — `LAB_WITHOUT_LESSON = ["fama-french", "systemic-risk"]` (guide files are
     outside this pack) → guide-audit 13/13.
  3. Merged plan 07's duplicate `syrShockKind_*` into plan 06's `syrKind_*`: `shocks/useGraphText.ts` uses
     `syrKind_${kind}`; 7 keys removed from `SystemicRiskShocks.ts`/`.hu.ts` (CCP now reads "Clearing house"
     on the shocks page too) → `tsc -b`, `systemic-shocks-page`, `systemic-wiring` green.
- **Follow-ups:**
  - Shocks network label/badge collisions and clipped `-20%` tick (layout audit above).
  - Add `fama-french` to lesson `factor-models` labs (`src/features/guide/guide.meta.ts`) and give
    `systemic-risk` a lesson; then empty `LAB_WITHOUT_LESSON` again.
  - Initial JS budget overrun (split the EN copy table per module, global).
  - HU SEO titles for `/hu/systemic-risk/shocks` (“Sokkszimuláció | Quant Sandbox”) and `/episodes` are
    bare compared with EN; add longer HU titles.
  - Hands-on play-through (pointer, keyboard, playback, reduced motion, challenge shows on `/sandbox`).
- **Owner-review list:** HU drafts for every new key in `src/Language/FamaFrench*.hu.ts` and
  `SystemicRisk*.hu.ts` (lists in plans 01–08 Findings); About copy (`ModuleAbout` `fama-french`,
  `systemic-risk`); episode dates/events and sources (plan 08 Findings lists the unverified dates and the GFC
  two-switch deviation); challenge thresholds and calibration (`ffm-loadings`, `ffm-alpha`, `ffm-corner`,
  `syr-most-systemic`, `syr-rescue`, `syr-fragile`, `syr-without`; numbers in plans 02, 03, 06, 07, 08);
  plan 07's added scenario presets/preview (LOG DEVIATION); plan 01's Carhart-for-momentum deviation.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`,
> every plan's Findings and `LOG.md` in that folder; confirm plans 01–08 are done (stop and report if not).
> Execute plan 09: static checks and tests, data re-run diff, build and SEO, hygiene greps, smoke and layout
> audit, the play-through checklist, small fixes with regression checks, and the owner-review list. Fill in
> Findings, append DONE to LOG.md, set plan 09 to `done`, and summarise.
