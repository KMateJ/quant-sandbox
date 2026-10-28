# Market microstructure guide plans

**Pack status: READY (2026-10-28).** Claim plans on their `Status:` line; see §3 for order.

Goal: a sixth guide track, **Market microstructure**, with 11 ground-up lessons that teach what the
market-making labs let you play with: order books and queues, adverse selection, Glosten–Milgrom, the
bid–ask spread and how to measure it, Kyle's λ, price impact and execution, inventory risk,
Avellaneda–Stoikov quoting, and market-making P&L. Every lesson has an interactive figure, at least two
checks (collected at the track end, never inline), a worked example, and links to its lab.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor (Sonnet
recommended) without the chat that produced it. Each plan ends with a ready-to-paste **handoff prompt**.
Sessions coordinate through the status table below and the append-only [`LOG.md`](LOG.md).

Snapshot taken: **2026-10-28** (commit `a4b1706` plus uncommitted work from the `docs/plans/market-making`
labs pack, which is running in parallel in the same tree). If the code has moved on, re-check your plan's
"Current state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Tracks and lessons | `src/features/guide/guide.types.ts` (`GuideTrackId` = derivatives/portfolio/fixed-income/corporate/stochastic; `GuideId` union, 64 ids), `src/features/guide/guide.meta.ts` (`guideLessons` array = reading order; `guideTracks` built with `track(id, titleKey, descKey)`) | 64 lessons in 5 tracks. Lesson shape `{ id, track, titleKey, descKey, labs: string[] }` |
| Track consumers | `GuideIndex.tsx`, `HomeTracks.tsx`, graph (`GraphControls`, `GraphList`, `GraphClusters`, `GraphDetails`, `GuideGraphPage`), `guide.ui.ts` (`lessonCode` = "track.lesson", e.g. "06.03"; `trackColor(id)` = `var(--track-<id>)`), `useTrackProgress.ts`, `seo.markdown.ts` | All iterate `guideTracks`, so a sixth track appears everywhere once registered. Graph labels use `CATEGORY_LABEL_KEYS[trackId]` from the registry |
| Sidebar node per track | `src/modules/registry.ts` `guideModule(trackId, seo)` calls (5 lines after the last lab) | Needs `seoTitleGuide<Track>` / `seoDescGuide<Track>` in `src/Language/Seo.ts`/`.hu.ts` |
| Track colours | `src/styles/tokens.scss` L121–125 (dark) and L189–193 (light): `--track-derivatives` … `--track-stochastic` | No `--track-microstructure` yet |
| Lesson text | `src/Language/guides/<camelCaseId>.ts` (`{ en: GuideBlock[], hu: GuideBlock[] }` with `p, h, eq, list, steps, note, figure, lab` from `guides/blocks.ts`; `check`/`worked` as object literals — exemplar `src/Language/guides/annuities.ts`), collected in `src/Language/guides/index.ts` | |
| Figures | `src/features/guide/components/figures/index.ts` (`guideFigures`), `GuideFigure` (`title`, `labId?`, `children`), `FigureReadout`, `figureFormat.ts`, `figureSeries.ts`; figure ids in `src/features/guide/guide.content.types.ts` (`GuideFigureId`) | Folders `figures/`, `interactive/`, `interactive2/`, `stochastic/`, `wave4/` |
| Strings | Per wave: `src/Language/GuideWave4.ts`/`.hu.ts`; registered in `src/Language/index.en.ts`, `index.hu.ts` **and** `src/Language/guideTitles.hu.ts` | HU table drives HU citations and links |
| SEO | `src/features/guide/guide.seo.ts` (`guideSeoTitles`, EN, ≤ 70 chars) | |
| Harness | `scripts/guide-audit.test.mjs` (`npm run test:guide-audit`): allowlists `NO_CHECKS`, `NO_WORKED`, `NO_SEO_TITLE`, `NOT_IN_GUIDES_PLAN`, `LAB_WITHOUT_LESSON`, `NO_FIGURE = ["wacc"]`, `PLACEHOLDER`, `ROOT_LESSONS`; `EN_WORDS = { min: 600, max: 2300 }` | Rules: EN/HU same block kinds; one figure, not shared; ≥ 2 checks; ≥ 1 worked; ends Summary + list + lab; ≤ 2 notes; word range; **lab links must be registered module root paths** (a subNav path such as `/market-making/desk` fails); **every lab has a lesson**; plain-noun-phrase titles (no trailing period, not starting with Why/How/What); SEO title; cites an earlier lesson by exact title in EN and HU (same pairs in both); opening paragraph quotes a registered title; `docs/GUIDES_PLAN.md` row per lesson (regex `\| n \| id \| Title \| Owner \| Status \| Figure \|`) |
| Other guide tests | `test:guide-checks`, `test:guide-graph` (reading order **within** a track; cross-track citations are free), `test:guide-markdown`, `test:guides-ui` | |
| Labs to teach | `src/modules/registry.ts` category `microstructure`: `order-book`, `market-making` (desk at `/market-making/desk`), `avellaneda-stoikov`, `glosten-milgrom`, `kyle`, `spread-estimation` (registered by labs-pack plan 01, status `planned` → `beta` as labs land) | Their `relatedGuides` point at stochastic lessons until this pack retargets them |
| Reusable maths | `src/lib/market/` (`book.ts` `marketOrder`/`previewMarket`/`queueAhead`, `flow.ts` `DEFAULT_FLOW`/`fairPath`/`flowSchedule`/`applyTick`/`seedBook`, `maker.ts` `decompose`, `quotes.ts` `asQuotes`/`asTotalSpread`/`fillIntensity`/`expectedSpreadIncome`); `src/features/glosten-milgrom/glostenMilgrom.math.ts`; `src/features/kyle/kyle.math.ts`; `src/features/spread-estimation/spreadEstimation.math.ts` (prices in cents, m₀ = 10000); `src/lib/stats/distributions.ts` (`normPdf`, `normCdf`) | All pure, tested by the labs pack; figures may import them (precedent: figures import `black-scholes/blackScholes.math`) |

