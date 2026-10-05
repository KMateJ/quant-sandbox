import { ScatterChart } from "../../../components/charts";
import type {
  ChartReferenceLine,
  ScatterAnnotation,
  ScatterSeries,
} from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { smlEndpoints } from "../capm.math";
import { CAPM_COLORS, alphaColor } from "../capm.colors";

type Props = {
  riskFree: number;
  marketReturn: number;
  beta: number;
  actualReturn: number;
  required: number;
  premium: number;
  jensenAlpha: number;
  maxBeta: number;
  isMobile: boolean;
  onDrag: (x: number, y: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

/// Security market line with directly-labelled risk-free, market, CAPM and asset points
/// plus a draggable asset marker and a vertical alpha segment.
export default function SmlChart({
  riskFree,
  marketReturn,
  beta,
  actualReturn,
  required,
  premium,
  jensenAlpha,
  maxBeta,
  isMobile,
  onDrag,
}: Props) {
  const { t } = useI18n();
  const accent = alphaColor(jensenAlpha);

  const endpoints = smlEndpoints(riskFree, marketReturn, maxBeta);
  const smlTop = endpoints[1].y;
  const top = Math.max(actualReturn, required, marketReturn, riskFree, smlTop) * 1.1;
  const yDomain: [number, number] = [Math.min(riskFree, 0), top];

  const series: ScatterSeries[] = [
    {
      key: "sml",
      label: t("capmSmlLabel"),
      color: CAPM_COLORS.sml,
      line: true,
      strokeWidth: 2.5,
      points: endpoints,
    },
    {
      key: "alpha",
      label: t("capmAlpha"),
      color: accent,
      line: true,
      strokeWidth: 2,
      dash: "4 3",
      legend: false,
      points: [
        { x: beta, y: required },
        { x: beta, y: actualReturn },
      ],
    },
    {
      key: "rf",
      label: t("capmRiskFreePoint"),
      color: CAPM_COLORS.riskFree,
      radius: 6,
      points: [{ x: 0, y: riskFree, label: t("capmRiskFreePoint") }],
    },
    {
      key: "market",
      label: t("capmMarketPoint"),
      color: CAPM_COLORS.market,
      radius: 7,
      points: [{ x: 1, y: marketReturn, label: t("capmMarketPoint") }],
    },
    {
      key: "capm",
      label: t("capmCapmPoint"),
      color: CAPM_COLORS.capmPoint,
      radius: 6,
      points: [{ x: beta, y: required, label: t("capmCapmPoint") }],
    },
    {
      key: "asset",
      label: t("capmSelectedPoint"),
      color: accent,
      radius: 8,
      draggable: true,
      points: [{ x: beta, y: actualReturn, label: t("capmSelectedPoint") }],
    },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: 0, color: CAPM_COLORS.guide, dash: "2 4" },
    { axis: "x", value: 1, color: CAPM_COLORS.market, dash: "5 4", width: 1.25 },
    { axis: "x", value: beta, color: CAPM_COLORS.guide, dash: "1 4" },
  ];

  const annotations: ScatterAnnotation[] = [
    { x: 0, y: riskFree, text: `${t("capmRiskFreePoint")} ${pct(riskFree)}`, anchor: "start", dx: 10, dy: -8, color: CAPM_COLORS.riskFree },
    { x: 1, y: marketReturn, text: `${t("capmMarketPoint")} · β=1`, anchor: "middle", dx: 0, dy: -12, color: CAPM_COLORS.market },
    { x: beta, y: (actualReturn + required) / 2, text: `α ${signed(jensenAlpha)}`, anchor: "start", dx: 12, dy: 4, color: accent },
    { x: maxBeta, y: smlTop, text: `${t("capmPremium")} ${pct(premium)}`, anchor: "end", dx: -8, dy: -10, color: CAPM_COLORS.sml },
  ];

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
      onDrag={onDrag}
    />
  );
}
