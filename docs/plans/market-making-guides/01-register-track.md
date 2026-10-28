# 01 — Register the track and 11 placeholder lessons

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
A new track touches about fifteen shared files (ids, track list, strings in three tables, figure registry,
SEO, registry sidebar node, colour tokens, the audit harness, GUIDES_PLAN). If eleven lesson writers each
edited them they would collide. This plan makes every shared edit once with valid placeholders, so plans
02–12 only write their own files and can run in parallel. It also turns the currently red guide audit green.

## Current state (verified 2026-10-28)
- `src/features/guide/guide.types.ts` L4: `export type GuideTrackId = "derivatives" | "portfolio" |
  "fixed-income" | "corporate" | "stochastic";` and the `GuideId` union (64 members, last
  `"correlated-brownian-motions"`).
- `src/features/guide/guide.meta.ts`: `guideLessons` (64 rows `{ id, track, titleKey, descKey, labs }`, array
  order = reading order) and `guideTracks = [track("derivatives", …), …, track("stochastic",
  "guideTrackStochasticTitle", "guideTrackStochasticDesc")]`. Track titles/descs live in `src/Language/Guide.ts`
  / `Guide.hu.ts` (`guideTrackStochasticTitle` L11).
- `src/features/guide/guide.content.types.ts`: `GuideFigureId` union.
- `src/Language/guides/index.ts`: imports each lesson export and maps id → content (`guideContent`).
- `src/features/guide/components/figures/index.ts`: maps figure id → component (`"clt-convergence":
  CltConvergenceFigure,` style). Example figure: `figures/wave4/CltConvergenceFigure.tsx` (uses
  `GuideFigure title labId`, `SliderField`, `SegmentedControl`, `FigureReadout`).
- Strings per wave: `src/Language/GuideWave4.hu.ts` (`export const guideWave4Hu = { … }`) and
  `GuideWave4.ts` (`export const guideWave4En: Record<keyof typeof guideWave4Hu, string> = { … }`),
  registered in `src/Language/index.en.ts` (import L47, spread L97), `index.hu.ts` (L46/L97) and
  `src/Language/guideTitles.hu.ts` (import + spread in `guideTitleTablesHu`).
- `src/features/guide/guide.seo.ts`: `guideSeoTitles` grouped by track (≤ 70 chars each).
- `src/modules/registry.ts`: five `guideModule("<track>", { titleKey: "seoTitleGuide<Track>", descKey:
  "seoDescGuide<Track>" })` lines (~L509–513), then `guide-graph` and `sandbox`. The six microstructure lab
  entries (ids `order-book`, `market-making`, `avellaneda-stoikov`, `glosten-milgrom`, `kyle`,
  `spread-estimation`) have `relatedGuides` pointing at stochastic lessons. **The labs pack edits this file
  in parallel** (status flips, a desk `subNav`): re-read before editing, change only the lines named here.
- `src/styles/tokens.scss`: `--track-*` at L121–125 (dark block) and L189–193 (light block).
- `scripts/guide-audit.test.mjs`: allowlists at L27–37 (`PLACEHOLDER = []`, `LAB_WITHOUT_LESSON = []`).
  Today it fails "labs no lesson practises: interest-rate-swap, order-book, market-making,
  avellaneda-stoikov, glosten-milgrom, kyle, spread-estimation, sandbox". The orphan filter (L128) skips
  `home` and `guide-*` ids only.
- Lesson `interest-rate-swaps` (in `guide.meta.ts`) does not list the `interest-rate-swap` lab module.
- `docs/GUIDES_PLAN.md` curriculum: one `### <Track>` section per track with rows
  `| n | id | Title (EN) | Owner | Status | Figure |`; the audit parses every such row in the file.
- `package.json` has `test:guide-wave4` etc.; no `test:guide-micro`.
- `README.md` (repo root) L127/L148/L166 say "64 lessons in five tracks" / "All 64 lessons" / "the 64 lessons".

## Goal
1. Track `microstructure` with the 11 lessons below registered as placeholders that typecheck, render and
   pass every guide test.
