/// Step laws offered in the CLT lesson; each is standardised to mean 0, variance 1.
export type StepDistribution = "coin" | "uniform" | "exponential";

export const STEP_DISTRIBUTIONS: StepDistribution[] = ["coin", "uniform", "exponential"];

/// Sum lengths n selectable for the histogram of Zₙ = Sₙ / √n.
export const CLT_LEVELS = [1, 2, 3, 5, 10, 30, 100] as const;

/// Denser grid of n for the convergence plot (a superset of `CLT_LEVELS`).
export const KS_LEVELS: readonly number[] = [1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 50, 70, 100];

export type StepMoments = {
  /// Skewness γ = E[X³] of the standardised step.
  skewness: number;
  /// Third absolute moment ρ = E|X|³, which drives the Berry–Esseen bound.
  thirdAbsolute: number;
};

export type SampleMoments = {
  mean: number;
  variance: number;
  skewness: number;
};

export type KsPoint = {
  n: number;
  /// Kolmogorov–Smirnov distance sup |Fₙ(x) − Φ(x)| of the sample.
  ks: number;
  /// Berry–Esseen upper bound C·ρ / √n on the true distance.
  bound: number;
};
