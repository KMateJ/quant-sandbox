# 06 — Network explorer page

Status: done (2026-10-28) · Depends on: 04, 05 · Suggested model: Sonnet · Est. size: L

## Why
Before anything fails, the reader should understand who is connected to whom and why some institutions
matter more than their size suggests. The explorer is an **editable** network: click an institution to open
its balance sheet, drag between two institutions to create an exposure, change or delete edges, switch
structures (core–periphery, complete, ring, random), and guess which failure would hurt most before the
DebtRank ranking is revealed.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 04: `src/features/systemic-risk/SystemicRiskPages.tsx`, stub `pages/NetworkPage.tsx` (yours to
  replace; it currently shows a sample graph from `pages/sampleGraph.ts` — delete that file when done),
  `systemicRisk.url.ts` (shared keys `net`, `seed`, `edits`), copy table `src/Language/SystemicRisk.ts`/`.hu.ts`
  (prefix `syr`), partial `src/styles/_systemic-risk.scss`; generic chart `src/components/charts/network/
  NetworkGraph.tsx` (`nodes: NetNode[]`, `edges: NetEdge[]`, `height`, `seed?`, `positions?`, `selectedId?`,
  `onSelect?`, `onEdgeSelect?`, `connectMode?`, `onConnect?(from, to)`, `dimmed?`, `ariaLabel`, `labels`) with
  `NetStatus` glyphs, and copy `src/Language/NetworkChart.ts`. Read plan 04's Findings.
- After plan 05: `src/features/systemic-risk/engine/` — `systemic.types.ts` (`FinNetwork`, `Institution`,
  `Exposure`, `ExposureType`, `InstKind`, `AssetId`), `presets.math.ts` (`presetNetwork`, `DEFAULT_PARAMS`),
  `edits.math.ts` (`Edit`, `applyEdits`, `encodeEdits`, `decodeEdits`), `metrics.math.ts` (`balance`,
  `degrees`, `density`, `exposureMatrix`, `eigenvectorCentrality`, `debtRank`, `systemicRanking`). Read plan 05's
  Findings (which node is most systemic in `core-periphery`).
- Primitives: `HeatmapPicker` (matrix view), `DataTable`, `StatCard`, `SegmentedControl`, `SwitchRow`
  (`src/components/SwitchRow.tsx`), `NumberStepper`, `PredictReveal`/`usePredictReveal`, `PredictExplain`,
  `ChallengeRecord`, `SERIES_PALETTE`. Pick-challenge pattern: `src/features/yield-curve/components/ShockPredict.tsx`.

## Goal
1. The network (dominant figure) with kind/exposure filters, size and colour encodings, selection.
2. A balance-sheet and counterparties panel for the selected institution; system metrics strip.
3. Edit mode: draw, change and delete exposures; edits live in the URL (`edits`) and drive all metrics.
4. Matrix view of exposures; Predict `syr-most-systemic`; "Fail it" link to the shock page.

## Non-goals
- Contagion animation (plan 07). No edits to `engine/` (append a `BLOCKED` line if something is missing).

## Steps
1. **View model** (`network/networkView.math.ts`, pure): `toNetNodes(net, { sizeBy: "assets" | "equity" |
   "debtRank", colorBy: "kind" | "leverage" | "capital", kinds: Set<InstKind> })` → `NetNode[]` (radius ∝ √value,
   kind colours from `SERIES_PALETTE` in a fixed order, sequential colours for leverage/capital using two
   tokens); `toNetEdges(net, types: Set<ExposureType>)` → `NetEdge[]` (width ∝ √amount, colour per type, `dashed`
   for repo, `directed` lender → borrower); `instLabel(inst, t)` = `t("syrKind_<kind>") + " " + tag`.
2. **Hook** `useNetworkPage.ts` + `network.url.ts` (own keys: `sel`, `size`, `color`, `kinds`, `types`, `view` =
   graph | matrix, `edit` bool): build the network from shared `net`/`seed`/`edits` via `presetNetwork` +
   `applyEdits`; memoise metrics and `systemicRanking`.