Measured 2026-10-28: `npm run test:guide-audit` is **red before this pack** on one rule — "labs no lesson
practises": `interest-rate-swap`, `sandbox` (pre-existing) and the six microstructure labs. Plan 01 fixes
all eight.

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | No microstructure track, ids, strings, figure ids, SEO, colour, sidebar node, GUIDES_PLAN table; audit red | 01 |
| G2 | Eleven lessons with figures, checks, worked examples, EN + HU | 02–12 |
| G3 | Cross-track sign-off | 13 |

## 2. Key decisions

- **One track, eleven lessons, in this reading order** (ids are fixed; titles are the registered titles
  every lesson cites):

  | # | Plan | id | Title (EN) | Labs | Figure id |
  |---|---|---|---|---|---|
  | 1 | [02](02-market-makers.md) | `market-makers` | Market makers and liquidity | market-making | `round-trip` |
  | 2 | [03](03-limit-order-book.md) | `limit-order-book` | The limit order book | order-book | `book-walk` |
  | 3 | [04](04-queue-position.md) | `queue-position` | Queue position and fill probability | order-book | `queue-fill` |
  | 4 | [05](05-adverse-selection.md) | `adverse-selection` | Adverse selection and informed trading | market-making | `toxic-income` |
  | 5 | [06](06-glosten-milgrom.md) | `glosten-milgrom` | The Glosten–Milgrom model | glosten-milgrom | `gm-learning` |
  | 6 | [07](07-spread-measurement.md) | `spread-measurement` | Measuring and decomposing the bid–ask spread | spread-estimation | `roll-bounce` |
  | 7 | [08](08-kyle-model.md) | `kyle-model` | Informed trading and Kyle's lambda | kyle | `kyle-schedule` |
  | 8 | [09](09-price-impact.md) | `price-impact` | Price impact and optimal execution | order-book | `execution-frontier` |
  | 9 | [10](10-inventory-risk.md) | `inventory-risk` | Inventory risk and quote skewing | market-making | `inventory-skew` |
  | 10 | [11](11-avellaneda-stoikov.md) | `avellaneda-stoikov` | Optimal quoting: the Avellaneda–Stoikov model | avellaneda-stoikov | `as-quotes` |
  | 11 | [12](12-market-making-pnl.md) | `market-making-pnl` | Market making profit and loss attribution | market-making | `pnl-attribution` |

  The owner's lesson mockups had a twelfth "Review & self-check" lesson; it is dropped because checks are
  already collected on the track page (owner rule: no inline quizzes). Each lesson is droppable: delete its
  row in plan 01's table before 01 runs.
