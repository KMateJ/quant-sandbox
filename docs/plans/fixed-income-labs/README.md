# Fixed income labs plans

Goal: the four Fixed Income labs (and three new ones) become **hands-on instruments** — predict, drag,
play rounds, step through processes — instead of "slider + line chart", and every Fixed Income page is
**pixel-clean at every width**: no overlapping labels, no clipped axes, no misaligned rows, no horizontal
scroll, on phone, tablet and desktop, light and dark, EN and HU.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model (Sonnet
recommended) without this README's chat. Each plan ends with a ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-19** (commit `bc7199b`). If the code has moved on, the executor re-checks its
plan's "Current state" before editing.

Scope: **Fixed Income only** (`bond-pricing`, `yield-curve`, `duration-convexity`, `treasury-futures`, plus
new FI modules). Other categories are out of scope, even if the shared fix would also help them.

## 1. Current state

| Piece | File | What it does |
|---|---|---|
| Module registry | `src/modules/registry.ts` (FI entries ~L182–229) | 4 FI modules, all `status: "beta"`; routes, nav, home, SEO derive from it |
| Bond lab | `src/features/bond-pricing/` (view 110 lines) | URL state (`bondPricing.url.ts`), tabs cashflows / price-yield / pull-to-par; **draggable cash-flow bars done** (`TimelineChart` `onFlow`), pull-to-par playback done (`PullToPar.tsx`, `usePlayback`) |
| Yield curve lab | `src/features/yield-curve/` | tabs curve / bootstrap / forwards / factors; draggable par nodes, sketch toggle (SketchLayer), forward brush (`ForwardBrushLayer.tsx`); tab **not** in URL; bootstrap has no autoplay |
| Duration lab | `src/features/duration-convexity/` | Δy draggable on chart, pin & compare (usePinnedScatter), URL-backed bond; **no predict step, no two-bond compare** |
| Treasury futures | `src/features/treasury-futures/` (view **144 lines**, business logic inside the view) | scenarios, basket editing, draggable F on net-basis chart; English hard-coded in `scenarios.ts` notes and `RangeError` messages shown to users; id collision bug on add after remove |
| Shared primitives (done, reuse!) | `src/components/charts/index.ts`, `src/components/ui/index.ts`, `src/components/playback/` | `DragHandles`, `DraggableBars`, `SketchLayer`, `usePinnedSeries`/`usePinnedScatter`, `WaterfallChart`, `HeatmapPicker`, `Histogram`, `IntervalSelector`, `PredictReveal`+`usePredictReveal`, `PredictExplain`, `RangeGuess`, `SegmentedControl`, `Tabs`, `PinButton`, `usePlayback`/`PlaybackControls`/`useTicker`, `useUrlState` (+ `src/lib/urlState.ts`, `src/lib/urlSchemas.ts`), `BondInputs` + `BondSpec` in `src/lib/finance/bond.ts` |
| Guide figure math worth promoting | `src/features/guide/guide.interactive.immunizationShock.math.ts`, `…callablePriceYield.math.ts`, `…swapTimeline.math.ts` | pure math for immunisation, callable bonds, swaps (used by guide figures) |
| Coordination log | `docs/LABS_PLAN.md` | multi-session history; FI rows 184–189 are stale ("idea") although several parts are done |

Measured (2026-10-19, headless Chrome on `vite` dev, probe script, widths 360/768/1280):

- Document-level horizontal overflow: **0 px** on all four pages at all widths (good baseline).
- Visual defects seen in 360 px / 1280 px screenshots:
  - treasury-futures 360: cash-flow chart x-axis ticks `0.0 1.0 2.0 … 9.0` collide; cash-flow tables cut
    off on the right with no scroll affordance; Bond A / Bond B factor strip cramped.
  - duration-convexity 360: in-chart label "Duration: tangent slope" overlaps the curves; the `+200` x tick
    is clipped at the right edge; chart header wraps title, Pin and Formulas onto three lines.
  - sidebar (≥ 901 px): module names truncated ("Duration & Co…", "Treasury Futur…") next to BETA chips.
  - yield-curve: selected row uses a **left border accent** (`src/styles/yieldcurve.scss:141–143`), which the
    owner forbids.
- Breakpoints are ad hoc: 540, 560, 640, 680, 760, 900, 1100 px across `layout.scss`, `mobile.scss`,
  `_primitives.scss`, `bond.scss`, `duration.scss`, `yieldcurve.scss`, `_treasury-futures.scss`.
- Axis tick count is width-blind: `LineChartInner.tsx:164` / `ScatterChartInner.tsx:244` use
  `numTicks={isMobile ? 5 : 8}`, which ignores the actual chart width (charts in a 2-column row are narrow
  on desktop too).

### Gaps
| # | Gap | Plan |
|---|---|---|
| G1 | No automated way to prove "no overlap / no clipping / no overflow" | 01 |
| G2 | Width-blind ticks, ad-hoc breakpoints, chart label collisions, sidebar truncation | 02 |
| G3 | Per-lab layout defects; treasury view logic and i18n debt | 03 |
| G4 | Duration lab teaches by watching, not predicting; no two-bond compare | 04 |
| G5 | Treasury: CTD switch not felt; can't predict CTD | 05 |
| G6 | Yield curve: shocks are static, bootstrap not steppable/playable, state not linkable | 06 |
| G7 | No game-like FI lab (immunisation rounds, W6 in LABS_PLAN) | 07 |
| G8 | Swaps and callable bonds exist only as guide figures | 08, 09 |
| G9 | Final cross-width, theme and language sign-off | 10 |

