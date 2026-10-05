import { useMemo } from "react";
import { ScatterChart } from "../../../components/charts";
import type {
  ScatterAnnotation,
  ScatterBand,
  ScatterSeries,
  ChartReferenceLine,
} from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { bondPrice, priceYieldCurve } from "../bondPricing.math";

type Props = {
  face: number;
  coupon: number;
  years: number;
  freq: number;
  ytm: number;
  price: number;
  maxYtm: number;
  onYtm: (v: number) => void;
};

/// Price–yield curve with a draggable current point, a labelled par point and
/// shaded premium / discount regions.
export default function PriceYieldExplorer({
  face,
  coupon,
  years,
  freq,
  ytm,
  price,
  maxYtm,
  onYtm,
}: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const curve = useMemo(
    () => priceYieldCurve(face, coupon, years, freq, maxYtm, 80),
    [face, coupon, years, freq, maxYtm]
  );

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const num = (v: number) => v.toFixed(2);
  const yTop = bondPrice(face, coupon, 0.001, years, freq);

  const series: ScatterSeries[] = [
    {
      key: "curve",
      label: t("bondPyPriceAxis"),
      color: "#f59e0b",
      strokeWidth: 2.5,
      line: true,
      legend: false,
      points: curve.map((p) => ({ x: p.ytm, y: p.price })),
    },
    {
      key: "par",
      label: t("bondPyPar"),
      color: "#a78bfa",
      radius: 6,
      hollow: true,
      legend: false,
      points: [{ x: coupon, y: face, label: t("bondPyPar") }],
    },
    {
      key: "current",
      label: t("bondPyCurrent"),
      color: "#38bdf8",
      radius: 7,
      draggable: true,
      legend: false,
      points: [
        {
          x: ytm,
          y: price,
          label: t("bondPyCurrent"),
          tooltipRows: [
            { label: t("bondMetricYtm"), value: pct(ytm) },
            { label: t("bondPyPriceAxis"), value: num(price) },
          ],
        },
      ],
    },
  ];

  const bands: ScatterBand[] = [
    { from: 0, to: coupon, color: "#22c55e", opacity: 0.08, label: t("bondPyPremium"), labelColor: "#22c55e" },
    { from: coupon, to: maxYtm, color: "#ef4444", opacity: 0.07, label: t("bondPyDiscount"), labelColor: "#ef4444" },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: ytm, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: price, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: face, color: "#a78bfa", dash: "2 4" },
  ];

  const annotations: ScatterAnnotation[] = [
    { x: ytm, y: price, text: t("bondPyCurrent"), color: "#38bdf8", dx: 10, dy: -8, anchor: "start" },
    { x: coupon, y: face, text: t("bondPyPar"), color: "#a78bfa", dx: 8, dy: 16, anchor: "start" },
  ];

  return (
    <div className="bond-py">
      <ScatterChart
        series={series}
        xDomain={[0, maxYtm]}
        yDomain={[0, yTop * 1.05]}
        referenceLines={referenceLines}
        bands={bands}
        annotations={annotations}
        isMobile={isMobile}
        legend={false}
        xFormat={pct}
        yFormat={num}
        xLabel={t("bondPyYtmAxis")}
        yLabel={t("bondPyPriceAxis")}
        onDrag={(x) => onYtm(Math.min(maxYtm, Math.max(0.001, x)))}
      />
      <p className="bond-py-hint">{t("bondPyDragHint")}</p>
    </div>
  );
}