3. **Graph** (`components/network/NetworkPanel.tsx`): `NetworkGraph` at ≥ 480px height on desktop, legend
   (kinds with words, exposure types with line samples), a search box that selects by label. In edit mode a small
   toolbar: Select · Connect · Delete; Connect uses `onConnect` to open `ExposureForm.tsx` (type
   `SegmentedControl`, amount `NumberStepper` $bn, collateral for repo) → `Edit` appended to `edits`; clicking an
   edge in edit mode opens the same form to change or delete it. An "Edited (n)" note with Reset.
4. **Matrix view** (`ExposureMatrix.tsx`): `HeatmapPicker` lenders × borrowers (sequential, amount), sorted by
   kind; `onPick` selects the pair and, in edit mode, opens `ExposureForm`. Tabs graph/matrix share selection.
5. **Selected entity** (`EntityPanel.tsx`, `BalanceSheetBars.tsx`, `CounterpartyTable.tsx`): kind, tag and a
   "systemically important" text marker (not a pill) when in the top 3 by DebtRank; two square stacked bars
   (assets: cash, loans, gov, corp, mbs, equity holdings, interbank/repo/derivative claims; liabilities: deposits,
   short funding, interbank/repo owed, other, equity) with a legend; stat cells: total assets, leverage, capital
   ratio, liquidity ratio, DebtRank, rank; counterparties table (counterparty, type, direction, amount, share of
   equity). Clicking a row selects that counterparty.
6. **System strip** (`SystemStats.tsx`): total assets, average leverage, density, largest exposure / equity,
   DebtRank of the top node, "single points of failure" (count of nodes whose DebtRank > 0.2; label the threshold).
7. **Structure switch**: `SegmentedControl` for `net` (starter, core–periphery, complete, ring, random) plus a
   degree stepper for random; `SeedControl compact`. `PredictExplain`: "Same banks, same total lending: complete
   network or ring — which is more fragile to one default?" (*the ring*: each bank's loss is concentrated on one
   neighbour; the complete network spreads it).
8. **Predict `syr-most-systemic`** (pick): metrics hidden; "Click the institution whose failure would do the most
   damage"; the reader clicks a node; reveal the DebtRank ranking as a bar list with the reader's pick and the
   largest-by-assets node marked; `challengeId: "syr-most-systemic"`; rounds use `core-periphery` and `random`
   with new seeds. The surprise (record it): the answer is often not the biggest balance sheet.
9. **Fail it**: in the entity panel, "Simulate its failure" links to `/systemic-risk/shocks?net=…&seed=…&edits=…&fail=<id>`
   (plan 07 reads `fail`; until then the link still opens the page).
10. Replace `pages/NetworkPage.tsx` (compose only), delete `pages/sampleGraph.ts`. Copy in `SystemicRisk.ts`;
    styles in `_systemic-risk.scss`.
11. **Wiring**: append `{ id: "syr-most-systemic", area: "portfolio", moduleId: "systemic-risk", kind: "pick",
    tolerance: "top 1" }`; `sbxCh_syr-most-systemic` "Most systemic institution" / HU "A legrendszerkockázatosabb
    intézmény". If plans 07 and 08 are both `done`, set the registry `status` to `"beta"`.
12. **Tests** `scripts/systemic-network-page.test.mjs`: `toNetNodes`/`toNetEdges` filters and encodings; labels
    never contain real firm names (assert against a small deny-list: JPMorgan, Goldman, Lehman, Citi, Barclays,
    HSBC, BNP, Deutsche, Morgan Stanley, Bank of America); edits from the form round-trip through the URL codec.

## Acceptance criteria
- Pointer and keyboard can: select, filter, switch views, add/change/delete an exposure, and play a predict
  round; metrics update immediately after an edit.
- Smoke and layout audit clean; the graph is usable at 360px (pan/zoom buttons, list fallback via the matrix).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:systemic-risk && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/systemic-risk,/systemic-risk?net=ring,/systemic-risk?view=matrix&edit=1,/systemic-risk?edits=d.e1,/hu/systemic-risk"
node scripts/layout-audit.mjs   # /systemic-risk at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Layout stability:** recomputing the force layout on every edit makes the graph jump; keep positions for
  existing nodes (pass `positions` from the previous layout) and only place new ones.
