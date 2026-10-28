import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { fmtCents } from "../spreadEstimation.math";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";

/// Readout row: Roll, its error against the true spread, lag-1 autocorrelation, effective spread.
export default function SpeReadouts({ lab }: { lab: SpreadEstimationLab }) {
  const { t } = useI18n();
  const { roll, effective, autocorr } = lab.estimates;
  const err = roll.defined ? (roll.s / lab.S - 1) * 100 : NaN;
  return (
    <div className="spe-readouts">
      <StatCard label={t("speRoll")} value={roll.defined ? fmtCents(roll.s) : "–"} />
      <StatCard label={t("speRollError")} value={Number.isFinite(err) ? `${err >= 0 ? "+" : "−"}${Math.abs(err).toFixed(0)}%` : "–"} />
      <StatCard label={t("speAutocorr")} value={Number.isFinite(autocorr) ? `${autocorr >= 0 ? "+" : "−"}${Math.abs(autocorr).toFixed(2)}` : "–"} />
      <StatCard label={t("speEffective")} value={fmtCents(effective)} />
    </div>
  );
}
