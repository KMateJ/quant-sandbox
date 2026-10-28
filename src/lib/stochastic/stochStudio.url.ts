import { urlEnum, urlNumber, urlString } from "../urlState";
import { STEP_DISTRIBUTIONS } from "./clt.types";
import { PG_MONITORING_STEPS } from "./pathGeometry.types";
import { RANDOM_WALK_MAX_PATHS, RANDOM_WALK_MAX_STEPS } from "./stochasticModels.math";

// Query-string state of the stochastic lessons, so an experiment can be linked. The lesson itself is the path
// (`/random-walk/<id>`, `/brownian-motion/<id>`); each schema below belongs to one lesson's Explore tab.

const seed = urlNumber(7, 1, 9999, 0);

/// Fields shared by the Chapter 2 lessons: sample size, seed and the window s < t.
const brownian = (paths: number) => ({
  paths: urlNumber(paths, 50, 3000, 0),
  seed,
  s: urlNumber(0.3, 0.05, 0.95, 2),
  t: urlNumber(0.7, 0.1, 1, 2),
});

/// Fields shared by the Chapter 3 lessons: sample size and seed.
const geometry = (paths: number, maxPaths = 3000) => ({ paths: urlNumber(paths, 100, maxPaths, 0), seed });

/// Active tab of a lesson (empty = the first tab).
export const LESSON_URL_SCHEMA = { tab: urlString("") };

export const CLT_URL_SCHEMA = {
  dist: urlEnum(STEP_DISTRIBUTIONS, "exponential"),
  n: urlNumber(1, 1, 100, 0),
  samples: urlNumber(5000, 1000, 20000, 0),
  seed,
};

export const SQRT_URL_SCHEMA = {
  steps: urlNumber(250, 50, RANDOM_WALK_MAX_STEPS, 0),
  paths: urlNumber(5, 2, RANDOM_WALK_MAX_PATHS, 0),
  seed,
  scale: urlEnum(["linear", "loglog"] as const, "linear"),
  k: urlNumber(4, 2, 16, 0),
};

export const INCREMENT_URL_SCHEMA = brownian(400);

export const COVARIANCE_URL_SCHEMA = {
  ...brownian(1500),
  joint: urlEnum(["levels", "increments"] as const, "levels"),
};

export const RUNNING_MAX_URL_SCHEMA = geometry(1000);

export const REFLECTION_URL_SCHEMA = { ...geometry(2000), a: urlNumber(1, 0.2, 2.5, 2) };

export const FIRST_PASSAGE_URL_SCHEMA = { ...geometry(1500), a: urlNumber(0.5, 0.2, 2.5, 2) };

export const HITTING_URL_SCHEMA = {
  ...geometry(1000, 2000),
  a: urlNumber(1, 0.2, 2.5, 2),
  mu: urlNumber(0, -1, 1, 2),
  mon: urlNumber(PG_MONITORING_STEPS[1], PG_MONITORING_STEPS[0], PG_MONITORING_STEPS[PG_MONITORING_STEPS.length - 1], 0),
};

/// The listed value closest to `value` (snaps a linked number onto a discrete control).
export function nearestOf(values: readonly number[], value: number): number {
  return values.reduce((best, v) => (Math.abs(v - value) < Math.abs(best - value) ? v : best), values[0]);
}
