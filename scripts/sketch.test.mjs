import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const src = await readFile(new URL("../src/components/charts/sketch.logic.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const m = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const grid = [0, 1, 2, 3, 4, 5];

test("a stroke writes onto the grid within its x span and keeps the rest", () => {
  const first = m.applyStroke(grid, [], [{ x: 0, y: 0 }, { x: 5, y: 5 }]);
  assert.deepEqual(first.map((p) => p.y), [0, 1, 2, 3, 4, 5]);
  // Redraw only the middle, drawn right-to-left: x order does not matter.
  const second = m.applyStroke(grid, first, [{ x: 3.5, y: 0 }, { x: 1.5, y: 0 }]);
  assert.deepEqual(second.map((p) => p.y), [0, 1, 0, 0, 4, 5]);
  const clamped = m.applyStroke(grid, [], [{ x: 0, y: -9 }, { x: 5, y: 9 }], [0, 2]);
  assert.ok(clamped.every((p) => p.y >= 0 && p.y <= 2));
});

test("smoothing pulls toward neighbours; a drawn line gives slope and intercept", () => {
  const spiky = [{ x: 0, y: 0 }, { x: 1, y: 3 }, { x: 2, y: 0 }];
  assert.equal(m.smoothSamples(spiky, 1)[1].y, 1);
  assert.equal(m.smoothSamples(spiky, 0)[1].y, 3);
  const line = m.lineThrough({ x: 2, y: 5 }, { x: 0, y: 1 });
  assert.deepEqual(m.lineCoefficients(line), { slope: 2, intercept: 1 });
  assert.equal(m.lineCoefficients([{ x: 1, y: 0 }, { x: 1, y: 2 }]), null);
});
