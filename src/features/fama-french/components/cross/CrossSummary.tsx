import { StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { CrossModelState } from "../../useCrossTab";

const GRS_CRITICAL = 1.5;
const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;

/// Mean absolute alpha, GRS statistic (with its verdict) and R-squared of predicted vs realised returns.
export default function CrossSummary({ model }: { model: CrossModelState }) {
  const { t } = useI18n();
  const { summary: s, selected: r } = model;
  const grs = s.grs === null ? t("ffmCrossGrsShort") : `${s.grs.toFixed(2)} · ${t(s.grs > GRS_CRITICAL ? "ffmCrossReject" : "ffmCrossKeep")}`;
  return (
    <>
      <div className="stats-grid">
        <StatCard label={t("ffmCrossMeanAlpha")} value={pct(s.meanAlpha, 2)} />
        <StatCard label={t("ffmCrossGrs")} value={grs} />
        <StatCard label={t("ffmCrossR2")} value={s.r2.toFixed(2)} />
      </div>
      <p className="control-hint">{t("ffmCrossGrsNote")}</p>
      <p className="control-hint" role="status">
        {r ? t("ffmCrossPoint", { code: r.label, pred: pct(r.predicted), real: pct(r.realised), alpha: pct(r.alpha), t: r.alphaT.toFixed(1) }) : t("ffmCrossPickHint")}
      </p>
    </>
  );
}
