import { ControlGroup } from "../../components/ui";
import { useI18n, type TranslationKey } from "../../i18n";
import type { SolveFor, TvmLab } from "./useTvmLab";

const SOLVED: Record<Exclude<SolveFor, "fv">, { key: TranslationKey; format: (v: number) => string }> = {
  payment: { key: "tvmSolvedPayment", format: (v) => v.toFixed(0) },
  rate: { key: "tvmSolvedRate", format: (v) => `${(v * 100).toFixed(2)}%` },
  years: { key: "tvmSolvedYears", format: (v) => v.toFixed(1) },
};

/// Result cards; when solving for an input, its value leads as the highlighted card.
export default function TvmResults({ lab }: { lab: TvmLab }) {
  const { t } = useI18n();
  const money = (v: number) => v.toFixed(0);
  const solved = lab.solveFor !== "fv" && lab.solution?.ok ? { ...SOLVED[lab.solveFor], value: lab.solution.value } : null;

  return (
    <ControlGroup label={t("tvmMetricsLabel")}>
      <div className="stats-grid">
        {solved && (
          <div className="stat-card tvm-solved">
            <div className="stat-title">{t(solved.key)}</div>
            <div className="stat-value">{solved.format(solved.value)}</div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-title">{t("tvmFinalBalance")}</div>
          <div className="stat-value">{money(lab.finalBalance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("tvmContributions")}</div>
          <div className="stat-value">{money(lab.totalContributions)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("tvmInterest")}</div>
          <div className="stat-value">{money(lab.interest)}</div>
        </div>
      </div>
    </ControlGroup>
  );
}
