import type { ScatterSeries } from "../../components/charts";
import type { TermPoint } from "./yieldCurve.types";
import { YC_COLORS, type RepKey } from "./curveChartUtils";

const REP_COLOR: Record<RepKey, string> = {
  par: YC_COLORS.par,
  zero: YC_COLORS.zero,
  forward: YC_COLORS.forward,
};

function repValue(p: TermPoint, rep: RepKey): number {
  return rep === "par" ? p.par : rep === "zero" ? p.zero : p.fwd;
}

/// Build the scatter series for the Curve view. The active representation is a bold,
/// marked (optionally draggable) line; comparison reps are subtle context lines.
export function buildRateSeries(
  term: TermPoint[],
  active: RepKey,
  compare: boolean,
  draggable: boolean,
  labels: Record<RepKey, string>
): ScatterSeries[] {
  const reps: RepKey[] = ["par", "zero", "forward"];
  const series: ScatterSeries[] = [];

  if (compare) {
    for (const rep of reps) {
      if (rep === active) continue;
      series.push({
        key: `cmp-${rep}`,
        label: labels[rep],
        color: REP_COLOR[rep],
        line: true,
        strokeWidth: 1.4,
        dash: "4 4",
        opacity: 0.4,
        legend: true,
        points: term.map((p, i) => ({ x: i, y: repValue(p, rep) })),
      });
    }
  }

  series.push({
    key: active,
    label: labels[active],
    color: REP_COLOR[active],
    line: true,
    strokeWidth: 2.8,
    legend: true,
    points: term.map((p, i) => ({ x: i, y: repValue(p, active) })),
  });
  series.push({
    key: `${active}-nodes`,
    label: labels[active],
    color: REP_COLOR[active],
    radius: 6,
    draggable,
    legend: false,
    points: term.map((p, i) => ({
      x: i,
      y: repValue(p, active),
      label: p.label,
    })),
  });

  return series;
}

/// Discount-factor representation of the same curve (monotonically declining).
export function buildDfSeries(term: TermPoint[], label: string): ScatterSeries[] {
  return [
    {
      key: "df",
      label,
      color: YC_COLORS.df,
      line: true,
      strokeWidth: 2.8,
      legend: true,
      points: term.map((p, i) => ({ x: i, y: p.df })),
    },
    {
      key: "df-nodes",
      label,
      color: YC_COLORS.df,
      radius: 6,
      legend: false,
      points: term.map((p, i) => ({ x: i, y: p.df, label: p.label })),
    },
  ];
}
