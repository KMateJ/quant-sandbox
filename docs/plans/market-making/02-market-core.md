# 02 — Market core: order book, flow, maker ledger, quoting

Status: done (2026-10-28, opus-02) · Depends on: – · Suggested model: Sonnet · Est. size: L

## Why
The order book lab, the market making lab, the Avellaneda–Stoikov lab and the desk all need the same
machinery: a limit order book with price–time priority, a crowd that places, cancels and takes liquidity
(some of it informed), an exact way to split a market maker's P&L into what the spread paid and what
information and inventory cost, and the standard quoting formulas. One pure, tested core keeps them
consistent (DRY) and lets four plans run in parallel.

## Current state (verified 2026-10-28, commit `a4b1706`)
- No order book or microstructure code anywhere in `src` (grep for `order book|orderBook|bid|ask` in
  `src/lib` finds nothing relevant).
- `src/lib/` holds `finance/`, `math/`, `stats/`, `game/`, `index.ts`, `palettes.ts`, `urlState.ts`,
  `urlSchemas.ts`. `src/lib/math/random.ts` exports `Rng = () => number`, `makeRng(seed)`, `nextNormal(rng)`,
  `normals(n, rng)`, `nextGaussian(mean, sd, rng)` — **no Poisson or exponential draw**.
- `src/lib/game/seed.ts`: `subSeed(seed, salt)` for independent streams.
- Test loader: `scripts/lib/load-ts.mjs` (`importSrc("lib/market/book.ts")`; relative imports only, `.ts`
  appended automatically, no folder `index` imports). See `scripts/game-kit*.test.mjs` for usage.
- Plan 01 defines `npm run test:microstructure` = `node --test scripts/micro-*.test.mjs`. If plan 01 is not
  done yet, run `node --test scripts/micro-core.test.mjs` directly.

## Goal
1. `src/lib/market/` with `market.types.ts`, `book.ts`, `flow.ts`, `maker.ts`, `quotes.ts` (pure, `///` docs).
2. Additive `nextPoisson`, `nextExponential` in `src/lib/math/random.ts`.
3. `scripts/micro-core.test.mjs` covering matching, flow determinism, ledger identity and formulas.

## Non-goals
- No React, no copy, no styles. No lab-specific models (Glosten–Milgrom, Kyle, Roll live in their labs).
- No AS Monte Carlo runner (plan 06 owns it), no desk reducer (plan 10).

## Constraints
- Prices inside the core are **integer ticks**; only formatting converts (`ticks * spec.tick`). Fair value is
  a float in ticks. Immutable updates: copy only the levels you touch; never mutate inputs.
- Randomness is **pre-drawn per tick from the seed** so the crowd's draws never depend on what the player
  does (see Pitfalls). No `Math.random`.

## Steps
1. `random.ts` (append): `nextExponential(rng, rate): number` (−ln(1−u)/rate) and `nextPoisson(rng, mean):
   number` (Knuth for mean < 30, else rounded normal approximation, never negative).
2. `market.types.ts`:
   ```ts
   export type Side = "buy" | "sell";               // a resting buy is a bid
   export type Owner = "you" | "crowd";
   export type RestingOrder = { id: number; side: Side; price: number; size: number; owner: Owner; t: number };
   export type Level = { price: number; orders: RestingOrder[] };          // FIFO: index 0 fills first
   export type Book = { bids: Level[]; asks: Level[]; nextId: number };     // bids price-desc, asks price-asc
   export type Fill = { makerId: number; makerOwner: Owner; taker: Owner | "noise" | "informed";
     side: Side /* aggressor side */; price: number; size: number; t: number };
   export type FlowSpec = { tick: number; levels: number; depthPerLevel: number; limitRate: number;
     cancelRate: number; marketRate: number; informedShare: number; buyShare: number; meanMarketSize: number;
     sigmaTicks: number; horizon: number; jump?: { t: number; sizeTicks: number } };
   export type TickDraws = { limits: { buy: boolean; dist: number; size: number }[]; cancels: number[];
     markets: { informedU: number; buy: boolean; size: number }[] };
   export type FlowEvent = { t: number; kind: "limit" | "cancel" | "market" | "skip"; side?: Side; price?: number; size?: number; taker?: Fill["taker"] };
   ```
