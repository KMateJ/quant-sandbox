import { SERIES_PALETTE } from "../../../../components/charts/chart.theme";
import { Panel } from "../../../../components/layout";
import { StatCard } from "../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { SimResult } from "../../engine/systemic.types";
import { CHANNEL_KEYS, channelShares, runStats } from "../shocks.math";

const LOSS_KEY = { direct: "direct", fireSales: "fireSale", funding: "funding", ccp: "ccp" } as const;

/// Final statistics of a run and each channel's share of the loss as a square bar with its percentage.
export default function ChannelShare({ result }: { result: SimResult }) {
  const { t } = useI18n();
  const s = runStats(result);
  const shares = channelShares(result);
  return (
    <Panel title={t("syrShockOutcome")}>
      <div className="syr-shock-stats">
        <StatCard label={t("syrShockStatLoss")} value={`$${s.totalLoss.toFixed(0)}bn`} />
        <StatCard label={t("syrShockStatFailed")} value={s.failed} />
        <StatCard label={t("syrShockStatPrice")} value={`−${s.peakDrop.toFixed(0)}%`} />
        <StatCard label={t("syrShockStatCalm")} value={s.calmDay === null ? "–" : t("syrShockDay", { day: s.calmDay })} />
      </div>
      <h3 className="syr-shock-sub">{t("syrShockShareTitle")}</h3>
      <ul className="syr-shock-shares">
        {CHANNEL_KEYS.map((k, i) => {
          const pct = shares[LOSS_KEY[k]];
          return (
            <li key={k}>
              <span>{t(`syrShockCh_${k}` as TranslationKey)}</span>
              <span className="syr-shock-share-bar"><span style={{ width: `${pct}%`, background: SERIES_PALETTE[i] }} /></span>
              <span className="syr-shock-share-pct">{pct.toFixed(0)}%</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
