import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const src = await readFile(new URL("../src/components/charts/dragHandle.logic.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const m = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("constrain snaps and clamps only along the handle's axis", () => {
  const strike = { id: "k", axis: "x", x: 100, min: 50, max: 150, step: 1 };
  assert.deepEqual(m.constrain(strike, { x: 123.4, y: 9 }), { x: 123 });
  assert.deepEqual(m.constrain(strike, { x: 400 }), { x: 150 });
  const point = { id: "p", axis: "xy", x: 0.2, y: 0.1, bounds: { x: [0, 0.5], y: [-0.1, 0.3] }, step: 0.01 };
  const c = m.constrain(point, { x: 0.7, y: -1 });
  assert.equal(c.x, 0.5);
  assert.equal(c.y, -0.1);
});

test("keyboard moves like a slider, with Shift ×10 and Home / End", () => {
  const h = { id: "k", axis: "x", x: 100, min: 50, max: 150, step: 1 };
  const span = { x: 100, y: 1 };
  assert.deepEqual(m.keyMove(h, "ArrowRight", false, span), { x: 101 });
  assert.deepEqual(m.keyMove(h, "ArrowLeft", true, span), { x: 90 });
  assert.deepEqual(m.keyMove(h, "Home", false, span), { x: 50 });
  assert.deepEqual(m.keyMove(h, "End", false, span), { x: 150 });
  assert.equal(m.keyMove(h, "a", false, span), null);
  const level = { id: "y", axis: "y", y: 0.05, min: 0, max: 0.1, step: 0.005 };
  assert.ok(Math.abs(m.keyMove(level, "ArrowUp", false, span).y - 0.055) < 1e-12);
});
