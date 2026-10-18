import { InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { ESTIMATOR_COLOR, ESTIMATOR_LABEL } from "./monteCarlo.estimators";
import { MC_ESTIMATORS } from "./monteCarloLab.math";
import type { McLabResult } from "./monteCarlo.types";

/// Final estimate, standard error and variance-reduction factor of each estimator at the same number of draws.
export default function McRaceReadout({ summary }: { summary: McLabResult["summary"] }) {
  const { t } = useI18n();
  const plainSe = summary.plain.standardError;
  return (
    <div className="stats-grid">
      {MC_ESTIMATORS.map((k) => {
        const s = summary[k];
        const vr = s.standardError > 0 ? (plainSe / s.standardError) ** 2 : Infinity;
        return (
          <div key={k} className="stat-card">
            <div className="stat-title">
              <span aria-hidden="true" style={{ color: ESTIMATOR_COLOR[k] }}>● </span>
              {t(ESTIMATOR_LABEL[k])}
            </div>
            <div className="stat-value">{s.estimate.toFixed(3)} ± {(1.96 * s.standardError).toFixed(3)}</div>
            <div className="stat-title">
              {t("monteCarloStdError")} {s.standardError.toFixed(4)} · {t("monteCarloVrFactor")} ×{Number.isFinite(vr) ? vr.toFixed(1) : "∞"}
              {k === "control" && <InfoTooltip content={t("monteCarloVrHelp")} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
