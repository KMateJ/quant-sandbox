import { useI18n } from "../../../i18n";
import { assetsValue, DEFAULT_CONFIG as C, exposure, liabilityConvexity, liabilityDuration, liabilityPv, money } from "../immunization.math";
import type { GameState } from "../immunization.types";

type RowProps = { label: string; assets: number; liability: number; format: (v: number) => string; matched?: boolean };

/// Two horizontal bars on one scale: the assets' figure against the liability's.
function CompareRow({ label, assets, liability, format, matched }: RowProps) {
  const { t } = useI18n();
  const scale = Math.max(assets, liability) || 1;
  const state = matched === undefined ? "" : matched ? " is-matched" : " is-gap";
  return (
    <div className={`im-compare${state}`}>
      <div className="im-compare-head">
        <span>{label}</span>
        {matched !== undefined && (
          <span className="im-compare-state">{matched ? t("imMatched") : t("imNotMatched", { gap: format(assets - liability) })}</span>
        )}
      </div>
      {([["imAssets", assets, "assets"], ["imLiability", liability, "liability"]] as const).map(([key, value, kind]) => (
        <div className="im-compare-row" key={kind}>
          <span className="im-compare-name">{t(key)}</span>
          <span className="im-compare-track"><i className={`im-compare-fill im-compare-fill--${kind}`} style={{ width: `${(value / scale) * 100}%` }} /></span>
          <span className="im-compare-value">{format(value)}</span>
        </div>
      ))}
    </div>
  );
}

const PV_TOLERANCE = 0.01;
const DURATION_TOLERANCE = 0.1;

/// Present value, duration and convexity of the assets against the liability: the immunization conditions.
export default function MatchGauges({ game }: { game: GameState }) {
  const { t } = useI18n();
  const assets = assetsValue(game);
  const liability = liabilityPv(game, C);
  const risk = exposure(game);
  const dL = liabilityDuration(game, C);
  const decimals = (v: number) => v.toFixed(2);
  return (
    <div className="im-gauges" aria-label={t("imGauges")}>
      <CompareRow label={t("imPv")} assets={assets} liability={liability} format={money} matched={Math.abs(assets - liability) < PV_TOLERANCE * liability} />
      <CompareRow label={t("imDuration")} assets={risk.dMod} liability={dL} format={decimals} matched={Math.abs(risk.dMod - dL) < DURATION_TOLERANCE} />
      <CompareRow label={t("imConvexity")} assets={risk.convexity} liability={liabilityConvexity(game, C)} format={decimals} />
    </div>
  );
}
