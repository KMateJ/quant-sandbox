import Panel from "../../../components/layout/Panel";
import { BandMeter } from "../../../components/game";
import { num, pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { portfolioStats } from "../engine/market.math";
import { ODDS_KEY } from "../retirementCopy";
import { oddsWord } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";

/// Success odds of the pending decision with a word, withdrawal rate, years of cover, and the portfolio's expected return and risk.
export default function RetirementRiskPanel({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { oddsNow, preview, equity, mission } = desk;
  const { mu, vol } = portfolioStats(mission, equity);
  return (
    <Panel id="retr-risk" title={t("retrRiskTitle")} className="gdesk-panel">
      <div className="gdesk-netdelta">
        <span className="gdesk-label">{t("retrOddsLabel")}</span>
        <span className="gdesk-netdelta-value gdesk-num">{pct(oddsNow, 0)}</span>
        <span className="gdesk-bandtag">{t(ODDS_KEY[oddsWord(oddsNow)])}</span>
      </div>
      <BandMeter value={oddsNow} min={0} max={1} lo={0.85} hi={1} scale={["0%", "50%", "100%"]}
        label={t("retrOddsMeterAria", { odds: pct(oddsNow, 0) })} />
      <dl className="gdesk-kv">
        <div><dt>{t("retrRate")}</dt><dd className="gdesk-num">{pct(preview.rate, 2)}</dd></div>
        <div><dt>{t("retrCover")}</dt><dd className="gdesk-num">{Number.isFinite(preview.cover) ? t("retrYearsValue", { n: num(preview.cover, 1) }) : "—"}</dd></div>
        <div><dt>{t("retrEquity")}</dt><dd className="gdesk-num">{pct(equity, 0)}</dd></div>
        <div><dt>{t("retrExpReturn")}</dt><dd className="gdesk-num">{pct(mu)}</dd></div>
        <div><dt>{t("retrVol")}</dt><dd className="gdesk-num">{pct(vol)}</dd></div>
      </dl>
    </Panel>
  );
}
