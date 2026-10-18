import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const m = await importSrc("components/ui/rangeGuess.logic.ts");

const close = (a, b, eps = 1e-12) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test("interval score: width inside, plus (2/α)·distance outside", () => {
  close(m.intervalScore(-0.1, 0.2, 0.05, 0.1), 0.3);
  close(m.intervalScore(-0.1, 0.2, 0.3, 0.1), 0.3 + 20 * 0.1);
  close(m.intervalScore(-0.1, 0.2, -0.15, 0.1), 0.3 + 20 * 0.05);
  // A narrow correct interval beats a wide correct one.
  assert.ok(m.intervalScore(0, 0.1, 0.05, 0.1) < m.intervalScore(-1, 1, 0.05, 0.1));
});

test("scoreRound marks hits on the closed interval and scores at α = 1 − nominal", () => {
  const r = m.scoreRound(0, 1, 1, 0.9);
  assert.equal(r.hit, true);
  close(r.score, 1);
  const miss = m.scoreRound(0, 1, 1.5, 0.8);
  assert.equal(miss.hit, false);
  close(miss.score, 1 + 10 * 0.5);
});

test("hit rate and mean score; NaN with no rounds", () => {
  assert.ok(Number.isNaN(m.hitRate([])));
  assert.ok(Number.isNaN(m.meanScore([])));
  close(m.hitRate([{ hit: true }, { hit: false }, { hit: true }, { hit: true }]), 0.75);
  close(m.meanScore([{ score: 1 }, { score: 3 }]), 2);
});

test("calibration verdict: pending below 5 rounds, then a binomial band around the nominal", () => {
  assert.equal(m.calibrationVerdict(0, 4, 0.9), "pending");
  // n = 5, p = 0.9: band = 1.64·√(0.09/5) ≈ 0.22 → anything below ≈ 68% is too narrow.
  assert.equal(m.calibrationVerdict(3, 5, 0.9), "tooNarrow");
  assert.equal(m.calibrationVerdict(4, 5, 0.9), "calibrated");
  assert.equal(m.calibrationVerdict(5, 5, 0.9), "calibrated");
  // With many rounds always inside, the ranges are too wide.
  assert.equal(m.calibrationVerdict(100, 100, 0.9), "tooWide");
  assert.equal(m.calibrationVerdict(50, 100, 0.9), "tooNarrow");
  assert.equal(m.calibrationVerdict(90, 100, 0.9), "calibrated");
  assert.equal(m.calibrationVerdict(4, 10, 0.5, 10), "calibrated");
});

test("track fraction is clamped to [0, 1]", () => {
  close(m.trackFraction(0.25, 0, 1), 0.25);
  assert.equal(m.trackFraction(-1, 0, 1), 0);
  assert.equal(m.trackFraction(5, 0, 1), 1);
  assert.equal(m.trackFraction(1, 1, 1), 0);
});

test("lab helpers: textbook 90% interval, seeded return draw, slider domains", async () => {
  const rr = await importSrc("features/risk-return/riskReturn.math.ts");
  const pl = await importSrc("features/portfolio-lab/portfolioLab.math.ts");
  const { makeRng } = await importSrc("lib/math/random.ts");
  const [lo, hi] = rr.normalInterval(0.07, 0.18);
  close(lo, 0.07 - 1.6449 * 0.18);
  close(hi, 0.07 + 1.6449 * 0.18);
  const rng = makeRng(7);
  const draws = Array.from({ length: 20000 }, () => rr.drawAnnualReturn(0.07, 0.18, rng));
  const inside = draws.filter((x) => x >= lo && x <= hi).length / draws.length;
  assert.ok(Math.abs(inside - 0.9) < 0.01, `coverage ${inside}`);
  const [dMin, dMax] = rr.returnGuessDomain(0.07, 0.18);
  assert.ok(dMin <= 0.07 - 3.5 * 0.18 && dMax >= 0.07 + 3.5 * 0.18);
  assert.deepEqual(rr.returnGuessDomain(0.03, 0), [-0.1, 0.15]);
  const [vMin, vMax] = pl.volGuessDomain([0.12, 0.31]);
  assert.equal(vMin, 0);
  close(vMax, 0.4);
});
