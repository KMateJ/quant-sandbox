import { PRESETS } from "../npvIrr.presets";
import { useI18n } from "../../../i18n";
import type { NpvLab } from "../useNpvLab";

type NpvHeaderActionsProps = { lab: NpvLab; onOpenLearn: () => void };

/// Header toolbar: example selector, reset, export and the Learn entry point.
export default function NpvHeaderActions({ lab, onOpenLearn }: NpvHeaderActionsProps) {
  const { t } = useI18n();

  const loadPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) lab.loadModel(preset.model);
  };

  const exportJson = () => {
    const payload = {
      model: lab.model,
      metrics: lab.metrics,
      scenarios: lab.scenarios.map((s) => ({ name: s.name, model: s.model })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "npv-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="npv-header-actions">
      <label className="npv-preset-select">
        <span className="npv-sr-only">{t("npvExampleProject")}</span>
        <select defaultValue="" onChange={(e) => { loadPreset(e.target.value); e.target.value = ""; }}>
          <option value="" disabled>{t("npvExampleProject")}</option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{t(p.labelKey as Parameters<typeof t>[0])}</option>
          ))}
        </select>
      </label>
      <button type="button" className="metric-button" onClick={lab.reset}>{t("npvReset")}</button>
      <button type="button" className="metric-button" onClick={exportJson}>{t("npvExport")}</button>
      <button type="button" className="metric-button" onClick={onOpenLearn}>{t("npvLearn")}</button>
    </div>
  );
}
