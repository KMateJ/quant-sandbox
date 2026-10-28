# 11 — Lesson: Optimal quoting: the Avellaneda–Stoikov model

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Avellaneda–Stoikov gives the skew and the spread a single rule from first principles: a risk-averse maker with exponential utility, a Brownian mid and fills that thin out with distance. The reservation price and the optimal spread are the formulas every quoting desk starts from.

## Current state (verified 2026-10-28)
- After plan 01: lesson `avellaneda-stoikov` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsAvellanedaStoikovTitle`, labs `["avellaneda-stoikov"]`) with a placeholder
  text in `src/Language/guides/avellanedaStoikov.ts` (export `avellanedaStoikov`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/AsQuotesFigure.tsx` registered as `"as-quotes"` in
  `figures/index.ts`. Its figure strings live in the `// #region avellaneda-stoikov` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsAsQuotesTitle` only).
  `scripts/guide-audit.test.mjs` lists `"avellaneda-stoikov"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Inventory risk and quote skewing" / „Készletkockázat és a jegyzések eltolása”; "Risk aversion and the optimal complete portfolio" / „Kockázatkerülés és az optimális teljes portfólió”; "Random walks and Brownian motion" / „Véletlen bolyongás és Brown-mozgás”; "Adverse selection and informed trading" / „Kedvezőtlen kiválasztás és informált kereskedés”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/avellaneda-stoikov` (module `avellaneda-stoikov`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"as-quotes"` with its maths in a pure file and a test.
3. Remove `"avellaneda-stoikov"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Inventory risk and quote skewing" and "Risk aversion and the optimal complete portfolio" by
exact title (HU: „Készletkockázat és a jegyzések eltolása” és „Kockázatkerülés és az optimális teljes portfólió”).

1. Set-up — mid `dS = σ dW`; maker with cash `x`, inventory `q`, horizon `T`; utility `-e^{-γ(x + qS_T)}`; fills at intensity `λ(δ) = A e^{-kδ}` per side.
2. The reservation price — derive the indifference price: `E[-e^{-γ(x + qS_T)}] = -e^{-γ(x + qs)} e^{γ^2 q^2 σ^2 (T-t)/2}`; buying one more share at `r^b` leaves utility unchanged ⇒ `r^b = s - (1 + 2q)γσ^2(T-t)/2`, selling ⇒ `r^a = s + (1 - 2q)γσ^2(T-t)/2`; average `r = s - qγσ^2(T-t)`.
3. The optimal spread — state the result `δ^a + δ^b = γσ^2(T-t) + (2/γ)\ln(1 + γ/k)` and explain its two terms (inventory risk over the remaining time; the trade-off between fill rate and margin, which tends to `2/k` as γ → 0 — the risk-neutral income maximiser from the adverse-selection lesson). Sketch where it comes from (HJB, first-order approximation) without the full derivation; say that clearly.
4. Quotes — `b = r - (δ^a+δ^b)/2`, `a = r + (δ^a+δ^b)/2`; long ⇒ both quotes below the mid; near the close both terms shrink.
5. Effect of γ — higher γ widens the spread early in the day but **narrows** it near the close (the second term falls with γ); show it numerically.
6. Symmetric versus inventory strategy — the symmetric maker earns slightly more on average but with much higher variance; the paper's comparison in words.

Then: one `worked` block (below), the `figure("as-quotes")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/avellaneda-stoikov", "<Open the … lab>")`. Also cite "Random walks and Brownian motion", "Adverse selection and informed trading" where the text uses them (same citations in HU).

## Worked example
γ = 0.1, σ = 2, k = 1.5, s = 100, T − t = 0.5, q = 6. Steps: inventory term qγσ²(T−t) = 1.2 ⇒ r = 98.80; spread terms 0.1·4·0.5 = 0.2 and (2/0.1)·ln(1 + 0.1/1.5) = 20·0.064539 = 1.2908 ⇒ total 1.4908; quotes 98.0546 / 99.5454. Then the same at T − t = 0 with γ = 0.5 vs 0.1 (1.1507 vs 1.2908) for the "tighter near the close" point.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `avellaneda-stoikov/reservation` (number): s = 50, q = −4, γ = 0.2, σ = 1, T − t = 0.25 → reservation price (`50 + 4·0.2·1·0.25 = 50.2`, tolerance 0.001).
- `avellaneda-stoikov/close` (choice): at the close (T − t → 0) a more risk-averse maker quotes… — a tighter spread (correct) / a wider spread / the same spread / no quotes.

## Figure
Interactive quotes. A vertical price column (SVG) with mid, reservation price and bid/ask, and a horizontal inventory track whose puck the reader drags (q from −10 to 10, `DragHandles` or a keyboard-accessible slider); a day clock `SliderField` (t from 0 to T) and γ `SliderField` (log scale 0.01–1); a small `LineChart` of the total spread against T − t for three γ values showing the crossover near the close; readouts: r, δ^a + δ^b, bid, ask.
All text through `t()` with keys inside the `// #region avellaneda-stoikov` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/AsQuotes*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-avellaneda-stoikov`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Import `asReservation`, `asTotalSpread`, `asQuotes` from `src/lib/market/quotes.ts`. Figure helpers (`spreadVsTime(gammas, sigma, k, T, steps)`, `indifferencePrices(s, q, gamma, sigma, tau)` returning `r^b`, `r^a`) in `src/features/guide/guide.micro.avellanedaStoikov.math.ts`. Tests: worked example; `(r^a + r^b)/2 = asReservation(...)`; spread at τ = 0 falls with γ, at τ = 1 rises with γ (for the defaults).
Test file: `scripts/guide-micro-avellaneda-stoikov.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"avellaneda-stoikov"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"avellaneda-stoikov"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/avellanedaStoikov.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-avellaneda-stoikov.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/avellaneda-stoikov,/hu/guide/microstructure/avellaneda-stoikov"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Do not claim the spread formula is exact; it is the paper's approximation. Phrase: "Avellaneda and Stoikov show that, to first order, …".

## Findings (fill in during execution)
- EN word count about 1450. Default readouts quoted: r 98.80, spread 1.49, bid 98.05, ask 99.55 (confirmed in the built page); spreads at T-t=1 / 0 for gamma 0.05, 0.2, 0.8: 1.51/2.05/4.27 and 1.31/1.25/1.07.
- HU text awaiting owner review: the whole HU lesson (headings Felépítés, A rezervációs ár, Az optimális spread, A jegyzések, A kockázatkerülés hatása, Szimmetrikus és készletvezérelt stratégia; terms rezervációs ár, közömbösségi ár, teljesülési tag) and the gfMsAs* figure strings.
- Deviations: figure uses inventory as a slider (-10..10), not a drag puck; spread chart gammas fixed at 0.05/0.2/0.8. Verification: tsc/eslint errors only in other plans' files (ExecutionFrontier, Inventory, Kyle, Pnl); test:guide-audit red only on fama-french/systemic-risk (other pack); test:guide-graph layout-time test flaked under load (323 ms); vite preview EN pages show React #418 (hydration) on the track page too, HU clean, likely prerender from parallel builds, not chased. micro/checks/markdown tests pass.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/11-avellaneda-stoikov.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Optimal quoting: the Avellaneda–Stoikov model" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `as-quotes` with its pure maths and
> `scripts/guide-micro-avellaneda-stoikov.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 11 to `done` in the README
> table, and summarise.
