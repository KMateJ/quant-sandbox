import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/systemic-risk/engine/";
const P = await importSrc(`${E}presets.math.ts`);
const B = await importSrc(`${E}build.math.ts`);
const Ed = await importSrc(`${E}edits.math.ts`);
const M = await importSrc(`${E}metrics.math.ts`);
const S = await importSrc(`${E}simulate.math.ts`);
const L = await importSrc(`${E}policies.math.ts`);
const F = await importSrc(`${E}fragility.math.ts`);

const params = (channels) => ({ ...P.DEFAULT_PARAMS, channels: { direct: false, fireSales: false, funding: false, ccp: false, ...channels } });
const sum = (r, k) => r.days.reduce((s, d) => s + d.losses[k], 0);
const linked = (net, a, b) => net.exposures.some((e) => (e.lender === a && e.borrower === b) || (e.lender === b && e.borrower === a));
const largest = (net) => net.institutions.reduce((m, i) => (M.balance(i, net).assets > M.balance(m, net).assets ? i : m)).id;
const cp = P.presetNetwork("core-periphery", 1);

test("presets are deterministic, positive in equity, and satisfy the balance identity", () => {
  for (const id of P.PRESET_IDS) {
    const a = P.presetNetwork(id, 3);
    assert.deepEqual(a, P.presetNetwork(id, 3), id);
    for (const inst of a.institutions) {
      const m = M.balance(inst, a);
      assert.ok(m.equity > 0, `${id} ${inst.id} equity ${m.equity}`);
      assert.ok(Math.abs(m.assets - m.liabilities - m.equity) < 1e-9);
    }
  }
  assert.notDeepEqual(P.presetNetwork("core-periphery", 1), P.presetNetwork("core-periphery", 2));
  assert.equal(P.presetNetwork("starter", 1).institutions.length, 8);
  assert.equal(cp.institutions.length, 30);
});

test("core-periphery follows the spec: counts, leverage ranges, MMF cushion, dealers start ok", () => {
  const of = (k) => cp.institutions.filter((i) => i.kind === k);
  const counts = Object.fromEntries(["dealer", "bank", "regional", "mmf", "hedgeFund", "insurer", "ccp"].map((k) => [k, of(k).length]));
  assert.deepEqual(counts, { dealer: 4, bank: 12, regional: 6, mmf: 2, hedgeFund: 3, insurer: 2, ccp: 1 });
  const range = { dealer: [18, 25], bank: [10, 14], regional: [9, 12], hedgeFund: [5, 15], insurer: [8, 10] };
  for (const [k, [lo, hi]] of Object.entries(range))
    for (const i of of(k)) assert.ok(M.balance(i, cp).leverage >= lo - 0.2 && M.balance(i, cp).leverage <= hi + 0.2, `${i.id} ${M.balance(i, cp).leverage}`);
  for (const m of of("mmf")) assert.ok(Math.abs(M.balance(m, cp).assets / m.deposits - 1.01) < 0.01);
  for (const d of of("dealer")) assert.ok(M.balance(d, cp).capitalRatio >= P.DEFAULT_PARAMS.distressRatio);
  const quiet = S.simulate(cp, [], P.DEFAULT_PARAMS);
  assert.equal(quiet.defaults.length, 0);
  assert.equal(quiet.totalLoss, 0);
  assert.ok(quiet.days.every((d) => d.events.length === 0));
});

test("edits: encode/decode round-trips and malformed parts are ignored", () => {
  let edits = [];
  edits.push(Ed.addEdit(edits, "b1", "b2", "repo", 12.5));
  edits.push(Ed.addEdit(edits, "d1", "h1", "interbank", 7));
  edits.push({ op: "set", id: "x3", amount: 4.25 });
  edits.push({ op: "del", id: "n2" });
  const s = Ed.encodeEdits(edits);
  assert.equal(s, "a.b1.b2.r.12.5;a.d1.h1.i.7;s.x3.4.25;d.n2");
  assert.deepEqual(Ed.decodeEdits(s), edits);
  assert.deepEqual(Ed.decodeEdits(`junk;${s};a.b1;s.x3;a.b1.b2.z.5;d.;;a.b1.b2.i.-3`), edits);
  assert.deepEqual(Ed.decodeEdits(""), []);
});

