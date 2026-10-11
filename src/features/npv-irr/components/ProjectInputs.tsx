import SliderField from "../../../components/SliderField";
import { Tabs, type TabItem, InfoTooltip } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { money, pct } from "../npvIrr.format";
import type { CashflowPattern, ProjectModel } from "../npvIrr.types";
import { RATE_MAX } from "../useNpvLab";
import AdvancedInputs from "./AdvancedInputs";

type ProjectInputsProps = {
  model: ProjectModel;
  updateModel: (patch: Partial<ProjectModel>) => void;
  advanced: boolean;
  setAdvanced: (v: boolean) => void;
};

/// Left-hand parameter column: pattern, core sliders and the advanced disclosure.
export default function ProjectInputs({ model, updateModel, advanced, setAdvanced }: ProjectInputsProps) {
  const { t } = useI18n();
  const years = (v: number) => v.toFixed(0);

  const patternTabs: TabItem<CashflowPattern>[] = [
    { id: "constant", label: t("npvPatternConstant") },
    { id: "growing", label: t("npvPatternGrowing") },
    { id: "custom", label: t("npvPatternCustom") },
  ];

  return (
    <div className="npv-inputs">
      <div className="npv-field-row">
        <span className="npv-field-label">
          {t("npvPatternLabel")}
          <InfoTooltip content={t("npvInfoPattern")} />
        </span>
        <Tabs segmented items={patternTabs} value={model.pattern} onChange={(id) => updateModel({ pattern: id })} ariaLabel={t("npvPatternLabel")} />
      </div>

      <div className="controls-grid">
        <SliderField label={t("npvOutlayLabel")} min={100} max={10000} step={50} value={model.outlay} onChange={(v) => updateModel({ outlay: v })} formatValue={money} />
        <SliderField label={t("npvAnnualLabel")} min={10} max={2000} step={10} value={model.annual} onChange={(v) => updateModel({ annual: v })} formatValue={money} />
        {model.pattern === "growing" && (
          <SliderField label={t("npvGrowthLabel")} min={-0.2} max={0.3} step={0.005} value={model.growth} onChange={(v) => updateModel({ growth: v })} formatValue={(v) => pct(v)} />
        )}
        {model.pattern === "custom" && <p className="npv-hint">{t("npvCustomHint")}</p>}
        <SliderField label={t("npvYearsLabel")} min={1} max={25} step={1} value={model.years} onChange={(v) => updateModel({ years: v })} formatValue={years} />
        <SliderField label={t("npvRateLabel")} min={0} max={RATE_MAX} step={0.0025} value={model.rate} onChange={(v) => updateModel({ rate: v })} formatValue={(v) => pct(v)} />
      </div>

      <div className="npv-field-row">
        <span className="npv-field-label">{t("npvDetailLabel")}</span>
        <Tabs
          segmented
          items={[{ id: "basic", label: t("npvBasic") }, { id: "advanced", label: t("npvAdvanced") }]}
          value={advanced ? "advanced" : "basic"}
          onChange={(id) => setAdvanced(id === "advanced")}
          ariaLabel={t("npvDetailLabel")}
        />
      </div>

      {advanced && <AdvancedInputs model={model} updateModel={updateModel} />}
    </div>
  );
}
