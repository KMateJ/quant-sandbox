import { simulateBrownian } from "./brownianFundamentals.math";

/// Finest partition of the single fine path; every coarser n = 2^k divides it.
export const QV_STEPS = 16384;
export const QV_MAX_K = 12;
/// Nested zoom windows have widths 1, 1/4, 1/16, 1/64.
export const ZOOM_WIDTHS = [1, 1 / 4, 1 / 16, 1 / 64];

export type PartitionRow = { k: number; n: number; qv: number; tv: number };

/// One Brownian path on [0, T] with `QV_STEPS` increments.
export function finePath(seed: number, T: number): Float64Array {
  const unit = simulateBrownian(seed, 1, QV_STEPS).values;
  const k = Math.sqrt(T);
  return unit.map((v) => v * k);
}

/// Σ(ΔW)² and Σ|ΔW| over the uniform partition of the path into n pieces.
export function partitionSums(path: Float64Array, n: number): { qv: number; tv: number } {
  const stride = (path.length - 1) / n;
  let qv = 0;
  let tv = 0;
  for (let i = 0; i < n; i++) {
    const d = path[(i + 1) * stride] - path[i * stride];
    qv += d * d;
    tv += Math.abs(d);
  }
  return { qv, tv };
}

/// The sums for every n = 2^k, k = 1…QV_MAX_K.
export function partitionTable(path: Float64Array): PartitionRow[] {
  return Array.from({ length: QV_MAX_K }, (_, i) => {
    const k = i + 1;
    const n = 2 ** k;
    return { k, n, ...partitionSums(path, n) };
  });
}

/// Mean ± z standard deviations of Σ(ΔW)²: T and T√(2/n) per unit z.
export const qvBand = (n: number, T: number, z = 2) => ({ lo: T - z * T * Math.sqrt(2 / n), hi: T + z * T * Math.sqrt(2 / n) });

/// Expected Σ|ΔW| = √(2nT/π): it grows without bound, so the total variation is infinite.
export const expectedAbsSum = (n: number, T: number) => Math.sqrt((2 * n * T) / Math.PI);

/// Window of the path of relative width w, rescaled to the unit square: (W(a + uw) − W(a))/√(wT) at u ∈ [0, 1].
/// Windows are nested around 40% of the path so each is a magnified part of the previous one.
export function zoomWindow(path: Float64Array, T: number, w: number): { x: number; y: number }[] {
  const last = path.length - 1;
  const first = Math.round(0.4 * (1 - w) * last);
  const len = Math.round(w * last);
  const scale = Math.sqrt(w * T);
  return Array.from({ length: len + 1 }, (_, i) => ({ x: i / len, y: (path[first + i] - path[first]) / scale }));
}
