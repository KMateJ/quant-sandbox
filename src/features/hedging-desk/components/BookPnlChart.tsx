import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { signedMoney } from "../deskFormat";
import { unhedgedPnl } from "../engine/series.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { compactTick, dayAxis } from "./deskChart";

/// Hedged book P&L against the opening trades left unhedged on the same path.
export default function BookPnlChart({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, market, mission, day, pnl } = desk;
  const unhedged = useMemo(() => unhedgedPnl(mission, market, day), [mission, market, day]);
  const data = useMemo(() => {
    const hedged = [...state.history.map((r) => r.pnl), pnl];
    return unhedged.map((u, i) => ({ day: u.day, hedged: hedged[i], unhedged: u.pnl }));
  }, [state.history, pnl, unhedged]);

  const series: ChartSeries[] = [
    { key: "hedged", label: t("hdChartPnlHedged"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "unhedged", label: t("hdChartPnlUnhedged"), color: SERIES_PALETTE[3], strokeWidth: 1.5, dash: "5 4" },
  ];

  return (
    <Panel id="hd-pnl" title={t("hdBookPnlTitle")} className="hdesk-panel" flush>
      <div className="hdesk-chart hdesk-chart--half">
        <LineChart
          data={data}
          xKey="day"
          series={series}
          {...dayAxis(desk, t)}
          curve="linear"
          valueFormat={signedMoney}
          yFormat={compactTick}
          referenceLines={[{ axis: "y", value: 0, color: SERIES_ROLE.reference }]}
        />
      </div>
    </Panel>
  );
}
