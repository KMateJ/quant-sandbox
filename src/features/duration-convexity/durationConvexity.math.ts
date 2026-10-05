import { bondPrice, convexity, modifiedDuration } from "../../lib/finance/bond";
import type { DurationPoint } from "./durationConvexity.types";

export { bondPrice, convexity, modifiedDuration };

/// Actual price versus the duration-only and duration+convexity estimates across a yield band.
/// The band spans `ytm0 ± halfWidth`; estimates are anchored at the base yield `ytm0`.
export function approximationCurve(
  face: number,
  couponRate: number,
  ytm0: number,
  years: number,
  freq: number,
  halfWidth: number,
  steps: number
): DurationPoint[] {
  const p0 = bondPrice(face, couponRate, ytm0, years, freq);
  const dMod = modifiedDuration(face, couponRate, ytm0, years, freq);
  const cvx = convexity(face, couponRate, ytm0, years, freq);
  const points: DurationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ytm = ytm0 - halfWidth + (i / steps) * 2 * halfWidth;
    const dy = ytm - ytm0;
    points.push({
      ytm,
      actual: bondPrice(face, couponRate, Math.max(ytm, 1e-6), years, freq),
      duration: p0 * (1 - dMod * dy),
      durConvex: p0 * (1 - dMod * dy + 0.5 * cvx * dy * dy),
    });
  }
  return points;
}
