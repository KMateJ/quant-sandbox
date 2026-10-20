# 03 — Home model, mini visuals, fan math + harness

Status: done (2026-10-20) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The new home is mostly data: which lab is featured per area, a small line drawing per lab, numbered
codes, counts, and the hero's simulated price paths. Putting that in pure, tested modules keeps the
views thin (CLAUDE.md: views ≤ ~150 lines, no math in `.tsx`) and gives plans 05–06 a harness.

## Current state (verified 2026-10-20)
- `src/modules/registry.ts`: `export interface ModuleDef { id; path; navKey; icon?; category?;
  status: "live" | "beta" | "planned"; seo; about?; Component; end?; relatedGuides?; intuition?; subNav? }`.
  `CATEGORY_ORDER = ["derivatives","portfolio","fixed-income","corporate","stochastic","guides"]`.
  `modulesInCategory(category)` filters `modules` in registry order. Module ids by category:
  - derivatives: `payoff`, `binomial`, `black-scholes`, `heston`, `delta-hedging`
  - fixed-income: `bond-pricing`, `yield-curve`, `duration-convexity`, `treasury-futures`, `immunization`
  - portfolio: `risk-return`, `capm`, `portfolio-lab`, `efficient-frontier`
  - corporate: `npv-irr`, `valuation`, `tvm`, `wacc`, `capital-structure`
  - stochastic: `stochastic-models`, `brownian-motion`, `gbm`, `ito-process`, `monte-carlo`
  - guides: generated guide-track modules + `guide-graph` (**not** part of the labs index)
- `src/lib/math/random.ts` has no imports: `makeRng(seed): Rng` (mulberry32) and `nextNormal(rng)`.
- Test pattern (copy from `scripts/capm-lab.test.mjs`): a `load(url)` helper transpiles a `.ts` file
  with `typescript.transpileModule` and rewrites **relative** imports to `data:` URLs. Bare imports
  (e.g. `react`) and `.tsx` files cannot be loaded this way — `registry.ts` itself is NOT loadable.

## Goal
1. `homeFeatured?: boolean` on `ModuleDef`, set on exactly one lab per lab category.
2. Pure modules in `src/features/home/`: `home.types.ts`, `home.viz.ts`, `home.fan.math.ts`,
   `home.model.ts`.
3. `scripts/home.test.mjs` + `npm run test:home`.

## Non-goals
- No React components, no SCSS (plan 05).
- Do not change any lab's behaviour.

## Constraints
- `home.*.ts` files import only relative pure modules (types, `../../lib/math/random`); never
  `registry.ts`, React, or `.tsx`.
- `///` doc comments on exports.

## Steps
1. **Registry.** In `ModuleDef` add `/// Shown as the large tile of its area on the home page.` +
   `homeFeatured?: boolean;`. Set `homeFeatured: true` on `black-scholes`, `efficient-frontier`,
   `yield-curve`, `valuation`, `stochastic-models`.
2. **`home.types.ts`:**
   ```ts
   export type VizLine = { d: string; w: number; o: number; area?: boolean };
   export type VizDot = { x: number; y: number; key?: boolean };
   /// A lab's mini drawing in a 120×64 box; the LAST line is the key line (accent colour).
   export type ModuleViz = { lines: VizLine[]; dots?: VizDot[] };
   export type HomeTileInput = { id: string; featured: boolean };
   export type HomeTile = { id: string; code: string; featured: boolean };
   export type FanParams = { seed: number; paths: number; steps: number; mu: number; sigma: number;
     s0: number; lo: number; hi: number; x0: number; x1: number; yTop: number; yBottom: number; bins: number };
   export type FanArt = { paths: { d: string; end: number }[]; keyIndex: number; mean: string;
     bins: { y: number; h: number; w: number }[]; y0: number };
   ```
