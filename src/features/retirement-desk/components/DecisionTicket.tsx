import Panel from "../../../components/layout/Panel";
import { num, pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { ODDS_KEY, PRESET_KEY } from "../retirementCopy";
import { amount, oddsWord, spct } from "../retirementFormat";
import { PRESETS, presetAmount } from "../ticket.math";
import type { RetirementDeskModel } from "../useRetirementDesk";

/// This year's decision: withdrawal amount with presets, the equity share, and what the choice means before it is sent.
export default function DecisionTicket({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { state, mission, preview: p, equity, oddsNow } = desk;
  const closed = state.settled || desk.demo;
  const locked = mission.equityLocked;
  return (
    <Panel id="retr-ticket" title={t("retrTicketTitle", { y: Math.min(state.year + 1, mission.years) })} className="gdesk-panel">
      <label className="retr-field">
        <span className="gdesk-label">{t("retrAmountLabel")}</span>
        <input type="text" inputMode="numeric" value={desk.amountText} disabled={closed} aria-invalid={desk.amount === null}
          onChange={(e) => desk.setAmount(e.target.value)} />
      </label>
      <div className="retr-presets">
        {PRESETS.map((id) => (
          <button key={id} type="button" className="gdesk-btn" disabled={closed} onClick={() => desk.fillPreset(id)}>
            <span>{t(PRESET_KEY[id])}</span> <span className="gdesk-num">{amount(presetAmount(id, mission, state))}</span>
          </button>
        ))}
      </div>
      <label className="retr-field">
        <span className="gdesk-label">{t("retrEquityMix", { e: pct(equity, 0), b: pct(1 - equity, 0) })}</span>
        <input type="range" min={0} max={1} step={0.05} value={equity} disabled={closed || locked}
          aria-label={t("retrEquity")} onChange={(e) => desk.setEquity(Number(e.target.value))} />
      </label>
      {locked && <p className="gdesk-label">{t("retrEquityLocked")}</p>}
      {desk.amount === null ? (
        <p className="retr-ticket-error" role="alert">{t("retrAmountInvalid")}</p>
      ) : (
        <dl className="gdesk-kv">
          <div><dt>{t("retrRate")}</dt><dd className="gdesk-num">{pct(p.rate, 2)}</dd></div>
          <div>
            <dt>{t("retrChange")}</dt>
            <dd className={`gdesk-num${p.isCut ? " gdesk-down" : ""}`}>
              {p.change === null ? "—" : spct(p.change)}{p.isCut && ` · ${t("retrCutTag")}`}
            </dd>
          </div>
          <div><dt>{t("retrCover")}</dt><dd className="gdesk-num">{Number.isFinite(p.cover) ? t("retrYearsValue", { n: num(p.cover, 1) }) : "—"}</dd></div>
          <div><dt>{t("retrOddsLabel")}</dt><dd className="gdesk-num">{pct(oddsNow, 0)} · {t(ODDS_KEY[oddsWord(oddsNow)])}</dd></div>
        </dl>
      )}
      <button id="retr-submit" type="button" className="retr-submit" disabled={closed || !desk.valid} onClick={desk.take}>
        {t("retrSubmit")}
      </button>
    </Panel>
  );
}
