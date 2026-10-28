# 09 — Help QA: widths, fullscreen, languages, keyboard, demo interplay, owner review list

Status: done (2026-10-28, session help-qa-2) · Depends on: 05, 06, 07, 08 · Suggested model: Sonnet · Est. size: S

## Why
Plans 05–08 may run in parallel sessions. This plan checks the integrated help the way a learner meets
it: on a phone, in Hungarian, in full screen and in the expanded view, with the keyboard only, together
with the demo, and across all five missions. It also collects everything the owner must review.

## Current state (re-check against the Findings of 05–08)
- HELP button `[aria-controls=hd-help]` in the command bar; the drawer is `#hd-help` inside `.hdesk`;
  tabs `#hd-help [role=tab]` (Next move, What if, Guide); "show me" sets `.hdesk[data-help-anchor]`.
- Pure modules: `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`; tests
  `scripts/hedging-desk-help-*.test.mjs`.
- Tables: `src/Language/HedgingDeskHelp*.ts` (four EN/HU pairs).
- Styles: `_hedging-desk-help*.scss` (four partials in `main.scss` after `hedging-desk-demo`).
- Tools: `scripts/cdp-smoke.mjs`, `scripts/layout-audit.mjs` (`--widths`, `--themes`, `--after`), both
  against `vite preview --port 4173 --strictPort`.

## Goal
1. Every command below passes at 360 / 768 / 1280 / 1536 px, light and dark site theme, EN and HU, with
   the drawer open on each tab.
2. Keyboard-only use works, help and the demo never fight over keys, and help never writes progress or
   trades on its own.
3. Findings holds the owner review list.

## Non-goals
No new features. Fix only clear defects in help files (`help/`, `components/help/`,
`_hedging-desk-help*.scss`, `HedgingDeskHelp*.ts`); propose anything larger in Findings.

## Steps
1. All of 05–08 must be `done` in the README table.
2. Full suite:
   ```bash
   npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs && npm run test:url-state
   npm run build && npm run test:seo && npm run test:seo-schema && npm run test:language-routes
   ```