- **Register once, write in parallel** (the pattern that worked in `docs/plans/guides-audit` plan 07):
  plan 01 makes every shared-file edit with valid placeholders; plans 02–12 write only their own files
  and can all run at once. Shared files the lesson plans may still touch, additively only: their own
  `// #region <lesson-id>` in `src/Language/GuideMicrostructure.ts`/`.hu.ts`, their own line in the
  audit's `PLACEHOLDER` list, their own row in `docs/GUIDES_PLAN.md`, and one Log line there.
- **Track colour** `--track-microstructure`: `#5cb8ae` (dark) / `#23807a` (light), the softened twin of the
  category accent `#2bb3a3` (owner exception: the knowledge graph colours nodes by track).
- **Figures reuse the labs' pure maths** where it exists (`src/lib/market/*`, the Glosten–Milgrom, Kyle and
  spread-estimation `*.math.ts`); anything figure-specific goes in the lesson's own
  `src/features/guide/guide.micro.<camelId>.math.ts`, tested in `scripts/guide-micro-<id>.test.mjs`
  (run by `npm run test:guide-micro`, created by plan 01). One shared helper is new: plan 05 creates
  `src/lib/market/informed.ts` (`informedLoss`, `incomeRate`), which the market making lab also uses.
- **Writing level:** ground-up and rigorous like the stochastic track: define terms before use, derive
  every formula the lesson relies on in `eq()` steps (Bayes for Glosten–Milgrom, the one-auction Kyle
  equilibrium, Roll's covariance, the CARA indifference price for Avellaneda–Stoikov, the Almgren–Chriss
  trade-off), at least one verified numeric example. EN 900–1800 words per lesson.
- **Hungarian terms** (draft, owner reviews): keep **market maker** in English with „(árjegyző)” on
  first mention in each lesson; keep bid, ask, spread, market order/limit order as „piaci megbízás” /
  „limitáras megbízás”; order book = „ajánlati könyv”; trade = „kötés”; inventory = „készlet”; insider =
  „bennfentes”; noise trader = „zajkereskedő”; adverse selection = „kedvezőtlen kiválasztás”; markout stays
  English; price impact = „árhatás”; fill = „teljesülés”. These match the labs' HU copy.

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-register-track.md) | Register the track and 11 placeholder lessons | – | M | Sonnet | done (2026-10-28) |
| [02](02-market-makers.md) | Lesson: Market makers and liquidity | 01 | M | Sonnet | done (2026-10-28) |
| [03](03-limit-order-book.md) | Lesson: The limit order book | 01 | M | Sonnet | done (2026-10-28) |
| [04](04-queue-position.md) | Lesson: Queue position and fill probability | 01 | M | Sonnet | done (2026-10-28) |
| [05](05-adverse-selection.md) | Lesson: Adverse selection and informed trading | 01 | M | Sonnet | done (2026-10-28) |
| [06](06-glosten-milgrom.md) | Lesson: The Glosten–Milgrom model | 01 | M | Sonnet | done (2026-10-28) |
| [07](07-spread-measurement.md) | Lesson: Measuring and decomposing the bid–ask spread | 01 | M | Sonnet | done (2026-10-28) |
| [08](08-kyle-model.md) | Lesson: Informed trading and Kyle's lambda | 01 | M | Sonnet | done (2026-10-28) |
| [09](09-price-impact.md) | Lesson: Price impact and optimal execution | 01 | M | Sonnet | done (2026-10-28) |
| [10](10-inventory-risk.md) | Lesson: Inventory risk and quote skewing | 01 | M | Sonnet | done (2026-10-28) |
| [11](11-avellaneda-stoikov.md) | Lesson: Optimal quoting, the Avellaneda–Stoikov model | 01 | M | Sonnet | done (2026-10-28) |
| [12](12-market-making-pnl.md) | Lesson: Market making profit and loss attribution | 01 | M | Sonnet | done (2026-10-28) |
| [13](13-final-qa.md) | Final QA: harness green, build, smoke EN + HU | all | S | Sonnet | done (2026-10-28) |

