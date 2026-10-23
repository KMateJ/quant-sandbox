# 05 — Missions screen, briefing, unlock progress

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: S

## Why
Missions turn the desk into a course: each one isolates a hedging skill (delta, rebalancing budget,
gamma, vega, pin risk). The Missions screen is where the learner picks one, reads its briefing and sees
what unlocks next.

## Current state (verified 2026-10-23, after plans 01–02)
- Stub: `src/features/hedging-desk/components/MissionsScreen.tsx`
  (`({ desk }: { desk: HedgingDeskModel })`), shown when `?screen=missions`.
- Model: `url.m`, `selectMission(id)` (sets `m`, screen → desk), `mission`, `setScreen`.
- Engine: `MISSIONS: MissionDef[]` (`id`, `greeks`, `market` (`s0`, `impliedVol`, `days`, …), `band`,
  `opening: Order[]`, `objectives`, `instruments: "stock" | "all"`, `unlockAfter?`) in
  `src/features/hedging-desk/engine/missions.data.ts`. After plan 01 only M1 exists; plan 07 adds
  M2–M5 with `unlockAfter` set.
- Copy: `src/Language/HedgingDeskMissions.ts` (plan 02) has M1 title/tagline/brief, objective labels and
  statuses; helpers in `src/features/hedging-desk/missionCopy.ts`.
- Storage pattern: `src/features/guide/useGuideProgress.ts` (reads `localStorage` behind try/catch,
  caches, exposes progress through a hook without breaking pre-render).
- Design reference: canvas board `Missions.dc.html`: mission list (number, title + tagline, Greeks,
  status) on the left, briefing (setup table, numbered objectives, instruments, START <GO> or LOCKED
  notice) on the right, "Desk rules" grid of four cards below the list.

## Goal
1. A mission list built from `MISSIONS`: id in amber, title + tagline, Greeks column (Δ, Γ, ν), status
   (Available / Locked / Completed with best result). Rows are buttons that select the briefing
   (`aria-pressed`); selected row = amber-tinted background.
2. A briefing panel for the selected mission: title, brief, a setup table **generated from data** by a
   pure `setupRows(mission)` in `src/features/hedging-desk/missionSetup.ts` (owned here): book from
   `opening`, spot/strike, implied vol, "realized vol: hidden until debrief", horizon in trading days,
   Δ band, and, only when the field is set, ticket fee (`costs.ticketFee`), trade limit (`maxTrades`),
   gap event (`market.gap`: "one ±{{size}}% gap between D{{from}} and D{{to}}"), IV path
   (`market.ivSchedule`), settlement ("Exercise settles in shares" for `physical`). All these fields
   exist in the types from plan 01, so the rows work as soon as plan 07 adds M2–M5. Then numbered
   objectives via `objectiveText`, instruments, and either a
   "START M1 <GO>" button (calls `selectMission`) or "LOCKED · Complete M1".
3. A "Desk rules" block: one day per step; fills cross the spread (±0.01 stock, ±0.05 options); marked
   at implied vol with a hidden realized vol; limits checked at the close.
4. Progress: `src/features/hedging-desk/deskProgress.ts` (+ hook `useDeskProgress.ts`) stores
   `{ [missionId]: { completed: boolean; bestPnl: number } }` under `localStorage` key
   `qs.hedgingDesk.progress.v1`. A mission is unlocked when it has no `unlockAfter` or that mission is
   completed. `recordResult(missionId, passedAll, pnl)` is exported for plan 06 to call.

## Non-goals
- Do not block deep links: `?m=M3` still plays M3 even if locked (the URL is a teaching tool). Only the
  START button is gated.
- No M2–M5 copy or engine work (plan 07). If plan 07 is already done, the list simply shows more rows.
- No debrief UI (plan 06); just export `recordResult`.

## Constraints
- `.tsx` ≤ ~150 lines: `MissionsScreen.tsx` composes `MissionList.tsx`, `MissionBriefing.tsx`,
  `DeskRules.tsx`.