3. Browser checks:
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   W='(ms)=>new Promise(r=>setTimeout(r,ms))'
   OPEN="(n)=>(async()=>{const w=${W};const b=document.querySelector('[aria-controls=hd-help]');if(!document.getElementById('hd-help'))b.click();await w(200);document.querySelectorAll('#hd-help [role=tab]')[n].click();await w(300)})()"
   ALL="(async()=>{const w=${W};const o=${OPEN};const out={};for(const n of [0,1,2]){await o(n);out['tab'+n]=document.querySelector('#hd-help [role=tabpanel], #hd-help .help-drawer-body')?.textContent.length}localStorage.removeItem('qs.hedgingDesk.progress.v1');const trades=document.querySelector('.hdesk-cmd-clock').textContent;return {...out,clock:trades,progress:localStorage.getItem('qs.hedgingDesk.progress.v1'),fills:document.querySelectorAll('.hdesk-blotter tr, #hd-blotter li').length}})()"
   DEMO="(async()=>{const w=${W};window.dispatchEvent(new KeyboardEvent('keydown',{key:'F1',bubbles:true}));await w(200);const opened=!!document.getElementById('hd-help');document.querySelector('[aria-keyshortcuts=Escape]')?.click();await w(500);window.dispatchEvent(new KeyboardEvent('keydown',{key:'F1',bubbles:true}));await w(200);return {openedInDemo:opened,openedAfterExit:!!document.getElementById('hd-help')}})()"
   FS="(async()=>{const w=${W};[...document.querySelectorAll('.hdesk-cmd-btn')].find(b=>b.getAttribute('aria-pressed')==='false')?.click();await w(200);document.querySelector('[aria-controls=hd-help]').click();await w(250);const r=document.getElementById('hd-help').getBoundingClientRect();const top=document.elementFromPoint(r.left+20,r.top+20);return {expanded:!!document.querySelector('.hdesk--expanded'),visible:r.width>0,onTop:!!top&&document.getElementById('hd-help').contains(top)}})()"
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
     --paths "/delta-hedging/desk,/hu/delta-hedging/desk,/delta-hedging/desk?m=M2,/delta-hedging/desk?m=M3,/delta-hedging/desk?m=M4,/delta-hedging/desk?m=M5,/delta-hedging/desk?demo=1" \
     --after "/delta-hedging/desk|$ALL" --after "/hu/delta-hedging/desk|$ALL" --after "/delta-hedging/desk?m=M5|$ALL" \
     --after "/delta-hedging/desk?demo=1|$DEMO" --after "/delta-hedging/desk|$FS"
   # expect ALL: three non-empty tabs, clock still day 0, progress null, fills unchanged (help never trades by itself)
   # expect DEMO: openedInDemo false, openedAfterExit true
   # expect FS: expanded true, visible true, onTop true
   for n in 0 1 2; do
     MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --widths 360,768,1280,1536 \
       --paths "/delta-hedging/desk,/hu/delta-hedging/desk" --after "${OPEN}($n)"
   done
   ```
   Adapt selectors only if a plan's Findings records a different class name, and note the change.
4. Manual checks (write "manual: done/not done" in Findings for each): browser full screen (the Fullscreen
   API cannot be entered from the smoke script) with the drawer open; a reduced-motion OS setting with
   "Show me" (no smooth scroll); a real keyboard: Tab through the drawer, arrows between tabs, Escape
   back to HELP.
5. Code checks:
   - `.tsx` sizes: `find src/features/hedging-desk -name "*.tsx" | xargs wc -l | sort -n | tail -5`.
   - No hex in `.tsx`; no `border-left` anywhere in `_hedging-desk-help*.scss` (the drawer's one edge
     line comes from `_primitives.scss`).
   - No future reads: `grep -n "gapDay\|spot\[.*+ *1\]\|replayPolicy" src/features/hedging-desk/help/*.ts`
     must print nothing (the guide may call `replayPolicy` only in a scratch script, never at runtime).
   - EN/HU parity across all four `HedgingDeskHelp*` pairs (a 10-line node script with `importSrc`).
   - `HelpDrawer` other callers unchanged: smoke `/npv-irr` and open its learn drawer.
6. Content spot-check against the engine (scratch script): for M1, M3 and M5 at day 0 print `deskAdvice`
   ids and `whatIfScenarios` ids, costs and verdicts; confirm they match the text the UI shows.

## Acceptance criteria
- All commands in steps 2–3 pass; the layout audit reports zero failing pages for every tab.
- Findings holds the step 4–6 results and the owner review list below, completed.

## Verification
The commands in steps 2, 3 and 5. Stop the preview server and confirm port 4173 is free.

## Pitfalls
- Below 900 px the drawer is modal and inerts the rest of the page: the layout audit must open it
  *after* load (the `--after` hook) and must not try to click desk controls behind it.
- The HU copy is longer; the drawer scrolls internally. Overflow inside `.help-drawer-body` is fine;
  horizontal page overflow is not.
- Do not report the known site-wide 22 px brand-link tap target as a help defect.

## Findings (fill in during execution)
- Results (2026-10-28, session help-qa-2; private build `vite build --outDir node_modules/.p-hd09`, preview
  on port **4199**, CDP ports 9471/9472 because the default 9339/9340 are shared with other sessions and
  their navigations leaked into this run; server, outDir and ports cleaned up afterwards):
  - Step 2: `test:hedging-desk` 78/78, `test:labs` 59/59, `test:url-state` 4/4. `tsc -b`: 1 error, outside
    the desk (`fama-french/components/fund/FundPicker.tsx`, another session). Lint: 12 errors + 1 warning,
    none in hedging-desk. Build with prerender OK (302 pages). `test:seo`, `test:seo-schema` and
    `test:language-routes` not run: they read the hard-coded shared `dist/`, which other sessions own.
  - Step 3 smoke: all 8 paths clean (M1–M5, HU, demo, `/npv-irr` page loads; its learn drawer was not opened).
    ALL: tabs non-empty in EN/HU/M5 (EN 553/1549/7867 chars, HU 644/1819/8748), progress
    (`qs.game.hedging.progress.v1`) null, fills unchanged (2). DEMO: openedInDemo false, openedAfterExit
    true. FS: expanded true, visible true, onTop true.
    Selectors adapted to the game-kit move: `.hdesk-cmd-btn` → `button.gdesk-cmd-btn` with text "Expand",
    `.hdesk--expanded` → `.gdesk--expanded`, progress key → `qs.game.hedging.progress.v1`;
    `.hdesk-cmd-clock` no longer exists (the day is in `.gdesk-status`), so the clock check was dropped.
  - Layout audit: 32/32 pages "failing" for every tab, **but the baseline with help closed fails the same
    way** (overlap 24–79 per page): page content overlaps the sticky `.gdesk-footer` (function keys +
    status line, `_game-kit.scss` L260) in the audit's full-page screenshot. `/market-making/desk` shows
    the same (2–10). No horizontal overflow and no help-specific failure; only the known 22 px brand
    tap target at 360 px. Not a help defect.
- Step 4 manual: browser full screen — not done; reduced motion + "Show me" — not done; real keyboard
  (Tab/arrows/Escape) — not done (headless session). For the owner.
- Step 5: largest `.tsx` is `DeskSession.tsx` 96 lines. No hex in `.tsx`. The help SCSS partials no longer
  exist as `_hedging-desk-help*.scss` (help styles moved into `_game-kit.scss`); `_game-kit.scss` has no
  `border-left`. No future reads (`gapDay`, `spot[…+1]`, `replayPolicy`) in `help/*.ts`. EN/HU parity:
  Help 3/3, Advice 44/44, Guide 98/98, WhatIf 49/49, no missing keys.
- Step 6 (seed 7, day 0): advice M1 `outsideBand, firstHedge, thetaVsGamma`; M3 adds `gammaDeadline`;
  M5 as M1. What if M1: stock buy 549 ($5, fixesDelta); options buy 10 C100 ($50, closesBook); OTM buy 12
  C102.5 ($60, flipsGamma); gamma-neutral = close out = buy 10 C100 ($50); sell 12 P100 ($60,
  addsShortGamma). M3: 1083 shares ($11) / 20 C100 ($100). M5: 538 shares / OTM 17 C102.5 ($85).
  Matches README §1 measurements and the UI tab texts.
- Fixes made: none (no clear defect in help files).
- Proposals:
  - Game-desks pack: the layout audit flags every desk because of the sticky `.gdesk-footer`; either
    teach `layout-audit.mjs` to skip sticky/fixed elements in the overlap check or audit at viewport height.
  - Give `cdp-smoke.mjs` / `layout-audit.mjs` a random default DevTools port (parallel sessions collide).
  - Point the SEO tests at an overridable dist dir (env var) so private builds can run them.
  - The empty ticket card shows verdict `missesBand` (same as do nothing); consider `emptyTicket` only.
  - Update this plan's "Current state" selectors to the game-kit names (`gdesk-*`).
- Owner review list:
  - English copy and HU drafts in the four `HedgingDeskHelp*` tables (plans 05–08 Findings list them).
  - Whether "buy the calls back" should stay a passing M1 strategy (plan 07 shows it as "closes the book").
  - M4: the book starts inside the vega limit, so that objective passes without action.
  - Whether the demo's last step should point to HELP (a demo caption change; plan 03's table).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/09-help-qa.md`, and confirm plans 05–08 are marked done
> (stop and report if not). Run every step; fix only clear defects in help files and propose anything
> larger in Findings. Fill in Findings with the results, fixes and the owner review list, set plan 09 to
> `done` in the README table, and summarise. Stop the preview server and confirm port 4173 is free. Do not
> run `git stash`.
