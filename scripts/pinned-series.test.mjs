import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const src = await readFile(new URL("../src/components/charts/pinned.logic.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const m = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const series = [{ key: "price", label: "Price", color: "red", strokeWidth: 2.5 }];
const old = [{ x: 0, price: 0 }, { x: 10, price: 10 }, { x: 20, price: 40 }];

test("snapshot interpolates onto a new x grid and leaves gaps outside its range", () => {
  const snap = m.takeSnapshot(old, "x", series);
  const merged = m.mergePinned([{ x: 5, price: 1 }, { x: 15, price: 2 }, { x: 30, price: 3 }], snap);
  assert.equal(merged[0]["pinned:price"], 5);
  assert.equal(merged[1]["pinned:price"], 25);
  assert.equal(merged[2]["pinned:price"], undefined);
  assert.equal(merged[0].price, 1);
});

test("ghost series reuse the colour, are dashed and thinner, with a localised label", () => {
  const snap = m.takeSnapshot(old, "x", series);
  const [g] = m.ghostSeries(snap, (l) => `${l} (pinned)`);
  assert.deepEqual([g.key, g.label, g.color, g.dash], ["pinned:price", "Price (pinned)", "red", "5 4"]);
  assert.ok(g.strokeWidth < 2.5);
  assert.deepEqual(m.ghostSeries(null, (l) => l), []);
  assert.equal(m.mergePinned(old, null), old);
});

test("scatter ghosts: lines become dashed and faded, markers only on request, never draggable", () => {
  const live = [
    { key: "curve", label: "Price", color: "blue", line: true, strokeWidth: 2.5, points: [{ x: 0, y: 1 }, { x: 1, y: 2 }] },
    { key: "pt", label: "Bond", color: "red", draggable: true, points: [{ x: 0.5, y: 1.5, color: "green" }] },
  ];
  const [g] = m.ghostScatter(live, (l) => `${l} (pinned)`);
  assert.equal(m.ghostScatter(live, (l) => l).length, 1);
  assert.deepEqual([g.key, g.label, g.dash, g.draggable, g.opacity], ["pinned:curve", "Price (pinned)", "5 4", false, 0.5]);
  const withMarkers = m.ghostScatter(live, (l) => l, true);
  assert.equal(withMarkers.length, 2);
  assert.equal(withMarkers[1].hollow, true);
  assert.equal(withMarkers[1].draggable, false);
  assert.equal(withMarkers[1].points[0].color, undefined);
});
