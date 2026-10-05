import type { ScatterSeries } from "../../components/charts";
import type { TermPoint } from "./yieldCurve.types";
import { dfFromZero } from "./yieldCurve.math";
import { YC_COLORS } from "./curveChartUtils";

/// Interpolated zero rate at maturity `tau` from a solved term structure (flat ends).
function zeroAt(term: TermPoint[], tau: number): number {
  if (!term.length) return 0;
  if (tau <= term[0].t) return term[0].zero;
  const last = term[term.length - 1];
  if (tau >= last.t) return last.zero;
  for (let i = 1; i < term.length; i++) {
    if (tau <= term[i].t) {
      const a = term[i - 1];
      const b = term[i];
      const w = (tau - a.t) / (b.t - a.t);
      return a.zero + w * (b.zero - a.zero);
    }
  }
  return last.zero;
}

/// Sum of discount factors at the integer coupon dates strictly before maturity `T`,
/// i.e. the "known earlier discount factors" used to solve the next one.
export function couponDfSum(term: TermPoint[], T: number): number {
  let sum = 0;
  for (let k = 1; k < T; k++) sum += dfFromZero(zeroAt(term, k), k);
  return sum;
}

/// Instrument label for a maturity: money-market deposit vs coupon bond.
export function instrumentKind(t: number): "deposit" | "bond" {
  return t <= 1 ? "deposit" : "bond";
}

/// Scatter series for the Bootstrap view: full par quotes (subtle), the zero curve
/// revealed up to `step`, and a highlight marker on the instrument being solved.
export function buildBootstrapSeries(
  term: TermPoint[],
  step: number,
  parLabel: string,
  zeroLabel: string
): ScatterSeries[] {
  return [
    {
      key: "par",
      label: parLabel,
      color: YC_COLORS.par,
      line: true,
      strokeWidth: 1.6,
      dash: "4 4",
      opacity: 0.55,
      legend: true,
      points: term.map((p, i) => ({ x: i, y: p.par })),
    },
    {
      key: "zero",
      label: zeroLabel,
      color: YC_COLORS.zero,
      line: true,
      strokeWidth: 2.8,
      legend: true,
      points: term.slice(0, step + 1).map((p, i) => ({ x: i, y: p.zero })),
    },
    {
      key: "zero-nodes",
      label: zeroLabel,
      color: YC_COLORS.zero,
      radius: 5,
      legend: false,
      points: term.slice(0, step + 1).map((p, i) => ({ x: i, y: p.zero, label: p.label })),
    },
    {
      key: "solving",
      label: zeroLabel,
      color: YC_COLORS.highlight,
      radius: 8,
      hollow: true,
      legend: false,
      points: term[step] ? [{ x: step, y: term[step].zero, label: term[step].label }] : [],
    },
  ];
}
