import { makeRng, nextNormal } from "../../lib/math/random";
import type { ItoPoint, ItoResult } from "./itoProcess.types";

/// Simulate ln(S) for a GBM asset, illustrating Itô's lemma: d ln S = (μ − ½σ²)dt + σ dW.
/// Each row carries the corrected-drift line ln S₀+(μ−½σ²)t, the naive line ln S₀+μt, and the paths.
export function simulateLogGbm(
  s0: number,
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): ItoResult {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sqrtDt = Math.sqrt(dt);
  const logS0 = Math.log(s0);
  const correctedDrift = drift - 0.5 * vol * vol;
  const keys = Array.from({ length: numPaths }, (_, i) => `p${i}`);
  const level = new Array<number>(numPaths).fill(logS0);

  const data: ItoPoint[] = [];
  const first: ItoPoint = { t: 0, correct: logS0, naive: logS0 };
  for (const k of keys) first[k] = logS0;
  data.push(first);

  for (let s = 1; s <= steps; s++) {
    const t = s * dt;
    const row: ItoPoint = {
      t,
      correct: logS0 + correctedDrift * t,
      naive: logS0 + drift * t,
    };
    for (let p = 0; p < numPaths; p++) {
      level[p] += correctedDrift * dt + vol * sqrtDt * nextNormal(rng);
      row[keys[p]] = level[p];
    }
    data.push(row);
  }
  return { keys, data };
}

/// One step of the step-by-step view: time, increment ΔW, W(t), running Σ(ΔW)², ln S(t) and the two drift lines.
export type ItoStepRow = { t: number; dw: number; w: number; sq: number; ln: number; naive: number; correct: number };

/// One coarse path for the step-by-step view of Itô's lemma on ln S, with `steps` increments.
/// ln S is stepped with the corrected drift (exact for GBM), so it tracks ln S₀ + (μ − ½σ²)t on average.
export function itoStepPath(s0: number, drift: number, vol: number, horizon: number, steps: number, seed: number): ItoStepRow[] {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const logS0 = Math.log(s0);
  const rows: ItoStepRow[] = [{ t: 0, dw: 0, w: 0, sq: 0, ln: logS0, naive: logS0, correct: logS0 }];
  for (let k = 1; k <= steps; k++) {
    const prev = rows[k - 1];
    const t = k * dt;
    const dw = Math.sqrt(dt) * nextNormal(rng);
    rows.push({
      t,
      dw,
      w: prev.w + dw,
      sq: prev.sq + dw * dw,
      ln: prev.ln + (drift - 0.5 * vol * vol) * dt + vol * dw,
      naive: logS0 + drift * t,
      correct: logS0 + (drift - 0.5 * vol * vol) * t,
    });
  }
  return rows;
}

// #region Both sides of Itô's lemma
export type ItoFn = "square" | "exp" | "sin";

/// f with its first and second derivatives, for f(W_T) − f(W_0) = ∫f′(W)dW + ½∫f″(W)dt.
export const ITO_FUNCTIONS: Record<ItoFn, { f: (w: number) => number; fp: (w: number) => number; fpp: (w: number) => number }> = {
  square: { f: (w) => w * w, fp: (w) => 2 * w, fpp: () => 2 },
  exp: { f: Math.exp, fp: Math.exp, fpp: Math.exp },
  sin: { f: Math.sin, fp: Math.cos, fpp: (w) => -Math.sin(w) },
};

/// Finest grid of the both-sides view; every coarser n must divide it.
export const ITO_FINE_STEPS = 1024;

/// Brownian increments of one seeded path on [0, T] at `fine` steps.
export function fineIncrements(horizon: number, fine: number, seed: number): Float64Array {
  const rng = makeRng(seed);
  const sd = Math.sqrt(horizon / fine);
  const dw = new Float64Array(fine);
  for (let k = 0; k < fine; k++) dw[k] = sd * nextNormal(rng);
  return dw;
}

/// One time point of the both-sides view: the target f(W_t) − f(0), the Itô sum Σ f′(W_k)ΔW_k
/// (left-point), and the Itô sum plus the correction ½Σ f″(W_k)Δt.
export type ItoSidesRow = { t: number; target: number; ito: number; corrected: number };

/// Running sums of both sides on a coarse grid of `n` steps built from the same fine path (fine increments summed).
export function itoBothSides(fn: ItoFn, fineDw: ArrayLike<number>, horizon: number, n: number): ItoSidesRow[] {
  const { f, fp, fpp } = ITO_FUNCTIONS[fn];
  const per = fineDw.length / n;
  const dt = horizon / n;
  const f0 = f(0);
  let w = 0;
  let ito = 0;
  let correction = 0;
  const rows: ItoSidesRow[] = [{ t: 0, target: 0, ito: 0, corrected: 0 }];
  for (let k = 0; k < n; k++) {
    let dw = 0;
    for (let j = k * per; j < (k + 1) * per; j++) dw += fineDw[j];
    ito += fp(w) * dw;
    correction += 0.5 * fpp(w) * dt;
    w += dw;
    rows.push({ t: (k + 1) * dt, target: f(w) - f0, ito, corrected: ito + correction });
  }
  return rows;
}

/// Mean absolute error at T of the Itô sum without and with the ½∫f″dt correction, over `paths` seeded paths, per n.
export function itoErrorByN(fn: ItoFn, horizon: number, ns: number[], paths: number, seed: number, fine = ITO_FINE_STEPS) {
  const totals = ns.map(() => ({ uncorrected: 0, corrected: 0 }));
  for (let p = 0; p < paths; p++) {
    const dw = fineIncrements(horizon, fine, seed * 7919 + p + 1);
    ns.forEach((n, i) => {
      const end = itoBothSides(fn, dw, horizon, n)[n];
      totals[i].uncorrected += Math.abs(end.ito - end.target);
      totals[i].corrected += Math.abs(end.corrected - end.target);
    });
  }
  return ns.map((n, i) => ({ n, uncorrected: totals[i].uncorrected / paths, corrected: totals[i].corrected / paths }));
}
// #endregion
