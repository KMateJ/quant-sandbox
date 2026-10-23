# 08 — Final QA: widths, languages, accessibility, owner review list

Status: done (2026-10-23) · Depends on: 01–07 · Suggested model: Sonnet · Est. size: S

## Why
Seven plans built the desk in parallel. This plan checks the whole thing once, the way a user meets
it: every screen at phone to wide-desktop widths, in English and Hungarian, by keyboard. It also
confirms that the existing lab is untouched, and collects everything the owner must review.

## Current state (verified 2026-10-23)
- The desk lives at `/delta-hedging/desk` (`?screen=desk|missions|debrief`, `?m=M1…M5`, `?seed=`).
- Code: `src/features/hedging-desk/**`, `src/features/delta-hedging/DeltaHedgingPages.tsx`, registry entry
  `delta-hedging` in `src/modules/registry.ts`, tables `src/Language/HedgingDesk*.ts`, partials
  `src/styles/_hedging-desk*.scss`, tests `scripts/hedging-desk-*.test.mjs`.
- Tools: `scripts/cdp-smoke.mjs` (`--help` lists `--paths`, `--after`, `--ignore`),
  `scripts/layout-audit.mjs` (`--paths`, widths 360/768/1280/1536, both themes).
- Lab files that must be byte-identical to commit `b0f23d3`: `src/features/delta-hedging/DeltaHedgingView.tsx`,
  `useDeltaHedging.ts`, `deltaHedging.math.ts`, `deltaHedging.types.ts`, `deltaHedging.url.ts`,
  `components/*`, and `src/styles/_delta-hedging.scss`.

## Goal
1. Every check below passes, or each failure is fixed here (small fixes) or written up (larger ones).
2. A single owner-review list in Findings: all HU drafts from plans 02–07, the mission limits to tune,
   and any deviation recorded in other plans' Findings.

## Non-goals
- No new features, no redesign. Fixes stay inside the hedging-desk files, never in the lab files.

## Constraints
- Fixes must respect README §4 (150-line `.tsx`, i18n, tokens, no pills, no left borders).

## Steps
1. Read every plan's Findings and the README status table; all of 01–07 must be `done`.
2. Run the full suite:
   ```bash
   npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs && npm run test:url-state
   npm run build && npm run test:seo && npm run test:seo-schema && npm run test:language-routes
   git diff --quiet b0f23d3 -- src/features/delta-hedging/DeltaHedgingView.tsx src/features/delta-hedging/useDeltaHedging.ts \
     src/features/delta-hedging/deltaHedging.math.ts src/features/delta-hedging/deltaHedging.types.ts \
     src/features/delta-hedging/deltaHedging.url.ts src/features/delta-hedging/components src/styles/_delta-hedging.scss \
     && echo "lab untouched"
   ```
