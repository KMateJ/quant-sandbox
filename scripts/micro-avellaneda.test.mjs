import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { DEFAULT_AS_PARAMS: P } = await importSrc("features/avellaneda-stoikov/avellanedaStoikov.types.ts");
const sim = await importSrc("features/avellaneda-stoikov/asSim.math.ts");
const { asReservation } = await importSrc("lib/market/quotes.ts");

const AS = { kind: "as", gamma: 0.1 };
const SYM = { kind: "symmetric", gamma: 0.1 };
const QS = Array.from({ length: 21 }, (_, i) => i - 10);

test("days are deterministic and every policy sees the same prices", () => {
  assert.deepEqual(sim.simulateDay(AS, P, 9), sim.simulateDay(AS, P, 9));
  const a = sim.simulateDay(AS, P, 4, true).path.map((x) => x.s);
  const b = sim.simulateDay(SYM, P, 4, true).path.map((x) => x.s);
  assert.deepEqual(a, b);
});

test("reservation price leans against inventory", () => {
  assert.ok(asReservation(100, 5, 0.1, 2, 0.5) < 100);
  assert.ok(asReservation(100, -5, 0.1, 2, 0.5) > 100);
  assert.equal(asReservation(100, 6, 0.1, 2, 0.5), 100 - 6 * 0.1 * 4 * 0.5);
  const { bid, ask } = sim.quotesFor(AS, 100, 6, 0.5, P);
  assert.ok(Math.abs((bid + ask) / 2 - 98.8) < 1e-12);
});

test("a drawn curve equal to AS's offsets at the open gives AS's centre at every time", () => {
  const drawn = { kind: "drawn", qs: QS, offsets: QS.map((q) => sim.asOffset(q, 0, 0.1, P)), halfSpread: 0.7 };
  for (const t of [0, 0.3, 0.75, 0.99]) {
    for (const q of [-7, -1, 0, 3, 10]) {
      const d = sim.quotesFor(drawn, 100, q, t, P);
      const a = sim.quotesFor(AS, 100, q, t, P);
      assert.ok(Math.abs((d.bid + d.ask) / 2 - (a.bid + a.ask) / 2) < 1e-12, `t=${t} q=${q}`);
    }
  }
});

test("500 days land near the paper's Table 1 (γ = 0.1)", () => {
  const start = performance.now();
  const [as, sym] = sim.runTournament([AS, SYM], P, 1, 500);
  const ms = performance.now() - start;
  console.log(`AS mean ${as.mean.toFixed(2)} sd ${as.sd.toFixed(2)} qSd ${as.qSd.toFixed(2)} | sym mean ${sym.mean.toFixed(2)} sd ${sym.sd.toFixed(2)} qSd ${sym.qSd.toFixed(2)} | ${ms.toFixed(0)} ms for 2 policies`);
  const within = (x, ref) => Math.abs(x - ref) <= 0.2 * ref;
  assert.ok(within(as.mean, 63) && within(as.sd, 6), "AS");
  assert.ok(within(sym.mean, 67) && within(sym.sd, 13), "symmetric");
  assert.ok(as.ce <= as.mean && sym.ce <= sym.mean);
  assert.ok(as.ce > sym.ce, "AS has the higher certainty equivalent");
  assert.ok(ms < 1500 * 2);
});

test("frontier sd falls as γ rises", () => {
  const f = sim.frontier(P, 3, [0.01, 0.1, 1], 150);
  assert.ok(f[0].sd > f[1].sd && f[1].sd > f[2].sd, JSON.stringify(f));
});

test("certainty equivalent does not overflow", () => {
  const ce = sim.certaintyEquivalent([5000, 5001, 4999], 1);
  assert.ok(Number.isFinite(ce) && ce <= 5000);
});