2. Audit green; `PLACEHOLDER` holds the 11 ids, one per line.
3. `npm run test:guide-micro` exists with a registry test; GUIDES_PLAN has the new table.

## Non-goals
- No lesson text, figure maths or real figures (plans 02–12). Do not reorder existing lessons.

## Constraints
- Additive edits only; keep other sessions' lines. HU strings are drafts (list them in Findings).

## Steps
1. **Types**: add `| "microstructure"` to `GuideTrackId`; append the 11 lesson ids to `GuideId` and the 11
   figure ids to `GuideFigureId` (table below).
2. **Strings** — create `src/Language/GuideMicrostructure.hu.ts` (`guideMicrostructureHu`) and
   `GuideMicrostructure.ts` (`guideMicrostructureEn: Record<keyof typeof guideMicrostructureHu, string>`).
   Top of each: `guideTrackMicrostructureTitle` ("Market microstructure" / „Piaci mikrostruktúra”),
   `guideTrackMicrostructureDesc` (EN: "Order books and queues, the bid–ask spread and what it pays for,
   informed trading from Glosten–Milgrom to Kyle, price impact and execution, inventory risk,
   Avellaneda–Stoikov quoting and market-making P&L." HU: „Ajánlati könyv és sorban állás, a bid–ask spread
   és ami mögötte van, informált kereskedés a Glosten–Milgrom-modelltől Kyle-ig, árhatás és végrehajtás,
   készletkockázat, Avellaneda–Stoikov-jegyzés és a market making eredménye.”), the 22 title/desc keys
   below, one shared `gfMsPlaceholder` ("Figure in preparation." / „Az ábra készül.”). Then **one region per
   lesson**, in reading order, holding that lesson's figure title key, so later plans add their figure strings
   inside their own region:
   ```ts
   // #region market-makers
   gfMsRoundTripTitle: "A market maker's round trip",
   // #endregion
   ```
   Register both tables in `index.en.ts`, `index.hu.ts` and `guideTitles.hu.ts` (append the import after the
   last import and the spread after the last spread in each).
