import Panel from "../../../components/layout/Panel";
import { money, num, pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { ASSET_KEY } from "../portfolioCopy";
import { ASSET_CODES, FUND_SIZE } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

/// Target weights per asset (cash is the rest), presets, a preview of the trade and the submit button.
export default function RebalanceTicket({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { targets, preview: p, state, mission } = desk;
  const closed = state.settled || desk.demo;
  const name = (code: (typeof ASSET_CODES)[number]) => t(ASSET_KEY[code]);

  return (
    <Panel id="pmgr-ticket" title={t("pmgrTicketTitle")} className="gdesk-panel">
      <div className="pmgr-targets">
        {ASSET_CODES.map((code, i) => (
          <label key={code} className="pmgr-target">
            <span className="gdesk-label">{name(code)}</span>
            <input type="number" inputMode="decimal" min={0} max={100} step={0.5} value={targets[i]} disabled={closed}
              aria-label={t("pmgrTargetAria", { asset: name(code) })} onChange={(e) => desk.setTarget(i, e.target.value)} />
          </label>
        ))}
        <p className="pmgr-target">
          <span className="gdesk-label">{t("pmgrAssetCash")}</span>
          <span className="gdesk-num">{p.valid ? pct(p.cash) : "—"}</span>
        </p>
      </div>
      <div className="pmgr-presets">
        <button type="button" className="gdesk-btn" disabled={closed} onClick={desk.fillScale}>
          {t("pmgrPresetScale", { vol: pct(mission.target, 0) })}
        </button>
        <button type="button" className="gdesk-btn" disabled={closed} onClick={desk.fillParity}>{t("pmgrPresetParity")}</button>
        <button type="button" className="gdesk-btn" disabled={closed} onClick={desk.fillBench}>{t("pmgrPresetBench")}</button>
      </div>
      {p.valid ? (
        <dl className="gdesk-kv">
          <div><dt>{t("pmgrPreviewVol")}</dt><dd className="gdesk-num">{pct(p.vol)}</dd></div>
          <div><dt>{t("pmgrPreviewSharpe")}</dt><dd className="gdesk-num">{num(p.sharpe, 2)}</dd></div>
          <div><dt>{t("pmgrPreviewTurnover")}</dt><dd className="gdesk-num">{pct(p.turnover)}</dd></div>
          <div><dt>{t("pmgrPreviewCost")}</dt><dd className="gdesk-num">{money(p.cost * FUND_SIZE)}</dd></div>
        </dl>
      ) : (
        <p className="pmgr-ticket-error" role="alert">{t("pmgrTicketInvalid", { total: pct(p.total) })}</p>
      )}
      <button id="pmgr-submit" type="button" className="pmgr-submit" disabled={closed || !p.valid || p.turnover < 1e-9} onClick={desk.submit}>
        {t("pmgrSubmit")}
      </button>
    </Panel>
  );
}
