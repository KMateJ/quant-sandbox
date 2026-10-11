import { Panel, ChartContainer } from "../../../components/layout";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import TornadoChart from "./TornadoChart";
import SensitivityHeatmap from "./SensitivityHeatmap";
import { money, pct } from "../npvIrr.format";
import type { HeatmapAxis, ProjectModel, SensitivityVar } from "../npvIrr.types";
import type { NpvLab } from "../useNpvLab";

const AXES: HeatmapAxis[] = ["rate", "annual", "outlay", "years", "growth"];

type SensitivityTabProps = { lab: NpvLab };

/// Sensitivity analysis: a sortable tornado chart and an interactive 2-D NPV heatmap.
export default function SensitivityTab({ lab }: SensitivityTabProps) {
  const { t } = useI18n();
  const varLabel: Record<SensitivityVar | HeatmapAxis, string> = {
    annual: t("npvVarAnnual"),
    rate: t("npvVarRate"),
    outlay: t("npvVarOutlay"),
    years: t("npvVarYears"),
    growth: t("npvVarGrowth"),
  };
  const formatAxis = (axis: HeatmapAxis, v: number) =>
    axis === "rate" || axis === "growth" ? pct(v) : axis === "years" ? v.toFixed(0) : money(v);

  const axisPatch = (axis: HeatmapAxis, value: number): Partial<ProjectModel> => {
    switch (axis) {
      case "rate": return { rate: value };
      case "annual": return { annual: value };
      case "outlay": return { outlay: value };
      case "years": return { years: Math.max(1, Math.round(value)) };
      case "growth": return { growth: value, pattern: lab.model.pattern === "custom" ? "growing" : lab.model.pattern };
    }
  };
  const applyCell = (x: number, y: number) =>
    lab.updateModel({ ...axisPatch(lab.heatAxes.x, x), ...axisPatch(lab.heatAxes.y, y) });

  const axisSelect = (which: "x" | "y") => (
    <label className="npv-axis-select">
      <span>{which === "x" ? t("npvAxisX") : t("npvAxisY")}</span>
      <select
        value={lab.heatAxes[which]}
        onChange={(e) => lab.setHeatAxes({ ...lab.heatAxes, [which]: e.target.value as HeatmapAxis })}
      >
        {AXES.filter((a) => a === lab.heatAxes[which] || a !== lab.heatAxes[which === "x" ? "y" : "x"]).map((a) => (
          <option key={a} value={a}>{varLabel[a]}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="npv-sensitivity-tab">
      <Panel title={t("npvSensControls")}>
        <div className="npv-inputs">
          <div className="controls-grid">
            <SliderField label={t("npvSwingRange")} min={0.05} max={0.5} step={0.05} value={lab.sensRange} onChange={lab.setSensRange} formatValue={(v) => pct(v, 0)} />
          </div>
          <div className="npv-field-row">
            <span className="npv-field-label">{t("npvHeatmapAxes")}</span>
            <div className="npv-axis-grid">
              {axisSelect("x")}
              {axisSelect("y")}
            </div>
          </div>
        </div>
      </Panel>

      <div className="npv-sens-charts">
        <ChartContainer title={t("npvTornadoTitle")}>
          <div className="npv-tornado-wrap">
            <TornadoChart rows={lab.tornadoRows} baseNpv={lab.metrics.npv} labelFor={(v) => varLabel[v]} valueFormat={money} />
          </div>
          <p className="npv-chart-hint">{t("npvTornadoHint")}</p>
        </ChartContainer>

        <ChartContainer title={t("npvHeatmapTitle")}>
          <div className="npv-heatmap-wrap">
            <SensitivityHeatmap
              model={lab.model}
              xAxis={lab.heatAxes.x}
              yAxis={lab.heatAxes.y}
              onApply={applyCell}
              formatAxis={formatAxis}
              valueFormat={money}
            />
          </div>
          <p className="npv-chart-hint">{t("npvHeatmapHint")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
