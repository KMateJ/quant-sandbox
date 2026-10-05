/// Arithmetic mean of `xs`. Throws on an empty array.
export function mean(xs: number[]): number {
  const n = xs.length;
  if (n === 0) throw new Error("mean: array must be non-empty");
  let sum = 0;
  for (let i = 0; i < n; i++) sum += xs[i];
  return sum / n;
}

/// Population variance (divisor N). Throws on an empty array.
export function variancePop(xs: number[]): number {
  const n = xs.length;
  if (n === 0) throw new Error("variancePop: array must be non-empty");
  const m = mean(xs);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const d = xs[i] - m;
    acc += d * d;
  }
  return acc / n;
}

/// Sample variance (Bessel-corrected, divisor N-1). Requires at least two values.
export function varianceSample(xs: number[]): number {
  const n = xs.length;
  if (n < 2) throw new Error("varianceSample: need at least two values");
  const m = mean(xs);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const d = xs[i] - m;
    acc += d * d;
  }
  return acc / (n - 1);
}

/// Sample standard deviation (sqrt of sample variance).
export function stdDev(xs: number[]): number {
  return Math.sqrt(varianceSample(xs));
}

/// Population standard deviation (sqrt of population variance).
export function stdDevPop(xs: number[]): number {
  return Math.sqrt(variancePop(xs));
}

/// Sample covariance (divisor N-1) between two equal-length series.
export function covariance(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 2 || ys.length !== n) {
    throw new Error("covariance: series must be equal length with at least two values");
  }
  const mx = mean(xs);
  const my = mean(ys);
  let acc = 0;
  for (let i = 0; i < n; i++) acc += (xs[i] - mx) * (ys[i] - my);
  return acc / (n - 1);
}

/// Pearson correlation coefficient in [-1, 1]. Returns 0 if either series has zero variance.
export function correlation(xs: number[], ys: number[]): number {
  const sx = stdDev(xs);
  const sy = stdDev(ys);
  if (sx === 0 || sy === 0) return 0;
  return covariance(xs, ys) / (sx * sy);
}

/// Sample covariance matrix for `k` asset return series (each an equal-length array).
/// Returns a symmetric k×k matrix with variances on the diagonal.
export function covarianceMatrix(series: number[][]): number[][] {
  const k = series.length;
  if (k === 0) throw new Error("covarianceMatrix: need at least one series");
  const out: number[][] = Array.from({ length: k }, () => new Array<number>(k));
  for (let i = 0; i < k; i++) {
    out[i][i] = varianceSample(series[i]);
    for (let j = i + 1; j < k; j++) {
      const c = covariance(series[i], series[j]);
      out[i][j] = c;
      out[j][i] = c;
    }
  }
  return out;
}

/// Sample correlation matrix for `k` asset return series. Diagonal entries are 1.
export function correlationMatrix(series: number[][]): number[][] {
  const k = series.length;
  if (k === 0) throw new Error("correlationMatrix: need at least one series");
  const out: number[][] = Array.from({ length: k }, () => new Array<number>(k));
  for (let i = 0; i < k; i++) {
    out[i][i] = 1;
    for (let j = i + 1; j < k; j++) {
      const c = correlation(series[i], series[j]);
      out[i][j] = c;
      out[j][i] = c;
    }
  }
  return out;
}
