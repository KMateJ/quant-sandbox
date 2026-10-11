import { useI18n } from "../../../i18n";
import type { NpvLab } from "../useNpvLab";

type ScenarioManagerProps = { lab: NpvLab };

/// Create, select, rename, duplicate and delete scenarios; each keeps its own model.
export default function ScenarioManager({ lab }: ScenarioManagerProps) {
  const { t } = useI18n();

  return (
    <div className="npv-scenario-manager">
      <ul className="npv-scenario-list">
        {lab.scenarios.map((s) => (
          <li key={s.id} className={s.id === lab.activeId ? "npv-scenario-row active" : "npv-scenario-row"}>
            <button
              type="button"
              className="npv-scenario-select"
              aria-pressed={s.id === lab.activeId}
              onClick={() => lab.setActiveId(s.id)}
            >
              <span className="npv-swatch" style={{ background: s.color }} aria-hidden="true" />
            </button>
            <input
              className="npv-scenario-name"
              value={s.name}
              onChange={(e) => lab.renameScenario(s.id, e.target.value)}
              aria-label={t("npvScenarioName")}
            />
            <div className="npv-scenario-actions">
              <button type="button" className="npv-icon-button" title={t("npvDuplicate")} aria-label={t("npvDuplicate")} onClick={() => lab.duplicateScenario(s.id)}>⧉</button>
              <button
                type="button"
                className="npv-icon-button"
                title={t("npvDelete")}
                aria-label={t("npvDelete")}
                disabled={lab.scenarios.length <= 1}
                onClick={() => lab.deleteScenario(s.id)}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="metric-button npv-add-scenario" onClick={lab.addScenario}>
        + {t("npvAddScenario")}
      </button>
    </div>
  );
}
