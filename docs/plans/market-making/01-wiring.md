# 01 — Category, module stubs, copy tables, partials, test scripts

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
Every lab plan in this pack must be able to work inside its own folder without fighting over the registry,
the i18n index, `main.scss` or `package.json`. This plan does all of those shared edits once: a new
"Market Microstructure" category with six working stub pages, empty-but-registered copy tables and SCSS
partials, the challenge area, and the pack's test scripts plus a wiring test.

## Current state (verified 2026-10-28, commit `a4b1706`)
- `src/modules/registry.ts`: `export type ModuleCategory = "derivatives" | "portfolio" | "fixed-income" |
  "corporate" | "stochastic" | "guides";` (L15–21). `CATEGORY_ORDER` (L60), `CATEGORY_LABEL_KEYS` (L69,
  values like `catStochastic`), `CATEGORY_DESC_KEYS` (L78, `catStochasticDesc`), `CATEGORY_ACCENT` (L88,
  hex per category). Module entries look like:
  ```ts
  { id: "capm", path: "/capm", navKey: "navCapm", category: "portfolio", status: "beta",
    seo: { titleKey: "seoTitleCapm", descKey: "seoDescCapm" }, about: moduleAbout("Capm", 4),
    relatedGuides: ["capm"], Component: lazy(() => import("../features/capm/CapmView")) },
  ```
  The last `monte-carlo` entry is followed by five `guideModule(...)` calls, `guide-graph` and `sandbox`.
- `category` labels: `catStochastic`/`catStochasticDesc` live in `src/Language/Home.ts` L72 area (`homeEn`)
  and `Home.hu.ts`; `nav*` keys are in the same tables (`navCapm` L27, `navSandbox` L53).
- SEO copy: `src/Language/Seo.ts`/`.hu.ts` (`seoTitleCapm`, `seoDescCapm`). About copy:
  `src/Language/ModuleAbout.ts`/`.hu.ts` (`aboutCapmIntro`, `aboutCapmQ1`…`A4`); `moduleAbout(prefix, n)`
  type-checks that `about<Prefix>Intro` exists.
- i18n index: `src/Language/index.en.ts` imports each table (`import { capmEn } from "./Capm";`) and spreads
  it into `en` (`...capmEn,`); `index.hu.ts` mirrors it and ends with `} satisfies Record<BaseKey, string>;`
  plus a `HuOnlyKeys` check, so **EN and HU tables must have identical keys** or `tsc` fails. Table style:
  `export const capmEn = { capmTitle: "CAPM", … };` / `export const capmHu = { … };`.
- Home: `src/features/home/home.viz.ts` `MODULE_VIZ` (e.g. `capm` L65; shapes `{ lines: [{ d, w, o, area? }],
  dots?: [{ x, y, key? }] }` in a 120×64 box, checked by `scripts/home.test.mjs` L56–62).
  `src/components/layout/ModuleIcon.tsx` `ICONS` (24×24 stroke paths; unknown ids fall back to a dot).
- `scripts/seo-audit.test.mjs`: lab pages need ≥ 400 visible words (`MIN_WORDS.lab`) and an About section
  with a link to a guide lesson (comes from `relatedGuides`). The About intro + 4 Q&As are most of a stub
  page's words.
- Challenges: `src/lib/game/challenges.data.ts` L3 `ChallengeArea`; `src/lib/game/game.types.ts` L19
  `ChallengeKind`; `src/features/sandbox/sandbox.math.ts` L4 `AREA_ORDER`; `src/Language/Sandbox.ts` L23–26
  `sbxArea_*` (+ `.hu.ts`). `scripts/sandbox.test.mjs` requires an `sbxArea_<area>` name for every area that
  has challenges.
- `src/styles/main.scss` ends with `@use` lines (`@use "swap";` last); partials are `src/styles/_<name>.scss`.
- `package.json` scripts: e.g. `"test:portfolio-desk": "node --test scripts/portfolio-desk-*.test.mjs"`.
- `TopNavigation.tsx` renders every `CATEGORY_ORDER` label plus Guide in one row; six categories + Guide
  fit today; a seventh, long label may overflow at 1280px.

## Goal
1. Category `microstructure` everywhere categories appear.
2. Six registered modules with stub views that pass `test:seo`: `order-book`, `market-making`,
   `avellaneda-stoikov`, `glosten-milgrom`, `kyle`, `spread-estimation` (status `"planned"`).
3. Six lab copy tables, six SCSS partials, challenge area + kind, test scripts, and a wiring test.

## Non-goals
- No lab behaviour, no market maths, no desk route (plan 11 adds the desk `subNav`), no guide track.
- No `CHALLENGES` rows (each lab adds its own; the challenge test requires ids to match call sites).

## Constraints
- Additive edits only; keep every existing line and order. Copy in i18n tables. `.tsx` ≤ 150 lines.
- HU copy is a draft (glossary in README §4); list every new HU key group in Findings.