test("applyEdits adds, changes and removes exposures without touching equity", () => {
  const net = P.presetNetwork("starter", 1);
  const eq = (n) => n.institutions.map((i) => M.balance(i, n).equity);
  const add = Ed.addEdit([], "b2", "r1", "interbank", 3);
  const a = Ed.applyEdits(net, [add]);
  assert.equal(a.exposures.length, net.exposures.length + 1);
  assert.equal(net.exposures.length, 11, "input untouched");
  const first = net.exposures[0];
  const b = Ed.applyEdits(net, [{ op: "set", id: first.id, amount: first.amount + 2 }, { op: "del", id: net.exposures[1].id }]);
  assert.equal(b.exposures.length, net.exposures.length - 1);
  assert.equal(b.exposures[0].amount, first.amount + 2);
  for (const n of [a, b]) eq(n).forEach((e, k) => assert.ok(Math.abs(e - eq(net)[k]) < 1e-9));
  const bad = Ed.applyEdits(net, [{ op: "set", id: "nope", amount: 1 }, { op: "del", id: "nope" }, Ed.addEdit([], "zz", "b1", "repo", 4)]);
  assert.deepEqual(bad, net);
  assert.deepEqual(Ed.applyEdits(net, Ed.decodeEdits(Ed.encodeEdits([add]))), a);
});

test("metrics: degrees, density, matrix, DebtRank and centrality behave", () => {
  const ring = P.presetNetwork("ring", 1);
  const full = P.presetNetwork("complete", 1);
  assert.ok(Math.abs(M.density(full) - 1) < 1e-12);
  assert.ok(Math.abs(M.density(ring) - 1 / 9) < 1e-12);
  assert.deepEqual(Object.values(M.degrees(ring)).map((d) => [d.out, d.in]), Array(10).fill([1, 1]));
  const { ids, matrix } = M.exposureMatrix(ring);
  assert.equal(matrix[ids.indexOf("b1")][ids.indexOf("b2")], 45);
  const cent = M.eigenvectorCentrality(ring);
  Object.values(cent).forEach((c) => assert.ok(Math.abs(c - 0.1) < 1e-9));
  const c = M.eigenvectorCentrality(cp);
  assert.ok(Math.abs(Object.values(c).reduce((s, v) => s + v, 0) - 1) < 1e-9);
  const iso = Ed.applyEdits(cp, cp.exposures.filter((e) => e.lender === "r6" || e.borrower === "r6").map((e) => ({ op: "del", id: e.id })));
  assert.equal(M.debtRank(iso, { r6: 1 }).rank, 0);
  assert.ok(M.debtRank(cp, { d3: 1 }).rank > 0);
  const rank = M.debtRank(cp, { d3: 1 });
  assert.equal(rank.h.d3, 1);
  assert.ok(Object.values(rank.h).every((h) => h >= 0 && h <= 1));
  assert.equal(M.debtRank(cp, {}).rank, 0);
});

test("DebtRank on a two-bank chain matches the hand calculation", () => {
  const net = B.buildNetwork(
    [
      { id: "a", kind: "bank", tag: "A", cash: 10, loans: 10, holdings: {}, leverage: 1.5 },
      { id: "b", kind: "bank", tag: "B", cash: 5, loans: 30, holdings: {}, leverage: 10 },
    ],
    [B.makeExposure("x1", "a", "b", "interbank", 10)],
  );
  const eqA = M.balance(net.institutions[0], net).equity;
  const w = Math.min(1, (0.6 * 10) / eqA);
  const assets = net.institutions.map((i) => M.balance(i, net).assets);
  const r = M.debtRank(net, { b: 1 });
  assert.ok(Math.abs(r.h.a - w) < 1e-12);
  assert.ok(Math.abs(r.rank - (w * assets[0]) / (assets[0] + assets[1])) < 1e-12);
});

test("the most systemic core-periphery node is a mid-size dealer, not the largest by assets", () => {
  for (let seed = 1; seed <= 12; seed++) {
    const net = P.presetNetwork("core-periphery", seed);
    const top = M.systemicRanking(net)[0].id;
    assert.notEqual(top, largest(net), `seed ${seed}`);
    assert.equal(top, "d3", `seed ${seed}`);
  }
  const rk = M.systemicRanking(cp);
  assert.ok(rk.every((r, k) => k === 0 || rk[k - 1].debtRank >= r.debtRank));
});