3. **Lessons** (append to `guideLessons` in this order, after the last existing row):

   | id | camelCase file/export | titleKey / descKey | labs | figure id | figure component |
   |---|---|---|---|---|---|
   | `market-makers` | `marketMakers` | `guideMsMarketMakersTitle/Desc` | `["market-making"]` | `round-trip` | `RoundTripFigure` |
   | `limit-order-book` | `limitOrderBook` | `guideMsLimitOrderBookTitle/Desc` | `["order-book"]` | `book-walk` | `BookWalkFigure` |
   | `queue-position` | `queuePosition` | `guideMsQueuePositionTitle/Desc` | `["order-book"]` | `queue-fill` | `QueueFillFigure` |
   | `adverse-selection` | `adverseSelection` | `guideMsAdverseSelectionTitle/Desc` | `["market-making"]` | `toxic-income` | `ToxicIncomeFigure` |
   | `glosten-milgrom` | `glostenMilgrom` | `guideMsGlostenMilgromTitle/Desc` | `["glosten-milgrom"]` | `gm-learning` | `GmLearningFigure` |
   | `spread-measurement` | `spreadMeasurement` | `guideMsSpreadMeasurementTitle/Desc` | `["spread-estimation"]` | `roll-bounce` | `RollBounceFigure` |
   | `kyle-model` | `kyleModel` | `guideMsKyleModelTitle/Desc` | `["kyle"]` | `kyle-schedule` | `KyleScheduleFigure` |
   | `price-impact` | `priceImpact` | `guideMsPriceImpactTitle/Desc` | `["order-book"]` | `execution-frontier` | `ExecutionFrontierFigure` |
   | `inventory-risk` | `inventoryRisk` | `guideMsInventoryRiskTitle/Desc` | `["market-making"]` | `inventory-skew` | `InventorySkewFigure` |
   | `avellaneda-stoikov` | `avellanedaStoikov` | `guideMsAvellanedaStoikovTitle/Desc` | `["avellaneda-stoikov"]` | `as-quotes` | `AsQuotesFigure` |
   | `market-making-pnl` | `marketMakingPnl` | `guideMsMarketMakingPnlTitle/Desc` | `["market-making"]` | `pnl-attribution` | `PnlAttributionFigure` |

   Titles and descriptions:

   | id | EN title · desc | HU title · desc |
   |---|---|---|
   | market-makers | "Market makers and liquidity" · "Who provides liquidity, how bid and ask quotes work, the spread as the price of immediacy, makers and takers, and the risks a market maker carries." | „Market makerek és a likviditás” · „Ki nyújt likviditást, hogyan működik a bid és az ask jegyzés, a spread mint az azonnaliság ára, a maker és a taker, és milyen kockázatokat visel a market maker.” |
   | limit-order-book | "The limit order book" · "Limit and market orders, price–time priority, depth, how a market order walks the book, and slippage measured against the mid price." | „A limitáras ajánlati könyv” · „Limitáras és piaci megbízások, ár–idő prioritás, mélység, hogyan halad végig a piaci megbízás a könyvön, és a mid árhoz mért csúszás.” |
   | queue-position | "Queue position and fill probability" · "First-in, first-out queues at a price, how long a limit order waits, the chance it fills, why moving it costs priority, and why fills come just before the price moves." | „A sorban elfoglalt hely és a teljesülés valószínűsége” · „Érkezési sorrend egy árszinten, mennyit vár egy limitáras megbízás, mekkora eséllyel teljesül, miért kerül a helyébe az áthelyezés, és miért épp az ármozgás előtt jön a teljesülés.” |
   | adverse-selection | "Adverse selection and informed trading" · "Why trading with someone who knows more costs money, markouts as the measure of that cost, toxic flow, and how informed traders change the best spread." | „Kedvezőtlen kiválasztás és informált kereskedés” · „Miért kerül pénzbe az üzlet azzal, aki többet tud, a markout mint ennek mértéke, a toxikus megbízásáramlás, és hogyan tolják el az informált kereskedők a legjobb spreadet.” |
   | glosten-milgrom | "The Glosten–Milgrom model" · "A Bayesian market maker who cannot tell informed from noise traders: quotes as conditional expectations, the spread from the informed share, and beliefs that learn the value trade by trade." | „A Glosten–Milgrom-modell” · „Bayes-i market maker, aki nem tudja megkülönböztetni az informált és a zajkereskedőt: jegyzések mint feltételes várható értékek, a spread az informáltak arányából, és kötésről kötésre tanuló hiedelmek.” |
   | spread-measurement | "Measuring and decomposing the bid–ask spread" · "Quoted, effective and realised spreads, the Roll estimator from trade prices alone, and the split into adverse selection and the rest." | „A bid–ask spread mérése és felbontása” · „Jegyzett, effektív és realizált spread, a Roll-becslés pusztán a kötési árakból, és a felbontás kedvezőtlen kiválasztásra és a többire.” |
   | kyle-model | "Informed trading and Kyle's lambda" · "An insider hiding among noise traders, a market maker who prices from total order flow, the price-impact coefficient λ, and why the insider trades gradually." | „Informált kereskedés és Kyle lambdája” · „A zajkereskedők közé rejtőző bennfentes, a teljes megbízásáramlásból árazó market maker, a λ árhatás-együttható, és miért kereskedik a bennfentes fokozatosan.” |
   | price-impact | "Price impact and optimal execution" · "Temporary and permanent impact, the square-root rule of thumb, splitting a large order over time, and the Almgren–Chriss trade-off between cost and risk." | „Árhatás és optimális végrehajtás” · „Átmeneti és tartós árhatás, a négyzetgyök-szabály, egy nagy megbízás időbeli szétosztása, és az Almgren–Chriss-féle átváltás költség és kockázat között.” |
   | inventory-risk | "Inventory risk and quote skewing" · "How a maker's position turns price moves into profit and loss, why that risk grows with position and time, and how shading both quotes pulls inventory back to zero." | „Készletkockázat és a jegyzések eltolása” · „Hogyan fordítja a market maker pozíciója az ármozgást eredménnyé, miért nő ez a kockázat a pozícióval és az idővel, és hogyan húzza vissza a készletet nullára a két jegyzés eltolása.” |
   | avellaneda-stoikov | "Optimal quoting: the Avellaneda–Stoikov model" · "Exponential utility, fills that fall off with distance from the mid, the reservation price, the optimal spread, and what risk aversion and time to the close do to the quotes." | „Optimális jegyzés: az Avellaneda–Stoikov-modell” · „Exponenciális hasznosság, a mid ártól távolodva ritkuló teljesülések, a rezervációs ár, az optimális spread, és mit tesz a jegyzésekkel a kockázatkerülés és a zárásig hátralévő idő.” |
   | market-making-pnl | "Market making profit and loss attribution" · "Splitting a maker's P&L into spread capture, adverse selection, inventory and fees, with markout curves, fill ratios and the numbers a desk watches." | „A market making eredményének felbontása” · „A market maker eredményének felbontása spreadbevételre, kedvezőtlen kiválasztásra, készletre és díjakra, markout-görbék, teljesülési arányok és a számok, amelyeket egy desk figyel.” |

