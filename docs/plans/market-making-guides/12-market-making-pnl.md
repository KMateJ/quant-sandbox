# 12 — Lesson: Market making profit and loss attribution

Status: done (2026-10-28, session ea82) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The track ends where a desk starts its day: reading its P&L. The lesson builds the exact identity that splits P&L into spread capture, adverse selection, inventory and fees, and the monitoring numbers (markout curves, fill ratios, inventory turnover) that tell a maker what to change.

## Current state (verified 2026-10-28)
- After plan 01: lesson `market-making-pnl` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsMarketMakingPnlTitle`, labs `["market-making"]`) with a placeholder
  text in `src/Language/guides/marketMakingPnl.ts` (export `marketMakingPnl`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/PnlAttributionFigure.tsx` registered as `"pnl-attribution"` in
  `figures/index.ts`. Its figure strings live in the `// #region market-making-pnl` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsPnlAttributionTitle` only).
  `scripts/guide-audit.test.mjs` lists `"market-making-pnl"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Adverse selection and informed trading" / „Kedvezőtlen kiválasztás és informált kereskedés”; "Inventory risk and quote skewing" / „Készletkockázat és a jegyzések eltolása”; "Optimal quoting: the Avellaneda–Stoikov model" / „Optimális jegyzés: az Avellaneda–Stoikov-modell”; "Queue position and fill probability" / „A sorban elfoglalt hely és a teljesülés valószínűsége”. Every lesson of the track
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
2. A working interactive figure `"pnl-attribution"` with its maths in a pure file and a test.
3. Remove `"market-making-pnl"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Adverse selection and informed trading" and "Inventory risk and quote skewing" by
exact title (HU: „Kedvezőtlen kiválasztás és informált kereskedés” és „Készletkockázat és a jegyzések eltolása”).

1. Marking to market — total P&L = cash + inventory × mid + fees.
2. Spread capture — for each fill, side-signed distance from the mid at fill time: `\text{sgn}(m_t - p)\,q`.
3. Adverse selection — side-signed mid move over the markout horizon `h` after each fill: `\text{sgn}(m_{t+h} - m_t)\,q`.
4. Inventory — the residual: holding the position beyond the markout window; derive that the four parts sum to the total exactly.
5. Fees and rebates — maker rebates, taker fees on hedges; a hedge has a negative spread-capture term.
6. What a desk watches — markout curves (average markout against horizon), fill ratio, quote-to-trade ratio, inventory turnover and limits; how each points to a fix (widen, skew, pull before news).
7. From lesson to desk — the Market Making Desk game at `/market-making/desk` reports exactly this split (mention it in text; the `lab()` block must link the module root `/market-making`).

Then: one `worked` block (below), the `figure("pnl-attribution")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/market-making", "<Open the … lab>")`. Also cite "Optimal quoting: the Avellaneda–Stoikov model", "Queue position and fill probability" where the text uses them (same citations in HU).

## Worked example
The maker buys 100 at 99.99 with mid 100.00; 10 seconds later the mid is 99.95 and stays there to the close. Steps: spread capture +1.00 USD, adverse selection −5.00 USD, inventory 0, fees 0 (then with a rebate of 0.002 per share: +0.20), total −4.00 (−3.80). Check against cash + inventory × mid: −9,999 + 100·99.95 = −4.00. (These are the labs pack's core test numbers.)
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `market-making-pnl/spread-capture` (number): the maker sells 200 at 50.03 when the mid is 50.00 → spread capture in USD (6, tolerance 0.01).
- `market-making-pnl/markout` (choice): spread capture is +500 USD a day but adverse selection is −650 USD. The first thing to try is… — widen the quotes or quote less to the toxic flow (correct) / quote tighter to get more fills / hedge every fill / stop charging fees.

## Figure
Interactive attribution. A seeded 5-minute session from the labs' market core (`seedBook`, `fairPath`, `flowSchedule`, `applyTick` in `src/lib/market/flow.ts`) with a simple maker joining the touch; `WaterfallChart` (`src/components/charts`) of spread capture → adverse selection → inventory → fees → total from `decompose` in `src/lib/market/maker.ts`; a markout curve (average markout of the maker's fills against horizon 1–30 s) as a `LineChart`; `SliderField`s informed share (0–40%, default 15%), quote distance (0.5–3 ticks), markout horizon (default 10 s); readouts the four parts and the total.
All text through `t()` with keys inside the `// #region market-making-pnl` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/PnlAttribution*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-market-making-pnl`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.marketMakingPnl.math.ts`: `runSession({ informed, offset, seconds = 300, seed })` (a minimal join-the-touch maker on the core: place bid/ask via `addLimit` with owner `"you"`, re-place after fills; collect maker fills into a `Ledger` with `applyFill`), `markoutCurve(ledger, midAt, horizons)`. Keep it small (≤ 120 lines); do not import the desk engine. Tests: the four parts sum to the total (1e-9); worked example via `decompose`; markout curve at informed 0 is near 0 on average over 20 seeds; determinism.
Test file: `scripts/guide-micro-market-making-pnl.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"market-making-pnl"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"market-making-pnl"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/marketMakingPnl.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-market-making-pnl.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/market-making-pnl,/hu/guide/microstructure/market-making-pnl"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Record each fill's mid as the mid **before** the tick that filled it, or the spread term absorbs the move that caused the fill.
- The audit rejects `lab("/market-making/desk", …)`; link `/market-making`.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: about 1,750 words (audit range passes). Default state (informed 15%, quote distance 0.5 tick, horizon 10 s, seed 1): 67 fills, spread capture 27.16, adverse selection -16.98, inventory 2.90, fees 10.43 (rebate 0.002 USD per share), total 23.51 USD; quoted in both languages.
- HU text awaiting owner review (headings, terms used): the whole HU lesson; headings Piaci értékelés, Spread-bevétel, Kedvezőtlen kiválasztás, Készlet, Díjak és visszatérítések, Mit figyel egy desk, A leckétől a deskig; terms spread-bevétel, markout-horizont, teljesülési arány, jegyzés-kötés arány, készletforgás, visszatérítés/taker-díj.
- Deviations: figure maker is fixed at 100-share quotes re-placed each second when the target price moves; quote distance steps 0.5 ticks (0.5 = join the touch); the rebate is fixed at 0.002 per share so the fees bar is non-zero; added a New session button (seed). Styles: small `.gf-ms-market-making-pnl` grid block appended to guide.scss. Verified with the shared tree: tsc has no errors in my files (others' ExecutionFrontier strings red); test:guide-audit red only on fama-french/systemic-risk (other pack); test:guide-graph timing test flaked under parallel load (183 ms layout), other graph tests pass; build printed port 24678 and SEO prerender timeouts from parallel builds (not chased). Smoke on a vite preview: HU page clean, all three sliders and New session change the readouts; EN pages showed React #418 on first load in the prerendered build (also on the track index, so not specific to this lesson).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/12-market-making-pnl.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Market making profit and loss attribution" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `pnl-attribution` with its pure maths and
> `scripts/guide-micro-market-making-pnl.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 12 to `done` in the README
> table, and summarise.
