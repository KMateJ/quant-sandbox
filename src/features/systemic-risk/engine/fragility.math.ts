import { makeRng } from "../../../lib/math/random";
import { subSeed } from "../../../lib/game/seed";
import { DEFAULT_PARAMS, randomBankNetwork } from "./presets.math";
import { simulate } from "./simulate.math";
import type { SimParams } from "./systemic.types";

export type SweepParams = {
  n?: number;
  degrees?: number[];
  trials?: number;
  interbankShare?: number;
  capitalRatio?: number;
  /// loss given default on interbank claims; 1 reproduces Gai–Kapadia (a defaulted claim is lost entirely)
  lgd?: number;
  seed: number;
};

export type FragilityPoint = {
  degree: number;
  /// share of trials where the first default topples at least 5% of the other banks
  pContagion: number;
  /// mean share of all banks failed, over the trials with contagion (0 when none)
  meanExtent: number;
};

export const SWEEP_DEFAULTS = {
  n: 50,
  degrees: [0.5, 1, 2, 3, 4, 6, 8, 10, 12],
  trials: 200,
  interbankShare: 0.2,
  capitalRatio: 0.04,
  lgd: 1,
};

const CONTAGION_SHARE = 0.05;
// Cascades advance one hop a day; contagion on 50 banks ends well inside this horizon.
const SWEEP_DAYS = 20;

/// The sweep parameters with defaults filled in.
export const resolveSweep = (p: SweepParams) => ({
  n: p.n ?? SWEEP_DEFAULTS.n,
  degrees: p.degrees ?? SWEEP_DEFAULTS.degrees,
  trials: p.trials ?? SWEEP_DEFAULTS.trials,
  interbankShare: p.interbankShare ?? SWEEP_DEFAULTS.interbankShare,
  capitalRatio: p.capitalRatio ?? SWEEP_DEFAULTS.capitalRatio,
  lgd: p.lgd ?? SWEEP_DEFAULTS.lgd,
  seed: p.seed,
});

/// One degree of the sweep: `trials` random networks, one random bank defaults, direct channel only.
/// `degreeIndex` indexes `degrees`; call it per index to run the sweep incrementally (e.g. in a worker).
export function sweepChunk(params: SweepParams, degreeIndex: number): FragilityPoint {
  const { n, degrees, trials, interbankShare, capitalRatio, lgd, seed } = resolveSweep(params);
  const degree = degrees[degreeIndex];
  const sim: SimParams = {
    ...DEFAULT_PARAMS, days: Math.min(n, SWEEP_DAYS), lgd, channels: { direct: true, fireSales: false, funding: false, ccp: false },
  };
  let contagious = 0;
  let extent = 0;
  for (let t = 0; t < trials; t++) {
    const s = subSeed(seed, degreeIndex * 100_003 + t + 1);
    const net = randomBankNetwork({ n, degree, interbankShare, capitalRatio, seed: s });
    const first = net.institutions[Math.floor(makeRng(s ^ 0x9e3779b9)() * n)].id;
    const failed = simulate(net, [{ kind: "default", id: first }], sim).defaults.length;
    if ((failed - 1) / n >= CONTAGION_SHARE) {
      contagious++;
      extent += failed / n;
    }
  }
  return { degree, pContagion: contagious / trials, meanExtent: contagious ? extent / contagious : 0 };
}

/// Gai–Kapadia style fragility sweep over average degree: probability and extent of contagion after one random
/// default. Shows the robust-yet-fragile shape: contagion first rises with connectivity, then falls once each
/// link is too small to topple a neighbour on its own.
export function fragilitySweep(params: SweepParams): FragilityPoint[] {
  const { degrees } = resolveSweep(params);
  return degrees.map((_, k) => sweepChunk(params, k));
}
