# 05 — Systemic engine: networks, metrics, contagion

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: L

## Why
All three systemic-risk pages run on one model of a financial system: stylised institutions with balance
sheets, bilateral exposures, common asset holdings, and a day-by-day contagion process with four channels
and policy interventions. Writing it once, pure and tested, keeps the explorer, the shock simulator and the
historical episodes consistent.

## Current state (verified 2026-10-28, commit `a4b1706`)
- No network or contagion code in `src`. Useful helpers: `src/lib/math/random.ts` (`makeRng`, `nextNormal`),
  `src/lib/game/seed.ts` (`subSeed`), `src/lib/math/matrix.ts` (`matVec`, `dot`), `src/lib/stats/moments.ts`
  (`mean`).
- Plan 04 (may run in parallel) creates the module folder `src/features/systemic-risk/` with pages and a URL
  key `edits` (a string) whose format **this plan defines** (`encodeEdits`/`decodeEdits`). Plan 04 defines
  `test:systemic-risk` (`scripts/systemic-*.test.mjs`); without it run `node --test scripts/systemic-engine*.test.mjs`.
- Owner decision: institutions are **stylised archetypes**, never real firms. The engine stores `kind` + a
  letter tag; pages turn that into "Dealer bank A" through copy.
- Test loader: `scripts/lib/load-ts.mjs` (`importSrc("features/systemic-risk/engine/x.ts")`; relative imports
  only, `.ts` appended).

## Goal
`src/features/systemic-risk/engine/` (pure, `///` docs): types, presets/generators, edits, balance-sheet
metrics, eigenvector centrality and DebtRank, the contagion simulator with shocks and interventions, rescue
policies, and the fragility sweep — with tests.

## Non-goals
- No React, copy or styles. No real-firm data.

## Constraints
- Money in $bn. Pure and deterministic: randomness only in generators (seeded); the simulator itself is
  deterministic given (network, shock, params, interventions).

## Steps
1. **`engine/systemic.types.ts` first** (commit it early and append a `CONTRACT` line to LOG.md so plans 06–08
   can start their UI):
   ```ts
   export type InstKind = "dealer" | "bank" | "regional" | "mmf" | "hedgeFund" | "insurer" | "ccp";
   export type AssetId = "gov" | "corp" | "mbs" | "equity";
   export type ExposureType = "interbank" | "repo" | "derivatives";
   export type Institution = { id: string; kind: InstKind; tag: string; cash: number; loans: number;
     holdings: Record<AssetId, number>; deposits: number; shortFunding: number; otherLiab: number };
   export type Exposure = { id: string; lender: string; borrower: string; type: ExposureType; amount: number; collateral: number };
   export type AssetClass = { id: AssetId; depth: number /* $bn of net sales that move the price by 1% */ };
   export type FinNetwork = { institutions: Institution[]; exposures: Exposure[]; assets: AssetClass[] };
   export type Channels = { direct: boolean; fireSales: boolean; funding: boolean; ccp: boolean };
   export type SimParams = { days: number; lgd: number; distressRatio: number; runTrigger: number;
     runFraction: number; depositRunFraction: number; targetRatio: number; priceFloor: number; channels: Channels };
   export type Shock =
     | { kind: "default"; id: string; day?: number }
     | { kind: "asset"; asset: AssetId; drop: number; shape: "instant" | "gradual"; days?: number; day?: number }
     | { kind: "run"; target: string /* id or InstKind */; source: "deposits" | "shortFunding"; fraction: number; day?: number };
   export type Intervention =
     | { kind: "capital"; id: string; amount: number; day: number }
     | { kind: "liquidity"; day: number }            // stops short-funding runs from that day
     | { kind: "guarantee"; day: number }            // stops deposit runs from that day
     | { kind: "parLending"; day: number }           // bonds can be pledged at par instead of sold
     | { kind: "assetPurchases"; asset: AssetId; amount: number; day: number };
   export type Status = "ok" | "stressed" | "critical" | "failed";
   export type ChannelLosses = { direct: number; fireSale: number; funding: number; ccp: number };
   export type SimEvent = { day: number; kind: "shock" | "default" | "fireSale" | "run" | "intervention" | "calm"; id?: string; asset?: AssetId; value?: number };
   export type DayState = { day: number; equity: Record<string, number>; assets: Record<string, number>;
     status: Record<string, Status>; prices: Record<AssetId, number>; losses: ChannelLosses; lossesById: Record<string, ChannelLosses>;
     flows: { from: string; to: string; amount: number; channel: keyof ChannelLosses }[]; events: SimEvent[] };
   export type SimResult = { days: DayState[]; defaults: string[]; totalLoss: number; peakPriceDrop: Record<AssetId, number> };
   ```
   Equity is always derived: `assets − liabilities` where assets = cash + loans + Σ holdings × price +
   interbank/repo/derivative claims, liabilities = deposits + shortFunding + otherLiab + amounts owed.
