export const MAX_SEED = 9999;

/// The next seed, wrapping to 1 after `MAX_SEED`.
export const nextSeed = (seed: number) => (seed >= MAX_SEED ? 1 : seed + 1);

/// Derived seed for a side RNG (events, Monte Carlo) that must not disturb the main path.
export const subSeed = (seed: number, salt: number) => (Math.imul(seed, 7919) + salt * 104729) >>> 0;
