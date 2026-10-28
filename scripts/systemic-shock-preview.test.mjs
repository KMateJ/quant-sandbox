import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const P = await importSrc("features/systemic-risk/engine/presets.math.ts");
const M = await importSrc("features/systemic-risk/engine/metrics.math.ts");
const V = await importSrc("features/systemic-risk/shocks/shockPreview.math.ts");
const net = P.presetNetwork("core-periphery", 1);

test("asset exposures add up the holdings and scale the loss by the drop", () => {
  const rows = V.assetExposures(net, [0, 0, 30, 10]);
  assert.deepEqual(rows.map((r) => r.asset), ["gov", "corp", "mbs", "equity"]);
  const mbs = net.institutions.reduce((s, i) => s + i.holdings.mbs, 0);
  assert.ok(Math.abs(rows[2].held - mbs) < 1e-9);
  assert.ok(Math.abs(rows[2].loss - 0.3 * mbs) < 1e-9);
  assert.equal(rows[0].loss, 0);
  assert.ok(net.institutions.some((i) => i.id === rows[2].topHolder));
});

test("fail preview describes the institution and its lenders", () => {
  const top = M.systemicRanking(net)[0].id;
  const f = V.failPreview(net, top);
  assert.ok(f.assets > 0 && f.leverage > 1 && f.assetShare > 0 && f.assetShare < 100);
  assert.ok(Math.abs(f.reach - 100 * M.debtRank(net, { [top]: 1 }).rank) < 1e-9);
  assert.ok(f.lenders > 0 && f.biggestLender.amount > 0);
  assert.equal(V.failPreview(net, "nope"), null);
});

test("every scenario is a valid setup for each preset network", () => {
  for (const id of P.PRESET_IDS) {
    const n = P.presetNetwork(id, 1);
    for (const sc of V.SCENARIO_IDS) {
      const p = V.scenarioPatch(sc, n);
      assert.equal(p.drop.length, 4);
      assert.ok(p.drop.every((d) => d >= 0 && d <= 50));
      assert.ok(p.fail === "" || p.fail === "none" || n.institutions.some((i) => i.id === p.fail));
    }
  }
  assert.ok(V.systemEquity(net) > 0);
});
