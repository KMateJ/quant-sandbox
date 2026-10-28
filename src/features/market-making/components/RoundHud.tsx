import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { ROUND_DT, ROUND_SECONDS, type MmParams } from "../marketMaking.types";
import { roundSummary } from "../rounds.math";
import type { QuoteRound } from "../useQuoteRound";
import InventoryGauge from "./InventoryGauge";
import { usd } from "./mkmFormat";

type Props = { live: QuoteRound; params: MmParams; onNext: () => void };

/// Clock, P&L, fills, inventory and the live P&L split, with the round's play controls.
export default function RoundHud({ live, params, onNext }: Props) {
  const { t } = useI18n();
  const { round, running, done, reduced, quotes } = live;
  const s = roundSummary(round, live.schedule, params);
  const buys = round.fills.filter((f) => f.side === "buy").length;
  const left = Math.max(0, ROUND_SECONDS - round.step * ROUND_DT);
  const play = done ? null : reduced ? t("mkmStep") : running ? t("mkmPause") : round.step ? t("mkmResume") : t("mkmStart");

  return (
    <div className="mkm-hud">
      <div className="mkm-hud-actions">
        {play && (
          <button type="button" className="lp-btn lp-btn--primary" onClick={live.toggle}>{play}</button>
        )}
        {!reduced && !done && <button type="button" className="lp-btn" onClick={live.stepSecond} disabled={running}>{t("mkmStep")}</button>}
        <button type="button" className="lp-btn" onClick={live.togglePull} aria-pressed={!quotes.live}>{quotes.live ? t("mkmPull") : t("mkmRestore")}</button>
        <button type="button" className="lp-btn" onClick={done ? onNext : live.newRound}>{done ? t("mkmNextRound") : t("mkmRestart")}</button>
      </div>
      <div className="mkm-hud-stats">
        <StatCard label={t("mkmClock")} value={`${left.toFixed(1)} s`} />
        <StatCard label={t("mkmPnl")} value={usd(s.pnl)} />
        <StatCard label={t("mkmFills")} value={t("mkmFillsValue", { buys, sells: round.fills.length - buys })} />
        <StatCard label={t("mkmHalfSpread")} value={`${((quotes.bid + quotes.ask) / 2).toFixed(1)}¢`} />
      </div>
      <InventoryGauge inventory={round.ledger.inventory} />
      <dl className="mkm-split">
        <div><dt>{t("mkmPartSpread")}</dt><dd>{usd(s.parts.spread)}</dd></div>
        <div><dt>{t("mkmPartAdverse")}</dt><dd>{usd(s.parts.adverse)}</dd></div>
        <div><dt>{t("mkmPartInventory")}</dt><dd>{usd(s.parts.inventory)}</dd></div>
      </dl>
    </div>
  );
}
