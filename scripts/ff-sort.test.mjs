import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const ff = await importSrc("features/fama-french/famaFrench.math.ts");
const sort = await importSrc("features/fama-french/sort.math.ts");
const cross = await importSrc("features/fama-french/cross.math.ts");

const raw = JSON.parse(readFileSync(new URL("../src/features/fama-french/data/famaFrench.json", import.meta.url), "utf8"));
const data = ff.toFfData(raw);
const full = { from: 0, to: data.months.length - 1 };
const SEED = 1;
const universe = sort.makeUniverse(SEED);
const returns = sort.stockReturns(universe, data, full, SEED);
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} ${a} vs ${b}`);

test("universe is deterministic and sized", () => {
  assert.equal(universe.length, 300);
  assert.deepEqual(sort.makeUniverse(SEED), universe);
  assert.notDeepEqual(sort.makeUniverse(2)[0], universe[0]);
  const again = sort.stockReturns(universe, data, full, SEED);
  assert.deepEqual(again[7].slice(0, 5), returns[7].slice(0, 5));
});

test("region counts sum to n and follow the percentile cuts", () => {
  const cuts = { sizeCut: 0.4, bmLo: 0.25, bmHi: 0.65 };
  const { counts } = sort.sortPortfolios(universe, returns, cuts, "equal");
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  assert.equal(total, 300);
  assert.equal(counts.SL + counts.SM + counts.SH, Math.ceil(0.4 * 300));
  assert.equal(counts.SL + counts.BL, Math.ceil(0.25 * 300));
  assert.equal(counts.SH + counts.BH, 300 - Math.ceil(0.65 * 300));
});

const six = (weighting) => sort.sortPortfolios(universe, returns, sort.DEFAULT_CUTS, weighting).series;
const mine = sort.yourFactors(six("equal"));

test("your SMB and HML track the official series", () => {
  const smb = sort.matchWithOfficial(mine.smb, data, "smb", full);
  const hml = sort.matchWithOfficial(mine.hml, data, "hml", full);
  console.log("corr SMB", smb.toFixed(3), "HML", hml.toFixed(3));
  assert.ok(smb > 0.8, `smb ${smb}`);
  assert.ok(hml > 0.8, `hml ${hml}`);
});

test("value and equal weighting differ", () => {
  const valueHml = sort.yourFactors(six("value")).hml;
  assert.ok(Math.abs(valueHml[10] - mine.hml[10]) > 1e-6);
});

test("breakpoint sweep on the default seed", () => {
  const sweep = sort.breakpointSweep(universe, returns, sort.DEFAULT_CUTS, "equal");
  console.log("sweep", sweep.map((p) => `${p.cut}:${p.t.toFixed(2)}`).join(" "));
  assert.equal(sweep.length, 4);
  sweep.forEach((p) => assert.ok(Number.isFinite(p.t)));
});

test("CAPM leaves bigger alphas than FF3 on the full sample", () => {
  const capm = cross.crossSection(data, full, "capm");
  const ff3 = cross.crossSection(data, full, "ff3");
  const ff5 = cross.crossSection(data, full, "ff5");
  const g = (m) => cross.grs(data, full, m);
  console.log("mean|a| capm", cross.meanAbsAlpha(capm).toFixed(4), "ff3", cross.meanAbsAlpha(ff3).toFixed(4), "ff5", cross.meanAbsAlpha(ff5).toFixed(4));
  console.log("GRS capm", g("capm").toFixed(2), "ff3", g("ff3").toFixed(2), "ff5", g("ff5").toFixed(2));
  const corner = (rows) => rows.filter((r) => ["S1B1", "S1B5", "S5B1", "S5B5"].includes(r.label)).map((r) => `${r.label}:${(r.alpha * 100).toFixed(2)}`).join(" ");
  console.log("capm corners", corner(capm), "| ff3 corners", corner(ff3));
  assert.ok(cross.meanAbsAlpha(capm) > cross.meanAbsAlpha(ff3));
  rowsSane(capm);
});

function rowsSane(rows) {
  assert.equal(rows.length, 25);
  rows.forEach((r) => close(r.alpha, r.realised - r.predicted, 1e-12, r.label));
  assert.ok(rows.every((r) => r.size >= 1 && r.size <= 5 && r.value >= 1 && r.value <= 5));
}

test("GRS is positive and finite, and null for a window that is too short", () => {
  for (const m of ["capm", "ff3", "ff5"]) {
    const g = cross.grs(data, full, m);
    assert.ok(Number.isFinite(g) && g > 0, `${m} ${g}`);
  }
  assert.ok(Number.isFinite(cross.grs(data, { from: 0, to: 59 }, "ff3")));
  assert.equal(cross.grsStat([[1, 2, 3], [2, 1, 4]], [[1, 2, 1]]), null);
});

test("grsStat equals a direct computation on a 3-portfolio, one-factor example", () => {
  const f = [0.02, -0.01, 0.03, 0.0, -0.02, 0.04, 0.01, -0.03, 0.02, 0.01, 0.0, -0.01];
  const noise = [
    [0.004, -0.002, 0.001, 0.003, -0.004, 0.002, -0.001, 0.0, 0.002, -0.003, 0.001, -0.003],
    [-0.002, 0.003, 0.002, -0.001, 0.001, -0.004, 0.003, 0.002, -0.002, 0.0, 0.004, -0.001],
    [0.001, 0.001, -0.003, 0.002, 0.003, 0.0, -0.002, 0.004, -0.001, -0.002, 0.002, 0.003],
  ];
  const betas = [0.8, 1.1, 1.3];
  const alphas = [0.002, -0.001, 0.003];
  const y = noise.map((e, i) => f.map((v, t) => alphas[i] + betas[i] * v + e[t]));
  const T = f.length;
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const mf = mean(f);
  const sff = f.reduce((s, v) => s + (v - mf) ** 2, 0);
  const fit = y.map((yi) => {
    const my = mean(yi);
    const b = yi.reduce((s, v, t) => s + (v - my) * (f[t] - mf), 0) / sff;
    const a = my - b * mf;
    return { a, e: yi.map((v, t) => v - a - b * f[t]) };
  });
  const S = fit.map((p) => fit.map((q) => p.e.reduce((s, v, t) => s + v * q.e[t], 0) / T));
  const [[a, b, c], [d, e, g], [h, i, j]] = S;
  const det = a * (e * j - g * i) - b * (d * j - g * h) + c * (d * i - e * h);
  const inv = [
    [(e * j - g * i) / det, (c * i - b * j) / det, (b * g - c * e) / det],
    [(g * h - d * j) / det, (a * j - c * h) / det, (c * d - a * g) / det],
    [(d * i - e * h) / det, (b * h - a * i) / det, (a * e - b * d) / det],
  ];
  const al = fit.map((p) => p.a);
  const quad = al.reduce((s, ai, r) => s + ai * inv[r].reduce((u, v, k) => u + v * al[k], 0), 0);
  const omega = sff / T;
  const expected = ((T - 3 - 1) / 3) * (quad / (1 + (mf * mf) / omega));
  close(cross.grsStat(y, [f]), expected, 1e-8 * Math.abs(expected));
});
