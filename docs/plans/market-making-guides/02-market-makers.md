# 02 — Lesson: Market makers and liquidity

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
This is the track's entry point. A reader who has only seen prices as one number per day learns that every trade has two prices, someone stands ready at both, and the gap pays them for immediacy and for the risks of holding what others want to get rid of.

## Current state (verified 2026-10-28)
- After plan 01: lesson `market-makers` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsMarketMakersTitle`, labs `["market-making"]`) with a placeholder
  text in `src/Language/guides/marketMakers.ts` (export `marketMakers`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/RoundTripFigure.tsx` registered as `"round-trip"` in
  `figures/index.ts`. Its figure strings live in the `// #region market-makers` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsRoundTripTitle` only).
  `scripts/guide-audit.test.mjs` lists `"market-makers"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Returns and volatility" / „Hozamok és volatilitás”; "Random walks and Brownian motion" / „Véletlen bolyongás és Brown-mozgás”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/market-making` (module `market-making`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"round-trip"` with its maths in a pure file and a test.
3. Remove `"market-makers"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Returns and volatility" and "Random walks and Brownian motion" by
exact title (HU: „Hozamok és volatilitás” és „Véletlen bolyongás és Brown-mozgás”).

1. Prices you can trade at — bid, ask, mid, spread (absolute, in ticks, in basis points: `s_{bp} = 10^4 (a - b)/m`).
2. Liquidity and immediacy — who wants to trade now versus who is willing to wait; makers post quotes, takers hit them; maker rebates and taker fees.
3. The round trip — a maker sells at the ask and later buys at the bid: earns `a - b` per share if the mid has not moved; the general formula with a mid move `Δm` while holding (derive: P&L = `(a - b) - Δm` for a short-then-buy-back, per share).
4. What can go wrong — inventory risk (the mid moves while you hold, link to price changes as a random walk) and adverse selection (the customer knew the price was about to move); both are named here and developed later in the track.
5. Who the market makers are — designated market makers, electronic liquidity providers, dealers in OTC markets; obligations versus profits (one paragraph, no history lesson).

Then: one `worked` block (below), the `figure("round-trip")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/market-making", "<Open the … lab>")`. 

## Worked example
Quotes 99.98 / 100.02 for 1,000 shares; a customer buys 1,000 at the ask, another later sells 1,000 at the bid. Steps: spread in USD and bp; round-trip income 0.04 × 1,000 = 40 USD; then the mid falls 0.10 before the second customer arrives and the maker re-quotes around the new mid: show the P&L of the same round trip (−60 USD) and name the culprit (inventory held through a move).
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `market-makers/spread-bp` (number): bid 49.95, ask 50.05 → spread in bp (`10^4 × 0.10 / 50 = 20`, tolerance 0.5).
- `market-makers/maker-taker` (choice): which side pays the spread — the trader who sends a market order (correct) / the trader whose limit order rests / both equally / neither when fees are zero.

## Figure
Interactive round trip. A small price strip (SVG via `LineChart` or a custom SVG ≤ 80 lines) shows the mid over 30 steps of a random walk with seed fixed; the maker's bid and ask are drawn around the mid; two customers arrive (step 5 buys at the ask, step 20 sells at the bid). Controls: half-spread `SliderField` (1–10¢, default 2¢), mid volatility (0–3¢ per step, default 1¢), a `SegmentedControl` "Calm / Volatile" preset, and "New path" (next seed). Readouts (`FigureReadout`): spread income, inventory P&L, total. Direct manipulation: drag the half-spread on the chart with `DragHandles` (y-handle on the ask line) — the slider stays as the keyboard alternative.
All text through `t()` with keys inside the `// #region market-makers` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/RoundTrip*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-market-makers`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.marketMakers.math.ts`: `roundTrip({ halfSpread, sigma, seed, steps = 30, buyAt = 5, sellAt = 20 })` → `{ mid: number[], bid: number[], ask: number[], fills, spreadIncome, inventoryPnl, total }` using `makeRng`/`nextNormal` from `src/lib/math/random.ts` (discard the first draw: a labs-pack session found `makeRng`'s first output biased across nearby seeds). Identity test: `spreadIncome + inventoryPnl = total`; zero volatility ⇒ inventory P&L 0 and total = 2 × halfSpread × size.
Test file: `scripts/guide-micro-market-makers.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"market-makers"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"market-makers"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/marketMakers.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-market-makers.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/market-makers,/hu/guide/microstructure/market-makers"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Keep the first lesson light on formulas: one `eq()` for the spread in bp and one for the round trip. The derivations belong to later lessons.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: about 1,340 EN words (HU about 1,150), counted over paragraph, list and note text. Default state (half-spread 2¢, volatility 1¢/step, seed 3, 100 shares): spread income 4.00 USD, mid change +4.47¢, inventory P&L −4.47 USD, total −0.47 USD; sd of the mid change over 15 steps √15 ≈ 3.9¢. Worked example in 1,000 shares: 0.04, 4 bp, 40, −60, −100, −60 USD.
- HU text awaiting owner review (headings, terms used): the whole lesson `src/Language/guides/marketMakers.ts` `hu` array, headings „Bid, ask, mid és spread”, „Likviditás és azonnaliság”, „Az oda-vissza kötés”, „Készletkockázat és kedvezőtlen kiválasztás”, „A market makerek fajtái”; terms: „market maker (árjegyző)” on first mention, „taker/maker” kept English, „azonnaliság”, „oda-vissza kötés” for round trip, „készletkockázat”, „kedvezőtlen kiválasztás”; the figure strings in the `// #region market-makers` block (GuideMicrostructure.hu.ts: „Fél spread”, „Nyugodt/Viharos”, „Új ármozgás”, readout labels).
- Deviations: (1) the plan says the mid *falls* 0.10 in the worked example to get −60 USD; a short maker loses when the mid *rises*, so the lesson uses a rise of 0.10 (quotes 100.08 / 100.12, buy back at 100.08). (2) The lesson does not cite "Inventory risk and quote skewing" or "Adverse selection and informed trading" by exact title: `test:guide-graph` forbids depending on lessons later than the next one in the same track; it says "later lessons" instead and cites only "The limit order book" (the next lesson) in the note. (3) Three checks, not two (added `market-makers/round-trip-pnl`). (4) Figure default uses seed 3 (a path where the round trip loses slightly) rather than seed 1. (5) Drag handle is a y-handle on the ask at the first step (mid starts at 100.00), so it is a horizontal line while the ask follows the mid; the slider and keyboard arrows (1¢ per press, Shift 10¢) work too. (6) Verified on the dev server, not a production build/preview: `npx tsc -b` is red in other packs (avellaneda-stoikov labs: missing `avs*` translation keys) and `eslint src/features/guide` has one error in another session`s `microstructure/useTweened.ts`; none in my files. cdp-smoke on dev (5174): no problems on the track page and the lesson in EN and HU, no leakingLinks. `test:guide-audit` fails only on the pre-existing "labs no lesson practises: fama-french, systemic-risk" (factor-and-systemic-risk pack), not fixed here. test:guide-checks, graph, markdown and guide-micro (45 tests) pass.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/02-market-makers.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Market makers and liquidity" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `round-trip` with its pure maths and
> `scripts/guide-micro-market-makers.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 02 to `done` in the README
> table, and summarise.