3. Browser checks against `vite preview`:
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   P="/delta-hedging,/delta-hedging/desk,/delta-hedging/desk?screen=missions,/delta-hedging/desk?screen=debrief,/delta-hedging/desk?m=M3,/delta-hedging/desk?m=M5"
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "$P,/hu/delta-hedging/desk,/hu/delta-hedging/desk?screen=debrief"
   MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "$P,/hu/delta-hedging/desk"
   ```
   Then a click-through with `--after`: on M1 click Underlying → Buy → 500 → submit, F2 ×3, F4,
   F5 (+21) ×3 to expiry, open Debrief. Expect no console errors and the debrief "Your run" row to
   equal the desk P&L.
4. Checks by reading code (grep):
   - no `.tsx` over 150 lines: `find src/features/hedging-desk -name "*.tsx" | xargs wc -l | sort -n | tail`
   - no hex colours in `.tsx`: `grep -rnE "#[0-9a-fA-F]{3,6}\b" src/features/hedging-desk --include=*.tsx`
   - no English literals in JSX: inspect `grep -rnE ">[A-Z][a-z]+ " src/features/hedging-desk --include=*.tsx`
   - no `border-left` in the partials: `grep -n "border-left\|inset [0-9]px 0 0" src/styles/_hedging-desk*.scss`
   - every `hd*` key exists in both EN and HU tables (write a 10-line node script comparing the keys of
     each `HedgingDesk*.ts` pair).
5. Accessibility spot checks: one `h1`; panel titles are headings; every input has a label; the
   ticket, chain and function keys are reachable by Tab in visual order; status words accompany colour
   everywhere (objectives, verdict, band tag).
6. Theme: switch the site to light; the desk stays dark and readable, the shell turns light, and nothing
   inside `.hdesk` inherits light tokens.

## Acceptance criteria
- All commands in steps 2–3 pass; "lab untouched" printed.
- Layout audit: zero overlaps on desk screens at all four widths, both site themes, EN and HU.
- Findings holds the owner-review list.

## Verification
The commands in Steps 2–4. Stop the preview server and confirm port 4173 is free.

## Pitfalls
- Audit on `vite preview`, not the dev server (the dev server's StrictMode theme race makes light runs
  dark).
- Query-string pages are not pre-rendered; their first paint is the client render. That is expected.
- HU strings are longer; check the function-key bar and ticket rows at 360px in HU specifically.

## Findings (fill in during execution)
- Results (2026-10-23, my-app-dd, vite preview):
  - Step 2: `tsc -b` clean; `test:hedging-desk` 40/40, `test:labs` 59/59, `test:url-state` 4/4, build OK,
    `test:seo` 25/25, `test:seo-schema` 7/7, `test:language-routes` 4/4; **lab untouched** printed.
    `npm run lint` fails only in files outside this pack, all unchanged since HEAD (AppShell, i18n, theme,
    heston, diffusion, payoff-lab, portfolio-lab).
  - Step 3: smoke clean on all 8 paths (EN desk/missions/debrief/M3/M5, lab, HU desk/debrief). Click-through
    (submit 500 sh, F2×3, F4, F5×3, Debrief): desk P&L −$4,339 = debrief "Your run" −$4,339, no console errors.
  - Layout audit (360/390/768/1024/1280/1536, light+dark): no defects in desk charts, side panels, missions or
    debrief. Still open: HU 768 `.hdesk-fkey-label` overlap in FunctionKeys; desk `.tab` buttons 28px high at
    360/390 (tap-target); site brand link 22px tall (site-wide, not desk). Lab `/delta-hedging` tap targets are
    pre-existing and hands-off.
  - Step 4: largest `.tsx` 81 lines; no hex in `.tsx`; no English JSX literals; no left-border rules; EN/HU key
    sets identical in all 6 `HedgingDesk*` tables (40/22/42/38/48/67 keys).
  - Steps 5–6: one `h1`; every panel has a heading; every input labelled; no positive tabindex (36 focusables
    in DOM order). Site switched to light: body light, `.hdesk` stays black.
- Fixes made: plan 04 audit fixes (see 04 Findings); my-app-6a added the fkey label wrap and 44px tabs below
  768px; I added 44px `.hdesk-cmd-btn` (Expand / Full screen) below 768px or on coarse pointers. Re-audit of 6
  desk pages × 6 widths × 2 themes: 48 clean, 24 flag only the site-wide brand link (22px, outside the desk).
- Late additions re-checked: F2–F9 keyboard shortcuts (my-app-c3) step the clock (D0 → D14 on F2,F2,F3) on the
  Desk screen; Expand toggles `hdesk--expanded` and Esc closes it. Six fresh smoke loads of EN/HU desk showed
  no React #418 and no console problems.
- Owner review list:
  - HU drafts: 02 `navDeltaHedgingLab`, `navHedgingDesk`, `seoDescHedgingDesk`, all of `HedgingDesk.hu.ts`, the
    M1/`hdObj*`/`hdStatus*` block of `HedgingDeskMissions.hu.ts`; 03 all `hdSide*` in `HedgingDeskSide.hu.ts`
    (check KÖTÉS/SÉRT/LEJ/RÉS/ELUT/LEHÍV, "Fedezeti napi mozgás"); 04 all `hdChart*` in
    `HedgingDeskCharts.hu.ts`; 05 all `hdMs*` in `HedgingDeskMissionScreen.hu.ts`; 06 all of
    `HedgingDeskDebrief.hu.ts`; 07 `hdMissionM2…M5Title/Tagline/Brief` ("Rés", "pin-kockázat").
  - Mission limits (seed 7): M1 daily hedging ends −$893 and fails `pnlWithin 400` (RV 26% > IV 22%), so
    decide whether that is intended; M2 `pnlWithin 600` is tight (every-5 = −382, daily runs out of trades by
    D9); M3 gap lands on D35, the window's last day; M4 `pnlAbove −500` is easy.
  - Deviations worth a look: 02 pages emitted as `desk.html`; 04 chart pairs stack at 768–1199px and the
    shares strip key sits in the panel header; 06 failed runs are not recorded as progress; 07 gap day moves
    by the jump alone.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/08-final-qa.md`, and confirm plans 01–07 are marked done
> (stop and report if not). Run every check in plan 08, fix small issues inside the hedging-desk files,
> write up anything larger, and compile the owner-review list in Findings. Set plan 08 to `done` in the
> README table and summarise.
