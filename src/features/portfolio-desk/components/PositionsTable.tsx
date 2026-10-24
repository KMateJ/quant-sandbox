import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { money, pct, toneClass } from "../../../components/game/gameFormat";
import { useI18n, type TranslationKey } from "../../../i18n";
import { ASSET_KEY } from "../portfolioCopy";
import { ASSET_CODES, FUND_SIZE, spct } from "../portfolioFormat";
import { positionRows } from "../positions.math";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

const COLS: TranslationKey[] = ["pmgrColWeight", "pmgrColValue", "pmgrColMonth", "pmgrColSince", "pmgrColVol", "pmgrColShare"];

/// Weights, values, returns and risk per asset class plus the cash line.
export default function PositionsTable({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { state, path, S, mission, shares } = desk;
  const rows = useMemo(() => positionRows(state, path.R, S, mission, shares, FUND_SIZE), [state, path, S, mission, shares]);
  const names = [...ASSET_CODES.map((c) => t(ASSET_KEY[c])), t("pmgrAssetCash")];
  const risky = (i: number) => i < ASSET_CODES.length;

  return (
    <Panel id="pmgr-positions" title={t("pmgrPositionsTitle")} className="gdesk-panel">
      <div className="gdesk-scroll">
        <table className="pmgr-table">
          <thead>
            <tr>
              <th scope="col">{t("pmgrColAsset")}</th>
              {COLS.map((c) => <th key={c} scope="col">{t(c)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={names[i]}>
                <th scope="row">{names[i]}</th>
                <td>{pct(r.weight)}</td>
                <td>{money(r.value)}</td>
                <td className={toneClass(r.month)}>{spct(r.month)}</td>
                <td className={toneClass(r.sinceStart)}>{spct(r.sinceStart)}</td>
                <td>{risky(i) ? `${pct(r.vol)} / ${pct(r.longRunVol)}` : "—"}</td>
                <td>{risky(i) ? pct(r.share, 0) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
