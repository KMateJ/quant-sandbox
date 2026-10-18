// An allocation is the full split of the portfolio: one share per asset, then cash last; it always sums to 1.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/// Equal split across `nAssets` risky assets, no cash.
export function equalAllocation(nAssets: number): number[] {
  return [...Array.from({ length: nAssets }, () => 1 / nAssets), 0];
}

/// Set share `k` to `value` (clamped to [0, 1]); every other share is rescaled proportionally so the total stays 1.
/// When all the others are zero, the remainder is spread over them equally.
export function setShareProportional(alloc: number[], k: number, value: number): number[] {
  const v = clamp01(value);
  const othersSum = alloc.reduce((acc, w, i) => (i === k ? acc : acc + w), 0);
  const rest = 1 - v;
  const othersCount = alloc.length - 1;
  return alloc.map((w, i) => {
    if (i === k) return v;
    if (othersSum > 1e-12) return (w / othersSum) * rest;
    return othersCount > 0 ? rest / othersCount : 0;
  });
}

/// Allocation from a target risky mix (negatives clipped, renormalised) scaled to leave `cash` in cash.
export function allocationFrom(riskyWeights: number[], cash: number): number[] {
  const c = clamp01(cash);
  const clipped = riskyWeights.map(clamp01);
  const sum = clipped.reduce((a, b) => a + b, 0);
  const mix = sum > 1e-12 ? clipped.map((w) => w / sum) : clipped.map(() => 1 / clipped.length);
  return [...mix.map((w) => w * (1 - c)), c];
}

/// Rescale non-negative shares to sum to 1 (equal split when they are all zero).
function renormalize(alloc: number[]): number[] {
  const sum = alloc.reduce((a, b) => a + b, 0);
  return sum > 1e-12 ? alloc.map((w) => w / sum) : alloc.map(() => 1 / alloc.length);
}

/// Drop risky asset `i` and renormalise what is left.
export function removeShare(alloc: number[], i: number): number[] {
  return renormalize(alloc.filter((_, j) => j !== i));
}

/// Fit an allocation to `nAssets` risky assets (+ cash): new assets enter at an equal 1/n share, taken
/// proportionally from the rest; surplus trailing assets are dropped. Returns `alloc` itself when it already fits.
export function resizeAllocation(alloc: number[], nAssets: number): number[] {
  if (alloc.length === nAssets + 1) return alloc;
  const cash = alloc[alloc.length - 1] ?? 0;
  const risky = alloc.slice(0, -1);
  if (risky.length > nAssets) return renormalize([...risky.slice(0, nAssets), cash]);
  let next = [...risky, ...new Array<number>(nAssets - risky.length).fill(0), cash];
  for (let i = risky.length; i < nAssets; i++) next = setShareProportional(next, i, 1 / nAssets);
  return next;
}

/// Compact URL form: percentages (one decimal) joined by "_"; the default equal split encodes as "".
export function encodeAllocation(alloc: number[]): string {
  const equal = equalAllocation(alloc.length - 1);
  if (alloc.every((w, i) => Math.abs(w - equal[i]) < 5e-4)) return "";
  return alloc.map((w) => String(Math.round(w * 1000) / 10)).join("_");
}

/// Parse the URL form for `nAssets` assets + cash; `null` when missing, malformed or sized for another universe.
export function decodeAllocation(raw: string, nAssets: number): number[] | null {
  if (!raw) return null;
  const parts = raw.split("_").map(Number);
  if (parts.length !== nAssets + 1 || parts.some((p) => !Number.isFinite(p) || p < 0)) return null;
  const sum = parts.reduce((a, b) => a + b, 0);
  return sum > 0 ? parts.map((p) => p / sum) : null;
}