**Start on day one:** 01. **After 01:** all of 02–12 in parallel (each lesson cites earlier lessons by
their registered titles, which exist from plan 01 on, so writing order does not matter). **Last:** 13.
A lesson plan may draft its text and maths before 01 lands; it cannot typecheck or pass the audit until then.

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Claim a plan first by setting its `Status:` line to `in progress (claimed <date>, <session name>)`.

## 4. Rules for every executor

### Project rules
- Read `CLAUDE.md`. DRY; maths in `*.math.ts` (pure, no React); strings in `src/Language/**`; `.tsx` ≤ ~150
  lines (figure components ≤ ~80); `///` doc comments on exported functions; no comments on code you did
  not change.
- Owner preferences: plain descriptive titles and headings that name the concept (no questions, taglines,
  "The key idea", "From X to Y"); build from the ground up; **no inline quizzes** (write `check` blocks
  after the section they test; the track page collects them); no left-border accents; square, one-accent
  visual style. Labs are for linking, not editing: never edit files under `src/features/{order-book,
  market-making,market-making-desk,avellaneda-stoikov,glosten-milgrom,kyle,spread-estimation}` (the labs
  pack owns them) — import their pure `*.math.ts` only.
- Lesson standard (enforced by `test:guide-audit`): one figure; ≥ 2 `check` blocks with ids
  `<lessonId>/<slug>` identical in EN and HU; ≥ 1 `worked` block; same block kinds in the same order in EN
  and HU; ≤ 2 `note()`s per language; ends `h("Summary")`/`h("Összefoglalás")` + `list()` (3–5 points) +
  `lab()` to a **module root path**; opening paragraph quotes an earlier lesson's exact registered title
  (`"…"` EN, `„…”` HU); every citation exists in both languages.
- TeX in TS strings: escape backslashes (`\\frac`); no literal `$` for currency (write "USD" or "¢");
  `{,}` for a Hungarian decimal comma (`0{,}9`) and for EN thousands (`1{,}600`).
- Every number the text quotes from the figure's default state must equal the figure's actual default
  output: compute it with `node` and paste.
- Hungarian follows §2 terms and the repo glossary: natural, te-form, decimal comma, „…” quotes. List all
  HU text you wrote in Findings as "awaiting owner review".

### Parallel sessions
- Never run `git stash`, `git checkout` or tree-wide git commands (two packs are editing this tree).
  Compare with `git diff --quiet <rev> -- <files>`; if the tree is red from someone else's half-done
  files, verify in a temporary `git worktree add --detach` copy (junction `node_modules`), then remove it.
- Read [`LOG.md`](LOG.md) before starting and before verification; append `CLAIM`, `CONTRACT`, `BLOCKED`,
  `DEVIATION`, `DONE` lines; never edit others' lines. Append one line to the `docs/GUIDES_PLAN.md` Log too.

### Standard verification
```bash
npx tsc -b
npx eslint src/features/guide src/Language/guides src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts
npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown && npm run test:guide-micro
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/<id>,/hu/guide/microstructure/<id>"
# expect: "problems": [] on every line, h1 present, no "leakingLinks"
```
Stop the preview server and confirm port 4173 is free (`netstat -ano | grep :4173` prints nothing).
Windows: Git Bash; prefix CDP commands with `MSYS_NO_PATHCONV=1`. No new dependencies; no commits or
pushes unless asked; do not deploy while any lesson is still a placeholder.

## 5. Definition of done
- `/guide/microstructure` lists 11 lessons in the order above; each lesson page renders in EN and HU with
  its interactive figure; the track page collects ≥ 22 checks.
- `npm run test:guide-audit` passes with `PLACEHOLDER` empty and `LAB_WITHOUT_LESSON` empty; all
  `test:guide*` scripts, `tsc`, eslint on the guide folders and `npm run build` pass; `test:seo` passes.
- The six microstructure labs' `relatedGuides` point at their lessons; the knowledge graph shows a sixth
  cluster in `--track-microstructure`; home, sidebar, mobile nav, search and the guide index list the track.

## 6. Post-merge checklist
- Owner reviews the HU drafts listed in each plan's Findings and the §2 HU terms.
- `npm run indexnow` after deploy; re-run `npm run test:seo` and `npm run test:seo-schema`.
- Refresh `docs/images/guide-graph.png` if the README screenshot should show six tracks.
