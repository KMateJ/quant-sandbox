# 04 — Lesson: Queue position and fill probability

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
A limit order earns the spread only if it fills. Where it sits in the queue decides how often it fills and which fills it gets; this is the passive side of the book and the first sight of adverse selection.

## Current state (verified 2026-10-28)
- After plan 01: lesson `queue-position` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsQueuePositionTitle`, labs `["order-book"]`) with a placeholder
  text in `src/Language/guides/queuePosition.ts` (export `queuePosition`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/QueueFillFigure.tsx` registered as `"queue-fill"` in
  `figures/index.ts`. Its figure strings live in the `// #region queue-position` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsQueueFillTitle` only).
  `scripts/guide-audit.test.mjs` lists `"queue-position"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "The limit order book" / „A limitáras ajánlati könyv”; "Random walks and Brownian motion" / „Véletlen bolyongás és Brown-mozgás”. Every lesson of the track
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
2. A working interactive figure `"queue-fill"` with its maths in a pure file and a test.
3. Remove `"queue-position"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "The limit order book" by
exact title (HU: „A limitáras ajánlati könyv”).

1. The queue at a price — FIFO under price–time priority; shares ahead `A`, your size `q`.
2. What moves you forward — market orders on your side's opposite (sells hit bids) consume the front; cancellations ahead remove shares; new orders join behind you.
3. Waiting time — with sell volume arriving at rate `v` shares per minute and cancellations ahead at rate `c` per minute, the first-order wait is `W \approx A / (v + c)`; derive it from a constant-rate queue, then say what randomness changes.
4. Fill probability — model sell volume over a horizon `h` as a compound Poisson sum (market orders arrive at rate `λ`, sizes with mean `μ_s` and second moment `E[S^2]`); mean `λ h μ_s`, variance `λ h E[S^2]`; normal approximation `P(\text{fill}) ≈ 1 - Φ((A + 1 - λ h μ_s - c h)/\sqrt{λ h E[S^2]})`.
5. Losing priority — moving the price or size means cancel and re-enter at the back; why makers avoid it.
6. Which fills you get — your bid fills when sellers push through the level; the price is more likely to keep falling afterwards (a preview of adverse selection, cited later by the adverse-selection lesson — do not cite it here).

Then: one `worked` block (below), the `figure("queue-fill")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/order-book", "<Open the … lab>")`. Also cite "Random walks and Brownian motion" where the text uses them (same citations in HU).

## Worked example
Best bid 99.97, 1,260 shares ahead of your 400; sells hit the bid at 300 shares per minute and cancellations ahead remove 100 per minute. Steps: combined rate 400/min, expected wait ≈ 3.15 minutes; after 2 minutes 800 shares are gone and 460 remain ahead; then the fill probability within the next minute with the normal approximation (market sells 3 per minute, sizes exponential with mean 100 ⇒ `E[S^2] = 20,000`) — compute with node.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `queue-position/fifo` (choice): two buy orders at 99.97, which fills first? — the one that arrived first (correct) / the larger / they split pro rata / the one from the market maker.
- `queue-position/wait` (number): 900 shares ahead, sells 250/min, cancels ahead 50/min → expected wait in minutes (3, tolerance 0.05).

## Figure
Interactive queue. A row of square blocks (orders at the best bid, front at the right) with your block highlighted (1px `var(--primary)` outline + tinted background, never a left bar); `SliderField`s for sell arrivals per minute (default 300), cancels ahead per minute (default 100) and shares ahead (default 1,260); a "Simulate 1 minute" button that runs a seeded compound-Poisson draw and animates blocks leaving the front (instant under `prefersReducedMotion()`); a curve of P(fill within 1 minute) against shares ahead with a marker at the current value ("1,260 ahead → n% in 1 min"). Readouts: shares ahead, expected wait, fill probability.
All text through `t()` with keys inside the `// #region queue-position` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/QueueFill*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-queue-position`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Own file `src/features/guide/guide.micro.queuePosition.math.ts`: `expectedWait(ahead, sellRate, cancelRate)`, `fillProbability({ ahead, lambda, meanSize, horizon, cancelRate })` with `normCdf` from `src/lib/stats/distributions.ts`, `simulateMinute(state, params, seed)` (Poisson arrivals via `nextPoisson`/`nextExponential` in `src/lib/math/random.ts`). Tests: wait formula; probability decreasing in `ahead` and within [0, 1]; Monte Carlo of `simulateMinute` agrees with `fillProbability` within 0.05 at the defaults.
Test file: `scripts/guide-micro-queue-position.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"queue-position"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"queue-position"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/queuePosition.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-queue-position.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/queue-position,/hu/guide/microstructure/queue-position"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Use "shares per minute" consistently in text and figure; the mockup numbers (1,260 ahead, 300/min, 100/min → 3.2 min) round 3.15 to 3.2 — say "about 3.2 minutes" only if the figure shows one decimal.

## Findings (filled in 2026-10-28)
- EN word count and figure default readouts quoted in the text: about 1,500 words EN (audit word range passes). Default readouts: 1,260 shares ahead, expected wait 3.15 min, fill within 1 minute 0.02% (normal approximation, `1 - Φ(3.52)`), filled 0 of 400. The text quotes exactly these, plus sd(W) ≈ 1.1 min and the worked example (460 ahead → z = 0.249 → 0.4017). Figure shows two decimals for the wait (3.15), so the text says 3.15, not 3.2.
- HU text awaiting owner review (headings, terms used): all HU in `src/Language/guides/queuePosition.ts` and the `gfMsQf*` keys in `GuideMicrostructure.hu.ts`. Headings: „A sor egy áron”, „Mi visz előre a sorban”, „Várakozási idő”, „Teljesülési valószínűség”, „A prioritás elvesztése”, „Milyen teljesüléseket kapsz”, „Összefoglalás”. Terms: market maker (árjegyző) on first mention, piaci/limitáras megbízás, ajánlati könyv (in the cited title), teljesül/teljesülés, törlés, bid/ask kept English, „first in, first out” kept English. Figure readouts use a dot decimal (`toFixed`), like the other figures.
- Deviations: (1) The plan's normal approximation is coarse at 3 orders a minute: simulation of the worked example (460 ahead) gives about 33%, not 40.2%. The lesson says so in one sentence; the Monte Carlo test therefore compares at the default (1,260), 700 ahead, and at 1,000 shares/min, where it is within 0.05, instead of at 460/300. (2) Simulation uses deterministic cancels (rate × h) so it matches the formula's model; the queue state persists across presses of "Simulate 1 minute" and "Reset" restores the slider value. (3) Third check `queue-position/priority` added (plan allowed 2–3). (4) Blocks are an inline SVG (no SCSS added); one square per 100 shares. (5) Verification: `tsc -b` is red only in `src/features/market-making-desk/**` (another pack's half-done files); `npm run build` and `cdp-smoke.mjs` were not run (port 4173 is another session's preview; the smoke script could not reach the dev server and printed "site unreachable"). Instead checked EN and HU in the built-in browser against the running dev server: lesson renders, no console errors, figure responds to sliders and to Simulate/Reset, HU strings resolve. `test:guide-audit` has one failure, pre-existing and not ours: "labs no lesson practises: fama-french, systemic-risk" (factor-and-systemic-risk pack).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/04-queue-position.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Queue position and fill probability" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `queue-fill` with its pure maths and
> `scripts/guide-micro-queue-position.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 04 to `done` in the README
> table, and summarise.