4. **Lesson placeholders** `src/Language/guides/<camelCase>.ts` (11 files), each with the figure so the
   "every figure id is used" rule holds:
   ```ts
   export const marketMakers: GuideLessonContent = {
     en: [p("This lesson is being written."), figure("round-trip"), h("Summary"), list("Coming soon."), lab("/market-making", "Open the lab")],
     hu: [p("Ez a lecke készül."), figure("round-trip"), h("Összefoglalás"), list("Hamarosan."), lab("/market-making", "Nyisd meg a labort")],
   };
   ```
   (copy the import line and type from an existing placeholder-era file, e.g. the git history of
   `src/Language/guides/curveRisk.ts`, or from `annuities.ts`), and the 11 entries in `guides/index.ts`.
5. **Figure placeholders** `src/features/guide/components/figures/microstructure/<Component>.tsx`:
   `<GuideFigure title={t("gfMs<Name>Title")} labId="<lab id>"><p className="gf-placeholder">{t("gfMsPlaceholder")}</p></GuideFigure>`;
   register the 11 in `figures/index.ts` (append after the last entry).
6. **Track**: append `track("microstructure", "guideTrackMicrostructureTitle", "guideTrackMicrostructureDesc")`
   to `guideTracks`. Registry: add `guideModule("microstructure", { titleKey: "seoTitleGuideMicrostructure",
   descKey: "seoDescGuideMicrostructure" }),` right after the `guideModule("stochastic", …)` line; `Seo.ts`/
   `.hu.ts`: `seoTitleGuideMicrostructure` ("Market Microstructure Course: Order Books, Spreads and Market
   Making" / HU equivalent), `seoDescGuideMicrostructure` (120–160 chars), appended after the other
   `seoDescGuide*` keys.
7. **Colour**: `--track-microstructure: #5cb8ae;` after `--track-stochastic` in the dark block and
   `--track-microstructure: #23807a;` in the light block of `tokens.scss`.
8. **SEO titles** in `guide.seo.ts` (new group at the end): market-makers "Market Makers Explained: Bid, Ask,
   Spread and Liquidity"; limit-order-book "Limit Order Book Explained: Price–Time Priority and Slippage";
   queue-position "Queue Position and Fill Probability of Limit Orders"; adverse-selection "Adverse Selection
   in Market Making: Markouts and Toxic Flow"; glosten-milgrom "Glosten–Milgrom Model: The Spread from
   Informed Trading"; spread-measurement "Roll Estimator and Bid–Ask Spread Decomposition"; kyle-model "Kyle
   Model and Kyle's Lambda: Insider Trading and Price Impact"; price-impact "Almgren–Chriss Optimal Execution
   and Price Impact"; inventory-risk "Market Maker Inventory Risk and Quote Skewing"; avellaneda-stoikov
   "Avellaneda–Stoikov Model: Reservation Price and Optimal Spread"; market-making-pnl "Market Making P&L
   Attribution: Spread, Adverse Selection, Inventory". Check each ≤ 70 chars.
9. **Labs ↔ lessons**: retarget `relatedGuides` of the six microstructure lab entries in the registry:
   order-book `["limit-order-book", "queue-position", "price-impact"]`; market-making `["market-makers",
   "adverse-selection", "market-making-pnl"]`; avellaneda-stoikov `["inventory-risk", "avellaneda-stoikov"]`;
   glosten-milgrom `["glosten-milgrom", "adverse-selection"]`; kyle `["kyle-model", "price-impact"]`;
   spread-estimation `["spread-measurement", "glosten-milgrom"]`. Add `"interest-rate-swap"` to the
   `interest-rate-swaps` lesson's `labs`, and extend the audit's orphan filter (L128) with
   `m !== "sandbox"` (Sandbox lists games, it is not a lab). Re-run the audit: the orphan rule must pass.
10. **Harness**: `scripts/guide-audit.test.mjs` `PLACEHOLDER` holds the 11 ids, **one per line** (each lesson
    plan deletes only its own line). Create `scripts/guide-micro-registry.test.mjs` (via `scripts/lib/load-ts.mjs`):
    the microstructure track has exactly these 11 ids in this order; every lab id exists in the registry;
    every lesson's figure id is registered; each `// #region <id>` exists once in both string files.
    `package.json`: `"test:guide-micro": "node --test scripts/guide-micro-*.test.mjs"`.
11. **Docs**: `docs/GUIDES_PLAN.md` gets `### Market microstructure` after `### Stochastic models` with the 11
    rows (`| 1 | market-makers | Market makers and liquidity | market-making-guides | placeholder | round-trip |`…)
    and a Log line ("market-making-guides 01: track registered; shared guide files frozen for plans 02–12
    except their own region, PLACEHOLDER line and table row"). Root `README.md`: "64" → "75", "five
    tracks" → "six tracks", and a "Market microstructure" group in the lesson list in the same format.
12. **Layout check**: build and run `node scripts/layout-audit.mjs` on `/`, `/guide`, `/guide/graph` and
    `/guide/microstructure` at 360/768/1280/1536: six tracks must fit the home track list, guide index and
    graph controls. Fix only spacing/grid counts in the owning SCSS if something overflows; record it.

## Acceptance criteria
- `npx tsc -b`, `npm run build` pass; `/guide/microstructure` lists 11 placeholder lessons; 22 new pages
  pre-rendered (EN + HU).
- `npm run test:guide-audit`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown`,
  `test:guide-micro`, `test:seo` pass.
- Break it on purpose: delete one `// #region` line in the HU file → `test:guide-micro` fails; restore.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-registry.test.mjs
npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown && npm run test:guide-micro
npm run build && npm run test:seo && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/,/guide,/guide/graph,/guide/microstructure,/guide/microstructure/market-makers,/hu/guide/microstructure/avellaneda-stoikov,/order-book"
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `guideTitles.hu.ts` must include the new HU table, or HU citations of the new titles never link.
- `GuideId` order does not matter; `guideLessons` order does.
- The audit's lab-link rule accepts only module root paths: placeholders link `/market-making`, never
  `/market-making/desk`.
- `CATEGORY_LABEL_KEYS.microstructure` already exists (labs pack); the graph uses it for the cluster label.
- Placeholders must not cite lessons (no fake citations); `PLACEHOLDER` exempts them.

## Findings (fill in during execution)
- Files touched: `guide.types.ts`, `guide.content.types.ts`, `guide.meta.ts` (11 rows, track, `interest-rate-swap`
  added to `interest-rate-swaps`), `guide.seo.ts`, new `src/Language/GuideMicrostructure.ts`/`.hu.ts` (regions per
  lesson), `index.en.ts`, `index.hu.ts`, `guideTitles.hu.ts`, `Seo.ts`/`.hu.ts`, 11 new `src/Language/guides/<camelId>.ts`
  + `guides/index.ts`, 11 new `figures/microstructure/<Name>Figure.tsx` + `figures/index.ts`, `registry.ts` (six
  `relatedGuides` + `guideModule("microstructure")`), `tokens.scss`, `scripts/guide-audit.test.mjs` (PLACEHOLDER,
  `sandbox` skipped in the orphan filter), new `scripts/guide-micro-registry.test.mjs`, `package.json`
  (`test:guide-micro`), `docs/GUIDES_PLAN.md` (table + Log line), root `README.md` (75 / six tracks, table row, lesson group).
- Verification (2026-10-28): the shared tree was red from other packs' half-done files (kyle/order-book views
  missing keys, `fama-french` view missing, `systemic-risk/engine/metrics.math.ts` type error), so build, `test:seo`,
  smoke and layout ran in a temp `git worktree add --detach` copy of the whole working tree (removed afterwards).
  Results: `tsc -b` errors only in `systemic-risk/engine/metrics.math.ts` (not this pack); eslint clean; `test:guide-micro`
  4/4 (and fails on a deleted HU `// #region` line, restored); `test:guide-checks`, `test:guide-graph`,
  `test:guide-markdown`, `test:guides-ui` green; `test:guide-audit` 12/13: the orphan rule now lists only
  `fama-french, systemic-risk`, registered by the `factor-and-systemic-risk` pack after this plan started (its
  plans must give them a lesson); `vite build` OK, 22 microstructure pages pre-rendered (11 EN + 11 HU); smoke on
  `/`, `/guide`, `/guide/graph`, `/guide/microstructure`, two lessons, HU AS lesson, `/order-book`: `problems: []`.
  `test:seo`: no title/description failures on microstructure pages; still red on (a) the Markdown-twin 150-word
  floor for the 22 placeholder lessons (clears as plans 02–12 land), (b) initial JS 1,021 KB vs 1,000 KB budget
  (this plan adds ≈ 6 KB: EN strings 3.7 KB + meta/SEO rows; the rest is the new labs), (c) other packs' pages
  (`/systemic-risk/*`, `/market-making/desk`, the stochastic-labs sub-pages).
  Preview ran on port 4183 because 4173 was held by another session's preview.
- Layout-audit result for six tracks: `/`, `/guide`, `/guide/graph`, `/guide/microstructure` at 360/768/1280/1536,
  light + dark: 32 pages, 0 failing (only the pre-existing 360 px tap-target warnings). No SCSS changes needed.
- HU strings awaiting owner review: everything in `GuideMicrostructure.hu.ts` (track title/desc, 11 titles,
  11 descriptions — six shortened, see Deviations — `gfMsPlaceholder`, 11 figure titles), `seoTitleGuideMicrostructure`
  / `seoDescGuideMicrostructure` in `Seo.hu.ts`, and the placeholder lesson text.
- Deviations: (1) `test:seo` measures the page title *with* " | Quant Sandbox" (16 chars), so the lesson SEO titles
  must be ≤ 54 chars, not 70: shortened market-makers, limit-order-book, queue-position, adverse-selection,
  glosten-milgrom, kyle-model, avellaneda-stoikov, market-making-pnl and the track title (EN "Market Microstructure
  Course: Order Books and Spreads", HU „Piaci mikrostruktúra kurzus: ajánlati könyv és spread”). (2) Descriptions
  are the meta description and must be ≤ 160 chars: shortened EN queue-position, glosten-milgrom, inventory-risk,
  avellaneda-stoikov and HU adverse-selection, glosten-milgrom, queue-position, inventory-risk, avellaneda-stoikov,
  market-making-pnl (same content, tighter wording). (3) Figure titles invented (the plan gave only the first).
  (4) The `gf-placeholder` class has no styles; placeholders render as a plain paragraph inside the figure panel.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/01-register-track.md`. Implement plan 01:
> register the `microstructure` guide track and its 11 placeholder lessons with the exact ids, order, titles,
> labs, figure ids, regions, SEO titles, colour tokens and sidebar node from the plan; retarget the six labs'
> `relatedGuides`; fix the audit's orphan-lab rule; add `PLACEHOLDER` lines, `scripts/guide-micro-registry.test.mjs`
> and `test:guide-micro`; update GUIDES_PLAN and the root README counts. Run the verification block, fill in
> Findings, append DONE to LOG.md, set plan 01 to `done` in the README table, and summarise.
