/// One histogram bin: the half-open interval [x0, x1) and how many values fell into it
/// (the last bin also takes values equal to its upper edge).
export type Bin = { x0: number; x1: number; count: number };

/// Empty, equal-width bins covering `domain`.
export function makeBins(domain: [number, number], binCount: number): Bin[] {
  const [lo, hi] = domain;
  const width = (hi - lo) / binCount;
  return Array.from({ length: binCount }, (_, i) => ({ x0: lo + i * width, x1: lo + (i + 1) * width, count: 0 }));
}

/// Index of the bin that `value` falls into, or −1 when it lies outside the bins.
export function binIndexOf(bins: Bin[], value: number): number {
  if (bins.length === 0 || !Number.isFinite(value)) return -1;
  const lo = bins[0].x0;
  const hi = bins[bins.length - 1].x1;
  if (value < lo || value > hi) return -1;
  if (value === hi) return bins.length - 1;
  return Math.min(bins.length - 1, Math.floor(((value - lo) / (hi - lo)) * bins.length));
}

/// Adds one value to `bins` in place; returns its bin index, or −1 if it fell outside.
export function addToBins(bins: Bin[], value: number): number {
  const i = binIndexOf(bins, value);
  if (i >= 0) bins[i].count += 1;
  return i;
}

/// Equal-width bins over `domain`, plus the number of values below and above it.
export function binValues(values: ArrayLike<number>, domain: [number, number], binCount: number) {
  const bins = makeBins(domain, binCount);
  let below = 0;
  let above = 0;
  for (let k = 0; k < values.length; k++) {
    const v = values[k];
    if (addToBins(bins, v) >= 0) continue;
    if (v < domain[0]) below++;
    else if (v > domain[1]) above++;
  }
  return { bins, below, above };
}

/// Density per bin, count / (total · width), so the bars integrate to the share of values inside the bins.
/// `total` defaults to the values inside the bins; pass the full sample size to account for values outside.
export function binDensity(bins: Bin[], total = bins.reduce((s, b) => s + b.count, 0)): number[] {
  return bins.map((b) => (total > 0 ? b.count / (total * (b.x1 - b.x0)) : 0));
}
