import { SERIES_PALETTE, type ChartReferenceLine, type ScatterSeries } from "../../../components/charts";
import type { TranslationKey } from "../../../i18n";
import { evalPiecewise, legPayoff, portfolioPayoff } from "./replication.math";
import { legLabel } from "./replication.labels";
import type { PiecewiseLinear, ReplicationPortfolio } from "./replication.types";

type Translate = (key: TranslationKey, options?: Record<string, string | number>) => string;

/// Colour of the i-th leg; shared by chart lines and table swatches.
export const legColor = (i: number) => SERIES_PALETTE[(i + 1) % SERIES_PALETTE.length];

/// Breakpoints of a piecewise-linear curve inside [0, xMax], plus the right edge.
export function curveXs(pw: PiecewiseLinear, xMax: number): number[] {
  return [...pw.xs.filter((x) => x < xMax), xMax];
}

export function targetSeries(pw: PiecewiseLinear, xMax: number, label: string, faint = false): ScatterSeries {
  return {
    key: "target",
    label,
    color: SERIES_PALETTE[0],
    points: curveXs(pw, xMax).map((x) => ({ x, y: evalPiecewise(pw, x) })),
    line: true,
    strokeWidth: faint ? 6 : 3,
    opacity: faint ? 0.25 : 1,
  };
}

/// One dashed line per leg; each is linear with at most one kink at its strike.
export function legSeries(p: ReplicationPortfolio, xMax: number, t: Translate): ScatterSeries[] {
  return p.legs.map((leg, i) => {
    const xs = [0, ...(leg.strike && leg.strike < xMax && leg.kind !== "bond" ? [leg.strike] : []), xMax];
    return {
      key: `leg-${i}`,
      label: legLabel(leg, t),
      color: legColor(i),
      points: xs.map((x) => ({ x, y: legPayoff(leg, x) })),
      line: true,
      dash: "5 4",
      strokeWidth: 1.5,
      opacity: 0.85,
      legend: false,
    };
  });
}

/// Sum of all legs, evaluated at every strike so the kinks are exact.
export function sumSeries(p: ReplicationPortfolio, tradable: PiecewiseLinear, xMax: number, label: string): ScatterSeries {
  return {
    key: "sum",
    label,
    color: "var(--text)",
    points: curveXs(tradable, xMax).map((x) => ({ x, y: portfolioPayoff(p, x) })),
    line: true,
    dash: "2 3",
    strokeWidth: 2,
  };
}

/// Faint vertical markers at the option strikes of a portfolio.
export function strikeLines(p: ReplicationPortfolio): ChartReferenceLine[] {
  return p.legs
    .filter((l) => l.kind === "call" || l.kind === "put")
    .map((l) => ({ axis: "x" as const, value: l.strike ?? 0, color: "var(--border)", dash: "2 4" }));
}
