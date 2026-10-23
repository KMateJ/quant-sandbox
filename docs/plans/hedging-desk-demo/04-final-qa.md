# 04 — Final QA: widths, languages, keyboard, reduced motion, progress isolation, owner review list

Status: done (2026-10-23) · Depends on: 01, 02, 03 · Suggested model: Sonnet · Est. size: S

## Why
Three plans ran in parallel sessions. This plan checks the integrated demo the way a learner meets it:
on a phone, in Hungarian, with the keyboard, with reduced motion, and without side effects on their
mission progress. It also collects everything the owner must review.

## Current state (verified 2026-10-23; re-check against plans 01–03 Findings)
- Routes: `/delta-hedging/desk?demo=1` (EN) and `/hu/delta-hedging/desk?demo=1` (HU) start the demo;
  the bar `footer#hd-keys.hdesk-demo-bar` holds `[aria-keyshortcuts=ArrowLeft|Space|ArrowRight|Escape]`
  buttons and `.hdesk-demo-caption`; the root `.hdesk.hdesk--demo[data-demo-anchor]`.
- Progress key `qs.hedgingDesk.progress.v1` (`src/features/hedging-desk/deskProgress.ts`).
- Tools: `scripts/cdp-smoke.mjs` (`--after "<path>|<js>"`, `--ignore`), `scripts/layout-audit.mjs`
  (`--widths`, `--themes`, `--after "<js>"`, `--strict`), both against `vite preview --port 4173 --strictPort`.
- The previous pack's QA (`docs/plans/hedging-desk/08-final-qa.md`) left two desk style items open
  (HU `.hdesk-fkey-label` overlap at 768px; 28px tabs below 768px); check whether they were fixed, and do
  not re-report them as demo defects.

## Goal
1. Every command in Verification passes at 360 / 768 / 1280 / 1536 px, light and dark site theme, EN and HU.
2. Keyboard-only run works; reduced motion disables auto-play; progress is never written by the demo.
3. Findings holds the owner review list (captions, HU drafts, judgement calls).

## Non-goals
- No new features. Fix only defects found; anything larger goes to Findings as a proposal.

## Steps
1. Read plans 01–03 Findings and the README status table; all three must be `done`.
2. Full suite:
   ```bash
   npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs && npm run test:url-state
   npm run build && npm run test:seo && npm run test:seo-schema && npm run test:language-routes
   git diff --quiet b0f23d3 -- src/features/delta-hedging/DeltaHedgingView.tsx src/features/delta-hedging/useDeltaHedging.ts \
     src/features/delta-hedging/deltaHedging.math.ts src/features/delta-hedging/components src/styles/_delta-hedging.scss && echo "lab untouched"
   ```
3. Browser checks (`vite preview`):
   ```bash
   (npx vite preview --port 4173 --strictPort &) && sleep 4
   W='(ms)=>new Promise(r=>setTimeout(r,ms))'
   ALL="(async()=>{const w=${W};localStorage.removeItem('qs.hedgingDesk.progress.v1');const seen=[];for(let i=0;i<20;i++){const b=document.querySelector('[aria-keyshortcuts=ArrowRight]');if(!b||b.disabled)break;b.click();await w(150);seen.push(document.querySelector('.hdesk').dataset.demoAnchor)}return {steps:seen.length,missing:seen.filter(a=>!document.getElementById('hd-'+a)),progress:localStorage.getItem('qs.hedgingDesk.progress.v1'),counter:document.querySelector('.hdesk-demo-caption .hdesk-label').textContent}})()"
   KEYS="(async()=>{const w=${W};const k=(key)=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));const a=()=>document.querySelector('.hdesk').dataset.demoAnchor;k('ArrowRight');await w(200);const r1=a();k('ArrowLeft');await w(200);const r2=a();k('F2');await w(200);const clock=document.querySelector('.hdesk-cmd-clock').textContent;k(' ');await w(200);const pressed=document.querySelector('[aria-keyshortcuts=Space]').getAttribute('aria-pressed');k('Escape');await w(400);return {r1,r2,clock,pressed,search:location.search,demo:document.querySelector('.hdesk--demo')!==null}})()"
   MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
     --paths "/delta-hedging/desk?demo=1,/hu/delta-hedging/desk?demo=1,/delta-hedging/desk?screen=missions,/delta-hedging/desk" \
     --after "/delta-hedging/desk?demo=1|$ALL" --after "/hu/delta-hedging/desk?demo=1|$ALL" --after "/delta-hedging/desk?demo=1|$KEYS"
   # expect: steps 15, missing [], progress null, counter "Step 16 of 16" (EN) / its HU text; KEYS: r1 "blotter", r2 "quotes",
   # clock still D0, pressed "false", search without demo=1, demo false
   MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --widths 360,768,1280,1536 \
     --paths "/delta-hedging/desk?demo=1,/hu/delta-hedging/desk?demo=1" \
     --after "(async()=>{const w=${W};for(let i=0;i<6;i++){document.querySelector('[aria-keyshortcuts=ArrowRight]').click();await w(150)}})()" \
     --after "(async()=>{const w=${W};for(let i=0;i<13;i++){document.querySelector('[aria-keyshortcuts=ArrowRight]').click();await w(150)}})()"
   ```
   The second `--after` lands on the debrief steps; the audit must be clean there too (sticky bar over
   the debrief grid).
