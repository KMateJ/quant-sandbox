import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { DEFAULT_MM_PARAMS, ROUND_STEPS } = await importSrc("features/market-making/marketMaking.types.ts");
const { roundSchedule, emptyRound, stepRound, playBot, fairAt } = await importSrc("features/market-making/round.math.ts");
const { roundSummary, runBotRounds } = await importSrc("features/market-making/rounds.math.ts");
const { theoryPnlPerMin } = await importSrc("features/market-making/theory.math.ts");
const { incomeRate, bestDelta, breakEvenDelta, informedLoss } = await importSrc("lib/market/informed.ts");
const { expectedSpreadIncome } = await importSrc("lib/market/quotes.ts");

const P = DEFAULT_MM_PARAMS;
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("schedule is deterministic and independent of how you quote", () => {
  assert.deepEqual(roundSchedule(P, 7), roundSchedule(P, 7));
  assert.notDeepEqual(roundSchedule(P, 7).fair, roundSchedule(P, 8).fair);
  const s = roundSchedule({ ...P, informed: 0.3 }, 3);
  const before = JSON.stringify(s);
  playBot(s, P, 1);
  playBot(s, P, 4);
  assert.equal(JSON.stringify(s), before);
  const a = playBot(s, P, 2);
  const b = playBot(s, P, 2);
  assert.deepEqual(a.fills, b.fills);
  assert.equal(a.events.length, b.events.length);
  assert.equal(playBot(s, P, 0.5).events.length, playBot(s, P, 5).events.length);
});

test("noise fill probability is e^{-kδ}", () => {
  const delta = 1.5;
  let n = 0;
  let filled = 0;
  for (let seed = 1; n < 20000; seed++) {
    const st = playBot(roundSchedule(P, seed), P, delta);
    n += st.events.length;
    filled += st.events.filter((e) => e.filled).length;
  }
  near(filled / n, Math.exp(-P.k * delta), 0.02, "fill share");
});

test("pulled quotes never fill", () => {
  const s = roundSchedule({ ...P, informed: 0.5 }, 2);
  let st = emptyRound();
  while (st.step < ROUND_STEPS) st = stepRound(st, { bid: 0, ask: 0, live: false }, s, P);
  assert.equal(st.fills.length, 0);
});

test("theory: π = 0 matches the plain spread income, best δ = 1/k and moves out with π", () => {
  for (const d of [0.5, 1, 2, 3.7]) near(incomeRate(d, P), expectedSpreadIncome(d, P.lambda / 2, P.k), 1e-12, `δ=${d}`);
  near(bestDelta(P), 1 / P.k, 1e-6, "best δ");
  assert.equal(breakEvenDelta(P), 0);
  const b1 = bestDelta({ ...P, informed: 0.1 });
  const b3 = bestDelta({ ...P, informed: 0.3 });
  assert.ok(b1 > 1 / P.k && b3 > b1, `${b1} ${b3}`);
  const be = breakEvenDelta({ ...P, informed: 0.2 });
  assert.ok(be > 0 && be < bestDelta({ ...P, informed: 0.2 }));
  near(incomeRate(be, { ...P, informed: 0.2 }), 0, 1e-6, "break-even");
  near(informedLoss(0, 1), 1 / Math.sqrt(2 * Math.PI), 1e-12, "E[X+]");
});

test("bot rounds agree with theory within 3 standard errors (δ = 1/k, π = 0.2)", () => {
  const p = { ...P, informed: 0.2 };
  const rounds = runBotRounds(p, 1 / p.k, 11, 400);
  const xs = rounds.map((r) => r.pnlPerMin);
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  near(m, theoryPnlPerMin(1 / p.k, p), (3 * sd) / Math.sqrt(xs.length), "mean P&L/min");
});

test("decompose adds up on a round", () => {
  const p = { ...P, informed: 0.3 };
  const s = roundSchedule(p, 5);
  const st = playBot(s, p, 1.5);
  const r = roundSummary(st, s, p);
  const { spread, adverse, inventory, fees, total } = r.parts;
  near(spread + adverse + inventory + fees, total, 1e-9, "identity");
  near(total, r.pnl, 1e-9, "total = pnl");
  near(spread, st.fills.length * 1.5, 1e-9, "spread = fills × δ ($ per 100 shares)");
  assert.ok(fairAt(s, 0) === 0);
});
