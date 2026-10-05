import { ScatterChart } from "../../../components/charts";
import type {
  ChartReferenceLine,
  ScatterAnnotation,
  ScatterSeries,
} from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { smlEndpoints, type AssetRow } from "../capm.math";
import { CAPM_COLORS, alphaColor } from "../capm.colors";

type Props = {
  riskFree: number;
  marketReturn: number;
  rows: AssetRow[];
  maxBeta: number;
  isMobile: boolean;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

/// Cross-sectional view: every security as a point with a thin residual line to the SML.
export default function AssetsChart({ riskFree, marketReturn, rows, maxBeta, isMobile }: Props) {
  const { t } = useI18n();

  const top = Math.max(...rows.map((r) => Math.max(r.expectedReturn, r.capmReturn)), marketReturn) * 1.12;
  const yDomain: [number, number] = [Math.min(riskFree, 0), top];

  const residuals: ScatterSeries[] = rows.map((r) => ({
    key: `res-${r.name}`,
    label: r.name,
    color: alphaColor(r.alpha),
    line: true,
    strokeWidth: 1.25,
    dash: "3 3",
    opacity: 0.7,
    legend: false,
    points: [
      { x: r.beta, y: r.capmReturn },
      { x: r.beta, y: r.expectedReturn },
    ],
  }));

  const series: ScatterSeries[] = [
    {
      key: "sml",
      label: t("capmSmlLabel"),
      color: CAPM_COLORS.sml,
      line: true,
      strokeWidth: 2.5,
      points: smlEndpoints(riskFree, marketReturn, maxBeta),
    },
    ...residuals,
    {
      key: "assets",
      label: t("capmTabAssets"),
      color: CAPM_COLORS.capmPoint,
      radius: 6,
      points: rows.map((r) => ({
        x: r.beta,
        y: r.expectedReturn,
        label: r.name,
        color: alphaColor(r.alpha),
        tooltipRows: [
          { label: t("capmBetaLabel"), value: r.beta.toFixed(2) },
          { label: t("capmActualLabel"), value: pct(r.expectedReturn) },
          { label: t("capmExpectedReturn"), value: pct(r.capmReturn) },
          { label: t("capmAlpha"), value: signed(r.alpha), color: alphaColor(r.alpha) },
        ],
      })),
    },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: 1, color: CAPM_COLORS.market, dash: "5 4", width: 1.25 },
  ];

  const annotations: ScatterAnnotation[] = rows.map((r) => ({
    x: r.beta,
    y: r.expectedReturn,
    text: r.name,
    anchor: "middle",
    dx: 0,
    dy: r.alpha >= 0 ? -12 : 18,
    color: CAPM_COLORS.riskFree,
  }));

  return (
    <ScatterChart
      series={series}
      xDomain={[0, maxBeta]}
      yDomain={yDomain}
      referenceLines={referenceLines}
      annotations={annotations}
      isMobile={isMobile}
      xFormat={(v) => v.toFixed(2)}
      yFormat={pct}
      xLabel={t("capmBetaAxis")}
      yLabel={t("capmReturnAxis")}
    />
  );
}