3. `book.ts` (all pure):
   - `emptyBook(): Book`; `bestBid(b)`, `bestAsk(b)` → `number | null`; `midTicks(b)` (null if a side is
     empty; may be x.5); `spreadTicks(b)`.
   - `addLimit(b, o: { side; price; size; owner; t }, taker?: Fill["taker"]): { book: Book; id: number; fills: Fill[] }`
     — a marketable limit first executes against the opposite side up to its price (price–time), the rest
     rests at the **back** of its level (new level inserted in sorted position).
   - `marketOrder(b, side, size, t, taker): { book; fills; filled; avgPrice: number | null; unfilled }`.
   - `previewMarket(b, side, size): { rows: { price: number; take: number; cum: number }[]; avgPrice; filled; unfilled }`
     (same walk, no new book; used for hover previews).
   - `cancel(b, id): Book`; `cancelOwner(b, owner): Book`; `ordersOf(b, owner): RestingOrder[]`.
   - `queueAhead(b, id): number | null` (shares ahead of order `id` at its level).
   - `depth(b, side, n): { price: number; size: number; cum: number }[]` (best n levels, cumulative).
4. `flow.ts`:
   - `export const DEFAULT_FLOW: FlowSpec = { tick: 0.01, levels: 10, depthPerLevel: 450, limitRate: 6,
     cancelRate: 0.02, marketRate: 1.2, informedShare: 0, buyShare: 0.5, meanMarketSize: 300, sigmaTicks: 0.35,
     horizon: 5 }` — labs spread it and override a few fields; tune values only if the tests below show an
     unstable book (record the change as a `CONTRACT` line in LOG.md).
   - `fairPath(spec, seconds, seed): number[]` — length `seconds + spec.horizon + 1`; random walk in ticks with
     sd `sigmaTicks` per second from `makeRng(subSeed(seed, 1))`; if `jump`, add `±sizeTicks` at `jump.t`
     (sign from `subSeed(seed, 3)`).
   - `flowSchedule(spec, seconds, seed): TickDraws[]` from `makeRng(subSeed(seed, 2))`: per second,
     `nextPoisson(limitRate)` limits (`buy` 50/50, `dist` geometric with mean 2 ticks, size ≈
     `depthPerLevel / 3` ± 50% integer ≥ 1), `nextPoisson(cancelRate × levels × 2 × 3)` cancel uniforms,
     `nextPoisson(marketRate)` markets (`buy` with prob `buyShare`, `size` exponential mean `meanMarketSize`,
     rounded to ≥ 1 and to lots of 10).
   - `seedBook(spec, fair0, seed): Book` — `levels` price levels each side, 2–4 crowd orders per level summing
     to ≈ `depthPerLevel`; best bid `floor(fair0)`, best ask `floor(fair0) + 1` (1-tick spread).
   - `applyTick(b, draws, fair: number[], t, spec): { book: Book; fills: Fill[]; events: FlowEvent[] }` in this
     order: cancels (each uniform picks the ⌊u × crowdCount⌋-th crowd order; `you` orders are never cancelled
     by the crowd), limits (bid at `floor(fair[t]) − dist`, ask at `ceil(fair[t]) + dist`; a crowd limit never
     crosses the book), markets: informed if `informedU < informedShare` → buys when `fair[t + horizon] >
     bestAsk + 0.5`, sells when `< bestBid − 0.5`, else event `skip`; noise uses `buy`. Then, if a side has
     fewer than 3 levels, add one crowd order at the next price outward (keeps the book from emptying).
5. `maker.ts` (money in currency units):
   ```ts
   export type MakerFill = { t: number; side: Side /* the maker's side: buy = maker bought */; price: number; size: number; mid: number; fee: number };
   export type Ledger = { cash: number; inventory: number; fees: number; fills: MakerFill[] };
   export type PnlParts = { spread: number; adverse: number; inventory: number; fees: number; total: number };
   ```
   `emptyLedger()`, `applyFill(l, f)` (cash −/+ price·size; inventory ±size; fees += fee; fee sign: + rebate,
   − fee), `pnlTotal(l, mid)` = `cash + inventory·mid + fees`, and
   `decompose(l, midAt: (t: number) => number, endT, markout): PnlParts` with sgn = +1 for maker buys:
   `spread = Σ sgn·(f.mid − f.price)·size`; `adverse = Σ sgn·(midAt(min(t + markout, endT)) − f.mid)·size`;
   `fees = l.fees`; `total = pnlTotal(l, midAt(endT))`; `inventory = total − spread − adverse − fees`
   (residual: the P&L from holding inventory beyond the markout window). Trades where the maker crosses the
   spread (hedges) are ordinary `MakerFill`s with a negative spread term.
