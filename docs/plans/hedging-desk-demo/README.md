# Hedging Desk playthrough demo plans

Goal: a **playthrough demo** of the Hedging Desk. From `/delta-hedging/desk?demo=1` (or a button on the
desk) the desk plays mission M1 by itself on a fixed path: about sixteen steps, each one restoring the
book to a scripted state, switching to the right screen, highlighting one panel and showing a short
caption in a bar that replaces the function keys. The learner can play, pause, go back and forth, exit,
or **take the desk** and continue the same book by hand. The demo never writes mission progress.

**Extension (plans 05–09, added 2026-10-23): desk help.** A **HELP** button in the command bar (also F1
and `?`) opens a drawer inside the desk with three tabs. **Next move** gives live advice from the book
("delta −549 is outside ±100: buy 549 shares", "gamma must be inside ±40 from D25: buy calls").
**What if** compares candidate trades on a copy of the book using today's market only: stock hedge,
options for delta, out-of-the-money options, gamma-neutral, selling options (the wrong tool), closing
out, doing nothing, and whatever is in the ticket. **Guide** holds mission playbooks, a panel guide with
"show me", keys, common mistakes and a glossary.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model (Sonnet
recommended) without this README's chat. Each plan ends with a ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-23** (commit `b0f23d3` plus the uncommitted `docs/plans/hedging-desk` pack,
plans 01–07 done, 08 in progress). If the code has moved on, the executor re-checks its plan's "Current
state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Engine | `src/features/hedging-desk/engine/` (`desk.types.ts` 137 lines, `book.math.ts` 154, `market.math.ts`, `risk.math.ts`, `objectives.math.ts`, `policy.math.ts`, `missions.data.ts`, `desk.config.ts`) | Pure, deterministic. `reduceDesk(state, action, market, mission)` with `DeskAction = order \| autoHedge \| step`; `startBook(mission, seed, market)`; `buildMarket(spec, seed)`; `replayPolicy(mission, market, seed, every)` already replays a scripted policy through the reducer |
| URL state | `src/features/hedging-desk/hedgingDesk.url.ts` (33 lines) | `m` (default `M1`), `seed` (default 7, 1–9999), `screen` (`desk \| missions \| debrief`). `urlBool` exists in `src/lib/urlState.ts`. Defaults are used while hydrating |
| Page hook | `src/features/hedging-desk/useHedgingDesk.ts` (117 lines) | `useDeskUrl()` → `{ url, run, mission, market, setScreen, selectMission, newPath, restart }`; `useDeskSession(deskUrl)` → the `HedgingDeskModel` (`state, day, S, iv, tau, greeks, pnl, objectives, realizedVol, trades, lastRebalanceDay, quote, ticket, setTicketId, setSide, setQty, submit, autoHedge, step`). The reducer's `dispatch` is **not** exposed |
| View | `src/features/hedging-desk/HedgingDeskView.tsx` (58 lines) | Renders `<DeskSession key={`${m}-${seed}-${run}`} …>`; desk screen = `DeskScreen` + `FunctionKeys`; the header `actions` slot holds `FullscreenButton` (expand + full screen) |
| Function keys | `src/features/hedging-desk/useFunctionKeys.ts` (44 lines), `components/FunctionKeys.tsx` (29) | `FUNCTION_KEYS` F2/F3/F4/F5/F8/F9 bound on `window` keydown; `keyEnabled(key, desk)` |
| Debrief | `src/features/hedging-desk/useDebrief.ts` (40 lines) | Replays four policies with `replayPolicy(mission, market, url.seed, every)`; **calls `recordResult(mission.id, passed, pnl)` into `localStorage` once the book settles** |
| Progress | `src/features/hedging-desk/deskProgress.ts` | key `qs.hedgingDesk.progress.v1`, `{ [missionId]: { completed, bestPnl } }`, `isUnlocked`, `recordResult` |
| Panels | `components/*.tsx`, `components/debrief/*.tsx`, `components/missions/*.tsx` | Every panel is `<Panel … className="hdesk-panel">`; **no ids, no data attributes**. `Panel` (`src/components/layout/Panel.tsx`, 41 lines) has `title, actions, footer, children, dominant, flush, className` |
| Playback helpers | `src/components/playback/useTicker.ts` | `useTicker(running, ms, tick, onStop)` (setInterval; stops when `tick` returns false), `prefersReducedMotion()` |
| Typing guard | `src/components/layout/isTyping.ts` | `isTyping(target)` true inside inputs |
| i18n | `src/Language/HedgingDesk*.ts` (six EN/HU pairs, registered in `index.en.ts` L53–58 and L114–119, `index.hu.ts` L53–58 and L115–120) | `useI18n().t(key, vars)`; keys prefixed `hd` |
| Styles | `src/styles/_hedging-desk.scss` (390 lines; function keys region L262–322, fullscreen region L347+), `main.scss` L32–36 (`@use "hedging-desk…"`) | Scoped `.hdesk` terminal theme, amber accent, `.hdesk--expanded`, `.hdesk:fullscreen` |
| Tests | `scripts/hedging-desk-*.test.mjs` (40 tests) via `scripts/lib/load-ts.mjs` `importSrc` (pure `.ts` only, relative imports) | `npm run test:hedging-desk` globs `scripts/hedging-desk-*.test.mjs` |
| Browser checks | `scripts/cdp-smoke.mjs` (`--after "<path>\|<js>"`), `scripts/layout-audit.mjs` (`--after "<js>"`, widths 360…1536, both themes) | Against `vite preview --port 4173 --strictPort` |