test("direct channel only: a default cascades further around a ring than in a complete network", () => {
  const out = {};
  for (const id of ["ring", "complete"]) {
    const net = P.presetNetwork(id, 1);
    const total = net.exposures.reduce((s, e) => s + e.amount, 0);
    out[id] = { total, r: S.simulate(net, [{ kind: "default", id: "b1" }], params({ direct: true })) };
  }
  assert.equal(out.ring.total, out.complete.total);
  assert.ok(out.ring.r.defaults.length > out.complete.r.defaults.length);
  assert.equal(out.ring.r.defaults.length, 10);
  assert.deepEqual(out.complete.r.defaults, ["b1"]);
  assert.ok(out.ring.r.totalLoss > out.complete.r.totalLoss);
  const order = out.ring.r.days.flatMap((d) => d.events.filter((e) => e.kind === "default").map((e) => [e.id, d.day]));
  assert.deepEqual(order.slice(0, 3), [["b1", 0], ["b10", 1], ["b9", 2]], "one hop per day");
});

test("fire sales reach institutions with no exposure to the failed one", () => {
  const shock = [{ kind: "default", id: "d3" }];
  const on = S.simulate(cp, shock, P.DEFAULT_PARAMS);
  const off = S.simulate(cp, shock, { ...P.DEFAULT_PARAMS, channels: { ...P.DEFAULT_PARAMS.channels, fireSales: false } });
  const victims = cp.institutions.filter((i) => i.id !== "d3" && !linked(cp, i.id, "d3"));
  const hit = victims.filter((v) => on.days.some((d) => d.lossesById[v.id].fireSale > 0));
  assert.ok(hit.length > 0);
  for (const v of victims) assert.equal(off.days.every((d) => d.lossesById[v.id].fireSale === 0), true);
  assert.ok(sum(on, "fireSale") > 0 && sum(off, "fireSale") === 0);
  assert.ok(on.peakPriceDrop.mbs > 0 && off.peakPriceDrop.mbs === 0);
});

test("CCP channel: the CCP absorbs derivative losses first, then members' margin", () => {
  const shock = [{ kind: "default", id: "d1" }];
  const withCcp = S.simulate(cp, shock, params({ direct: true, ccp: true }));
  const without = S.simulate(cp, shock, params({ direct: true }));
  assert.ok(sum(withCcp, "ccp") > 0 && sum(without, "ccp") === 0);
  const day1 = withCcp.days[1];
  assert.ok(day1.lossesById.c1.ccp > 0);
  const insurerHit = (r) => ["i1", "i2"].some((id) => r.days[1].lossesById[id].direct > 0);
  assert.equal(insurerHit(withCcp), false, "derivative claims are made whole by the CCP");
  assert.equal(insurerHit(without), true);
});

test("funding runs: an unmet outflow fails the institution, a liquidity facility prevents it", () => {
  const net = B.buildNetwork([{ id: "q", kind: "dealer", tag: "A", cash: 5, loans: 80, holdings: { gov: 10 }, leverage: 10 }], []);
  const run = [{ kind: "run", target: "q", source: "shortFunding", fraction: 0.6 }];
  const p = params({ funding: true });
  assert.deepEqual(S.simulate(net, run, p).defaults, ["q"]);
  assert.deepEqual(S.simulate(net, run, p, [{ kind: "liquidity", day: 0 }]).defaults, []);
  assert.deepEqual(S.simulate(net, run, p, [{ kind: "liquidity", day: 1 }]).defaults, ["q"], "too late for the day-0 run");
  assert.deepEqual(S.simulate(net, run, params({})).defaults, [], "channel off ⇒ no run");
});

test("deposit runs and a guarantee", () => {
  const net = B.buildNetwork([{ id: "r", kind: "regional", tag: "A", cash: 2, loans: 40, holdings: { gov: 4 }, leverage: 10 }], []);
  const run = [{ kind: "run", target: "regional", source: "deposits", fraction: 0.5 }];
  const p = params({ funding: true });
  assert.deepEqual(S.simulate(net, run, p).defaults, ["r"]);
  assert.deepEqual(S.simulate(net, run, p, [{ kind: "guarantee", day: 0 }]).defaults, []);
});