- Screen strings (list headers, setup labels, rules, buttons) in a new table
  `src/Language/HedgingDeskMissionScreen.ts` (`hedgingDeskMissionScreenEn`) + `.hu.ts`, registered
  additively. Mission copy stays in `HedgingDeskMissions.ts`; add nothing there for M1 (plan 02 did).
- Styles: new partial `src/styles/_hedging-desk-missions.scss`, `@use` appended after the other
  `hedging-desk*` lines in `main.scss`.

## Steps
1. `deskProgress.ts` (pure apart from storage access, all wrapped in try/catch): `readProgress()`,
   `writeProgress(p)`, `isUnlocked(mission, progress)`, `recordResult(...)`. Tests for the pure parts
   (`isUnlocked`, merge of best P&L as the smallest |P&L| among passes) in
   `scripts/hedging-desk-missions.test.mjs` via `importSrc`.
2. `useDeskProgress.ts`: `useSyncExternalStore` with a **server snapshot of "nothing completed"**, a
   module-level cache, and a `storage` event listener (copy the shape of `useGuideProgress.ts`).
3. Components as in Goal; `MissionList` rows are `<button type="button">` in a list; the briefing START is
   a `<button>` (not a link) because it changes URL state through `selectMission`.
4. Selected-briefing state: local `useState`, initialised to `url.m`.

## Acceptance criteria
- `/delta-hedging/desk?screen=missions` shows every mission in `MISSIONS`; M1 is Available; others (if
  any) are Locked with their unlock rule.
- START M1 switches to the desk screen with `m=M1` in the URL and a fresh run.
- With `localStorage["qs.hedgingDesk.progress.v1"] = '{"M1":{"completed":true,"bestPnl":-120}}'`, M1 shows
  Completed with its best P&L and M2 (if present) is Available.
- Pre-render of `?screen=missions` is not required (query strings are not pre-rendered), but the default
  page must still pre-render without touching `localStorage`.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk?screen=missions,/hu/delta-hedging/desk?screen=missions,/delta-hedging/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk?screen=missions"
```
Stop the server and confirm port 4173 is free.

## Pitfalls
- **Hydration mismatch:** never read `localStorage` during the first render; the server snapshot must
  equal the first client snapshot.
- **Private mode / blocked storage:** reads and writes can throw; treat as empty progress.
- **Setup values come from data**, not copy, so M2–M5 render correctly when plan 07 adds them.

## Findings (fill in during execution)
- Baseline / measurements: smoke on preview: with `{"M1":{"completed":true,"bestPnl":-120}}` stored, list shows "Completed · best −$120 | Available | Locked | Locked | Locked"; M2 START goes to `?m=M2`. Layout audit 360–1536 px EN/HU clean.
- Deviations and why: `deskProgress.ts` also owns the store (cache, listeners, `subscribeProgress`) so `recordResult` from the debrief updates the list live; `useDeskProgress.ts` is a one-line `useSyncExternalStore` wrapper. Setup rows are structured (`kind` + `vars`) and turned into text by `components/missions/useSetupText.ts`. A failed run is not recorded (only passes complete a mission).
- Owner change (2026-10-23): missions are no longer locked. `unlockAfter`, `isUnlocked`, the Locked status/note (`hdMsLocked`, `hdMsLockedNote`), `.hdesk-brief-locked` and the unlock test were removed; every mission shows Available or Completed and has a Start button.
- Items awaiting owner approval: HU strings added (`HedgingDeskMissionScreen.hu.ts`, all draft, `hdMs*`, 47 keys), e.g. "Fedezési pult" rules, "Kiinduló helyzet", "Lehíváskor részvényben teljesít".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/05-missions-screen.md`, and confirm plans 01 and 02 are marked
> done (stop and report if not). Implement plan 05: `deskProgress.ts` + `useDeskProgress.ts` with tests,
> the Missions screen (list, briefing, desk rules), its i18n table and SCSS partial. Run the verification
> block and make it pass. Fill in Findings (list HU strings), set plan 05 to `done` in the README table,
> and summarise.