Measured: M1 on seed 7 with daily auto-hedging ends at −$893 and **fails** `pnlWithin 400` (08 Findings),
so the demo cannot use the default seed. Nothing resembling a tour, spotlight, coach mark or autoplay
exists anywhere in the repo (grep over `src/`).

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | No scripted sequence, no way to restore an arbitrary book state, no chosen demo seed | 01 |
| G2 | No `?demo=1` mode, no `dispatch` on the model, no anchors on panels, no entry buttons, progress and F-keys not guarded | 02 |
| G3 | No controller (play/pause/next/back), no caption bar, no highlight styling, no captions | 03 |
| G4 | No cross-width, language, keyboard, reduced-motion and progress-isolation sign-off | 04 |
| G5 | No help entry point; the shared `HelpDrawer` portals to `body`, so it is invisible in full screen and sits under `.hdesk--expanded` (z 1000 vs 50) | 05 |
| G6 | No "what should I do now?" guidance after the demo | 06 |
| G7 | No way to try a hedge (stock vs options vs nothing) before trading | 07 |
| G8 | No mission playbooks, panel explanations or glossary on the desk | 08 |
| G9 | No integrated sign-off for help (widths, fullscreen, demo interplay) | 09 |

Measured for the extension (seed 7, day 0): M1 Δ −549, Γ −36, vega −$198/pt, θ +$28/day; M3 Δ −1083,
Γ −85; M4 Δ +609, vega +$152/pt (already inside its $1,500 limit); M5 Γ −90. In M1, buying the 10 C100
back flattens every Greek for about $50 more spread and passes all three objectives.

## 2. Key decisions

- **Scripted states, not a live replay.** `demo/demo.script.ts` lists the steps as data (`id`, `screen`,
  `anchor`, `actions: DeskAction[]`, optional `ticket`, `holdMs`). A pure `runDemo(mission, market)` folds
  every step's actions through `reduceDesk` from `startBook` and returns `states[k]`. Entering step `k`
  dispatches a new engine action `{ type: "restore"; state }`, so Next and Back are exact, the whole
  sequence is testable by numbers, and the controller holds no engine logic.
