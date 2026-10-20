import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import { importSrc } from "./lib/load-ts.mjs";

const load = async (name) => {
  const src = await readFile(new URL(`../src/components/charts/${name}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
};
const { tickCount, edgeAnchor, thinTicks } = await load("ticks.logic.ts");
const { placeLabels, estimateTextWidth } = await load("labels.logic.ts");

test("tick count grows with the plot width and stays within bounds", () => {
  let last = 0;
  for (let w = 0; w <= 2000; w += 20) {
    const n = tickCount(w, 48);
    assert.ok(n >= last, `not monotonic at ${w}`);
    assert.ok(n >= 2 && n <= 10);
    last = n;
  }
  assert.equal(tickCount(0), 2);
  assert.equal(tickCount(Number.NaN), 2);
  assert.equal(tickCount(5000), 10);
  assert.equal(tickCount(5000, 44, 2, 8), 8);
});

test("a narrow chart gets fewer ticks than the viewport would suggest", () => {
  assert.ok(tickCount(260, 48) <= 4);
  assert.ok(tickCount(260, 48) < tickCount(700, 48));
});

test("edge ticks anchor inward, inner ticks stay centred", () => {
  assert.equal(edgeAnchor(0, 300), "start");
  assert.equal(edgeAnchor(300, 300), "end");
  assert.equal(edgeAnchor(150, 300), "middle");
  assert.equal(edgeAnchor(18, 300), "middle");
});

test("text width estimate scales with characters and font size", () => {
  assert.equal(estimateTextWidth("abcd", 10), 24);
});

test("two colliding labels: the higher priority stays, the other is nudged", () => {
  const a = { id: "a", x: 10, y: 20, w: 60, h: 12, priority: 2 };
  const b = { id: "b", x: 20, y: 22, w: 60, h: 12, priority: 1 };
  const { placed, hidden } = placeLabels([b, a], 200, 100);
  assert.deepEqual(placed.a, { x: 10, y: 20 });
  assert.equal(hidden.size, 0);
  assert.notEqual(placed.b.y, 22);
  assert.ok(Math.abs(placed.b.y - 20) >= 12, "nudged clear of a");
});

test("labels are kept inside the plot", () => {
  const { placed } = placeLabels([{ id: "a", x: 190, y: 5, w: 60, h: 12, priority: 1 }], 200, 100);
  assert.equal(placed.a.x, 140);
});

test("an impossible case hides the lower-priority label", () => {
  const wall = Array.from({ length: 4 }, (_, i) => ({ id: `o${i}`, x: 0, y: i * 12, w: 100, h: 12, priority: 0 }));
  const { placed, hidden } = placeLabels(
    [
      { id: "hi", x: 0, y: 12, w: 50, h: 12, priority: 5 },
      { id: "lo", x: 0, y: 12, w: 50, h: 12, priority: 1 },
    ],
    100,
    48,
    wall
  );
  assert.deepEqual([...hidden].sort(), ["hi", "lo"]);
  assert.deepEqual(placed, {});
});

test("an obstacle pushes a label aside, a label wider than the plot is hidden", () => {
  const obstacle = { id: "curve", x: 0, y: 20, w: 200, h: 12, priority: 0 };
  const { placed } = placeLabels([{ id: "a", x: 10, y: 20, w: 40, h: 12, priority: 1 }], 200, 100, [obstacle]);
  assert.ok(placed.a.y + 12 <= 20 || placed.a.y >= 32);
  const { hidden } = placeLabels([{ id: "wide", x: 0, y: 0, w: 500, h: 12, priority: 1 }], 200, 100);
  assert.ok(hidden.has("wide"));
});

const { layoutAnnotations } = await importSrc("components/charts/annotations.logic.ts");

test("an annotation sitting on a curve is nudged off it", () => {
  const identity = { x: (v) => v, y: (v) => v };
  const curve = Array.from({ length: 41 }, (_, i) => ({ x: i * 5, y: 50 }));
  const [out] = layoutAnnotations([{ x: 100, y: 55, text: "tangent", anchor: "middle", fontSize: 10 }], [curve], identity, { width: 200, height: 100 }, 12);
  assert.equal(out.hidden, false);
  const top = out.y - out.fontSize;
  assert.ok(top + 12 <= 48 || top >= 52, "clear of the curve at y=50");
});

test("rotated annotations are left where they are", () => {
  const identity = { x: (v) => v, y: (v) => v };
  const [out] = layoutAnnotations([{ x: 40, y: 30, text: "slope", rotate: -20, dy: -5 }], [], identity, { width: 200, height: 100 }, 12);
  assert.deepEqual([out.x, out.y, out.hidden], [40, 25, false]);
});

test("thinned ticks never touch and always keep the last one", () => {
  const widths = Array(20).fill(20);
  const positions = Array.from({ length: 20 }, (_, i) => i * 14);
  const kept = thinTicks(positions, widths, 6);
  assert.equal(kept[0], 0);
  assert.equal(kept[kept.length - 1], 19);
  for (let i = 1; i < kept.length; i++) assert.ok(positions[kept[i]] - positions[kept[i - 1]] >= 20 + 6, "gap kept");
});

test("ticks that already fit are all kept", () => {
  assert.deepEqual(thinTicks([0, 100, 200], [20, 20, 20]), [0, 1, 2]);
  assert.deepEqual(thinTicks([], []), []);
});
