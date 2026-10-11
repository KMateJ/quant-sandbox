import SliderField from "../../../components/SliderField";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { money, pct } from "../npvIrr.format";
import type { CashflowTiming, ProjectModel } from "../npvIrr.types";

type AdvancedInputsProps = {
  model: ProjectModel;
  updateModel: (patch: Partial<ProjectModel>) => void;
};

/// Advanced project assumptions: inflation, tax, terminal value and cashflow timing.
export default function AdvancedInputs({ model, updateModel }: AdvancedInputsProps) {
  const { t } = useI18n();
  const timingTabs: TabItem<CashflowTiming>[] = [
    { id: "end", label: t("npvTimingEnd") },
    { id: "begin", label: t("npvTimingBegin") },
  ];

  return (
    <div className="npv-advanced">
      <div className="controls-grid">
        <SliderField label={t("npvInflationLabel")} min={0} max={0.1} step={0.0025} value={model.inflation} onChange={(v) => updateModel({ inflation: v })} formatValue={(v) => pct(v)} />
        <SliderField label={t("npvTaxLabel")} min={0} max={0.5} step={0.01} value={model.taxRate} onChange={(v) => updateModel({ taxRate: v })} formatValue={(v) => pct(v)} />
        <SliderField label={t("npvTerminalLabel")} min={0} max={5000} step={50} value={model.terminalValue} onChange={(v) => updateModel({ terminalValue: v })} formatValue={money} />
      </div>
      <div className="npv-field-row">
        <span className="npv-field-label">{t("npvTimingLabel")}</span>
        <Tabs segmented items={timingTabs} value={model.timing} onChange={(id) => updateModel({ timing: id })} ariaLabel={t("npvTimingLabel")} />
      </div>
    </div>
  );
}
