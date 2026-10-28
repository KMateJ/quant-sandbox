import { StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { SPOF_THRESHOLD } from "../networkView.math";
import type { NetworkPageModel } from "../useNetworkPage";

/// System-wide numbers; they follow every edit.
export default function SystemStats({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const { stats } = m;
  return (
    <div className="syr-stats" role="group" aria-label={t("syrStatsTitle")}>
      <StatCard label={t("syrSysAssets")} value={`$${Math.round(stats.totalAssets)}bn`} />
      <StatCard label={t("syrSysLeverage")} value={`${stats.meanLeverage.toFixed(1)}×`} />
      <StatCard label={t("syrSysDensity")} value={`${Math.round(stats.density * 100)}%`} />
      <StatCard label={t("syrSysLargestExposure")} value={`${stats.largestExposure.toFixed(1)}×`} />
      <StatCard label={t("syrSysTopDebtRank")} value={stats.topDebtRank.toFixed(3)} />
      <StatCard label={t("syrSysSpof", { threshold: SPOF_THRESHOLD })} value={stats.singlePoints} />
    </div>
  );
}
