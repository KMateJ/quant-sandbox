import assert from "node:assert/strict";
import { test } from "node:test";
import { rolldown } from "rolldown";

async function loadModule(path) {
  const bundle = await rolldown({ input: new URL(`../src/${path}`, import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });
  const { output } = await bundle.generate({ format: "esm" });
  return import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString("base64")}`);
}

const tr = await loadModule("features/brownian-motion/lessons/transformations.math.ts");
const qv = await loadModule("features/brownian-motion/lessons/quadraticVariation.math.ts");
const br = await loadModule("features/brownian-motion/lessons/bridge.math.ts");
const bm = await loadModule("features/brownian-motion/lessons/brownianFundamentals.math.ts");
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) < tol, `${msg ?? ""} ${a} vs ${b}`);

test("every transformation of Brownian motion has variance t", () => {
  const base = tr.simulateBase(7, 600);
  const params = { c: 2, s: tr.SHIFT_S };
  for (const kind of tr.TRANSFORM_KINDS) {
    for (const { x, y } of tr.varianceProfile(base, kind, params, 5)) near(y, x, 0.2 * x + 0.04, `${kind} at t=${x}`);
  }
});

test("scaling uses the right time change and inversion starts at zero", () => {
  const base = tr.simulateBase(3, 4);
  near(tr.transformedAt(base, 1, "scale", 0.5, { c: 4, s: 0 }), tr.levelAt(base, 1, 2) / 2, 1e-12);
  assert.equal(tr.transformedAt(base, 0, "invert", 0.01, { c: 1, s: 0 }), 0);
  near(tr.transformedAt(base, 2, "negate", 0.3, { c: 1, s: 0 }), -tr.levelAt(base, 2, 0.3), 1e-12);
});

test("quadratic variation converges to T while the absolute sum diverges", () => {
  const T = 1.5;
  const path = qv.finePath(11, T);
  const rows = qv.partitionTable(path);
  const last = rows[rows.length - 1];
  assert.equal(last.n, 4096);
  near(last.qv / T, 1, 0.05, "QV at n=4096");
  assert.ok(last.tv > 4 * rows[3].tv, "absolute sum grows with n");
  near(last.tv / qv.expectedAbsSum(last.n, T), 1, 0.15, "abs sum ~ sqrt(2nT/pi)");
  const band = qv.qvBand(4096, T);
  assert.ok(band.lo < T && T < band.hi);
});

test("zoom windows are rescaled to unit size", () => {
  const path = qv.finePath(5, 1);
  for (const w of qv.ZOOM_WIDTHS) {
    const pts = qv.zoomWindow(path, 1, w);
    assert.equal(pts[0].x, 0);
    assert.equal(pts[pts.length - 1].x, 1);
    assert.equal(pts[0].y, 0);
  }
});

test("bridge ends exactly at b and has variance t(T-t)/T", () => {
  const T = 2;
  const b = 0.8;
  const cloud = bm.simulateBrownian(9, 800, 200);
  const values = br.bridgeValues(cloud, T, b);
  for (let p = 0; p < cloud.pathCount; p++) {
    assert.equal(values[p], 0);
    near(values[200 * cloud.pathCount + p], b, 1e-12);
  }
  for (const { x, y } of br.bridgeVarianceProfile(values, cloud, T, 5)) near(y, br.bridgeVariance(x, T), 0.25 * br.bridgeVariance(x, T) + 0.02, `var at ${x}`);
  near(br.bridgeMean(1, T, b), 0.4, 1e-12);
});
