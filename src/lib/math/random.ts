/// A deterministic pseudo-random generator returning values in [0, 1).
export type Rng = () => number;

/// Create a seeded `mulberry32` PRNG. Same seed ⇒ same sequence (reproducible simulations).
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/// One standard normal variate N(0,1) via the Box–Muller transform using `rng`.
export function nextNormal(rng: Rng): number {
  let u = 0;
  // Guard against log(0).
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/// `n` independent standard normal variates from `rng`.
export function normals(n: number, rng: Rng): number[] {
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = nextNormal(rng);
  return out;
}

/// A normal variate N(mean, sd²) drawn from `rng`.
export function nextGaussian(mean: number, sd: number, rng: Rng): number {
  return mean + sd * nextNormal(rng);
}
