import { resolveSweep, sweepChunk, type FragilityPoint, type SweepParams } from "../engine/fragility.math";

/// One worker message per degree: the page sends a request, the worker answers with `total` points in order.
export type FragilityRequest = { requestId: number; params: SweepParams };
export type FragilityResponse = { requestId: number; index: number; total: number; point: FragilityPoint };

/// The responses for a request, in degree order (the worker posts each as soon as it is computed).
export function* fragilityJob({ requestId, params }: FragilityRequest): Generator<FragilityResponse> {
  const { degrees } = resolveSweep(params);
  for (let index = 0; index < degrees.length; index++) {
    yield { requestId, index, total: degrees.length, point: sweepChunk(params, index) };
  }
}

/// The degree at which contagion is most likely; ties between neighbouring degrees give their average.
export function peakDegree(points: FragilityPoint[]): number {
  if (!points.length) return NaN;
  const best = Math.max(...points.map((p) => p.pContagion));
  const top = points.filter((p) => p.pContagion >= best - 1e-9);
  return top.reduce((s, p) => s + p.degree, 0) / top.length;
}
