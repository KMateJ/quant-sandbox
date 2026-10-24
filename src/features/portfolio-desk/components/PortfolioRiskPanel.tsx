import Panel from "../../../components/layout/Panel";
import { BandMeter } from "../../../components/game";
import { num, pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { ASSET_CODES } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

const DEFAULT_BAND: [number, number] = [0.085, 0.115];

/// Vol band of the mission (its realised-vol objective), else the default 8.5–11.5%.
function volBand(desk: PortfolioDeskModel): [number, number] {
  const o = desk.mission.objectives.find((x) => x.kind === "realizedVolBand");
  return o?.kind === "realizedVolBand" ? [o.lo, o.hi] : DEFAULT_BAND;
}

/// Ex-ante risk against the target band, risk shares per asset and the run's risk statistics.
export default function PortfolioRiskPanel({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { exAnte, shares, sharpe, te, state, mission } = desk;
  const [lo, hi] = volBand(desk);
  const word = exAnte > hi ? "pmgrVolHot" : exAnte < lo ? "pmgrVolCold" : "pmgrVolOnTarget";
  const tracksShares = mission.objectives.some((o) => o.kind === "riskShareMisses");

  return (
    <Panel id="pmgr-risk" title={t("pmgrRiskTitle")} className="gdesk-panel">
      <div className="gdesk-netdelta">
        <span className="gdesk-label">{t("pmgrExAnteVol")}</span>
        <span className="gdesk-netdelta-value gdesk-num">{pct(exAnte)}</span>
        <span className="gdesk-bandtag">{t(word)}</span>
      </div>
      <BandMeter value={exAnte} min={0} max={0.25} lo={lo} hi={hi} scale={["0%", pct(mission.target, 0), "25%"]}
        label={t("pmgrVolMeterAria", { vol: pct(exAnte), lo: pct(lo), hi: pct(hi) })} />
      <p className="gdesk-label">{t("pmgrRiskShares")}</p>
      <ul className="pmgr-shares">
        {ASSET_CODES.map((code, i) => (
          <li key={code} className="pmgr-share">
            <span className="gdesk-label">{code}</span>
            <span className="pmgr-share-track"><span className="pmgr-share-fill" style={{ width: `${Math.max(0, Math.min(1, shares[i])) * 100}%` }} /></span>
            <span className="gdesk-num">{pct(shares[i], 0)}</span>
          </li>
        ))}
      </ul>
      <dl className="gdesk-kv">
        <div><dt>{t("pmgrExAnteSharpe")}</dt><dd className="gdesk-num">{num(sharpe, 2)}</dd></div>
        <div><dt>{t("pmgrTrackingError")}</dt><dd className="gdesk-num">{pct(te)}</dd></div>
        <div><dt>{t("pmgrMaxDrawdown")}</dt><dd className="gdesk-num">{pct(-state.mdd)}</dd></div>
        <div><dt>{t("pmgrCosts")}</dt><dd className="gdesk-num">{t("pmgrBp", { v: num(state.costs * 1e4, 1) })}</dd></div>
        {tracksShares && <div><dt>{t("pmgrShareMisses")}</dt><dd className="gdesk-num">{state.shareMisses}</dd></div>}
      </dl>
    </Panel>
  );
}
