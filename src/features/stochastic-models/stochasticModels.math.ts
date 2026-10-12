import { makeRng } from "../../lib/math/random";
import type { Histogram, RandomWalkResult, WalkMoments } from "./stochasticModels.types";

export const RANDOM_WALK_MAX_STEPS = 500;
export const RANDOM_WALK_MAX_PATHS = 1000;

/// One fixed field of uniforms lets probability and display settings reuse the same trials.
export function createRandomWalkDraws(seed: number): Float32Array {
  const rng = makeRng(seed);
  const draws = new Float32Array(RANDOM_WALK_MAX_STEPS * RANDOM_WALK_MAX_PATHS);
  for (let i = 0; i < draws.length; i++) draws[i] = rng();
  return draws;
}

/// Simulate a seeded Bernoulli walk; the first paths keep their draws as sample size changes.
export function simulateRandomWalk(
  draws: Float32Array,
  steps: number,
  pathCount: number,
  upProbability: number
): RandomWalkResult {
  const positionsByStep = new Int16Array((steps + 1) * pathCount);

  for (let path = 0; path < pathCount; path++) {
    const offset = path * RANDOM_WALK_MAX_STEPS;
    let level = 0;
    for (let step = 0; step < steps; step++) {
      level += draws[offset + step] < upProbability ? 1 : -1;
      positionsByStep[(step + 1) * pathCount + path] = level;
    }
  }

  return { positionsByStep };
}

export function walkMoments(values: ArrayLike<number>): WalkMoments {
  let mean = 0;
  for (let i = 0; i < values.length; i++) mean += values[i];
  mean /= values.length;
  let squaredDeviations = 0;
  for (let i = 0; i < values.length; i++) squaredDeviations += (values[i] - mean) ** 2;
  return { mean, variance: values.length > 1 ? squaredDeviations / (values.length - 1) : 0 };
}

export function histogram(values: ArrayLike<number>, binCount = 21): Histogram {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < values.length; i++) {
    min = Math.min(min, values[i]);
    max = Math.max(max, values[i]);
  }
  if (min === max) {
    return { bins: [{ center: min, count: values.length }], minimum: min, maximum: max };
  }
  const width = (max - min + 1) / binCount;
  const result = Array.from({ length: binCount }, (_, index) => ({
    center: min + (index + 0.5) * width,
    count: 0,
  }));
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const index = Math.min(binCount - 1, Math.floor((value - min) / width));
    result[index].count++;
  }
  return { bins: result, minimum: min, maximum: max };
}
