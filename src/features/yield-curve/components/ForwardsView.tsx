import { useState } from "react";
import { ChartContainer } from "../../../components/layout";
import type { ScatterSeries, ScatterBand } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import { MATURITY_LABELS } from "../presets";
import { forwardRate } from "../yieldCurve.math";
import { pct2, YC_COLORS } from "../curveChartUtils";
import MaturityChart from "./MaturityChart";

type Props = { model: YieldCurveModel };

export default function ForwardsView({ model }: Props) {
  const { t } = useI18n();
  const { term } = model;
  const [start, setStart] = useState(5);
  const [end, setEnd] = useState(6);
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);

  const zStart = term[lo]?.zero ?? 0;
  const zEnd = term[hi]?.zero ?? 0;
  const fwd = forwardRate(term[lo]?.df ?? 1, term[hi]?.df ?? 1, (term[hi]?.t ?? 1) - (term[lo]?.t ?? 0));

  const band: ScatterBand[] = [{ from: lo, to: hi, color: YC_COLORS.forward, opacity: 0.12 }];

  const zeroSeries: ScatterSeries[] = [
    { key: "zero", label: t("ycZeroRate"), color: YC_COLORS.zero, line: true, strokeWidth: 2.6, legend: true, points: term.map((p, i) => ({ x: i, y: p.zero })) },
    { key: "zero-pts", label: t("ycZeroRate"), color: YC_COLORS.zero, radius: 5, legend: false, points: [lo, hi].map((i) => ({ x: i, y: term[i]?.zero ?? 0, label: term[i]?.label })) },
  ];
  const fwdSeries: ScatterSeries[] = [
    { key: "fwd", label: t("ycForwardRate"), color: YC_COLORS.forward, line: true, strokeWidth: 2.6, legend: true, points: term.map((p, i) => ({ x: i, y: p.fwd })) },
    { key: "fwd-hit", label: t("ycForwardRate"), color: YC_COLORS.highlight, radius: 7, hollow: true, legend: false, points: term[hi] ? [{ x: hi, y: term[hi].fwd, label: term[hi].label }] : [] },
  ];

  const zVals = term.map((p) => p.zero);
  const fVals = term.map((p) => p.fwd);
  const zDomain: [number, number] = [Math.min(0, ...zVals), Math.max(...zVals) * 1.12];
  const fDomain: [number, number] = [Math.min(0, ...fVals), Math.max(...fVals) * 1.12];

  const pick = (value: number, onChange: (i: number) => void, label: string) => (
    <label className="yc-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {MATURITY_LABELS.map((l, i) => (
          <option key={l} value={i}>{l}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="module-main yc-forwards">
      <div className="yc-forward-bar">
        {pick(start, setStart, t("ycStart"))}
        {pick(end, setEnd, t("ycEnd"))}
        <div className="yc-forward-readout">
          <span><i style={{ background: YC_COLORS.zero }} />z({term[lo]?.label}) {pct2(zStart)}</span>
          <span><i style={{ background: YC_COLORS.zero }} />z({term[hi]?.label}) {pct2(zEnd)}</span>
          <span className="is-strong"><i style={{ background: YC_COLORS.forward }} />{term[lo]?.label}→{term[hi]?.label} {pct2(fwd)}</span>
        </div>
      </div>

      <ChartContainer title={t("ycZeroCurve")}>
        <div className="chart-wrap">
          <MaturityChart labels={MATURITY_LABELS} series={zeroSeries} yDomain={zDomain}
            yFormat={pct2} yLabel={t("ycYieldAxis")} bands={band}
            extraRefs={[{ axis: "x", value: hi, color: YC_COLORS.forward, dash: "4 4" }]} />
        </div>
      </ChartContainer>

      <ChartContainer title={t("ycImpliedForwardCurve")}>
        <div className="chart-wrap">
          <MaturityChart labels={MATURITY_LABELS} series={fwdSeries} yDomain={fDomain}
            yFormat={pct2} yLabel={t("ycYieldAxis")} bands={band}
            extraRefs={[{ axis: "x", value: hi, color: YC_COLORS.forward, dash: "4 4" }]} />
        </div>
      </ChartContainer>
      <p className="yc-hint">{t("ycForwardHint")}</p>
    </div>
  );
}
