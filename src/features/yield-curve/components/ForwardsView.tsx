import { useState } from "react";
import { ChartContainer } from "../../../components/layout";
import type { ScatterSeries, ScatterBand } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import { MATURITY_LABELS } from "../presets";
import { forwardBetween, snapInterval } from "../yieldCurve.math";
import { pct2, YC_COLORS } from "../curveChartUtils";
import MaturityChart from "./MaturityChart";
import ForwardBrushLayer from "./ForwardBrushLayer";
import ForwardExplain from "./ForwardExplain";

type Props = { model: YieldCurveModel };

export default function ForwardsView({ model }: Props) {
  const { t } = useI18n();
  const { term } = model;
  const [start, setStart] = useState(5);
  const [end, setEnd] = useState(6);
  // The selects may pick the same maturity or a reversed pair; the interval is always two distinct, ordered nodes.
  const [lo, hi] = snapInterval(start, end, term.length);
  const setRange = (from: number, to: number) => { setStart(from); setEnd(to); };

  const zStart = term[lo]?.zero ?? 0;
  const zEnd = term[hi]?.zero ?? 0;
  const fwd = term[lo] && term[hi] ? forwardBetween(term[lo], term[hi]).fwd : 0;

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
        {pick(lo, (i) => setRange(i, hi), t("ycStart"))}
        {pick(hi, (i) => setRange(lo, i), t("ycEnd"))}
        <div className="yc-forward-readout">
          <span><i style={{ background: YC_COLORS.zero }} />z({term[lo]?.label}) {pct2(zStart)}</span>
          <span><i style={{ background: YC_COLORS.zero }} />z({term[hi]?.label}) {pct2(zEnd)}</span>
          <span className="is-strong"><i style={{ background: YC_COLORS.forward }} />{term[lo]?.label}→{term[hi]?.label} {pct2(fwd)}</span>
        </div>
      </div>

      <ChartContainer title={t("ycZeroCurve")}>
        <div className="chart-wrap">
          <MaturityChart labels={MATURITY_LABELS} series={zeroSeries} yDomain={zDomain}
            yFormat={pct2} yLabel={t("ycYieldAxis")}
            layer={(frame) => (
              <ForwardBrushLayer frame={frame} lo={lo} hi={hi} labels={MATURITY_LABELS}
                color={YC_COLORS.forward} onChange={setRange} />
            )} />
        </div>
        <p className="yc-hint">{t("ycFwdBrushHint")}</p>
        {term[lo] && term[hi] && <ForwardExplain start={term[lo]} end={term[hi]} />}
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
