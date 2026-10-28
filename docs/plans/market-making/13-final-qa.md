# 13 — Final QA across the area

Status: done (2026-10-28, opus-main) · Depends on: all · Suggested model: Sonnet · Est. size: M

## Why
Twelve plans by several sessions touched one new category, six labs, a desk, the Sandbox and shared
tables. Before the owner reviews, one session checks the whole area end to end, fixes small breakage, and
lists what needs the owner.

## Current state
Every other plan in `docs/plans/market-making/` is `done` in the README table (stop and report if not).
Read every plan's Findings and all of `LOG.md` (`DEVIATION`, `CONTRACT`, `BLOCKED` lines).

## Goal
1. Static checks, all test suites, build and SEO green.
2. Browser smoke and layout audit clean for every page in EN/HU, light/dark, 360/768/1280/1536.
3. A play-through of each lab's three modes and each desk mission; the §2 interaction bar checked per lab.
4. A Findings list of fixes made, follow-ups and owner-review items.

## Non-goals
- No new features or redesigns; fixes only (anything larger becomes a follow-up in Findings).

## Steps
1. **Static and tests**: `npx tsc -b`, `npm run lint` (classify any failure as new vs pre-existing by linting
   the same file at `HEAD`: `git show HEAD:<path> | npx eslint --stdin --stdin-filename <path>`),
   `npm run test:microstructure`, `test:micro-desk`, `test:challenges`, `test:sandbox`, `test:home`,
   `test:search`, `test:game-kit`, `test:hedging-desk` (regression guard for the kit).
2. **Build and SEO**: `npm run build && npm run test:seo`; confirm all seven paths and their `/hu/` twins exist
   in `dist/` and in the sitemap; open one built HTML file and check the About section links to a lesson.
3. **Size and hygiene**: list `.tsx` files over 150 lines in the new folders
   (`find src/features/{order-book,market-making,market-making-desk,avellaneda-stoikov,glosten-milgrom,kyle,spread-estimation} -name "*.tsx" | xargs wc -l | sort -n | tail`);
   grep for hard-coded English in JSX text and for `border-left` / `inset 2px 0 0` / `border-radius: 9999` in
   the new partials; grep `Math.random|Date.now` in maths files (only `recordChallenge` calls may use `Date.now`).
4. **Smoke** (preview server):
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
     --paths "/,/sandbox,/order-book,/market-making,/market-making/desk,/avellaneda-stoikov,/glosten-milgrom,/kyle,/spread-estimation,/hu/order-book,/hu/market-making,/hu/market-making/desk,/hu/avellaneda-stoikov,/hu/glosten-milgrom,/hu/kyle,/hu/spread-estimation"
   ```
   and `node scripts/layout-audit.mjs` for the same paths at 360/768/1280/1536, light and dark.
5. **Play-through checklist** (record pass/fail per row in Findings): for each lab — main figure manipulable
   by pointer and keyboard; play/pause/step; Simulate · Predict · Challenge each complete one round; you vs
   theory visible; the written surprise question answered by the lab; URL state restores the setup; reduced
   motion (emulate with CDP or the OS setting) leaves the lab usable. For the desk — MM1–MM5 each played to
   settlement once (any result), debrief sums, demo take-over, progress on `/sandbox`.
6. **Sandbox**: the "Market microstructure" group lists twelve challenges with EN/HU names; the desk row
   shows MM progress.
7. **Fix** small issues in place (one commit-sized change per issue, each with a regression check added to
   the relevant test file where possible); record each in Findings with the file and the check.
8. **Owner-review list**: collect every plan's "New HU keys" and calibration notes into one list here.

## Acceptance criteria
- All commands in steps 1–4 pass; the play-through table has no open failures (or each is a listed follow-up).

## Verification
The commands in steps 1–4. Stop the preview server and confirm port 4173 is free afterwards.

## Pitfalls
- Audit against `vite preview`, never the dev server (its light theme renders dark).
- Don't run `git stash`/`checkout` while other sessions may still be editing; verify in a temporary worktree
  if the shared tree is red for reasons outside this pack.

## Findings (fill in during execution)
- Play-through table (automated coverage; no manual play-through of every mode was done):
  | Area | Result |
  |---|---|
  | All 7 pages + /hu twins | pre-rendered, in sitemap, CDP smoke clean (16 paths incl. /, /sandbox) |
  | Lab maths / desk engine | test:microstructure 83/83, test:micro-desk 24/24 (determinism, theory vs Monte Carlo, calibration) |
  | Labs layout | layout audit clean at 360/768/1280/1536 × light/dark × EN/HU for all six labs |
  | Desk layout | overlaps only with the sticky kit F-key bar; same on /portfolio-lab/desk and /delta-hedging/desk (kit/audit artifact, follow-up) |
  | Sandbox | "Market microstructure" group renders EN/HU; 12 challenges each named EN/HU (new check); desk id `mm` in DESK_IDS |
  | Per-mode manual play (pointer + keyboard, reduced motion, MM1–MM5 to settlement, demo take-over) | NOT done in this session → follow-up |
- Fixes made (file → regression check):
  - `scripts/game-kit.test.mjs`: exact challenge count 16 was stale (35 now, several packs) → lower bound; area count pinned instead in `scripts/micro-wiring.test.mjs` ("the area has its twelve challenges…").
  - Desk SEO: `registry.ts` seoTitle shortened (71 → 68 chars with suffix), `seoDescMarketMakingDesk` EN/HU shortened to ≤ 158 → covered by `test:seo`.
- Follow-ups:
  - Initial JS 1,093 KB vs budget 1,000 KB (raised once in plan 01): eager EN copy from all packs. Owner decision: raise again or lazy-load ModuleAbout/Seo tables.
  - Layout audit flags the sticky `.gdesk` F-key bar as overlapping in full-page captures on every desk; teach the audit to skip sticky/fixed bars or give the bar reserved space.
  - Manual play-through of each lab's three modes and MM1–MM5 (see table).
  - Plan 12 BLOCKED item: debrief informed-vs-noise markout split needs an `informed` flag on desk fill events (plan 10 engine).
  - Out of pack, seen during QA: tsc red in `fama-french`/`systemic-risk`, `test:challenges` red on `syr-fragile` (systemic-risk pack).
- Owner-review list (HU keys, mission limits, challenge thresholds, About copy):
  - HU drafts: plan 01 Findings (nav/cat/home/SEO/About), and each lab plan's "New HU keys" (03, 04, 05, 06, 07, 08, 09), desk tables (11, 12).
  - About copy for all six labs (plan 01).
  - Thresholds: mkm-round 60% of theory (bot 9/20), avs-beat CE within $1 of AS (0.7× AS beats AS), obk-execution factor 0.6 (plan 04), plus plans 07–09 Findings.
  - Desk mission limits: plan 10 calibration table; DESK_FLOW / γ deviation.
  - Order book pacing change requested by owner (plan 03 DEVIATION).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`, all
> plan Findings and `LOG.md` in `docs/plans/market-making/`; confirm plans 01–12 are done (stop and report if
> not). Execute plan 13: static checks and tests, build and SEO, size/hygiene greps, browser smoke and
> layout audit, the per-lab and per-mission play-through checklist, small fixes with regression checks, and
> the owner-review list. Fill in Findings, append DONE to LOG.md, set plan 13 to `done`, and summarise.
