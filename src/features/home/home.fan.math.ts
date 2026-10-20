import { makeRng, nextNormal } from "../../lib/math/random";
import type { FanArt, FanParams } from "./home.types";

/// Hero figure: seeded GBM price paths, their expected path and a terminal-value histogram.
export const HERO_FAN: FanParams = {
  seed: 7, paths: 70, steps: 56, mu: 0.07, sigma: 0.3, s0: 100, lo: 40, hi: 230,
  x0: 40, x1: 600, yTop: 40, yBottom: 380, bins: 24,
};

const fmt = (n: number) => n.toFixed(1);

/// Simulate `p.paths` GBM paths and lay them out as SVG path strings (deterministic per seed).
export function buildFan(p: FanParams): FanArt {
  const rng = makeRng(p.seed);
  const dt = 1 / p.steps;
  const drift = (p.mu - (p.sigma * p.sigma) / 2) * dt;
  const vol = p.sigma * Math.sqrt(dt);
  const clamp = (s: number) => Math.min(p.hi, Math.max(p.lo, s));
  const yOf = (s: number) => p.yBottom - ((clamp(s) - p.lo) / (p.hi - p.lo)) * (p.yBottom - p.yTop);
  const xOf = (i: number) => p.x0 + (i / p.steps) * (p.x1 - p.x0);

  const paths = Array.from({ length: p.paths }, () => {
    let s = p.s0;
    let d = `M${fmt(xOf(0))} ${fmt(yOf(s))}`;
    for (let i = 1; i <= p.steps; i++) {
      s *= Math.exp(drift + vol * nextNormal(rng));
      d += ` L${fmt(xOf(i))} ${fmt(yOf(s))}`;
    }
    return { d, end: s };
  }).sort((a, b) => a.end - b.end);

  const mean = Array.from({ length: p.steps + 1 }, (_, i) => {
    const s = p.s0 * Math.exp(p.mu * (i / p.steps));
    return `${i === 0 ? "M" : "L"}${fmt(xOf(i))} ${fmt(yOf(s))}`;
  }).join(" ");

  const counts = new Array<number>(p.bins).fill(0);
  for (const { end } of paths) {
    const k = Math.floor(((clamp(end) - p.lo) / (p.hi - p.lo)) * p.bins);
    counts[Math.min(p.bins - 1, k)]++;
  }
  const maxCount = Math.max(...counts, 1);
  const binH = (p.yBottom - p.yTop) / p.bins;
  const bins = counts.map((c, k) => ({
    y: p.yBottom - (k + 1) * binH,
    h: binH - 2,
    w: (c / maxCount) * 88,
  }));

  return { paths, keyIndex: Math.round(0.75 * (p.paths - 1)), mean, bins, y0: yOf(p.s0) };
}
