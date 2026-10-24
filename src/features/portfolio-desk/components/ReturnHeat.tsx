import { useMemo, type CSSProperties } from "react";
import Panel from "../../../components/layout/Panel";
import { heatCell } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { ASSET_CODES, spct } from "../portfolioFormat";
import { recentReturns } from "../positions.math";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

const HEAT_MAX = 0.08;

/// Last twelve monthly returns per asset and for the fund, oldest left, tinted by sign and size (±8% = full tint).
export default function ReturnHeat({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { state, path } = desk;
  const recent = useMemo(() => recentReturns(state, path.R), [state, path]);
  const rows = [...ASSET_CODES.map((code, i) => ({ label: code, values: recent.assets[i] })), { label: t("pmgrSeriesFund"), values: recent.fund }];

  return (
    <Panel id="pmgr-heat" title={t("pmgrHeatTitle")} className="gdesk-panel">
      {recent.months.length === 0 ? (
        <p className="gdesk-label">{t("pmgrHeatEmpty")}</p>
      ) : (
        <div className="gdesk-scroll">
          <table className="gdesk-matrix pmgr-heat">
            <thead>
              <tr>
                <th scope="col">{t("pmgrHeatCorner")}</th>
                {recent.months.map((m) => <th key={m} scope="col">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((v, k) => {
                    const h = heatCell(v, HEAT_MAX);
                    return (
                      <td key={k} title={spct(v)} className={`gdesk-matrix__cell gdesk-matrix__cell--${h.tone}`} style={{ "--gdesk-tint": h.alpha } as CSSProperties}>
                        <span className="pmgr-sr">{spct(v)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
