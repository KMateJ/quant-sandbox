import { useMemo, useState } from "react";
import type {
  ScatterAnnotation,
  ScatterBand,
  ScatterSeries,
  ChartReferenceLine,
} from "../../components/charts";
import { useI18n } from "../../i18n";
import {
  bondPrice,
  priceYieldCurve,
  durationApproxCurve,
  durationConvexityApproxCurve,
} from "./bondPricing.math";
import { BOND_COLORS } from "./bondColors";

export type PriceYieldProps = {
  face: number;
  coupon: number;
  years: number;
  freq: number;
  ytm: number;
  price: number;
  modified: number;
  convexity: number;
  maxYtm: number;
  onYtm: (v: number) => void;
};

/// Price–yield curve with a draggable current point, soft hover halo, faint
/// premium/discount regions and optional duration / convexity approximation overlays.
export function usePriceYieldExplorer({
  face,
  coupon,
  years,
  freq,
  ytm,
  price,
  modified,
  convexity,
  maxYtm,
}: PriceYieldProps) {
  const { t } = useI18n();
  const [showDuration, setShowDuration] = useState(false);
  const [showConvexity, setShowConvexity] = useState(false);

  const curve = useMemo(
    () => priceYieldCurve(face, coupon, years, freq, maxYtm, 80),
    [face, coupon, years, freq, maxYtm]
  );

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const num = (v: number) => v.toFixed(2);
  const yTop = bondPrice(face, coupon, 0.001, years, freq);
  const yMax = yTop * 1.05;

  const durCurve = useMemo(
    () =>
      showDuration
        ? durationApproxCurve(price, modified, ytm, maxYtm, 60).filter((p) => p.price >= 0 && p.price <= yMax)
        : [],
    [showDuration, price, modified, ytm, maxYtm, yMax]
  );
  const convCurve = useMemo(
    () =>
      showConvexity
        ? durationConvexityApproxCurve(price, modified, convexity, ytm, maxYtm, 60).filter(
            (p) => p.price >= 0 && p.price <= yMax
          )
        : [],
    [showConvexity, price, modified, convexity, ytm, maxYtm, yMax]
  );

  const tooltipRows = [
    { label: t("bondMetricYtm"), value: pct(ytm) },
    { label: t("bondPyPriceAxis"), value: num(price) },
  ];

  const series: ScatterSeries[] = [
    {
      key: "halo",
      label: t("bondPyCurrent"),
      color: BOND_COLORS.current,
      radius: 15,
      opacity: 0.16,
      legend: false,
      points: [{ x: ytm, y: price, label: t("bondPyCurrent"), tooltipRows }],
    },
    {
      key: "curve",
      label: t("bondPyCurve"),
      color: BOND_COLORS.curve,
      strokeWidth: 2.5,
      line: true,
      legend: false,
      points: curve.map((p) => ({ x: p.ytm, y: p.price })),
    },
    ...(showDuration
      ? [
          {
            key: "dur",
            label: t("bondPyDuration"),
            color: BOND_COLORS.durationApprox,
            line: true,
            dash: "7 4",
            strokeWidth: 1.8,
            legend: false,
            points: durCurve.map((p) => ({ x: p.ytm, y: p.price })),
          } as ScatterSeries,
        ]
      : []),
    ...(showConvexity
      ? [
          {
            key: "conv",
            label: t("bondPyConvexity"),
            color: BOND_COLORS.convexityApprox,
            line: true,
            dash: "2 4",
            strokeWidth: 1.8,
            legend: false,
            points: convCurve.map((p) => ({ x: p.ytm, y: p.price })),
          } as ScatterSeries,
        ]
      : []),
    {
      key: "par",
      label: t("bondPyPar"),
      color: BOND_COLORS.par,
      radius: 6,
      hollow: true,
      legend: false,
      points: [{ x: coupon, y: face, label: t("bondPyPar") }],
    },
    {
      key: "current",
      label: t("bondPyCurrent"),
      color: BOND_COLORS.current,
      radius: 7,
      draggable: true,
      legend: false,
      points: [{ x: ytm, y: price, label: t("bondPyCurrent"), tooltipRows }],
    },
  ];

  const bands: ScatterBand[] = [
    { from: 0, to: coupon, color: "#22c55e", opacity: 0.05, label: t("bondPyPremium"), labelColor: "#22c55e" },
    { from: coupon, to: maxYtm, color: "#ef4444", opacity: 0.045, label: t("bondPyDiscount"), labelColor: "#ef4444" },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: ytm, color: BOND_COLORS.current, dash: "4 4" },
    { axis: "y", value: price, color: BOND_COLORS.current, dash: "4 4" },
    { axis: "y", value: face, color: BOND_COLORS.par, dash: "2 4" },
  ];

  // Keep the two point labels apart: place the current label on the side away from
  // par, and push them further apart when the bond sits close to par.
  const curRight = ytm >= coupon;
  const near = Math.abs(ytm - coupon) < maxYtm * 0.07 && Math.abs(price - face) < yMax * 0.07;
  const sep = near ? 10 : 0;
  const annotations: ScatterAnnotation[] = [
    {
      x: ytm,
      y: price,
      text: t("bondPyCurrent"),
      color: BOND_COLORS.current,
      dx: curRight ? 10 : -10,
      dy: -10 - sep,
      anchor: curRight ? "start" : "end",
    },
    {
      x: coupon,
      y: face,
      text: t("bondPyPar"),
      color: BOND_COLORS.par,
      dx: curRight ? -8 : 8,
      dy: 18 + sep,
      anchor: curRight ? "end" : "start",
    },
  ];

  return { series, bands, referenceLines, annotations, yMax, showDuration, setShowDuration, showConvexity, setShowConvexity };
}
