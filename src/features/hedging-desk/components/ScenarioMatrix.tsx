import { useMemo, type CSSProperties } from "react";
import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { signed, signedMoney } from "../deskFormat";
import { scenarioGrid } from "../engine/risk.math";
import { matrixCells } from "../engine/series.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

const SPOT_SHOCKS = [-0.1, -0.05, -0.02, 0, 0.02, 0.05, 0.1];
const VOL_SHIFTS = [0.05, 0, -0.05];

/// Instant spot × vol shock grid of book P&L, tinted by sign and size.
export default function ScenarioMatrix({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, market } = desk;
  const cells = useMemo(() => {
    const grid = scenarioGrid(state, market, SPOT_SHOCKS, VOL_SHIFTS);
    const max = Math.max(...grid.flat().map(Math.abs));
    return matrixCells(grid, max);
  }, [state, market]);

  return (
    <Panel id="hd-matrix" title={t("hdScenarioMatrixTitle")} className="hdesk-panel">
      <div className="hdesk-scroll">
        <table className="hdesk-matrix" aria-describedby="hdesk-matrix-note">
          <thead>
            <tr>
              <th scope="col">{t("hdChartScenarioVol")} \ {t("hdChartScenarioSpot")}</th>
              {SPOT_SHOCKS.map((s) => (
                <th key={s} scope="col">{signed(s * 100, 0)}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={VOL_SHIFTS[i]}>
                <th scope="row">{signed(VOL_SHIFTS[i] * 100, 0)}</th>
                {row.map((c, j) => (
                  <td
                    key={SPOT_SHOCKS[j]}
                    className={`hdesk-matrix__cell hdesk-matrix__cell--${c.tone}`}
                    style={{ "--hdesk-tint": c.alpha } as CSSProperties}
                  >
                    {signedMoney(c.value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p id="hdesk-matrix-note" className="hdesk-matrix__note">{t("hdChartScenarioCaption")}</p>
    </Panel>
  );
}
