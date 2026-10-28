# 10 — Lesson: Inventory risk and quote skewing

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Even with no informed traders, a maker who accumulates a position is exposed to every price move. This lesson quantifies that risk and shows the maker's main tool, skewing both quotes, before the next lesson makes the skew optimal.

## Current state (verified 2026-10-28)
- After plan 01: lesson `inventory-risk` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsInventoryRiskTitle`, labs `["market-making"]`) with a placeholder
  text in `src/Language/guides/inventoryRisk.ts` (export `inventoryRisk`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/InventorySkewFigure.tsx` registered as `"inventory-skew"` in
  `figures/index.ts`. Its figure strings live in the `// #region inventory-risk` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsInventorySkewTitle` only).
  `scripts/guide-audit.test.mjs` lists `"inventory-risk"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Market makers and liquidity" / „Market makerek és a likviditás”; "Random walks and Brownian motion" / „Véletlen bolyongás és Brown-mozgás”; "Delta and hedging" / „Delta és fedezés”. Every lesson of the track
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
2. A working interactive figure `"inventory-skew"` with its maths in a pure file and a test.
3. Remove `"inventory-risk"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Market makers and liquidity" and "Random walks and Brownian motion" by
exact title (HU: „Market makerek és a likviditás” és „Véletlen bolyongás és Brown-mozgás”).

1. Inventory P&L — with position `q` and mid change `Δm`, P&L `qΔm`; over time τ with volatility σ its standard deviation is `|q|σ\sqrt{τ}`; the variance grows with `q^2`.
2. How inventory builds — fills on one side are random; with balanced flow inventory is a random walk, so its typical size grows like the square root of time (cite the random-walk lesson).
3. Skewing — move both quotes down when long (sell more readily, buy less readily) by `θq`; the expected drift of inventory becomes negative; a mean-reverting inventory.
4. The trade-off — skewing lowers variance but gives up spread income (you sell cheaper when long); a numerical illustration from the figure.
5. Hedging instead — crossing the spread to flatten (cost: half-spread plus fee) or trading a correlated instrument (as in delta hedging); when each is used.

Then: one `worked` block (below), the `figure("inventory-skew")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/market-making", "<Open the … lab>")`. Also cite "Delta and hedging" where the text uses them (same citations in HU).

## Worked example
Long 500 shares, σ = 0.02 USD per √second, horizon 60 s ⇒ P&L standard deviation 500·0.02·√60 = 77.46 USD; versus flattening now by selling 500 at the bid with half-spread 0.01 and fee 0.003 ⇒ cost 6.50 USD. Then the 95% one-minute loss (1.645 × 77.46 = 127.42 USD).
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `inventory-risk/sd` (number): short 1,000 shares, σ = 0.01 USD per √s, horizon 100 s → standard deviation of inventory P&L in USD (100, tolerance 0.5).
- `inventory-risk/skew` (choice): the maker is long. To reduce inventory it should… — lower both bid and ask (correct) / raise both / widen only the ask / stop quoting the bid only.

## Figure
Interactive skew. 200 seeded sessions of a simple Poisson-fill maker (fills at rate `A e^{-kδ}` per side via `fillIntensity` from `src/lib/market/quotes.ts`) with skew strength `θ` from a `SliderField` (default 0); a `LineChart` of 5 inventory paths and a `Histogram` of terminal inventory for the current θ, with θ = 0 as a faint reference; readouts: inventory sd, mean P&L, P&L sd. Direct manipulation: drag the reservation marker on a small price ladder (`DragHandles`) to set the skew per share.
All text through `t()` with keys inside the `// #region inventory-risk` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/InventorySkew*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-inventory-risk`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.inventoryRisk.math.ts`: `inventoryPnlSd(q, sigma, tau)`, `simulateSkew({ theta, halfSpread, A, k, sigma, T, dt, sessions, seed })` → paths and summaries (common random numbers across θ). Keep it ≤ 20,000 steps total for the default so the page stays fast (compute synchronously in `useMemo`). Tests: sd formula; θ > 0 lowers terminal-inventory sd versus θ = 0 on the same seeds; determinism.
Test file: `scripts/guide-micro-inventory-risk.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"inventory-risk"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"inventory-risk"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/inventoryRisk.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-inventory-risk.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/inventory-risk,/hu/guide/microstructure/inventory-risk"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- This lesson must not derive Avellaneda–Stoikov (next lesson); keep the skew a free parameter θ.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: about 1,500 EN words. Defaults (θ = 0, 200 sessions, 60 s, δ = 2¢, A = 0.25, k = 30, σ = 0.02): final inventory sd 372 shares, mean P&L 36.01 USD, P&L sd 39.62 USD; at θ = 0.20¢ per lot: 253 / 33.59 / 34.50; at 0.40¢: 202 / 30.39 / 29.58 (verified in the built page via CDP). Worked: 77.46, 127.42, 6.50, 120.92.
- HU text awaiting owner review (headings, terms used): the whole lesson. Headings „A készlet eredménye”, „Hogyan épül fel a készlet”, „A jegyzések eltolása” (skewing), „Mibe kerül az eltolás”, „Fedezés az eltolás helyett”; terms készlet, lot, teljesülés, átlépheti a spreadet; figure labels in GuideMicrostructure.hu.ts (gfMsIs*).
- Deviations: added a third check `inventory-risk/flatten`; the figure is three charts (draggable quote ladder, 5 inventory paths, terminal-inventory histogram with θ = 0 curve); skew slider in cents per 100 shares (0 to 0.5), drag marker sits at 5 lots long. Verification: tsc/eslint clean for my files (tsc errors in ExecutionFrontier* belong to plan 09); test:guide-audit red only on fama-french/systemic-risk (other pack); test:guide-graph failed once on a layout timing assertion (174 ms, machine load from parallel builds); vite build printed the SEO prerender plugin error from parallel builds, bundle was fine.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/10-inventory-risk.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Inventory risk and quote skewing" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `inventory-skew` with its pure maths and
> `scripts/guide-micro-inventory-risk.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 10 to `done` in the README
> table, and summarise.
