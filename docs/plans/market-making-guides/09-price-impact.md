# 09 — Lesson: Price impact and optimal execution

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Every large order moves the price against itself. This lesson separates temporary from permanent impact, gives the empirical rule of thumb, and derives the Almgren–Chriss schedule so the reader sees execution as a cost-versus-risk choice, like the portfolio choice they already know.

## Current state (verified 2026-10-28)
- After plan 01: lesson `price-impact` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsPriceImpactTitle`, labs `["order-book"]`) with a placeholder
  text in `src/Language/guides/priceImpact.ts` (export `priceImpact`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/ExecutionFrontierFigure.tsx` registered as `"execution-frontier"` in
  `figures/index.ts`. Its figure strings live in the `// #region price-impact` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsExecutionFrontierTitle` only).
  `scripts/guide-audit.test.mjs` lists `"price-impact"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Informed trading and Kyle's lambda" / „Informált kereskedés és Kyle lambdája”; "The limit order book" / „A limitáras ajánlati könyv”; "Risk aversion and the optimal complete portfolio" / „Kockázatkerülés és az optimális teljes portfólió”. Every lesson of the track
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
2. A working interactive figure `"execution-frontier"` with its maths in a pure file and a test.
3. Remove `"price-impact"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Informed trading and Kyle's lambda" and "The limit order book" by
exact title (HU: „Informált kereskedés és Kyle lambdája” és „A limitáras ajánlati könyv”).

1. Two kinds of impact — temporary (paid while trading, then fades: walking the book) and permanent (information, as in Kyle's λ); measuring each from before/after prices.
2. The square-root rule — empirical `ΔP/P ≈ Y σ \sqrt{Q/V}` with daily volatility σ and daily volume V, `Y` of order 1; why concavity matters for splitting orders.
3. Splitting an order — sell `X` shares over `N` intervals of length `τ`; holdings `x_j`, trades `n_j = x_{j-1} - x_j`; linear temporary impact `η n_j/τ`, permanent `γ n_j`.
4. Expected cost and risk — `E = \tfrac12 γ X^2 + \tilde η/τ \sum n_j^2` (with `\tilde η = η - γτ/2`), `V = σ^2 τ \sum x_j^2`; derive both.
5. The optimal schedule — minimise `E + λ_{risk} V`; solution `x_j = X \sinh(κ(T - t_j))/\sinh(κT)` with `\cosh(κτ) = 1 + \tfrac12 \tilde κ^2 τ^2`, `\tilde κ^2 = λ_{risk}σ^2/\tilde η`; risk-neutral ⇒ straight line (TWAP); very risk-averse ⇒ trade early.
6. The efficient frontier of execution — each λ gives a (variance, cost) point; the curve looks like the portfolio frontier.

Then: one `worked` block (below), the `figure("execution-frontier")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/order-book", "<Open the … lab>")`. Also cite "Risk aversion and the optimal complete portfolio" where the text uses them (same citations in HU).

## Worked example
Square-root rule: a 2% daily volatility stock, order 5% of daily volume, Y = 1 ⇒ impact ≈ 2%·√0.05 = 0.447% (44.7 bp). Then a two-interval Almgren–Chriss toy with numbers chosen so the arithmetic is short (X = 2, N = 2): cost and variance for selling 1 then 1 versus 2 then 0 — compute with node and paste.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `price-impact/square-root` (number): σ = 1.5% daily, order 4% of daily volume, Y = 1 → impact in % (`1.5·0.2 = 0.3`, tolerance 0.005).
- `price-impact/risk-neutral` (choice): a trader who does not care about risk (λ = 0) and faces linear impact splits the order… — evenly over the horizon (correct) / all at the start / all at the end / in a random order.

## Figure
Interactive execution. Left: holding trajectories `x_j` for the current risk aversion (solid) and for λ = 0 (TWAP, dashed with contrasting colour) over N = 20 intervals; right: the efficient frontier (expected cost against standard deviation) for a sweep of λ with a dot for the current one, draggable along the frontier with `DragHandles` (dragging picks λ). `SliderField`s: risk aversion (log scale), volatility, temporary impact η. Readouts: expected cost, standard deviation, share sold in the first quarter.
All text through `t()` with keys inside the `// #region price-impact` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/ExecutionFrontier*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-price-impact`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.priceImpact.math.ts`: `squareRootImpact(sigma, participation, Y = 1)`, `acTrajectory({ X, N, T, sigma, eta, gamma, lambdaRisk })`, `acCostVariance(params, x)`, `acFrontier(params, lambdas)`. Tests: λ = 0 gives a straight line; cost/variance of the straight line by hand; trajectory monotone; frontier cost decreases as variance increases; the worked toy numbers.
Test file: `scripts/guide-micro-price-impact.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"price-impact"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"price-impact"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/priceImpact.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-price-impact.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/price-impact,/hu/guide/microstructure/price-impact"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Use `Math.sinh`/`Math.acosh`; for λ → 0 switch to the linear schedule to avoid 0/0.
- Keep λ_risk distinct from Kyle's λ in notation (write `λ_{risk}` or use `A` for risk aversion) and say so in the text.

## Findings (fill in during execution)
- EN ~1700 words (audit word range passes). Figure defaults (lambda_risk 100, sigma 2%, eta 20 bp, gamma 10 bp fixed, N 20): cost 49.3 bp, sd 59.3 bp, 67.5% sold in first quarter; even schedule about 25 bp / 111 bp. Quoted in the text and confirmed in the browser readouts (first-quarter readout set to one decimal to match 67.5%).
- HU text awaiting owner review: all of it, notably headings (Átmeneti és tartós árhatás; A négyzetgyök-szabály; Egy megbízás szétosztása; Várható költség és kockázat; Az optimális ütemezés; A végrehajtás hatékony frontja; Egy részletes példa), the risk-aversion symbol lambda_kock (EN lambda_risk), "időarányos átlagár (TWAP)", "ütemezés", "front".
- Deviations: the figure slider is the exponent of lambda_risk (10^x, shown as lambda); the dot on the frontier is an "xy" DragHandle that snaps to the nearest-sd frontier point (24+ hand-typed numbers verified with node). A third check price-impact/front-loading was added. test:guide-audit still red only on fama-french/systemic-risk (other pack); eslint/tsc clean for my files; smoke (EN + HU) problems: [], verified on vite preview 4209, server stopped and outDir removed. Full npm run build not run (used in-repo outDir build only).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/09-price-impact.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Price impact and optimal execution" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `execution-frontier` with its pure maths and
> `scripts/guide-micro-price-impact.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 09 to `done` in the README
> table, and summarise.
