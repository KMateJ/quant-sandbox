import type { ChartDatum } from "../../components/charts";

export type RandomWalkResult = {
  data: ChartDatum[];
  positionsByStep: Int16Array;
  /// How many of the simulated paths are drawn as trajectories.
  renderedPaths: number;
};

export type WalkMoments = {
  mean: number;
  variance: number;
};

export type HistogramBin = {
  center: number;
  count: number;
};

export type Histogram = {
  bins: HistogramBin[];
  minimum: number;
  maximum: number;
};