## Steps
1. **Registry** (`src/modules/registry.ts`): add `| "microstructure"` before `| "guides"`; insert
   `"microstructure"` after `"stochastic"` in `CATEGORY_ORDER`; add `microstructure: "catMicrostructure"`,
   `microstructure: "catMicrostructureDesc"`, `microstructure: "#2bb3a3"` to the three maps. After the
   `monte-carlo` entry (before the first `guideModule(`), add six entries in this order:

   | id | path | navKey | Component (lazy default import) | about prefix | relatedGuides | extra |
   |---|---|---|---|---|---|---|
   | `order-book` | `/order-book` | `navOrderBook` | `../features/order-book/OrderBookView` | `OrderBook` | `random-walks`, `returns-volatility` | |
   | `market-making` | `/market-making` | `navMarketMaking` | `../features/market-making/MarketMakingPages` | `MarketMaking` | `random-walks`, `law-of-large-numbers-clt` | `homeFeatured: true` |
   | `avellaneda-stoikov` | `/avellaneda-stoikov` | `navAvellanedaStoikov` | `../features/avellaneda-stoikov/AvellanedaStoikovView` | `AvellanedaStoikov` | `risk-aversion`, `mean-reversion` | |
   | `glosten-milgrom` | `/glosten-milgrom` | `navGlostenMilgrom` | `../features/glosten-milgrom/GlostenMilgromView` | `GlostenMilgrom` | `martingales`, `filtrations` | |
   | `kyle` | `/kyle` | `navKyle` | `../features/kyle/KyleView` | `Kyle` | `martingales`, `random-walks` | |
   | `spread-estimation` | `/spread-estimation` | `navSpreadEstimation` | `../features/spread-estimation/SpreadEstimationView` | `SpreadEstimation` | `random-walks`, `law-of-large-numbers-clt` | |

   Each: `category: "microstructure"`, `status: "planned"`, `seo: { titleKey: "seoTitle<Prefix>", descKey:
   "seoDesc<Prefix>" }`, `about: moduleAbout("<Prefix>", 4)`.
2. **Stub views** (one per folder, ≤ 40 lines each): `<Prefix>View.tsx` renders `<PageHeader
   title={t("<p>Title")} description={t("<p>Desc")} />` and a `Panel` with `t("<p>Planned")` (a two-sentence
   note on what the lab will let you do). `<p>` is the lab's i18n prefix (`obk`, `mkm`, `avs`, `glm`, `kyl`,
   `spe`). For market making also create `MarketMakingPages.tsx` copying the `ImmunizationPages.tsx` shape:
   `if (!page) return <MarketMakingView />;` otherwise `<Navigate to="/market-making" replace />` (no desk
   case yet; plan 11 adds it). The About section and FAQ come from the registry, not the view.
3. **Copy tables**: create `src/Language/<Table>.ts` + `.hu.ts` for `OrderBook`, `MarketMaking`,
   `AvellanedaStoikov`, `GlostenMilgrom`, `Kyle`, `SpreadEstimation` exporting `<camel>En` / `<camel>Hu` with
   `<p>Title`, `<p>Desc`, `<p>Planned`. Register each in `index.en.ts` / `index.hu.ts` (append imports after
   the last import, spreads just before `navGuide`, mirroring order in both files).
