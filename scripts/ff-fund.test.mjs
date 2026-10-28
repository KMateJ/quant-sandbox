import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const base = await importSrc("features/fama-french/famaFrench.math.ts");
const fund = await importSrc("features/fama-french/fund.math.ts");
const alpha = await importSrc("features/fama-french/alpha.math.ts");

const raw = JSON.parse(readFileSync(new URL("../src/features/fama-french/data/famaFrench.json", import.meta.url), "utf8"));
const data = base.toFfData(raw);
const full = { from: 0, to: data.months.length - 1 };
const choice = (id) => fund.fundChoice(id, data);
const series = (id, seed = 1) => fund.fundSeries(choice(id), data, seed);

test("OLS loadings beat any +-0.1 perturbation on replica R2", () => {
  const y = base.slice(series("small-value"), full);
  const ids = base.MODEL_FACTORS.ff3;
  const fit = base.factorFit(series("small-value"), data, "ff3", full);
  const best = fit.betas.map((b) => b.b);
  const r2 = (l) => fund.replicaR2(y, fund.replicaReturns(l, ids, data, full));
  const top = r2(best);
  for (let i = 0; i < best.length; i++) {
    for (const d of [-0.1, 0.1]) {
      const l = best.slice();
      l[i] += d;
      assert.ok(r2(l) < top, `perturbing ${ids[i]} by ${d}`);
    }
  }
});

test("exact replica of a noise-free fund has zero tracking error and R2 = 1", () => {
  const spec = { id: "x", salt: 9, loadings: { mkt: 1, smb: 0.4, hml: -0.3 }, alpha: 0, idioVol: 0 };
  const y = base.slice(base.syntheticFund(spec, data, 3), full);
  const rep = fund.replicaReturns([1, 0.4, -0.3], base.MODEL_FACTORS.ff3, data, full);
  assert.ok(fund.trackingError(y, rep) < 1e-12);
  assert.ok(Math.abs(fund.replicaR2(y, rep) - 1) < 1e-12);
  assert.ok(Math.abs(fund.meanResidualPerYear(y, rep)) < 1e-12);
});

test("loadingsHit tolerance edges", () => {
  assert.equal(fund.loadingsHit([1.15, 0], [1, 0]), true);
  assert.equal(fund.loadingsHit([1.16, 0], [1, 0]), false);
  assert.equal(fund.loadingsHit([0.85, -0.15], [1, 0]), true);
  assert.equal(fund.loadingsHit([1, 0.2], [1, 0], 0.25), true);
});

test("challenge fund: model by seed parity, truth has one loading per factor", () => {
  assert.equal(fund.challengeModel(2), "ff3");
  assert.equal(fund.challengeModel(3), "ff5");
  const t = fund.truthLoadings(choice("challenge"), "ff5", 3);
  assert.equal(t.length, 5);
  assert.equal(fund.truthLoadings(choice("ind-HiTec"), "ff3", 1), null);
});

test("industry funds are excess returns (rf subtracted)", () => {
  const s = series("ind-Utils");
  const i = data.industries.labels.indexOf("Utils");
  assert.ok(Math.abs(s[10] - (data.industries.returns[i][10] - data.factors.rf[10])) < 1e-15);
});

test("alpha ladder: small-value loses its CAPM alpha under FF3, true-alpha survives FF5", () => {
  const rows = {};
  for (const id of ["small-value", "quality-growth", "momentum", "closet-indexer", "true-alpha", "ind-NoDur", "ind-HiTec", "ind-Utils"]) {
    rows[id] = alpha.alphaLadder(series(id), data, full);
    console.log(id, rows[id].map((r) => `${r.model} ${(r.fit.alphaAnnual * 100).toFixed(2)}% t=${r.fit.alphaT.toFixed(2)}`).join(" | "), "first insig:", alpha.firstInsignificant(rows[id]));
  }
  const sv = rows["small-value"];
  assert.ok(Math.abs(sv[0].fit.alphaT) >= 2, "CAPM significant");
  assert.ok(Math.abs(sv[1].fit.alphaT) < 2, "FF3 insignificant");
  assert.equal(alpha.firstInsignificant(sv), "ff3");
  assert.ok(Math.abs(rows["true-alpha"][3].fit.alphaT) >= 2, "true alpha survives FF5");
});

test("alpha fit matches factorFit and customModel always keeps the market", () => {
  const y = series("momentum");
  const a = alpha.alphaFit(y, data, base.MODEL_FACTORS.carhart, full);
  const b = base.factorFit(y, data, "carhart", full);
  assert.ok(Math.abs(a.alphaT - b.alphaT) < 1e-12);
  assert.deepEqual(alpha.customModel(["hml", "smb"]), ["mkt", "smb", "hml"]);
  assert.equal(alpha.matchingModel(["mkt", "smb", "hml"]), "ff3");
  assert.equal(alpha.matchingModel(["smb"]), null);
  const lad = alpha.alphaLadder(y, data, full);
  assert.ok(lad[0].fit.hi > lad[0].fit.lo);
});

test("challenge window is 240 months inside the sample", () => {
  for (let s = 1; s < 30; s++) {
    const w = alpha.challengeWindow(s, data.months.length);
    assert.equal(w.to - w.from, 239);
    assert.ok(w.from >= 0 && w.to < data.months.length);
  }
});