4. Reduced motion: CDP cannot be toggled from the smoke script; verify by code reading that `useDemo`
   initialises `playing` from `!prefersReducedMotion()` and that `_hedging-desk-demo.scss` has the
   `prefers-reduced-motion` block; then run one manual check in a browser with the OS setting on (note
   "manual" in Findings if done, "not done" otherwise).
5. Code checks (grep):
   - `.tsx` sizes: `find src/features/hedging-desk -name "*.tsx" | xargs wc -l | sort -n | tail -5`
   - no hex in `.tsx`: `grep -rnE "#[0-9a-fA-F]{3,6}\b" src/features/hedging-desk --include=*.tsx`
   - no English literals in demo JSX: `grep -rnE ">[A-Z][a-z]+ " src/features/hedging-desk/components/demo`
   - no `border-left` in `src/styles/_hedging-desk-demo.scss`
   - `restore` dispatched only from `demo/useDemo.ts`: `grep -rn '"restore"' src/features/hedging-desk --include=*.ts --include=*.tsx`
   - EN/HU key parity for `HedgingDeskDemo*.ts` (10-line node script comparing `Object.keys`).
   - Every `DEMO_ANCHORS` entry appears as `id="hd-<anchor>"` somewhere in `components/` (grep each).
6. Accessibility: the bar is a labelled region; the caption is `aria-live="polite"`; Play/Pause has
   `aria-pressed`; every control is a real `<button>` with text; focus is visible on the bar's buttons
   (amber outline); Tab order inside the bar is Back, Play, Next, Take the desk, Exit.
7. Theme: switch the site to light; the demo bar and highlight stay in the dark `.hdesk` palette.

## Acceptance criteria
- All commands in steps 2–3 pass; "lab untouched" printed; layout audit reports zero defects at all four
  widths for both demo paths and both `--after` positions.
- Findings holds the owner review list and the result of each check in steps 4–7.

## Verification
The commands in steps 2–3 and 5. Stop the preview server and confirm port 4173 is free.

## Pitfalls
- Audit on `vite preview`, not the dev server.
- `?demo=1` pages are client-rendered after hydration; allow the `--wait` default (3 s) before `--after`.
- The `KEYS` check dispatches synthetic `keydown` on `window`; `useDemo` must listen on `window` (plan 03)
  for this to work. If it listens on the bar element instead, adapt the script to dispatch on the bar.
- HU captions are longer: the bar may be two or three lines tall at 360px; that is fine as long as nothing
  overlaps and the panel above remains reachable by scrolling.

