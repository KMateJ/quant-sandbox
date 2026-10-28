export type RandomWalkResult = {
  /// Step-major positions: `positionsByStep[step * pathCount + path]`.
  positionsByStep: Int16Array;
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