- **Fixed mission and seed.** With `demo=1` the effective mission is `M1` and the effective seed is
  `DEMO_SEED`, whatever `m` and `seed` say. Plan 01 chooses `DEMO_SEED` by search (one breach during the
  "five unhedged days" step; the daily auto-hedge run passes all three objectives) and pins it in a test.
- **Caption dock, not anchored bubbles.** During the demo the function-key row is replaced by a `DemoBar`
  in the same slot (Back / Play–Pause / Next, "Step n of N", title, caption, Take the desk, Exit). The
  root gets `hdesk--demo` and `data-demo-anchor="<anchor>"`; CSS dims every `.hdesk-panel` and lifts the
  one whose `id="hd-<anchor>"` matches (amber outline, tinted head). No portal and no positioning maths,
  so it works at 360–1536 px, in the expanded view and in fullscreen. Rejected: a spotlight overlay with
  a hole and floating bubbles (three breakpoints, fullscreen, hydration).
- **Anchors are ids.** `Panel` gains an optional `id` prop (additive). Desk panels, debrief panels, the
  quote strip, the tabs row, the ticket's submit button and the option chain get `id="hd-<anchor>"`.
  `DemoAnchor` is a closed union; a test checks that every script step uses a declared anchor and plan
  04 checks that every anchor exists in the DOM.
- **Take over keeps the book.** The session key is built from the *effective* mission id and seed.
  `takeOver()` writes `{ demo: false, m: "M1", seed: DEMO_SEED }`, so the key does not change and the
  book continues. `exitDemo()` writes `{ demo: false }` only (back to the learner's own mission and seed).
- **The demo never writes progress.** `useDebrief` skips `recordResult` while `desk.demo` is true. F2–F9
  are ignored while the demo runs; Escape exits; arrows and space work when the bar has focus.
- **Copy through i18n**, two new tables so the plans never share a file: `HedgingDeskDemo.ts` (bar and
  button strings, plan 02) and `HedgingDeskDemoSteps.ts` (step titles and captions, plan 03).
- **Stub contract for parallel work.** Plan 02 creates `components/demo/DemoBar.tsx` as a stub with the
  final props `({ desk }: { desk: HedgingDeskModel })` returning `null`; plan 03 fills it.

Help extension (05–09):
- **Drawer inside the desk.** Reuse `HelpDrawer` (focus trap, Escape, modal below 900 px) with a new
  additive `container` prop, so it portals into the `.hdesk` root: it then keeps the terminal tokens and
  works in the expanded view and in full screen. Help state lives in `HedgingDeskView`, so it survives
  F8/F9 remounts. No URL parameter. Hidden while the demo runs.
- **Help never reads the future.** Advice and what-if use only today's spot and IV and the mission spec
  (gap window, IV schedule, which the briefing reveals), never `market.gapDay`, later spot values or
  `replayPolicy`. Each pure module has a "two markets that differ only after today" test.
- **What if is one day of typical moves, not a replay.** Scenarios apply orders to a copy with
  `applyOrder`, then report Greeks, cost, the breach chance at tomorrow's close (delta linear in the move,
  normal moves at today's IV) and P&L at ±1σ/±2σ. Honest about its approximation.
- **Honest about loopholes.** "Buy the calls back" is shown and labelled "closes the book, not a hedge";
  the engine is not changed (owner decision, §6).
- **Advice is data.** `deskAdvice` returns ids, tones, vars and one action; copy keys are derived from
  the ids. The actions reuse the existing model (`setTicketId/setSide/setQty`, `FUNCTION_KEYS`,
  `setScreen`) and plan 05's `help.show` / `help.point`.
- **Independent plans.** 05 creates stub tabs with fixed props; 06–08 each own their tab file, their pure
  module, their copy table, their SCSS partial and their test file. They type plan 05's tab and anchor
  names as local literal unions, so they compile without 05's types.

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-script-and-driver.md) | Demo script, pure driver, `restore` action, seed search, harness | – | M | Sonnet | done (2026-10-23) |
| [02](02-demo-mode-plumbing.md) | `?demo=1` mode, `dispatch`, effective session key, guards, anchors, entry buttons, stub bar | – (verified with 01) | M | Sonnet | done (2026-10-23) |
| [03](03-demo-bar.md) | `useDemo` controller, `DemoBar`, highlight styling, captions | 01, 02 | M | Sonnet | done (2026-10-23) |
| [04](04-final-qa.md) | Final QA: widths, languages, keyboard, reduced motion, progress isolation, owner review list | 01–03 | S | Sonnet | done (2026-10-23) |
| [05](05-help-shell.md) | Help shell: HELP button, F1/`?`, drawer inside `.hdesk`, tabs, "show me", stubs | – | M | Sonnet | done (2026-10-23) |
| [06](06-next-move.md) | Next move: `deskAdvice` engine (21 rules), tab, copy, tests | – (UI verified with 05) | M | Sonnet | done (2026-10-23) |
| [07](07-what-if.md) | What if: scenario engine (stock, options, gamma/vega-neutral, sell options, close out, ticket), tab | – (UI verified with 05) | L | Sonnet | done (2026-10-23) |
| [08](08-guide-tab.md) | Guide: mission playbooks M1–M5, panel guide, keys, mistakes, glossary | – (UI verified with 05) | M | Sonnet | done (2026-10-23) |
| [09](09-help-qa.md) | Help QA: widths, fullscreen, languages, keyboard, demo interplay, owner list | 05–08 | S | Sonnet | todo |