## 2. Key decisions

- **Harness first (plan 01):** `scripts/layout-audit.mjs`, a dependency-free CDP script (no Playwright, no
  new deps) that emulates widths, measures geometry, writes screenshots and exits non-zero on defects.
  Every later plan must end with this audit green for its pages. Reason: "impeccable UI" is only
  enforceable if executors can run it.
- **Fix layout at the primitive level** (plan 02) before the per-lab pass (03): width-aware ticks in the
  shared charts fix every lab at once (DRY).
- **New FI modules, not new tabs**, for immunisation, swaps, callable bonds: each gets a registry entry +
  `src/features/<name>/` (project rule). Their math is **promoted** from the guide files into
  `src/lib/finance/`, and the guide files re-export from there (no duplicate math).
- **Interaction types per lab** (LABS_PLAN T-codes): duration → predict + explain (T3) and seesaw compare
  (T7); treasury → drag yield, watch CTD jump (T1) + predict CTD (T3); yield curve → animated scenario
  shocks (T12+T5) and step-through bootstrap (T4); immunisation → rounds game (T11); swaps → drag curve,
  watch the MTM split into legs (T1+T8); callable → drag yield on a price–yield chart with the negative
  convexity region and a call-decision timeline (T1+T6).
- W7 (historic Treasury curve replay) is **not** in this pack: it needs an external dataset; the owner
  must decide on data sourcing first.

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-layout-audit-harness.md) | Layout audit harness | – | M | Sonnet | done (2026-10-19) |
| [02](02-responsive-foundations.md) | Responsive foundations (breakpoints, ticks, labels, sidebar) | 01 | M | Sonnet | done (2026-10-19) |
| [03](03-fi-layout-pass-and-treasury-cleanup.md) | Per-lab layout pass + treasury cleanup | 01, 02 | M | Sonnet | done (2026-10-24) |
| [04](04-duration-predict-and-compare.md) | Duration: predict the shock, compare two bonds | 01, 03 | M | Sonnet | done (2026-10-28) |
| [05](05-treasury-ctd-switch.md) | Treasury: yield-shift CTD switch + predict CTD | 01, 03 | M | Sonnet | done (2026-10-28) |
| [06](06-yield-curve-shocks-and-bootstrap.md) | Yield curve: animated shocks, bootstrap stepper, URL tab | 01, 02 | M | Sonnet | done (2026-10-19; layout-audit not yet run, see Findings) |
| [07](07-immunization-rounds-lab.md) | New lab: immunisation rounds game | 01, 02 | L | Sonnet | done (2026-10-19) |
| [08](08-swap-lab.md) | New lab: interest rate swap | 01, 02 | L | Sonnet | done (2026-10-24) |
| [09](09-callable-bond-lab.md) | New lab: callable bond | 01, 02 | M | Sonnet | done (2026-10-28) |
| [10](10-final-qa.md) | Final cross-width / theme / language QA | all | S | Sonnet | todo |

Order: 01 → 02 → 03, then 04, 05, 06 in any order (different feature folders), then 07, 08, 09.
**07, 08, 09 all edit `src/modules/registry.ts`, `src/i18n.tsx` and `src/styles/main.scss`: run them one
after another**, never in parallel. 10 last.
When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.

## 4. Rules for every executor

- Read `CLAUDE.md`. Hard rules: DRY; math in `*.math.ts` / `src/lib/**` (no React there); types in
  `*.types.ts`; **`.tsx` ≤ ~150 lines** (split as part of the same change); styles in SCSS under
  `src/styles/**` with tokens as CSS custom properties; **all user text through i18n** (`useI18n()`, string
  tables `src/Language/<Name>.ts` + `<Name>.hu.ts`, both languages); `///` doc comments on exported math.
- Owner preferences: **no pills/capsules** for nav or decorative labels; **never left-border accents** for
  active/selected states (use background or colour); no inline quizzes in guides; derivatives labs are
  hands-off; Hungarian copy you write is a draft — list new HU strings in Findings for owner review.
- Reuse the primitives in §1. Do not build a private copy of anything listed there.
- Every drag has a keyboard / input equivalent; animations respect `prefers-reduced-motion`
  (`usePlayback` already does).
- Platform: Windows 11, Git Bash + PowerShell. In Git Bash prefix CDP commands with `MSYS_NO_PATHCONV=1`.
  After starting a dev/preview server, stop it and confirm the port is free (`netstat -ano | grep :PORT`).
- Do not edit `docs/LABS_PLAN.md` beyond appending one Log line per plan
  (`- HH:MM fixed-income-labs NN: <summary>`).
- Standard verification:

```bash
npx tsc -b && npm run lint && npm run test:labs && npm run test:yield-curve && npm run test:treasury-futures
npm run build
npx vite preview --port 4173 --strictPort &
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/bond-pricing,/yield-curve,/duration-convexity,/treasury-futures,/hu/bond-pricing" --ignore "_vercel"
```

## 5. Definition of done

- `layout-audit.mjs --group fixed-income` exits 0 at 360, 390, 768, 1024, 1280, 1536 px, light and dark,
  `/` and `/hu/` (no allowlist entries without a written reason in plan 10's Findings).
- No FI `.tsx` above ~150 lines; no business math in FI components; no hard-coded user text in FI.
- Each FI lab has at least one non-slider interaction (drag on chart, predict-reveal, playback, or game).
- tsc, lint, all `test:*` scripts, build green; cdp-smoke shows no console errors.
- New modules appear in nav, home, sitemap automatically via the registry.