3. **`home.viz.ts`:** `export const MODULE_VIZ: Record<string, ModuleViz>` with one entry per lab id
   above (24). Use these drawings (viewBox `0 0 120 64`; `w` = stroke width, `o` = opacity):
   | id | lines (last = key) | dots |
   |---|---|---|
   | payoff | `M6 52 H114` (1, .25); `M6 52 H60 L114 10` (1.6, 1, area) | – |
   | binomial | `M10 32 L60 14 M10 32 L60 50 M60 14 L110 4 M60 14 L110 32 M60 50 L110 32 M60 50 L110 60` (1, .5) | (10,32 key) (60,14) (60,50) (110,4) (110,32) (110,60) |
   | black-scholes | `M6 56 H60 L114 6` (1,.3); `M6 56 C46 56 62 50 76 40 S104 18 114 12` (1,.45); `M6 55 C40 54 56 46 70 34 S100 10 114 4` (1.8,1,area) | (70,34 key) |
   | heston | `M6 22 C30 44 58 50 74 48 S104 34 114 24` (1,.4); `M6 12 C30 46 58 54 74 50 S104 30 114 14` (1.6,1) | – |
   | delta-hedging | `M6 55 C40 54 56 46 70 34 S100 10 114 4` (1,.35); `M6 54 H24 V48 H42 V40 H60 V30 H78 V20 H96 V11 H114` (1.4,1) | – |
   | bond-pricing | `M6 8 C30 30 60 46 114 56` (1.6,1,area) | (40,33 key) |
   | yield-curve | `M6 50 C30 26 54 14 76 24 S104 20 114 10` (1,.4); `M6 50 C30 32 60 22 114 16` (1.8,1,area) | (6,50)(20,41)(38,32)(60,25)(86,20 key)(114,16) |
   | duration-convexity | `M16 4 L98 62` (1,.4); `M6 10 C34 36 70 50 114 56` (1.6,1,area) | (52,40 key) |
   | treasury-futures | `M6 44 L114 30` (1,.35); `M6 56 L114 14` (1,.35); `M6 50 L114 20` (1.6,1) | – |
   | immunization | `M6 22 C40 46 80 46 114 22` (1,.4); `M6 42 C40 18 80 18 114 42` (1.6,1) | (60,32 key) |
   | risk-return | `M6 58 L114 6` (1,.25) | (18,50)(30,44)(38,48)(50,36)(58,40)(70,28)(78,34)(92,20 key)(104,24) |
   | capm | `M6 54 L114 10` (1.6,1) | (24,44)(44,40)(62,26)(82,26 key)(98,14) |
   | portfolio-lab | `M74 6 C30 18 30 46 74 58` (1.6,1) | (74,6)(74,58)(41,32 key) |
   | efficient-frontier | `M6 46 L114 4` (1,.4); `M84 6 C40 16 30 38 62 58` (1.8,1) | (52,22 key) |
   | npv-irr | `M6 34 H114` (1,.3); `M6 10 C40 24 70 38 114 54` (1.6,1) | (62,34 key) |
   | valuation | `M14 58 V46 M30 58 V42 M46 58 V37 M62 58 V32 M78 58 V28` (7,.55); `M102 58 V12` (12,1) | – |
   | tvm | `M6 56 C50 54 82 40 114 6` (1.6,1,area) | – |
   | wacc | `M6 18 C40 50 70 52 114 22` (1.6,1) | (58,44 key) |
   | capital-structure | `M6 50 C50 46 80 34 114 30` (1,.4); `M6 50 L114 16` (1.6,1) | – |
   | stochastic-models | `M6 34 L18 38 L30 30 L42 36 L54 40 L66 34 L78 42 L90 38 L102 46 L114 42` (1,.35); `M6 34 L18 30 L30 24 L42 28 L54 16 L66 20 L78 12 L90 16 L102 8 L114 10` (1,.35); `M6 34 L14 28 L22 32 L30 24 L38 30 L46 22 L54 26 L62 18 L70 24 L78 20 L86 28 L94 22 L102 26 L114 16` (1.6,1) | – |
   | brownian-motion | `M6 34 L20 40 L34 36 L48 44 L62 40 L76 48 L90 42 L104 50 L114 46` (1,.4); same walk as above (1.5,1) | – |
   | gbm | `M6 46 C50 44 80 34 114 22` (1,.3); `M6 46 L20 48 L34 44 L48 46 L62 42 L76 44 L90 40 L104 42 L114 38` (1,.4); `M6 46 L20 42 L34 44 L48 36 L62 38 L76 28 L90 30 L104 18 L114 12` (1.5,1) | – |
   | ito-process | `M6 50 L114 14` (1,.35); `M6 50 L18 44 L30 46 L42 38 L54 40 L66 32 L78 30 L90 24 L102 22 L114 16` (1.5,1) | – |
   | monte-carlo | `M6 32 H114` (1,.35); `M6 10 L18 50 L30 18 L42 44 L54 24 L66 38 L78 28 L90 35 L102 30 L114 33` (1.5,1) | – |
   Also export `GUIDE_FILLER_VIZ: ModuleViz` = lines `M6 14 H70 M6 26 H96 M6 38 H84` (1,.4) and
   `M6 50 H60` (1.5,1), and `/// Closed area under an `area` line, down to the box bottom.`
   `export function areaPath(d: string): string { return `${d} L114 64 L6 64 Z`; }`