**Start in parallel right away:** 01 and 02 (disjoint files; 02 imports only `DEMO_SEED` /
`DEMO_MISSION` from `demo/demo.config.ts`, which it may create itself if 01 has not yet, see its Steps).
**After 01 and 02:** 03 (it may be written earlier against the API stated in both plans, and verified
once they are done). **Last:** 04.

**Must run one after another:**
- 01 → 03: `useDemo` imports `runDemo` and the `DemoStep` types.
- 02 → 03: `useDemo` reads `desk.demo`, `desk.dispatch`, `desk.takeOver`, `desk.exitDemo`; `DemoBar`
  replaces the stub 02 created.
- 02 creates `src/Language/HedgingDeskDemo.ts`; 03 does **not** edit it (03 owns
  `HedgingDeskDemoSteps.ts`). Both register their table by appending after the `hedgingDeskMissionScreen`
  lines in `index.en.ts` / `index.hu.ts`; re-read right before editing and keep the other plan's lines.

**Help extension:** 05, 06, 07 and 08 can all start on day one in parallel. 06–08 build and test their
pure engines without 05; their tab components replace 05's stubs (if a stub does not exist yet, they
create the file at the stated path, and 05 must not overwrite it). 09 runs last.
Shared files in the extension, each with an additive edit: `index.en.ts` / `index.hu.ts` (append after
the last `hedgingDeskDemo…`/`hedgingDeskHelp…` line), `main.scss` (append after `hedging-desk-demo` /
the last help partial), `HedgingDeskView.tsx` (05 only), `src/components/ui/HelpDrawer.tsx` (05 only,
additive props).

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Executors working in parallel claim a plan first: `in progress (claimed <date>, <session>)` on its
`Status:` line.

## 4. Rules for every executor

- Read `CLAUDE.md`. Hard rules: DRY; math in `*.math.ts` / `engine/*.ts` / `demo/*.math.ts` (no React
  there); types in `*.types.ts`; **`.tsx` ≤ ~150 lines** (split in the same change); styles in SCSS under
  `src/styles/**` with tokens; **all user text through i18n** (both EN and HU tables, registered in
  `src/Language/index.en.ts` / `index.hu.ts`); `///` doc comments on exported functions; no comments on
  code you did not change.
- **Do not edit the lab** under `src/features/delta-hedging/` (only `DeltaHedgingPages.tsx` belongs to
  the desk) nor `src/styles/_delta-hedging.scss`.
