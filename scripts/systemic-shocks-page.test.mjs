import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/systemic-risk/";
const Sh = await importSrc(`${D}shocks/shocks.math.ts`);
const R = await importSrc(`${D}shocks/rescue.math.ts`);
const Pr = await importSrc(`${D}shocks/fragility.protocol.ts`);
const Sa = await importSrc(`${D}shocks/fragilitySample.math.ts`);
const P = await importSrc(`${D}engine/presets.math.ts`);
const S = await importSrc(`${D}engine/simulate.math.ts`);
const F = await importSrc(`${D}engine/fragility.math.ts`);
const cp = P.presetNetwork("core-periphery", 1);

test("channel bitmask round-trips and 5 means direct + funding", () => {
  for (let m = 0; m <= 15; m++) assert.equal(Sh.encodeChannels(Sh.decodeChannels(m)), m);
  assert.deepEqual(Sh.decodeChannels(5), { direct: true, fireSales: false, funding: true, ccp: false });
  assert.equal(Sh.encodeChannels(P.DEFAULT_PARAMS.channels), Sh.ALL_CHANNELS);
});

test("drop list is validated: four numbers in range, otherwise zeros", () => {
  assert.deepEqual(Sh.parseDrops("0,0,20,0"), [0, 0, 20, 0]);
  for (const bad of [null, "", "1,2,3", "1,2,3,4,5", "a,b,c,d", "0,0,51,0", "-1,0,0,0", "0,,0,0"]) assert.deepEqual(Sh.parseDrops(bad), [0, 0, 0, 0], String(bad));
  assert.equal(Sh.formatDrops([0, 5, 20, 0]), "0,5,20,0");
});

test("shocks come from the failed institution and the asset bars", () => {
  assert.deepEqual(Sh.buildShocks(null, [0, 0, 0, 0], "instant"), []);
  const shocks = Sh.buildShocks("d3", [0, 0, 20, 10], "gradual");
  assert.deepEqual(shocks[0], { kind: "default", id: "d3" });
  assert.deepEqual(shocks.slice(1).map((s) => [s.asset, s.drop, s.shape, s.days]), [["mbs", 0.2, "gradual", 10], ["equity", 0.1, "gradual", 10]]);
  assert.equal(Sh.failedId("none", cp), null);
  assert.equal(Sh.failedId("b2", cp), "b2");
  assert.equal(Sh.failedId("", cp), "d3");
  assert.equal(Sh.failedId("nope", cp), "d3");
});

test("channel switches change the result and the shares add up", () => {
  const shocks = Sh.buildShocks("d3", [0, 0, 0, 0], "instant");
  const run = (mask) => S.simulate(cp, shocks, { ...P.DEFAULT_PARAMS, channels: Sh.decodeChannels(mask) });
  const all = run(15);
  const noSales = run(15 & ~2);
  assert.notEqual(all.totalLoss, noSales.totalLoss);
  const shares = Sh.channelShares(all);
  assert.ok(Math.abs(shares.direct + shares.fireSale + shares.funding + shares.ccp - 100) < 1e-9);
  assert.equal(Sh.channelShares(noSales).fireSale, 0);
  const rows = Sh.chartRows(all, cp.institutions.length);
  assert.equal(rows.defaults.length, P.DEFAULT_PARAMS.days + 1);
  assert.ok(rows.defaults.at(-1).pct > 0 && rows.defaults.every((r, i) => i === 0 || r.pct >= rows.defaults[i - 1].pct));
});

test("event markers are derived from events, in day order", () => {
  const result = S.simulate(cp, Sh.buildShocks("d3", [0, 0, 0, 0], "instant"), P.DEFAULT_PARAMS);
  const markers = Sh.eventMarkers(result.days);
  const firstDefault = result.days.flatMap((d) => d.events).find((e) => e.kind === "default");
  assert.equal(markers.find((m) => m.kind === "default").day, firstDefault.day);
  assert.ok(markers.some((m) => m.kind === "fireSale"));
  assert.deepEqual(markers.map((m) => m.day), [...markers.map((m) => m.day)].sort((a, b) => a - b));
  assert.deepEqual(Sh.eventMarkers(S.simulate(cp, [], P.DEFAULT_PARAMS).days).filter((m) => m.kind !== "peak"), []);
});

