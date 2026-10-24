import { useMemo } from "react";
import { ScenarioGrid } from "../../../components/game";
import { signed, signedMoney } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { scenarioGrid } from "../engine/risk.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

const SPOT_SHOCKS = [-0.1, -0.05, -0.02, 0, 0.02, 0.05, 0.1];
const VOL_SHIFTS = [0.05, 0, -0.05];

/// Instant spot × vol shock grid of book P&L, tinted by sign and size.
export default function ScenarioPanel({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, market } = desk;
  const rows = useMemo(
    () =>
      scenarioGrid(state, market, SPOT_SHOCKS, VOL_SHIFTS).map((cells, i) => ({
        label: signed(VOL_SHIFTS[i] * 100, 0),
        cells: cells.map((value) => ({ value, display: signedMoney(value) })),
      })),
    [state, market],
  );
  return (
    <ScenarioGrid
      id="hd-matrix"
      title={t("hdScenarioMatrixTitle")}
      caption={t("hdChartScenarioCaption")}
      corner={`${t("hdChartScenarioVol")} \\ ${t("hdChartScenarioSpot")}`}
      cols={SPOT_SHOCKS.map((s) => `${signed(s * 100, 0)}%`)}
      rows={rows}
    />
  );
}