test("par lending: bonds are pledged instead of sold, so a run causes no fire-sale losses", () => {
  const net = B.buildNetwork(
    [{ id: "q", kind: "dealer", tag: "A", cash: 5, loans: 50, holdings: { gov: 40 }, leverage: 10 }],
    [],
  );
  net.assets.find((a) => a.id === "gov").depth = 20;
  const run = [{ kind: "run", target: "q", source: "shortFunding", fraction: 0.5 }];
  const p = params({ funding: true, fireSales: true });
  const plain = S.simulate(net, run, p);
  const par = S.simulate(net, run, p, [{ kind: "parLending", day: 0 }]);
  assert.ok(sum(plain, "funding") > 0 && plain.peakPriceDrop.gov > 0);
  assert.equal(sum(par, "funding"), 0);
  assert.equal(par.peakPriceDrop.gov, 0);
  assert.ok(par.totalLoss < plain.totalLoss);
});

test("asset shocks: instant, gradual, and purchases that support the price", () => {
  const instant = S.simulate(cp, [{ kind: "asset", asset: "equity", drop: 0.1, shape: "instant", day: 2 }], params({}));
  assert.equal(instant.days[1].prices.equity, 1);
  assert.ok(Math.abs(instant.days[2].prices.equity - 0.9) < 1e-12);
  const gradual = S.simulate(cp, [{ kind: "asset", asset: "equity", drop: 0.1, shape: "gradual", days: 5 }], params({}));
  assert.ok(gradual.days[0].prices.equity > 0.97 && gradual.days[0].prices.equity < 1);
  assert.ok(Math.abs(gradual.days[4].prices.equity - 0.9) < 1e-12);
  assert.ok(Math.abs(gradual.days[9].prices.equity - 0.9) < 1e-12);
  const shock = [{ kind: "asset", asset: "mbs", drop: 0.3, shape: "instant" }];
  const base = S.simulate(cp, shock, P.DEFAULT_PARAMS);
  const bought = S.simulate(cp, shock, P.DEFAULT_PARAMS, [{ kind: "assetPurchases", asset: "mbs", amount: 60, day: 0 }]);
  assert.ok(bought.days[0].prices.mbs > base.days[0].prices.mbs);
  const floored = S.simulate(cp, [{ kind: "asset", asset: "mbs", drop: 0.9, shape: "instant" }], { ...P.DEFAULT_PARAMS, priceFloor: 0.5 });
  assert.ok(floored.days.every((d) => d.prices.mbs >= 0.5));
});

test("capital on the right node stops the cascade", () => {
  const ring = P.presetNetwork("ring", 1);
  const shock = [{ kind: "default", id: "b1" }];
  const p = params({ direct: true });
  const none = S.simulate(ring, shock, p);
  const right = S.simulate(ring, shock, p, [{ kind: "capital", id: "b10", amount: 10, day: 0 }]);
  const wrong = S.simulate(ring, shock, p, [{ kind: "capital", id: "b5", amount: 10, day: 0 }]);
  assert.deepEqual(right.defaults, ["b1"]);
  assert.ok(none.defaults.length > wrong.defaults.length && wrong.defaults.length > right.defaults.length);
});

test("rescue policies: plans respect budget and chunk, comparisons cover every policy", () => {
  assert.deepEqual(L.rescuePlan("none", cp, 100, 10), []);
  const plan = L.rescuePlan("debtRank", cp, 35, 10);
  assert.equal(plan.length, 3);
  assert.deepEqual(plan.map((i) => i.id), M.systemicRanking(cp).slice(0, 3).map((r) => r.id));
  assert.ok(plan.every((i) => i.kind === "capital" && i.day === 0 && i.amount === 10));
  assert.equal(L.rescuePlan("largest", cp, 10, 10)[0].id, largest(cp));
  const weak = L.rescueOrder("weakest", cp);
  assert.ok(!weak.includes("m1") && !weak.includes("c1"));
  assert.equal(M.balance(cp.institutions.find((i) => i.id === weak[0]), cp).capitalRatio, Math.min(...weak.map((id) => M.balance(cp.institutions.find((i) => i.id === id), cp).capitalRatio)));
  const shocks = [{ kind: "asset", asset: "mbs", drop: 0.4, shape: "instant" }];
  const rows = L.compareRescues(cp, shocks, P.DEFAULT_PARAMS, 30, 10, [{ kind: "capital", id: "r4", amount: 10, day: 0 }]);
  assert.deepEqual(rows.map((r) => r.policy), ["none", "largest", "debtRank", "weakest", "yours"]);
  const none = rows[0];
  assert.equal(none.defaults, S.simulate(cp, shocks, P.DEFAULT_PARAMS).defaults.length);
  assert.ok(rows.slice(1, 4).every((r) => r.defaults <= none.defaults));
});

