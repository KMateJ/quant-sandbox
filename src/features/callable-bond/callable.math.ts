import { callSchedule, callablePriceAt, effectiveRisk, expectedRedemption, negativeConvexityRanges, straightPriceAt, yieldToWorst, type CallableSpec } from "../../lib/finance/callable";
import { Y_MAX, Y_MIN } from "./callable.url";

const POINTS = 57;
/// Yield grid of the price–yield chart.
export const YIELD_GRID = Array.from({ length: POINTS }, (_, i) => Y_MIN + ((Y_MAX - Y_MIN) * i) / (POINTS - 1));

export type CurvePoint = { y: number; straight: number; callable: number };

/// Straight and callable prices over the chart's yield range.
export const priceCurve = (spec: CallableSpec): CurvePoint[] =>
  YIELD_GRID.map((y) => ({ y, straight: straightPriceAt(spec, y), callable: callablePriceAt(spec, y).callable }));

/// Everything the readout and timeline show at yield `y`.
export function labAt(spec: CallableSpec, y: number) {
  const { straight, callable, call } = callablePriceAt(spec, y);
  return {
    straight,
    callable,
    call,
    ...yieldToWorst(spec, callable),
    ...effectiveRisk(spec, y),
    schedule: callSchedule(spec, y),
    redemption: expectedRedemption(spec, y),
  };
}

export type CallableLab = ReturnType<typeof labAt>;

/// Yield ranges on the grid where effective convexity is negative.
export const negativeRanges = (spec: CallableSpec) => negativeConvexityRanges(spec, YIELD_GRID);

/// Price change (points and percent) of both bonds when the yield falls to `to`.
export function rallyOutcome(spec: CallableSpec, from: number, to: number) {
  const a = callablePriceAt(spec, from);
  const b = callablePriceAt(spec, to);
  return {
    straight: { points: b.straight - a.straight, pct: b.straight / a.straight - 1 },
    callable: { points: b.callable - a.callable, pct: b.callable / a.callable - 1 },
  };
}

/// Yield with the widest gap between the straight and callable curves.
export const widestGap = (curve: CurvePoint[]) =>
  curve.reduce((best, p) => (p.straight - p.callable > best.straight - best.callable ? p : best), curve[0]);