6. `quotes.ts`: `fillIntensity(delta, A, k) = A·e^{−kδ}`; `expectedSpreadIncome(delta, A, k) = 2δ·A·e^{−kδ}`
   (both sides, unit size, per unit time); `incomeMaximisingDelta(k) = 1/k`;
   `asReservation(s, q, gamma, sigma, tLeft) = s − q·γσ²·tLeft`;
   `asTotalSpread(gamma, sigma, k, tLeft) = γσ²·tLeft + (2/γ)·ln(1 + γ/k)`;
   `asQuotes({ s, q, gamma, sigma, k, tLeft }): { reservation; halfSpread; bid; ask }`.
7. Tests `scripts/micro-core.test.mjs`:
   - matching: limit rests at back of level; market buy of 1,600 against asks 318/311/518/453/… fills
     318+311+518+453, average `(100.01·318 + 100.02·311 + 100.03·518 + 100.04·453)/1600 = 100.02678…` with
     tick 0.01 (convert in the test), `unfilled` when the book is too thin; marketable limit stops at its
     price; price–time priority across two orders at one level; `queueAhead`; inputs not mutated
     (`structuredClone` before/after deep-equal).
   - flow: same seed ⇒ identical `TickDraws` and `fairPath`; changing the book (adding a `you` order) does not
     change `flowSchedule`; crowd never cancels `you` orders; informed orders trade in the direction of
     `fair[t + horizon]`; the book never has < 3 levels a side after `applyTick`; 900 ticks of
     `applyTick` with default spec run < 500 ms.
   - ledger: worked example — maker buys 100 at 99.99 with mid 100.00, mid 99.95 after the markout and at the
     end ⇒ spread +1.00, adverse −5.00, inventory 0, total −4.00; identity `spread + adverse + inventory + fees
     = total` on 200 random fills.
   - quotes: `asTotalSpread(0.1, 2, 1.5, 1) ≈ 1.6908` (±1e-4); reservation moves down with positive q; income
     maximised at `1/k` (numeric check on a grid).

## Acceptance criteria
- `node --test scripts/micro-core.test.mjs` passes; core files import nothing from React, `src/features`,
  i18n or the DOM.
- Break it on purpose: make `addLimit` insert at the front of the level; the priority test fails.

## Verification
```bash
npx tsc -b && npm run lint && node --test scripts/micro-core.test.mjs
grep -rnE "react|i18n|document|window|Math\.random|Date\.now" src/lib/market && echo LEAK || echo pure
```

## Pitfalls
- **Action-independent randomness:** if the crowd drew from a live RNG, one extra click by the player would
  shift every later draw and the "same seed" comparisons (you vs policy) would be meaningless. Pre-draw per
  tick (`flowSchedule`) and only *apply* draws to whatever book exists.
- **Float prices:** 100.01 + 0.01 ≠ 100.02 in floats. Keep ticks as integers in the book; convert at the edges.
- **Mid can be x.5 ticks:** keep `midTicks` a float; never use it as a level key.
- **Inventory term is a residual by design:** don't "fix" it to a formula; the identity test protects it.
- Keep each function small; `book.ts` may be long, but split helpers (`walk`, `insertResting`) for clarity.

## Findings (fill in during execution)
- Performance (ms for 900 ticks): ~30 ms (default spec, with the 3-levels/no-cross asserts per tick).
- Default `FlowSpec` chosen for labs to share (record the literal): unchanged from the plan — `{ tick: 0.01, levels: 10, depthPerLevel: 450, limitRate: 6, cancelRate: 0.02, marketRate: 1.2, informedShare: 0, buyShare: 0.5, meanMarketSize: 300, sigmaTicks: 0.35, horizon: 5 }`.
- Deviations: (1) `fairPath` takes an optional 4th arg `fair0` (default exported `FAIR0 = 10000`, i.e. 100.00). (2) Exported `Taker` type alias (= `Fill["taker"]`). (3) A crowd market order that finds no liquidity is executed partially; the `market` event's `size` is the filled amount. (4) Informed takers that do not trade emit `skip` with `taker: "informed"`. (5) `seedBook` uses `subSeed(seed, 4)`. (6) Market sizes are ≥ 10 (lots of 10). (7) Refill seeds an empty side at `floor(fair)` / `ceil(fair)` clamped to not cross. Imports inside `src/lib/market` are extensionless (the loader appends `.ts`).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/02-market-core.md`. Implement plan 02: the pure
> market core in `src/lib/market/` (types, integer-tick order book with price–time priority, pre-drawn order
> flow with noise and informed traders, maker ledger with the exact P&L decomposition, quoting formulas),
> `nextPoisson`/`nextExponential` in `src/lib/math/random.ts`, and `scripts/micro-core.test.mjs`. Run the
> verification block, record the default FlowSpec in Findings and as a `CONTRACT` line in LOG.md, append
> DONE, set plan 02 to `done` in the README table, and summarise.