4. **`home.fan.math.ts`:**
   `export function buildFan(p: FanParams): FanArt` — for each path start at `s0`, step
   `s *= exp((mu - sigma²/2)·dt + sigma·√dt·nextNormal(rng))` with `dt = 1/steps`, `rng = makeRng(p.seed)`;
   map `x = x0 + i/steps·(x1−x0)`, `y = yBottom − (clamp(s, lo, hi) − lo)/(hi − lo)·(yBottom − yTop)`;
   `d` as `M x y L x y …` with 1 decimal. Sort paths by `end`; `keyIndex = round(0.75·(paths−1))`.
   `mean` = the expected path `s0·exp(mu·t)`. `bins`: histogram of `end` over `[lo, hi]` into
   `p.bins` buckets laid out vertically between `yTop` and `yBottom`, `w` = count/max·88, `h` = bucket
   height − 2. `y0` = y of `s0`. Hero defaults (export `HERO_FAN: FanParams`): seed 7, paths 70,
   steps 56, mu .07, sigma .3, s0 100, lo 40, hi 230, x0 40, x1 600, yTop 40, yBottom 380, bins 24.
5. **`home.model.ts`:**
   - `/// Featured lab first, then the rest in registry order; codes "01.1", "01.2", ….`
     `export function orderTiles(categoryIndex: number, mods: HomeTileInput[]): HomeTile[]`
   - `/// True when a 4-column bento needs a guide tile to close its second row.`
     `export function needsGuideFiller(count: number): boolean` → `count - 1 < 4` (featured + 4 small
     fills two rows exactly).
   - `export function categoryNumber(index: number): string` → `"01"…`.
   - `export function trackProgress(read: number, total: number): { label: string; pct: number }`
     → `{ label: \`${read} / ${total}\`, pct: total ? read / total : 0 }`.
6. **`scripts/home.test.mjs`** (copy `load()` from `scripts/capm-lab.test.mjs`). Tests:
   - Parse `src/modules/registry.ts` as text: split the `modules` array on `\n  {` and per chunk read
     `id: "…"`, `category: "…"` and `homeFeatured: true`. For the five lab categories: every id has a
     `MODULE_VIZ` entry, no extra keys exist, exactly one `homeFeatured` per category.
   - Every viz line `d` only uses coordinates within 0–120 × 0–64; every line has `w > 0`, `0 < o ≤ 1`.
   - `buildFan(HERO_FAN)` twice → identical output (determinism, needed for hydration); 70 paths; all
     y within `[yTop, yBottom]`; bin widths sum > 0 and counts sum to 70 (expose counts or check via
     `w` > 0 for the max bucket).
   - `orderTiles(0, [{id:"a",featured:false},{id:"b",featured:true}])` → codes `01.1`(b), `01.2`(a).
   - `needsGuideFiller(4) === true`, `needsGuideFiller(5) === false`.
   - **Break it on purpose:** temporarily delete one `MODULE_VIZ` key, see the test fail, restore.
7. `package.json` scripts: `"test:home": "node --test scripts/home.test.mjs"`.

## Acceptance criteria
- `npm run test:home` passes; the deliberate break fails as expected.
- `npx tsc -b` passes; `npx eslint src/features/home src/modules/registry.ts scripts/home.test.mjs`
  reports nothing new.
- No `.tsx` added.

## Verification
```bash
npm run test:home
npx tsc -b
npx eslint src/features/home src/modules/registry.ts scripts/home.test.mjs
```

## Pitfalls
- **`registry.ts` cannot be imported by the test loader** (it imports React `lazy` and `.tsx`); parse it
  as text as described.
- Determinism matters: the home page is pre-rendered and hydrated. Never use `Math.random()` in the
  fan; only `makeRng(seed)`.
- `nextNormal` consumes two RNG values per call; do not "optimise" it, or the art changes.
- `guides` is a registry category too (track modules, `guide-graph`); exclude it from the labs index.

## Findings (fill in during execution)
- Registry parsed as text in the harness (split on `
  {`); labs counted = 24.
- Deliberate break (deleted `tvm` viz) failed the registry test as expected; restored.
- `tsc -b` and eslint on changed files: clean. No deviations.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (sections 0 and 4) and `docs/plans/home-redesign/03-home-model.md`. Run `git status` and stop if
> `src/modules/registry.ts` or anything in `src/features/home/` has changes you didn't make. Implement plan 03:
> the `homeFeatured` registry flag, the pure `home.types.ts`, `home.viz.ts`, `home.fan.math.ts`,
> `home.model.ts`, and `scripts/home.test.mjs` with an `npm run test:home` script. Run the Verification
> commands and make them pass, including the deliberate-break check. Fill in Findings, set plan 03 to
> `done (<date>)` in the README table, and summarise.