- Owner style: no pills or capsules; never left-border accents (use a background tint or an outline on
  all sides); square corners; no gradients, glows or colour floods; no marquee motion; respect
  `prefers-reduced-motion`. Inside `.hdesk` the only accent is amber; up/down are blue/red.
- Hungarian copy you write is a **draft**: list every new HU key in your plan's Findings for owner review.
- Shared files (`index.en.ts`/`index.hu.ts`, `main.scss`, `engine/desk.types.ts`, `useHedgingDesk.ts`):
  re-read right before editing, make an **additive** edit at the stated insertion point, never reorder
  or rewrite other lines.
- **Never `git stash`, `git checkout` or reset while other sessions run in parallel.** To compare with a
  commit use `git diff --quiet <rev> -- <paths>`. If the shared tree does not build because of another
  plan's half-finished files, wait or verify in a temporary `git worktree add --detach` copy (junction
  `node_modules`), then remove it.
- Platform: Windows 11, Git Bash + PowerShell. Prefix CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash.
  Start servers with `--strictPort`; afterwards stop them and confirm the port is free
  (`netstat -ano | grep :4173`). Audit against `vite preview`, not the dev server.
- Do not add dependencies. Do not commit or push unless asked.
- Standard verification (every plan, after its own checks):

```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/delta-hedging/desk?demo=1,/hu/delta-hedging/desk?demo=1"
```

`npm run lint` currently reports 12 errors in files outside the desk (AppShell, i18n, theme, heston,
diffusion, payoff-lab, portfolio-lab); those are pre-existing. Report only new ones.

## 5. Definition of done

- `/delta-hedging/desk?demo=1` and `/hu/delta-hedging/desk?demo=1` start the playthrough on M1 /
  `DEMO_SEED`; the bar shows "Step 1 of N"; Next/Back/Play/Pause work by click and keyboard; Escape and
  Exit return to the learner's own desk; Take the desk continues the scripted book by hand.
- Each step highlights exactly one anchor, scrolls it into view, and (on the debrief steps) switches
  screen; the captions are in EN and HU.
- `npm run test:hedging-desk` covers the script (anchors declared, states monotone in day, one breach in
  the drift step, final state settled with all M1 objectives passing, `restore` round-trip).
- After a full demo, `localStorage` has no `qs.hedgingDesk.progress.v1` entry (unless the learner had one
  before); F2–F9 do nothing while the demo runs.
- No `.tsx` over ~150 lines; no hard-coded user-facing English; all colours via tokens inside `.hdesk`.
- Smoke and layout audit clean at 360 / 768 / 1280 / 1536 px in EN and HU with the demo running; the
  pre-rendered desk pages are byte-identical in structure (the demo is client-only after hydration).

Help extension:
- HELP / F1 / `?` open the drawer on every mission in EN and HU, inside `.hdesk`, visible in the expanded
  view and in full screen; hidden during the demo.
- Next move, What if and Guide show content for M1–M5; their action buttons fill the ticket, press keys,
  switch tabs or point at panels; help never trades or writes progress by itself.
- `npm run test:hedging-desk` covers advice, what-if and guide copy parity, including the no-future-reads tests.
- Layout audit clean with each tab open at 360 / 768 / 1280 / 1536 px.

## 6. Post-merge checklist

- Owner reviews the HU drafts listed in each plan's Findings and the English captions in plan 03.
- Owner plays the demo once on a phone-width window and once in fullscreen.
- Decide whether guides should link to `/delta-hedging/desk?demo=1` (the Delta hedging guide lesson is
  the natural place; not part of this pack).
- Help: owner reviews the advice, what-if and guide copy (EN and HU drafts).
- Decide whether M1 should keep passing when the learner simply buys the 10 calls back (What if labels it
  "closes the book"); changing that is an engine/objective change outside this pack.
- M4 starts with |vega| ≈ $152/pt against a $1,500/pt limit, so its vega objective passes without action;
  check the intended units or limit.
- Whether the demo's final caption should point to HELP.