test("rescue budget never exceeds four chunks and removal takes the latest", () => {
  let placed = [];
  for (const id of ["d1", "d1", "d2", "b1", "d3", "c1"]) placed = R.addChunk(placed, id);
  assert.equal(placed.length, R.RESCUE_CHUNKS);
  assert.deepEqual(placed, ["d1", "d1", "d2", "b1"]);
  assert.deepEqual(R.removeChunk(placed, "d1"), ["d1", "d2", "b1"]);
  assert.equal(R.removeChunk(placed, "zz"), placed);
  const iv = R.chunksToInterventions(placed);
  assert.equal(iv.reduce((s, i) => s + i.amount, 0), R.RESCUE_BUDGET);
  assert.deepEqual(iv.find((i) => i.id === "d1"), { kind: "capital", id: "d1", amount: 20, day: 0 });
});

test("rescue scenario is identical for every policy and DebtRank is never worse than largest-first", () => {
  let better = 0;
  for (let seed = 1; seed <= 8; seed++) {
    const net = P.presetNetwork("core-periphery", seed);
    const rows = R.rescueRows(net, P.DEFAULT_PARAMS, []);
    const by = Object.fromEntries(rows.map((r) => [r.policy, r]));
    assert.deepEqual(rows.map((r) => r.policy), ["none", "largest", "debtRank", "weakest", "yours"]);
    assert.equal(by.yours.defaults, by.none.defaults, "an empty plan equals no rescue");
    assert.ok(by.debtRank.defaults <= by.largest.defaults, `seed ${seed}`);
    if (by.debtRank.defaults < by.largest.defaults) better++;
  }
  assert.ok(better >= 1);
});

test("a hit is at most the DebtRank defaults, ties count", () => {
  const rows = (mine, ref) => [{ policy: "debtRank", defaults: ref }, { policy: "yours", defaults: mine }];
  assert.equal(R.rescueHit(rows(3, 3)), true);
  assert.equal(R.rescueHit(rows(2, 3)), true);
  assert.equal(R.rescueHit(rows(4, 3)), false);
  const net = P.presetNetwork("core-periphery", 3);
  const dr = R.rescueRows(net, P.DEFAULT_PARAMS, ["d3", "d1", "c1", "d4"]);
  assert.equal(R.rescueHit(dr), dr.find((r) => r.policy === "yours").defaults <= dr.find((r) => r.policy === "debtRank").defaults);
});

test("worker messages: one response per degree in order, ids echoed, equals the plain sweep", () => {
  const params = { seed: 5, trials: 12, degrees: [1, 3, 8] };
  const out = [...Pr.fragilityJob({ requestId: 7, params })];
  assert.deepEqual(out.map((r) => [r.requestId, r.index, r.total]), [[7, 0, 3], [7, 1, 3], [7, 2, 3]]);
  assert.deepEqual(out.map((r) => r.point), F.fragilitySweep(params));
  assert.equal(Pr.peakDegree([{ degree: 2, pContagion: 0.5 }, { degree: 3, pContagion: 0.9 }, { degree: 4, pContagion: 0.9 }, { degree: 8, pContagion: 0.1 }]), 3.5);
  assert.ok(Number.isNaN(Pr.peakDegree([])));
});

test("sample cascade is deterministic and resamples with the draw", () => {
  const a = Sa.sampleCascade(3, 2, 0);
  assert.deepEqual(a.result.defaults, Sa.sampleCascade(3, 2, 0).result.defaults);
  assert.equal(a.net.institutions.length, Sa.SAMPLE_BANKS);
  assert.ok(a.result.defaults.includes(a.failed));
  assert.notDeepEqual(a.net, Sa.sampleCascade(3, 2, 1).net);
});
