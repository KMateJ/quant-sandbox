import Panel from "../../../components/layout/Panel";
import { BandMeter, money, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { KEY_RATES } from "../../../lib/finance/curveRisk";
import { objectiveLimits } from "../engine/limits.math";
import type { RatesDeskModel } from "../useRatesDesk";

const METER = 5000;
const DEFAULT_BAND = 1000;

/// Net DV01 against the band, book vs futures DV01, net key-rate bars and run counters.
export default function RatesRiskPanel({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { risk, state, mission } = desk;
  const limits = objectiveLimits(mission);
  const band = limits.dv01Band ?? DEFAULT_BAND;
  const inBand = Math.abs(risk.net) <= band;
  const maxK = Math.max(band, ...risk.kNet.map(Math.abs));
  return (
    <Panel id="ratd-risk" title={t("ratdRiskTitle")} className="gdesk-panel">
      <div className="gdesk-netdelta">
        <span className="gdesk-label">{t("ratdNetDv01")}</span>
        <span className="gdesk-netdelta-value gdesk-num">{signedMoney(risk.net)}</span>
        <span className="gdesk-bandtag">{t(inBand ? "ratdInBand" : "ratdOutBand")}</span>
      </div>
      <BandMeter
        value={Math.max(-METER, Math.min(METER, risk.net))}
        min={-METER}
        max={METER}
        lo={-band}
        hi={band}
        scale={[signedMoney(-METER), "0", signedMoney(METER)]}
        label={t("ratdMeterAria", { net: signedMoney(risk.net), band: money(band) })}
      />
      <dl className="gdesk-kv">
        <div><dt>{t("ratdBookDv01")}</dt><dd className="gdesk-num">{signedMoney(risk.bookDv01)}</dd></div>
        <div><dt>{t("ratdFutDv01")}</dt><dd className="gdesk-num">{signedMoney(risk.futDv01)}</dd></div>
      </dl>
      <p className="gdesk-label ratd-krd-title">{t("ratdKrdTitle")}</p>
      <ul className="ratd-krd">
        {risk.kNet.map((v, k) => (
          <li key={k} className="ratd-krd-row">
            <span className="gdesk-label">{t("ratdChartMat", { t: KEY_RATES[k] })}</span>
            <span className="ratd-krd-track">
              <span className={`ratd-krd-bar ${v < 0 ? "ratd-krd-bar--neg" : ""}`} style={{ width: `${(Math.abs(v) / maxK) * 50}%` }} />
            </span>
            <span className="gdesk-num">{signedMoney(v)}</span>
          </li>
        ))}
      </ul>
      <dl className="gdesk-kv">
        <div><dt>{t("ratdTraded")}</dt><dd className="gdesk-num">{state.traded}</dd></div>
        <div><dt>{t("ratdCosts")}</dt><dd className="gdesk-num">{money(state.costs)}</dd></div>
        <div><dt>{t("ratdMisses")}</dt><dd className="gdesk-num">{state.misses}</dd></div>
        {limits.krdLimit !== null && <div><dt>{t("ratdKrdMisses")}</dt><dd className="gdesk-num">{state.krdMisses}</dd></div>}
      </dl>
    </Panel>
  );
}
