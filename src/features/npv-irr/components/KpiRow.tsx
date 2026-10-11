import KpiCard from "./KpiCard";
import { useI18n } from "../../../i18n";
import { money, pct, ratio } from "../npvIrr.format";
import type { ProjectMetrics, ProjectModel } from "../npvIrr.types";

type KpiRowProps = {
  metrics: ProjectMetrics;
  model: ProjectModel;
};

/// The four headline KPIs for the active project, colour-coded by their decision rule.
export default function KpiRow({ metrics, model }: KpiRowProps) {
  const { t } = useI18n();
  const hasIrr = Number.isFinite(metrics.irr);

  return (
    <div className="metric-strip">
      <KpiCard
        label={t("npvValue")}
        value={money(metrics.npv)}
        tone={metrics.npv >= 0 ? "good" : "bad"}
        info={t("npvInfoNpv")}
        sub={metrics.npv >= 0 ? t("npvTagCreates") : t("npvTagDestroys")}
      />
      <KpiCard
        label={t("npvIrr")}
        value={hasIrr ? pct(metrics.irr) : "—"}
        tone={hasIrr ? (metrics.irr >= model.rate ? "good" : "bad") : "neutral"}
        info={t("npvInfoIrr")}
        sub={
          hasIrr
            ? `${t("npvVsRate")} ${pct(model.rate)}`
            : metrics.irrSecondary != null
              ? t("npvMultipleIrr")
              : t("npvNoIrr")
        }
      />
      <KpiCard
        label={t("npvPi")}
        value={ratio(metrics.pi)}
        tone={metrics.pi >= 1 ? "good" : "bad"}
        info={t("npvInfoPi")}
        sub={metrics.pi >= 1 ? t("npvTagPiGood") : t("npvTagPiBad")}
      />
      <KpiCard
        label={t("npvPayback")}
        value={metrics.payback === null ? "—" : `${metrics.payback.toFixed(1)} ${t("npvYearsUnit")}`}
        tone="neutral"
        info={t("npvInfoPayback")}
        sub={metrics.payback === null ? t("npvNeverPays") : t("npvDiscountedBasis")}
      />
    </div>
  );
}
