import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const cache = new Map();

/// Transpiles a TS module and its relative imports into data: URLs (type-only imports vanish).
async function load(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const source = await readFile(url, "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [, spec] of outputText.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
    const dep = await load(new URL(`${spec}.ts`, url));
    outputText = outputText.replaceAll(`"${spec}"`, `"${dep}"`);
  }
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}

const ito = await import(await load(new URL("../src/features/ito-process/itoProcess.math.ts", import.meta.url)));
const NS = [4, 16, 64, 256, 1024];

test("both sides of Itô's lemma: for f = W², the uncorrected gap is Σ(ΔW)², the corrected error is T − Σ(ΔW)²", () => {
  const dw = ito.fineIncrements(1, ito.ITO_FINE_STEPS, 7);
  for (const n of NS) {
    const rows = ito.itoBothSides("square", dw, 1, n);
    const end = rows[n];
    let sq = 0;
    for (let k = 0; k < n; k++) {
      let d = 0;
      for (let j = (k * 1024) / n; j < ((k + 1) * 1024) / n; j++) d += dw[j];
      sq += d * d;
    }
    assert.ok(Math.abs(end.target - end.ito - sq) < 1e-12, `gap = Σ(ΔW)² at n=${n}`);
    // Corrected error = Σ(ΔW)² − T, which shrinks like √(2/n).
    assert.ok(Math.abs(end.corrected - end.target - (1 - sq)) < 1e-12);
  }
  assert.equal(ito.itoBothSides("square", dw, 1, 4).length, 5);
});

test("coarse grids reuse the same fine path, so W_T is identical at every n", () => {
  const dw = ito.fineIncrements(2, ito.ITO_FINE_STEPS, 3);
  const targets = NS.map((n) => ito.itoBothSides("exp", dw, 2, n)[n].target);
  for (const v of targets) assert.ok(Math.abs(v - targets[0]) < 1e-9);
});

test("mean error over paths: corrected shrinks with n, uncorrected levels off near ½E∫f″dt", () => {
  for (const fn of ["square", "exp", "sin"]) {
    const rows = ito.itoErrorByN(fn, 1, NS, 200, 7);
    console.log(fn, rows.map((r) => `${r.n}: ${r.corrected.toFixed(4)} / ${r.uncorrected.toFixed(4)}`).join("  "));
    assert.ok(rows[4].corrected < rows[0].corrected / 4, `${fn}: corrected error shrinks`);
    assert.ok(rows[4].corrected < rows[4].uncorrected, `${fn}: correction helps at n = 1024`);
  }
  const sq = ito.itoErrorByN("square", 1, NS, 200, 7);
  assert.ok(Math.abs(sq[4].uncorrected - 1) < 0.1, "W²: the uncorrected gap ≈ T");
});

test("default path numbers (seed 7, T = 1)", () => {
  const dw = ito.fineIncrements(1, ito.ITO_FINE_STEPS, 7);
  for (const fn of ["square", "exp", "sin"]) {
    const out = NS.map((n) => {
      const e = ito.itoBothSides(fn, dw, 1, n)[n];
      return `${n}: target ${e.target.toFixed(4)} ito ${e.ito.toFixed(4)} corr ${e.corrected.toFixed(4)}`;
    });
    console.log(fn, out.join(" | "));
  }
});