## Findings (fill in during execution)
- Results (2026-10-23, vite preview):
  - Step 2: `tsc -b` clean; `test:hedging-desk` 49/49, `test:labs` 59/59, `test:url-state` 4/4; build OK;
    `test:seo` 25 pass / 0 fail / 3 todo (known baseline), `test:seo-schema` 7/7, `test:language-routes` 4/4;
    **lab untouched** printed. Lint: only the 8 pre-existing files outside the desk; `eslint src/features/hedging-desk` clean.
  - Step 3: smoke clean on `?demo=1` (EN, HU), `?screen=missions`, `?screen=debrief`, `/delta-hedging/desk`, `/delta-hedging`.
    Step-through: 16 steps in EN ("Step 16 of 16") and HU ("16. lépés / 16"); progress key stays `null`.
    Every anchor exists, has width and is lifted to opacity 1 at its own step (debrief anchors on the debrief steps).
    Keyboard: auto-play starts on load; Space pauses; → / ← move quotes → blotter → quotes; F2 ignored (clock stays D0);
    Escape exits (URL drops `demo`, 6 function keys back). Missions screen loaded 30 times: no React #418, so the
    intermittent error my-app-dd and my-app-6a saw did not reproduce here.
  - Layout audit 360/768/1280/1536, light+dark, EN+HU, after step 7 and after step 14: 48 pages, 0 failing; only the
    site-wide 22px brand link tap-target warning (not the desk). Screenshots checked at 1280 dark (step 7: price
    panel outlined in amber, the rest dimmed) and 360 light HU.
  - Step 4: by code reading, `useDemo` starts with `playing: !prefersReducedMotion()` and scrolls with `behavior: "auto"`
    under reduced motion; `_hedging-desk-demo.scss` has the `prefers-reduced-motion` block. Manual OS-setting check: not done.
  - Step 5: largest `.tsx` 81 lines; no hex in `.tsx`; no English JSX literals in `components/demo`; no `border-left` in
    the demo partial; `"restore"` dispatched only in `demo/useDemo.ts`; EN/HU parity 14/14 (`HedgingDeskDemo`) and
    32/32 (`HedgingDeskDemoSteps`), no HU string identical to EN; all 19 `DEMO_ANCHORS` appear as `hd-<anchor>` ids.
  - Steps 6–7: the bar is a labelled region, caption `aria-live="polite"`, Play/Pause `aria-pressed`, all controls are
    text buttons; tab order Back, Play, Next, Take the desk, Exit. Light site theme: shell light, `.hdesk` stays dark.
- Fixes made:
  - **Focus after Exit/Escape landed on `<body>`.** Exit changes the seed, so the session (and the header holding the
    demo button) remounts; the old `requestAnimationFrame` focus ran before the button existed. Now `useDemo`'s `exit`
    calls `requestDemoButtonFocus()` (new one-shot flag in `demo/demoStore.ts`) and `DemoButton` takes focus on mount
    when the flag is set. Verified: after Exit and after Escape focus is on "Watch the playthrough".
    Take the desk still leaves focus on `<body>` (the bar unmounts; the session does not); acceptable, noted for the owner.
- Proposals (not done, owner's call):
  - **Phone width:** the bar sits in flow below the whole desk (about 4,500 px tall at 360 px), so when a step scrolls
    its panel into view the caption is off screen. Options: scroll to the bar instead of the panel below 768 px, or
    show the step title in the command bar next to the DEMO badge.
  - Take the desk could move focus to the F2 key so keyboard users land on the controls they just received.
- Owner review list:
  - English captions (plan 03, 16 titles + 16 bodies) and every HU draft in `HedgingDeskDemo.hu.ts` and
    `HedgingDeskDemoSteps.hu.ts`.
  - `DEMO_SEED` and the numbers it produces (plan 01 Findings); whether the "five unhedged days" breach
    reads clearly on the chart.
  - Whether the Delta hedging guide should link to `/delta-hedging/desk?demo=1`.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (section 4) and `docs/plans/hedging-desk-demo/04-final-qa.md`, and confirm plans 01–03 are marked done
> (stop and report if not). Run every step; fix only clear defects in demo files (`demo/`,
> `components/demo/`, `_hedging-desk-demo.scss`, `HedgingDeskDemo*.ts`), and propose anything larger in
> Findings. Fill in Findings with the results, fixes and the owner review list, set plan 04 to `done` in
> the README table, and summarise. Stop the preview server and confirm port 4173 is free. Do not run
> `git stash`.