2. **`engine/presets.math.ts`**: `DEFAULT_PARAMS: SimParams` (`days` 60, `lgd` 0.6, `distressRatio` 0.04,
   `runTrigger` 0.03, `runFraction` 0.25, `depositRunFraction` 0.15, `targetRatio` 0.05, `priceFloor` 0.4,
   all channels on); `presetNetwork(id, seed): FinNetwork` for `starter` (8 nodes, for teaching),
   `core-periphery` (~30: 4 dealers fully interconnected; 12 banks each linked to 1–2 dealers; 6 regionals
   with deposits and MBS; 2 MMFs lending repo to dealers; 3 hedge funds borrowing repo from dealers; 2 insurers
   holding corp bonds with derivative exposures to dealers; 1 CCP clearing dealer derivatives), `complete` and
   `ring` (10 equal banks, same total interbank assets), `random` (30 banks, Erdős–Rényi with average degree
   from a param, default 4). Leverage ranges: dealers 18–25×, banks 10–14×, regionals 9–12×, hedge funds 5–15×,
   MMFs ≈ 1.01× (shares are `deposits`), insurers 8–10×. Make the most systemic node under DebtRank **not** the
   largest by assets in `core-periphery` (e.g. the mid-size dealer that is the MMFs' main repo borrower) and
   assert it in a test.
3. **`engine/edits.math.ts`**: `type Edit = { op: "add"; e: Exposure } | { op: "set"; id: string; amount: number }
   | { op: "del"; id: string }`; `applyEdits(net, edits)`; `encodeEdits(edits): string` / `decodeEdits(s): Edit[]`
   (compact, URL-safe: `a.<lender>.<borrower>.<i|r|d>.<amount>;s.<id>.<amount>;d.<id>`, ids are short codes;
   ignore malformed parts).
4. **`engine/metrics.math.ts`**: `balance(inst, net, prices)` → `{ assets, liabilities, equity, leverage,
   capitalRatio, liquidityRatio /* (cash + gov) / (shortFunding + deposits·depositRunFraction) */ }`;
   `degrees(net)`; `density(net)`; `exposureMatrix(net, type?)`; `eigenvectorCentrality(net)` (power iteration on
   the exposure matrix normalised by lender equity, 200 iterations, L1-normalised); `debtRank(net, h0:
   Record<string, number>)` (Battiston et al. 2012: impact Wᵢⱼ = min(1, exposureⱼ→ᵢ / equityⱼ); each node
   propagates once; R = Σⱼ hⱼ·vⱼ − Σⱼ hⱼ(0)·vⱼ with vⱼ = assets share); `systemicRanking(net)` → DebtRank of each
   node shocked alone (h0 = 1), sorted.
5. **`engine/simulate.math.ts`**: `simulate(net, shocks, params, interventions = []): SimResult`. Each day, in
   this order (document it in the `///` comment):
   1. apply shocks and interventions dated today (`capital` adds cash and equity; `assetPurchases` adds buy
      volume to the day's net sales);
   2. **direct**: for institutions that failed yesterday, each creditor loses `lgd × max(0, amount − collateral
      value)`; derivative exposures go through the CCP when `channels.ccp` (the CCP absorbs losses with its
      equity, then mutualises the rest pro rata to members' derivative exposure);
   3. **funding**: institutions with capital ratio < `runTrigger` lose `runFraction` of short funding (unless a
      `liquidity` intervention is active); `run` shocks and regionals below `distressRatio` lose
      `depositRunFraction` of deposits (unless `guarantee`); outflows are paid from cash, then by selling gov,
      corp, mbs, equity in that order (sales feed the fire-sale step; with `parLending`, bonds are pledged at par
      instead and not sold); unpaid outflow ⇒ failure (illiquid);
   4. **fire sales**: institutions with capital ratio < `distressRatio` sell holdings pro rata to reach
      `targetRatio` (or all they have); net sales per asset minus purchases move the price by
      `−net / depth %` (floored at `priceFloor`); every holder marks to market (fire-sale losses);
   5. status: equity ≤ 0 ⇒ `failed` (from tomorrow its creditors lose); ratio < `runTrigger` ⇒ `critical`; <
      `distressRatio` ⇒ `stressed`; else `ok`; emit events (first default, fire-sale start, runs, calm when
      nothing changed for 5 days);
   6. record `flows` (who lost what to whom by channel) for the edge animation.
   Turning a channel off skips its step. `gradual` asset shocks spread the drop evenly over `days` (default 10).
6. **`engine/policies.math.ts`**: `rescuePlan(policy: "none" | "largest" | "debtRank" | "weakest", net, budget,
   chunk)` → `Intervention[]` on day 0 (`largest` = biggest by assets, `debtRank` = top of `systemicRanking`,
   `weakest` = lowest capital ratio); `compareRescues(net, shocks, params, budget, chunk, yours)` → defaults and
   total loss per policy and for `yours`.
7. **`engine/fragility.math.ts`**: `fragilitySweep({ n = 50, degrees = [0.5, 1, 2, 3, 4, 6, 8, 10, 12],
   trials = 200, interbankShare = 0.2, capitalRatio = 0.04, seed })` → per degree `{ degree, pContagion /* ≥ 5%
   of banks fail after one random bank's default */, meanExtent /* given contagion */ }` (direct channel only,
   Gai–Kapadia style random networks). This must show the **robust-yet-fragile** shape (rising then falling
   probability); if it doesn't, tune `interbankShare`/`capitalRatio` and record the values. Expose a
   `sweepChunk(params, degreeIndex)` for incremental worker use.
8. **Tests** `scripts/systemic-engine.test.mjs`: presets deterministic; every institution's equity > 0 at day 0;
   balance identity; `applyEdits` + `encode`/`decode` round-trip; DebtRank of an isolated node is 0, of a hub > 0;
   the most systemic `core-periphery` node is not the largest by assets; a single default with direct channel only
   in `ring` cascades further than in `complete` for the same totals (Allen–Gale intuition; record numbers);
   fire sales on ⇒ some institution with no exposure to the failed one still loses; `liquidity` intervention
   lowers defaults in a funding-run scenario; `parLending` removes fire-sale losses from bond sales; `capital`
   on the right node prevents a default; `fragilitySweep` peaks at an interior degree; `simulate` on
   `core-periphery` (60 days) < 50 ms.

## Acceptance criteria
- `node --test scripts/systemic-engine.test.mjs` green; no React/i18n/DOM/`Math.random` in `engine/`.
- `systemic.types.ts` committed early with a `CONTRACT` line.

## Verification
```bash
npx tsc -b && npm run lint && node --test scripts/systemic-engine.test.mjs
grep -rnE "react|i18n|document|window|Math\.random|Date\.now" src/features/systemic-risk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Double counting:** an exposure is an asset of the lender and a liability of the borrower; when a borrower
  fails, remove the claim from the lender once (direct loss) and stop counting it as an asset.
- **Order of steps matters** (losses → runs → fire sales → status); keep it fixed and documented, and tests
  depend on it.
- **Price floor and depth units:** depth is $bn per 1% move; a 20 $bn sale with depth 10 moves the price 2%.
- **MMF "equity"** is tiny by design; treat MMFs as failing ("breaking the buck") when equity < 0, as for others.

## Findings (filled in 2026-10-28, systemic-engine)
- **Preset balance sheets** (`core-periphery`, seed 1, $bn): dealers 4 · assets 1377 · equity 60.5 · leverage 20.8–24.4;
  banks 12 · 1284 · 107 · 10.2–13.5; regionals 6 · 305 · 28.5 · 9.7–11.7; MMFs 2 · 186 · 1.8 (assets ÷ shares 1.01);
  hedge funds 3 · 182 · 17.1 · 8.9–11.9; insurers 2 · 235 · 27.1 · 8.5–8.9; CCP 1 · 49 · 4.0. Total assets 3619,
  83 exposures, density 0.095. `starter` 8 nodes/11 exposures; `ring`/`complete` 10 equal banks (leverage 11, equity
  21.4, 45 $bn lent each, so equal totals); `random` 30 banks (assets 100, share 0.2, capital 7%).
- **Most systemic node:** dealer D3 (`d3`, 3rd by assets: D1 412, D2 359, D3 338). DebtRank (lgd 0.6, claims net of
  collateral): d3 0.427, d1 0.355, d2 0.300, c1 0.286, d4 0.282. D3 is the MMFs' main repo borrower and has the most
  bank creditors; d3 is top on every seed 1–12 (tested). Eigenvector centrality also puts d3 first.
- **Ring vs complete** (direct channel only, default shock on b1, lgd 0.6): ring 10 defaults, total loss 243 (the
  creditor loses 27 > equity 21.4, one hop per day); complete 1 default (b1), total loss 27 (nine creditors lose 3 each).
- **Fragility sweep** (n 50, interbank share 0.2, capital ratio 0.04, lgd 1 as in Gai–Kapadia, 200 trials, seed 7),
  degree: P(contagion) / mean extent: 0.5: 0.09/0.10 · 1: 0.41/0.24 · 2: 0.77/0.77 · 3: 0.90/0.95 · 4: 0.90/0.98 ·
  6: 0.77/0.99 · 8: 0.46/0.99 · 10: 0.09/1.00 · 12: 0.01/1.00. Robust-yet-fragile on the first try, so the defaults
  were not tuned. Contagion = the first default topples at least 5% of the banks (excluding itself). Whole sweep ≈ 6 s
  (≈ 3 ms per trial); use `sweepChunk(params, degreeIndex)` per degree in a worker.
- **Rescue policies** (`core-periphery`, budget 30, chunk 10, mbs −40%): none 9 defaults, largest/debtRank/weakest 7.
  Order: debtRank d3,d1,d2,c1; largest d1,d2,d3,d4; weakest d3,d2,d4,d1 (MMFs and CCP excluded from `weakest`).
- **Timing:** `simulate` on `core-periphery`, 60 days: ≈ 5–10 ms median, test requires best-of-9 < 50 ms.
- **Deviations / design choices:**
  - `debtRank(net, h0, lgd = 0.6)` returns `{ rank, h }`; impacts use lgd × (claim − collateral) ÷ lender equity (not
    the raw claim), so collateralised repo does not dominate. `systemicRanking(net)` returns `{ id, debtRank }[]`.
  - `collateral` is the stylised recoverable value (repo 70% of the claim, derivatives 50%, interbank 0), fixed in time.
  - `ChannelLosses.funding` = mark-to-market loss caused by run-forced sales (split of each price move by the share
    of forced vs deleveraging sales); `fireSale` = the rest. The initial asset shock is not a channel loss; `totalLoss`
    sums the four channels.
  - CCP: member margin is modelled as a derivatives exposure `lender = member, borrower = CCP`; CCP equity absorbs first,
    then members' margin pro rata. MMFs and the CCP use equity vs starting equity for status (ok ≥ 80%, stressed ≥ 50%,
    critical below), never fire-sell for capital, and an MMF below 50% of starting equity suffers deposit runs.
  - Failed institutions liquidate all securities in the next fire-sale step; a failure from an unmet outflow can happen
    with positive equity. `applyEdits` keeps every institution's equity unchanged (lender funds from cash then loans;
    borrower swaps other liabilities, short funding, deposits). Added exposures are numbered `n1`, `n2`, … by `decodeEdits`.
  - `days[0]` is the end of day 0 (day-0 shocks included); `days.length = params.days + 1`.
  - Extra files beside the planned ones: `accounting.math.ts`, `build.math.ts`, `simctx.math.ts`, `contagion.math.ts`.
  - No `.tsx`, copy or HU keys were added by this plan.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/05-systemic-engine.md`. Implement plan
> 05: commit `engine/systemic.types.ts` first (CONTRACT line), then the presets, edits codec, metrics (eigenvector,
> DebtRank), the four-channel day-by-day simulator with shocks and interventions, rescue policies and the
> fragility sweep, all pure, with `scripts/systemic-engine.test.mjs`. Run the verification block, record preset
> facts and the sweep in Findings, append DONE to LOG.md, set plan 05 to `done`, and summarise.