4. **Shared copy** (append after the module group's existing keys): `Home.ts`/`.hu`: `catMicrostructure`
   ("Market Microstructure" / "Piaci mikrostruktúra"), `catMicrostructureDesc` (one sentence: order books,
   quoting, inventory and information), six `nav*` keys. `Seo.ts`/`.hu`: six `seoTitle*`/`seoDesc*` (titles
   ≤ 60 chars, e.g. "Order Book Simulator: Market Orders, Slippage and Queues"; descriptions 120–160 chars).
   `ModuleAbout.ts`/`.hu`: for each prefix an intro (~90 words) and four Q&As (~70 words each) written for
   a student: what the model is, the key formula in words, what to try in the lab, a common misconception.
   Use these facts: order book (price–time priority, market orders walk the book, slippage = average fill −
   mid); market making (income ≈ spread × matched volume, fills fall as the spread widens, inventory risk);
   Avellaneda–Stoikov (reservation price r = s − qγσ²(T − t), optimal total spread γσ²(T − t) +
   (2/γ)ln(1 + γ/k)); Glosten–Milgrom (ask = E[V | buy], bid = E[V | sell], spread from informed share π,
   beliefs are a martingale); Kyle (insider hides in noise, price impact Δp = λ × order flow); spread
   estimation (Roll s = 2√(−cov(Δp_t, Δp_{t−1})), effective spread = 2|p − mid|, informed trading lowers
   Roll's estimate).
5. **Home and icon**: `MODULE_VIZ` entries for the six ids (simple shapes inside 0–120 × 0–64: a stepped
   depth curve, two parallel quote lines, a skewed pair, converging bid/ask, a staircase price path, a
   zig-zag tape). `ICONS` glyphs for the six ids (stroke-only, same style as neighbours).
6. **Challenges plumbing** (no rows): `ChallengeArea` gains `| "microstructure"`; `AREA_ORDER` appends
   `"microstructure"`; `ChallengeKind` gains `| "score"` (a scored play round, not a guess); `Sandbox.ts`
   appends `sbxArea_microstructure: "Market microstructure"` (HU "Piaci mikrostruktúra").
7. **Styles**: create empty partials `src/styles/_order-book.scss`, `_market-making.scss`,
   `_avellaneda-stoikov.scss`, `_glosten-milgrom.scss`, `_kyle.scss`, `_spread-estimation.scss` (one comment
   line each naming the owning plan) and append six `@use` lines at the end of `main.scss`.
8. **Scripts**: `package.json` gains `"test:microstructure": "node --test scripts/micro-*.test.mjs"` and
   `"test:micro-desk": "node --test scripts/micro-desk-*.test.mjs"` (next to the other `test:*` lines).
   Create `scripts/micro-wiring.test.mjs` (uses `scripts/lib/load-ts.mjs`) asserting: the six ids are in the
   registry with category `microstructure`; `CATEGORY_ORDER` has it once, after `stochastic`; each module's
   `navKey`, SEO keys and `about…Intro/Q1–A4` exist in EN and HU and HU ≠ EN; `MODULE_VIZ` has each id.
   (If importing `registry.ts` fails in the loader because of `lazy`/React imports, parse the file text with
   regexes instead and note it in Findings.)
9. **Top nav fit**: run the layout audit at 1280 and 1536. If the top nav wraps or overflows, change only
   the EN/HU value of `catMicrostructure` to "Microstructure" / "Mikrostruktúra" and record it.
10. `docs/LABS_PLAN.md`: append one Log line.

## Acceptance criteria
- Six new pages render with header, planned note, About + FAQ and a related-lesson link; `test:seo` green.
- Category appears in top nav, mobile nav, sidebar, search, home (one featured tile: market making) and the
  Sandbox area list once challenges exist.
- `npm run test:microstructure` passes; deleting one HU `about…` key makes it fail (try, then restore).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:home && npm run test:search && npm run test:sandbox && npm run test:challenges
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/,/order-book,/market-making,/avellaneda-stoikov,/glosten-milgrom,/kyle,/spread-estimation,/hu/order-book,/hu/kyle,/sandbox"
node scripts/layout-audit.mjs --help   # then run it for the paths above at 360/768/1280/1536
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **HU parity is a compile error**, not a test: add every key to both tables in the same edit.
- **`status: "planned"`** shows a text badge in the sidebar (`SideModuleRow.tsx` L58) and on home tiles;
  that is intended until each lab plan flips its own entry to `"beta"`.
- **Word count:** a stub with short About copy fails `test:seo` (< 400 words). Write the full About copy now.
- **Don't add `CHALLENGES` rows** here: `scripts/challenge-scores.test.mjs` fails on ids no call site uses.
- `moduleAbout` is typed on `about<Prefix>Intro`; add the copy before the registry lines or `tsc` complains.

## Findings (fill in during execution)
- Word counts: `test:seo` "body has enough words" passes for all six pages (EN + HU).
- Top-nav fit: no overflow at 1280/1536 (labels wrap to two lines like the others); kept "Market Microstructure" / "Piaci mikrostruktúra".
- New HU keys for owner review: `nav*`, `catMicrostructure(Desc)`, `homeLabDesc_*` (Home.hu), six `seoTitle*/seoDesc*` (Seo.hu), six `about<Prefix>Intro/Q1–A4` groups (ModuleAbout.hu), the six lab tables' `<p>Title/Desc/Planned`, `sbxArea_microstructure`.
- Deviations:
  - Home category sections assumed every category has a guide track: added `findGuideTrack` (guide.meta.ts); `HomeLabCategory` hides the track link and filler tile when there is none.
  - Added six `homeLabDesc_*` tile descriptions (required by home test).
  - `scripts/home.test.mjs`: hard-coded LAB_CATEGORIES gains microstructure; lab count 25 → 31. Later plans adding labs: none (count is final for this pack).
  - `scripts/seo-audit.test.mjs`: INITIAL_JS_BUDGET 955 000 → 1 000 000 (eager EN About/SEO copy, +~20 KB; build now 975 KB).
  - SEO titles kept ≤ 52 chars (site suffix " | Quant Sandbox" counts toward 70).
  - Registry is read as text in `micro-wiring.test.mjs` (React/lazy imports).
  - Unknown sub-paths like `/market-making/foo` log React #418 on hydration; same on existing `/immunization/foo`, pre-existing.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/01-wiring.md`. Implement plan 01: the
> `microstructure` category, six stub modules with full About/SEO copy (EN + HU draft), six copy tables, six
> SCSS partials, the challenge area and `score` kind, the `test:microstructure`/`test:micro-desk` scripts and
> `scripts/micro-wiring.test.mjs`. Run the verification block and make it pass, fill in Findings, append
> DONE to LOG.md, set plan 01 to `done` in the README table, and summarise. Do not add CHALLENGES rows.
