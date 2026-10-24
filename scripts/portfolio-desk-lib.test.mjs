import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const { riskParityWeights, scaleToVol, portfolioVolatility } = await importSrc("lib/finance/portfolio.ts");
const { riskContributions, covFromCorr } = await importSrc("features/portfolio-lab/portfolioLab.math.ts");

const cov = covFromCorr([0.16, 0.22, 0.06, 0.08, 0.15], [
  [1, 0.75, -0.2, 0.55, 0.05],
  [0.75, 1, -0.1, 0.55, 0.15],
  [-0.2, -0.1, 1, 0.3, 0.2],
  [0.55, 0.55, 0.3, 1, 0.1],
  [0.05, 0.15, 0.2, 0.1, 1],
]);

test("riskParityWeights equalises risk contributions and sums to 1", () => {
  const w = riskParityWeights(cov);
  assert.ok(Math.abs(w.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  for (const share of riskContributions(w, cov)) assert.ok(Math.abs(share - 0.2) < 1e-6, `share ${share}`);
});

test("riskParityWeights survives strongly negative correlation", () => {
  const c = covFromCorr([0.2, 0.05], [[1, -0.9], [-0.9, 1]]);
  const w = riskParityWeights(c);
  assert.ok(w.every((x) => Number.isFinite(x) && x > 0));
});

test("scaleToVol hits the target and caps the total at 1", () => {
  const down = scaleToVol([0.6, 0.2, 0.1, 0.1, 0], cov, 0.05, 1);
  assert.ok(Math.abs(portfolioVolatility(down, cov) - 0.05) < 1e-12);
  const up = scaleToVol([0, 0, 0.5, 0, 0], cov, 0.2, 1);
  assert.ok(Math.abs(up.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  assert.deepEqual(scaleToVol([0, 0, 0, 0, 0], cov, 0.1), [0, 0, 0, 0, 0]);
});
