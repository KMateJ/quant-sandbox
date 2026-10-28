import { asTotalSpread } from "../../lib/market/quotes";
import { asOffset } from "./asSim.math";
import type { AsParams, Policy } from "./avellanedaStoikov.types";

/// Inventory grid of the policy sketch.
export const POLICY_QS = Array.from({ length: 21 }, (_, i) => i - 10);
/// Smallest gap to AS's offsets (at some q) that makes a drawn policy count as your own in the challenge.
export const MIN_DIFF = 0.1;

export type SketchPoint = { x: number; y: number };

/// AS's reservation offsets at time t on the sketch grid.
export const asCurve = (gamma: number, t: number, p: AsParams): SketchPoint[] => POLICY_QS.map((q) => ({ x: q, y: asOffset(q, t, gamma, p) }));

/// A flat curve: the symmetric maker.
export const flatCurve = (): SketchPoint[] => POLICY_QS.map((q) => ({ x: q, y: 0 }));

/// AS's average half-spread over the day, (γσ²·T/2 + (2/γ)ln(1 + γ/k)) / 2, rounded to the stepper.
export const asMeanHalfSpread = (gamma: number, p: AsParams) => Math.round((asTotalSpread(gamma, p.sigma, p.k, p.T / 2) / 2) * 20) / 20;

/// The drawn policy from sketch points (gaps fall back to 0).
export function drawnPolicy(points: SketchPoint[], halfSpread: number): Policy {
  return { kind: "drawn", qs: POLICY_QS, offsets: POLICY_QS.map((q) => points.find((pt) => pt.x === q)?.y ?? 0), halfSpread };
}

/// Largest gap between the drawn offsets and AS's offsets at the open.
export function gapToAs(points: SketchPoint[], gamma: number, p: AsParams): number {
  const as = asCurve(gamma, 0, p);
  return Math.max(...POLICY_QS.map((q, i) => Math.abs((points.find((pt) => pt.x === q)?.y ?? 0) - as[i].y)));
}