- **Colour-only meaning:** kinds also appear in the legend and in the entity panel; statuses use glyphs.
- **No real names** anywhere in copy or presets (the test guards labels).

## Findings (filled in 2026-10-28)
- Default preset (`core-periphery`, seed 3): most systemic node is dealer `d3` (DebtRank 0.415), largest balance sheet is `d1` (0.304). Same on seed 1. In the predict rounds 0-5 the DebtRank leader was never the largest node (core-periphery: d3 vs d1; random: b24 vs b5, b15 vs b7, b22 vs b4), so the recorded surprise holds.
- New HU keys for owner review (all draft, in `src/Language/SystemicRisk.hu.ts`): every `syr*` key added by this plan, notably `syrKind_*`, `syrKindShort_*`, `syrNet_*`, `syrSeg_*`, `syrType_*`, `syrTool*`, `syrForm*`, `syrExplain*`, `syrPredict*`, `syrSys*`; plus `sbxCh_syr-most-systemic`. HU kind names differ from EN on purpose (test requires HU != EN): "Kereskedelmi bank", "Dealer-bank", "Hedge-alap".
- Deviations:
  - Kind filter does not change the layout: `positions` come from the unedited, unfiltered network (fixed 900x520 box, assets-based radii) and are passed to `NetworkGraph`, so filters, encodings and edits never rearrange the picture. Filtering removes nodes and their edges from the chart.
  - Graph labels use short kind names (`syrKindShort_*`, "Regional B") to avoid label collisions on 30 nodes; the panels, form and tables use the full `instLabel` ("Regional bank B").
  - `ExposureForm` has no collateral input: `encodeEdits` does not carry collateral, so a note states the stylised recoverable share (repo 70%, derivatives 50%). Changing an existing exposure edits the amount only; to change the type, delete and add.
  - The predict round has its own small graph (core-periphery on even rounds, random on odd, seeds 11+) instead of hiding metrics on the main page; the main explorer is never blurred.
  - Filter and legend are one control (`FilterLegend`): toggle buttons with colour/line swatches and words.
  - "Largest exposure / equity" is shown as a multiple (e.g. 36.3x) because a money market fund with equity 1.8 lends about 65.
  - Deleting an exposure appends `d.<id>`; edits are never compacted (ids `n1`... depend on add order), only an earlier `s.<id>` for the same exposure is replaced.
  - Registry `status` left `planned`: plans 07 and 08 were not both done. `sampleGraph.ts` deleted; `syrPlanned`/`syrSample*` copy removed.
- Verification: `tsc -b` clean for this plan's files (errors only in plan 08's in-progress episodes files); eslint clean on touched files; `test:systemic-risk` network-page, engine and chart suites pass (systemic-wiring failed only on plan 07's `SystemicRiskShocks.syrShockKind_bank` equal in EN/HU); `test:challenges`, `test:sandbox` pass. Built to an in-repo outDir (`test:seo` reads `dist/` only, so not run; the root page has 844 words EN, 749 HU, 302 pages pre-rendered on the second build, the first showed the parallel-build LanguageProvider prerender failures). Smoke on the 6 paths plus an interactive check (delete an edge -> `edits=d.x1`, metrics changed; predict pick reveals ranking; matrix renders) clean; layout audit 360/768/1280/1536 light and dark for `/systemic-risk`, `?view=matrix&edit=1`, `/hu/systemic-risk`: 0 failing.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/06-network-explorer.md`; confirm plans
> 04 and 05 are done and read their Findings. Implement plan 06: the editable network explorer (filters,
> encodings, entity balance sheet and counterparties, system stats, connect/edit/delete exposures in the URL,
> matrix view, structure switch), the `syr-most-systemic` predict and tests. Run the verification block, fill
> in Findings, append DONE to LOG.md, set plan 06 to `done`, and summarise.
