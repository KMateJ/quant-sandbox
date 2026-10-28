/// Step counts n at which the typical spread of Sₙ is measured. Logarithmically
/// spaced so a power law sd ∼ nᵃ shows as a straight line on log–log axes.
export const SCALING_STEP_GRID = [4, 8, 16, 32, 64, 128, 256, 512, 1024] as const;

export type ScaleMode = "linear" | "loglog";

export type ScalingPoint = {
  n: number;
  /// Empirical standard deviation of Sₙ across the sampled walks.
  empirical: number;
};

export type ScalingResult = {
  points: ScalingPoint[];
  /// Slope of a least-squares fit of log(sd) on log(n); ≈ 1/2 for the walk.
  slope: number;
};