test("simulate is deterministic and reports consistent day states", () => {
  const shocks = [{ kind: "asset", asset: "mbs", drop: 0.35, shape: "instant" }];
  const a = S.simulate(cp, shocks, P.DEFAULT_PARAMS);
  assert.deepEqual(a, S.simulate(cp, shocks, P.DEFAULT_PARAMS));
  assert.equal(a.days.length, P.DEFAULT_PARAMS.days + 1);
  assert.ok(a.days.every((d, k) => d.day === k));
  const total = a.days.reduce((s, d) => s + d.losses.direct + d.losses.fireSale + d.losses.funding + d.losses.ccp, 0);
  assert.ok(Math.abs(total - a.totalLoss) < 1e-9);
  for (const d of a.days) {
    const byId = Object.values(d.lossesById).reduce((s, l) => s + l.direct + l.fireSale + l.funding + l.ccp, 0);
    assert.ok(Math.abs(byId - (d.losses.direct + d.losses.fireSale + d.losses.funding + d.losses.ccp)) < 1e-9);
  }
  a.defaults.forEach((id) => assert.equal(a.days.at(-1).status[id], "failed"));
  assert.ok(a.days.at(-1).events.some((e) => e.kind === "calm") || a.days.some((d) => d.events.some((e) => e.kind === "calm")));
  assert.equal(cp.exposures[0].amount, P.presetNetwork("core-periphery", 1).exposures[0].amount, "input untouched");
});

test("fragility sweep shows the robust-yet-fragile shape", () => {
  const sweep = F.fragilitySweep({ seed: 7, trials: 60 });
  assert.equal(sweep.length, 9);
  const p = sweep.map((s) => s.pContagion);
  const peak = p.indexOf(Math.max(...p));
  assert.ok(peak > 0 && peak < p.length - 1, `peak at ${sweep[peak].degree}`);
  assert.ok(p[peak] > 0.5);
  assert.ok(p[0] < p[peak] - 0.3 && p.at(-1) < p[peak] - 0.3);
  assert.deepEqual(F.sweepChunk({ seed: 7, trials: 60 }, 3), sweep[3]);
  assert.ok(sweep.every((s) => s.pContagion >= 0 && s.pContagion <= 1 && s.meanExtent >= 0 && s.meanExtent <= 1));
});

test("simulate on core-periphery for 60 days takes under 50 ms", () => {
  const shocks = [{ kind: "asset", asset: "mbs", drop: 0.35, shape: "instant" }];
  const times = Array.from({ length: 9 }, () => {
    const t0 = performance.now();
    S.simulate(cp, shocks, P.DEFAULT_PARAMS);
    return performance.now() - t0;
  });
  assert.ok(Math.min(...times) < 50, `best ${Math.min(...times)} ms`);
});

test("engine files stay pure: no UI, i18n, DOM, clock or Math.random", () => {
  const dir = new URL(`../src/${E}`, import.meta.url);
  for (const f of readdirSync(dir)) {
    const src = readFileSync(new URL(f, dir), "utf8");
    assert.doesNotMatch(src, /from "react|from "i18next|document\.|window\.|Math\.random|Date\.now/, f);
  }
});

test("background market: seeded, opt-in, and keeps the run moving after the first wave", async () => {
  const K = await importSrc(`${E}market.math.ts`);
  const net = P.presetNetwork("core-periphery", 3);
  const shocks = [{ kind: "default", id: M.systemicRanking(net)[0].id }];
  const params = { ...P.DEFAULT_PARAMS, market: { ...K.DEFAULT_MARKET, seed: 3 } };
  const a = S.simulate(net, shocks, params);
  assert.deepEqual(S.simulate(net, shocks, params), a);
  assert.ok(!S.simulate(net, shocks, P.DEFAULT_PARAMS).days.some((d) => d.events.some((e) => e.kind === "aftershock")));
  const late = a.days.slice(10).flatMap((d) => d.events).filter((e) => e.kind === "aftershock");
  assert.ok(late.length >= 5, `aftershocks after day 10: ${late.length}`);
  assert.ok(late.every((e) => ["jolt", "rumour", "writedown"].includes(e.cause)));
});
