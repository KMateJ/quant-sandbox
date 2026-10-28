# 03 — Lesson: The limit order book

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The order book is the machine every later lesson runs on. The reader must be able to read a ladder, predict which orders a market order hits and compute the average price and slippage by hand.

## Current state (verified 2026-10-28)
- After plan 01: lesson `limit-order-book` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsLimitOrderBookTitle`, labs `["order-book"]`) with a placeholder
  text in `src/Language/guides/limitOrderBook.ts` (export `limitOrderBook`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/BookWalkFigure.tsx` registered as `"book-walk"` in
  `figures/index.ts`. Its figure strings live in the `// #region limit-order-book` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsBookWalkTitle` only).
  `scripts/guide-audit.test.mjs` lists `"limit-order-book"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Market makers and liquidity" / „Market makerek és a likviditás”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/order-book` (module `order-book`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"book-walk"` with its maths in a pure file and a test.
3. Remove `"limit-order-book"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Market makers and liquidity" by
exact title (HU: „Market makerek és a likviditás”).

1. Orders — limit orders (price, size, side) rest; market orders execute now; marketable limits; cancels.
2. The book — bids sorted high to low, asks low to high; best bid and ask, the touch, depth per level, cumulative depth.
3. Price–time priority — better price first, then earlier arrival; why this rewards both aggressive pricing and speed.
4. Walking the book — a market buy of size `Q` takes the best ask, then the next level, until filled; average price `\bar p = \sum p_i q_i / \sum q_i`; slippage against the mid `(\bar p - m)/m` in bp; total cost `Q(\bar p - m)`.
5. Depth and the cost of size — with flat depth `d` per tick, a buy of `Q` walks `Q/d` levels, average slippage grows about linearly in `Q`, so total cost grows about with `Q^2` (derive with an arithmetic series); real books are thicker further out.

Then: one `worked` block (below), the `figure("book-walk")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/order-book", "<Open the … lab>")`. 

## Worked example
Asks 100.01 × 318, 100.02 × 311, 100.03 × 518, 100.04 × 453 (mid 100.00, bid 99.99). A market buy of 1,600: fills per level (318, 311, 518, 453), notional 160,043.06, average 100.0269125 (4 decimals: 100.0269), slippage 2.69 bp, cost vs mid 43.06 USD. (These are the numbers the labs pack's core test uses; recompute with `previewMarket` to confirm.)
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `limit-order-book/priority` (choice): two bids at 99.97 — 500 shares placed at 09:30:01 and 2,000 at 09:30:05; a market sell of 600 arrives: who fills? (the 500 fully, then 100 of the 2,000 — correct) / the 2,000 first / pro rata / neither.
- `limit-order-book/average` (number): asks 50.00 × 200, 50.01 × 300; market buy 400 → average price (`(50·200 + 50.01·200)/400 = 50.005`, tolerance 0.0005).

## Figure
Interactive book walk. A static 10-level ladder (DOM table or SVG) seeded with `seedBook(DEFAULT_FLOW, FAIR0, seed)` from `src/lib/market/flow.ts`; the reader drags an order-size handle along the ask side (or uses a `SliderField` 100–5,000, default 1,600) and the consumed rows highlight with a `var(--primary)` tint and "take n" labels; Buy/Sell `SegmentedControl`; readouts: average price, slippage bp, levels hit, cost USD. A second small chart: slippage vs size curve for this book with a marker at the chosen size. Use `previewMarket` from `src/lib/market/book.ts` (no new matching code).
All text through `t()` with keys inside the `// #region limit-order-book` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/BookWalk*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-limit-order-book`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.limitOrderBook.math.ts`: `bookForFigure(seed)` (fixed seed; optionally overwrite the first four ask levels with the worked example's sizes so the default figure matches the text), `slippageBp(avg, mid)`, `slippageCurve(book, side, sizes)` built on `previewMarket`. Tests: the worked example numbers; curve non-decreasing; `slippageBp` sign for buys and sells.
Test file: `scripts/guide-micro-limit-order-book.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"limit-order-book"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"limit-order-book"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/limitOrderBook.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-limit-order-book.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/limit-order-book,/hu/guide/microstructure/limit-order-book"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Prices in `src/lib/market` are integer ticks (`FAIR0 = 10000` ticks = 100.00 at tick 0.01); convert only for display.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: about 1,270 words of prose, list and notes (plus 3 checks, 1 worked block with 5 steps). Figure defaults (buy, 1,600 shares): 4 levels, average 100.0269, slippage 2.69 bp, cost 43.06 USD, matching the worked example; 100 shares = 1.00 bp; 3,200 shares = 8 levels, 4.50 bp, 144.06 USD. All computed with `walkBook`, pinned in `scripts/guide-micro-limit-order-book.test.mjs`.
- HU text awaiting owner review (headings, terms used): the whole HU lesson in `src/Language/guides/limitOrderBook.ts` and the `gfMsBook*` strings in `GuideMicrostructure.hu.ts`. Headings: „Megbízások”, „Az ajánlati könyv”, „Ár–idő prioritás”, „Végighaladás a könyvön”, „Mélység és a méret költsége”. Terms: bid/ask/touch/mid ár/spread/tick kept in English; „csúszás” for slippage (slippage in parentheses on first use); „bázispont (bp)”; „halmozott mélység”; „azonnal teljesíthető” for marketable; „visszavonható” for cancelled; piaci/limitáras megbízás, árjegyző on first mention of market maker. The lesson title is „A limitáras ajánlati könyv” (registered by plan 01).
- Deviations: (1) the book has a two-tick spread (bid 99.99, ask 100.01, mid 100.00) so the figure matches the worked example. `bookForFigure` drops the top seeded bid level, so every row beyond the first four asks is ≈450 shares. (2) Slider range is 100–4,000 (not 5,000) so every size is fillable (the ten ask levels hold 4,299 shares) and no "unfilled" state is needed. (3) The ladder shows only the side the order hits, not both sides; the touch is a one-line caption. (4) Added a three-rule `// #region gf-ms-limit-order-book` block at the end of `src/styles/guide.scss`. (5) Interpolation in `t()` uses `{{n}}`, not `{n}`. (6) Thousands in the figure use a thin space in both languages, like the other figures.
- Verification: `tsc -b` shows no errors in my files (the tree has others' errors in `market-making-desk`); eslint clean on my files (`useTweened.ts`, another session's, fails `react-hooks/set-state-in-effect`); `test:guide-micro` 45/45, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass; `test:guide-audit` 12/13: the only failure is the pre-existing "labs no lesson practises: fama-french, systemic-risk" (factor-and-systemic-risk pack, not fixed here). `npm run build` and `cdp-smoke` were not run: `tsc -b` is red from others' files and ports 4173/5173 were held by other sessions. Instead I checked `/guide/microstructure/limit-order-book` and its `/hu` twin on a Vite dev server: no console errors, no KaTeX errors, defaults as quoted, Buy/Sell and keyboard slider work, no horizontal overflow at 375px (the phone screenshot came back blank, so that check is by measurement only).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/03-limit-order-book.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "The limit order book" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `book-walk` with its pure maths and
> `scripts/guide-micro-limit-order-book.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 03 to `done` in the README
> table, and summarise.
