import { useState } from "react";
import SliderField from "../../../components/SliderField";
import { ChartContainer, Panel } from "../../../components/layout";
import type { ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import type { Factors, FactorScenario } from "../yieldCurve.types";
import { MATURITY_LABELS } from "../presets";
import { factorContribution, scenarioDelta } from "../yieldCurve.math";
import { pct2, YC_COLORS } from "../curveChartUtils";
import MaturityChart from "./MaturityChart";

type Props = { model: YieldCurveModel };

const SCENARIOS: FactorScenario[] = ["parallel", "steepen", "flatten", "curvature"];

export default function FactorsView({ model }: Props) {
  const { t } = useI18n();
  const { nodes } = model;
  const [f, setF] = useState<Factors>({ level: 0, slope: 0, curvature: 0 });
  const [showContribution, setShowContribution] = useState(true);

  const result = nodes.map((node) => node.rate + factorContribution(node.t, f));
  const set = (key: keyof Factors) => (v: number) => setF((p) => ({ ...p, [key]: v }));
  const nudge = (id: FactorScenario) => {
    const d = scenarioDelta(id);
    setF((p) => ({
      level: p.level + d.level,
      slope: p.slope + d.slope,
      curvature: p.curvature + d.curvature,
    }));
  };
  const apply = () => {
    model.setAllRates(result.map((r) => Math.max(0, r)));
    setF({ level: 0, slope: 0, curvature: 0 });
  };

  const series: ScatterSeries[] = [
    {
      key: "baseline", label: t("ycBaseline"), color: YC_COLORS.baseline, line: true,
      strokeWidth: showContribution ? 1.6 : 2.6, dash: showContribution ? "4 4" : undefined,
      opacity: showContribution ? 0.6 : 1, legend: true,
      points: nodes.map((node, i) => ({ x: i, y: node.rate })),
    },
    {
      key: "result", label: t("ycResultingCurve"), color: YC_COLORS.zero, line: true,
      strokeWidth: 2.8, legend: true,
      points: result.map((r, i) => ({ x: i, y: r })),
    },
    {
      key: "result-pts", label: t("ycResultingCurve"), color: YC_COLORS.zero, radius: 5,
      legend: false, points: result.map((r, i) => ({ x: i, y: r, label: MATURITY_LABELS[i] })),
    },
  ];

  const vals = [...nodes.map((d) => d.rate), ...result];
  const yDomain: [number, number] = [Math.min(0, ...vals), Math.max(...vals) * 1.12];

  return (
    <div className="workspace cols-sidebar">
      <Panel title={t("ycFactorsTitle")}>
        <div className="yc-controls">
          <SliderField label={t("ycLevel")} min={-0.02} max={0.02} step={0.001} value={f.level} onChange={set("level")} formatValue={pct2} />
          <p className="yc-factor-note">{t("ycLevelNote")}</p>
          <SliderField label={t("ycSlope")} min={-0.02} max={0.02} step={0.001} value={f.slope} onChange={set("slope")} formatValue={pct2} />
          <p className="yc-factor-note">{t("ycSlopeNote")}</p>
          <SliderField label={t("ycCurvature")} min={-0.02} max={0.02} step={0.001} value={f.curvature} onChange={set("curvature")} formatValue={pct2} />
          <p className="yc-factor-note">{t("ycCurvatureNote")}</p>

          <label className="yc-check">
            <input type="checkbox" checked={showContribution} onChange={(e) => setShowContribution(e.target.checked)} />
            {t("ycShowContribution")}
          </label>

          <div className="yc-scenarios">
            {SCENARIOS.map((id) => (
              <button key={id} type="button" onClick={() => nudge(id)}>{t(`ycScenario_${id}`)}</button>
            ))}
          </div>
          <div className="yc-factor-actions">
            <button type="button" className="yc-apply" onClick={apply}>{t("ycApplyToCurve")}</button>
            <button type="button" onClick={() => setF({ level: 0, slope: 0, curvature: 0 })}>{t("ycReset")}</button>
          </div>
        </div>
      </Panel>

      <div className="module-main">
        <ChartContainer title={t("ycFactorChart")}>
          <div className="chart-wrap">
            <MaturityChart labels={MATURITY_LABELS} series={series} yDomain={yDomain} yFormat={pct2} yLabel={t("ycYieldAxis")} />
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
