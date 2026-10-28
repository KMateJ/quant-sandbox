import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { THEORY_UNLOCK, type MarketMakingLab } from "../useMarketMakingLab";
import BotRuns from "./BotRuns";
import { cents } from "./mkmFormat";
import RoundsScatter from "./RoundsScatter";

/// Your rounds chart with the theory toggle (locked until enough rounds or a reveal) and the bot runs.
export default function RoundsPanel({ lab }: { lab: MarketMakingLab }) {
  const { t } = useI18n();
  const { theoryAllowed, theoryOn, rounds, url } = lab;
  const toggle = (
    <label className="mkm-toggle">
      <input type="checkbox" checked={theoryOn} disabled={!theoryAllowed} onChange={(e) => lab.setTheoryOn(e.target.checked)} />
      {t("mkmShowTheory")}
    </label>
  );
  return (
    <ChartContainer title={t("mkmRoundsTitle")} actions={url.mode !== "challenge" ? toggle : undefined}>
      {!theoryAllowed && url.mode === "simulate" && (
        <p className="mkm-caption">{t("mkmTheoryLocked", { n: Math.max(0, THEORY_UNLOCK - rounds.length) })}</p>
      )}
      {theoryOn && <p className="mkm-caption">{t("mkmTheoryLegend", { best: cents(lab.best) })}</p>}
      <div className="mkm-rounds-chart">
        <RoundsScatter lab={lab} />
      </div>
      {url.mode === "simulate" && <BotRuns lab={lab} />}
    </ChartContainer>
  );
}
