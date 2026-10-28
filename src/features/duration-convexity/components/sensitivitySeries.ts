import type { ScatterSeries } from "../../../components/charts";
import type { TranslationKey } from "../../../i18n";
import type { PriceChangePoint } from "../durationConvexity.types";

/// The equal-duration twin: its exact price change at each Δy of the curve.
export function twinSeries(curve: PriceChangePoint[], pct: (dyBp: number) => number, label: string): ScatterSeries {
  return {
    key: "twin",
    label,
    color: TWIN,
    line: true,
    strokeWidth: 2.4,
    points: curve.map((d) => ({ x: d.dyBp, y: pct(d.dyBp) })),
  };
}

export const EXACT = "#22c55e";
export const DURATION = "#38bdf8";
export const DURCONVEX = "#f59e0b";
export const GUESS = "#f472b6";
export const TWIN = "#a78bfa";

/// The three price-change curves against Δy: exact repricing (first, the one that gets pinned),
/// the duration tangent and the duration-plus-convexity parabola.
export function sensitivitySeries(curve: PriceChangePoint[], t: (key: TranslationKey) => string): ScatterSeries[] {
  return [
    {
      key: "exact",
      intuitionSectionId: "exact-repricing",
      label: t("dcExactLabel"),
      color: EXACT,
      line: true,
      strokeWidth: 2.8,
      points: curve.map((d) => ({ x: d.dyBp, y: d.exact })),
    },
    {
      key: "duration",
      intuitionSectionId: "modified-duration",
      label: t("dcDurationLabel"),
      color: DURATION,
      line: true,
      strokeWidth: 2,
      dash: "6 5",
      points: curve.map((d) => ({ x: d.dyBp, y: d.duration })),
    },
    {
      key: "durConvex",
      intuitionSectionId: "convexity",
      label: t("dcDurConvexLabel"),
      color: DURCONVEX,
      line: true,
      strokeWidth: 2.2,
      dash: "2 3",
      points: curve.map((d) => ({ x: d.dyBp, y: d.durConvex })),
    },
  ];
}
