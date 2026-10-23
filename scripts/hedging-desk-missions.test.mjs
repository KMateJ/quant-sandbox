import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { mergeResult, readProgress } = await importSrc("features/hedging-desk/deskProgress.ts");

test("best P&L is the smallest |P&L| among passes", () => {
  let p = mergeResult({}, "M1", false, 10);
  assert.deepEqual(p, {});
  p = mergeResult(p, "M1", true, -300);
  p = mergeResult(p, "M1", true, 120);
  p = mergeResult(p, "M1", true, -250);
  p = mergeResult(p, "M1", false, 1);
  assert.deepEqual(p, { M1: { completed: true, bestPnl: 120 } });
});

test("missing storage reads as empty progress", () => {
  assert.deepEqual(readProgress(), {});
});

const { setupRows } = await importSrc("features/hedging-desk/missionSetup.ts");
const { missionById } = await importSrc("features/hedging-desk/engine/missions.data.ts");

test("setup rows come from data, optional mechanics only when set", () => {
  const M1 = missionById("M1");
  const kinds = setupRows(M1).map((r) => r.kind);
  assert.deepEqual(kinds, ["book", "spot", "impliedVol", "realizedVol", "horizon", "band"]);
  assert.deepEqual(setupRows(M1)[0].vars, { side: "short", qty: 10, type: "C", strike: 100 });
  const rich = {
    ...M1, maxTrades: 10, settlement: "physical", costs: { ...M1.costs, ticketFee: 15 },
    market: { ...M1.market, gap: { from: 25, to: 35, size: 0.08 }, ivSchedule: [{ day: 20, iv: 0.3 }] },
  };
  const extra = setupRows(rich).slice(6).map((r) => r.kind);
  assert.deepEqual(extra, ["ticketFee", "tradeLimit", "gap", "ivPath", "physical"]);
});
