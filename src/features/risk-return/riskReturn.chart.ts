import type {
  ScatterSeries,
  ScatterBand,
  ScatterAnnotation,
  ChartReferenceLine,
} from "../../components/charts";
import { allocationReturn, allocationVolatility, riskyAssetSharpe } from "./riskReturn.math";

/// Colour roles for the capital-allocation chart (kept in one place for consistency).
export const RR_COLORS = {
  cal: "#22c55e",
  calB: "#a78bfa",
  riskFree: "#38bdf8",
  risky: "#f59e0b",
  riskyB: "#a78bfa",
  current: "#f97316",
  guide: "#64748b",
  wOne: "#f59e0b",
} as const;

export type RiskAsset = { mu: number; sigma: number };

export type CalChartLabels = {
  cal: string;
  riskFree: string;
  risky: string;
  assetA: string;
  assetB: string;
  current: string;
  lending: string;
  leverage: string;
  slope: string;
};

export type CalChartInput = {
  asset: RiskAsset;
  riskFree: number;
  weight: number;
  maxWeight: number;
  assetB?: RiskAsset;
  labels: CalChartLabels;
};

export type CalChartModel = {
  series: ScatterSeries[];
  bands: ScatterBand[];
  annotations: ScatterAnnotation[];
  referenceLines: ChartReferenceLine[];
  xDomain: [number, number];
  yDomain: [number, number];
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Build every drawable object for the capital-allocation line from the current parameters.
export function buildCalChart(input: CalChartInput): CalChartModel {
  const { asset, riskFree, weight, maxWeight, assetB, labels } = input;
  const { mu, sigma } = asset;
  const compare = assetB != null;

  const portVol = allocationVolatility(sigma, weight);
  const portReturn = allocationReturn(mu, riskFree, weight);
  const sharpe = riskyAssetSharpe(mu, sigma, riskFree);

  const calEnd = { x: sigma * maxWeight, y: allocationReturn(mu, riskFree, maxWeight) };
  const calBEnd = assetB
    ? { x: assetB.sigma * maxWeight, y: allocationReturn(assetB.mu, riskFree, maxWeight) }
    : null;

  const xMax = Math.max(calEnd.x, calBEnd?.x ?? 0, sigma) * 1.08 || 0.01;
  const yMax = Math.max(calEnd.y, calBEnd?.y ?? 0, mu) * 1.1;
  const yMin = Math.min(0, riskFree);

  const assetALabel = compare ? labels.assetA : labels.risky;

  const series: ScatterSeries[] = [
    // Projection guides for the current portfolio (drawn under the markers).
    {
      key: "guide-v",
      label: "",
      color: RR_COLORS.guide,
      line: true,
      dash: "4 4",
      strokeWidth: 1,
      legend: false,
      points: [
        { x: portVol, y: yMin },
        { x: portVol, y: portReturn },
      ],
    },
    {
      key: "guide-h",
      label: "",
      color: RR_COLORS.guide,
      line: true,
      dash: "4 4",
      strokeWidth: 1,
      legend: false,
      points: [
        { x: 0, y: portReturn },
        { x: portVol, y: portReturn },
      ],
    },
    {
      key: "cal",
      label: compare ? `${labels.cal} · ${labels.assetA}` : labels.cal,
      color: RR_COLORS.cal,
      line: true,
      strokeWidth: 2.5,
      points: [{ x: 0, y: riskFree }, calEnd],
    },
  ];

  if (assetB && calBEnd) {
    series.push({
      key: "cal-b",
      label: `${labels.cal} · ${labels.assetB}`,
      color: RR_COLORS.calB,
      line: true,
      dash: "6 4",
      strokeWidth: 2,
      points: [{ x: 0, y: riskFree }, calBEnd],
    });
  }

  series.push(
    {
      key: "rf",
      label: labels.riskFree,
      color: RR_COLORS.riskFree,
      radius: 6,
      legend: false,
      points: [{ x: 0, y: riskFree, label: labels.riskFree }],
    },
    {
      key: "risky",
      label: assetALabel,
      color: RR_COLORS.risky,
      radius: 7,
      legend: false,
      points: [{ x: sigma, y: mu, label: assetALabel }],
    }
  );

  if (assetB) {
    series.push({
      key: "risky-b",
      label: labels.assetB,
      color: RR_COLORS.riskyB,
      radius: 7,
      legend: false,
      points: [{ x: assetB.sigma, y: assetB.mu, label: labels.assetB }],
    });
  }

  series.push({
    key: "current",
    label: labels.current,
    color: RR_COLORS.current,
    radius: 11,
    hollow: true,
    draggable: true,
    legend: false,
    points: [
      {
        x: portVol,
        y: portReturn,
        label: labels.current,
        tooltipRows: [
          { label: "w", value: `${(weight * 100).toFixed(0)}%` },
          { label: labels.slope, value: sharpe.toFixed(2) },
        ],
      },
    ],
  });

  const bands: ScatterBand[] = [
    { from: 0, to: sigma, color: RR_COLORS.cal, label: labels.lending, labelColor: "#4ade80", opacity: 0.05 },
    { from: sigma, to: xMax, color: RR_COLORS.risky, label: labels.leverage, labelColor: "#fbbf24", opacity: 0.05 },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: sigma, color: RR_COLORS.wOne, dash: "2 4", width: 1 },
  ];

  const annotations: ScatterAnnotation[] = [
    { x: 0, y: riskFree, text: `rf ${pct(riskFree)}`, color: "#7dd3fc", dx: 8, dy: 16 },
    { x: sigma, y: mu, text: assetALabel, color: "#fcd34d", dx: 10, dy: -8 },
    {
      x: calEnd.x * 0.55,
      y: allocationReturn(mu, riskFree, maxWeight * 0.55),
      text: `${labels.slope} = ${sharpe.toFixed(2)}`,
      color: "#86efac",
      dx: 8,
      dy: -8,
      fontSize: 11,
    },
    { x: portVol, y: portReturn, text: `w ${(weight * 100).toFixed(0)}%`, color: "#fdba74", dx: 12, dy: 20, fontSize: 11 },
  ];

  if (assetB) {
    annotations.push({ x: assetB.sigma, y: assetB.mu, text: labels.assetB, color: "#c4b5fd", dx: 10, dy: -8 });
  }

  return { series, bands, annotations, referenceLines, xDomain: [0, xMax], yDomain: [yMin, yMax] };
}
