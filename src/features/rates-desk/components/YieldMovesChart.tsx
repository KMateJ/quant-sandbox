import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../components/charts";
import { SeriesKey, signed } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { yieldMoves } from "../deskView.math";
import type { RatesDeskModel } from "../useRatesDesk";
import { useDayAxis } from "./ratesChart";

const TENORS = [2, 10, 30];

/// Cumulative basis-point change of the 2y, 10y and 30y zero since day 0.
export default function YieldMovesChart({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const axis = useDayAxis(desk);
  const rows = useMemo(() => yieldMoves(desk.path, desk.day), [desk.path, desk.day]);
  const series: ChartSeries[] = TENORS.map((tt, i) => ({
    key: `y${tt}`, label: t("ratdChartMat", { t: tt }), color: SERIES_PALETTE[i], strokeWidth: 1.5, dash: i === 2 ? "4 3" : undefined,
  }));
  return (
    <Panel id="ratd-moves" title={t("ratdMovesTitle")} actions={<SeriesKey series={series} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <LineChart data={rows} xKey="day" series={series} {...axis} curve="linear" legend={false} valueFormat={(v) => `${signed(v, 1)} bp`} yFormat={(v) => signed(v)} />
      </div>
    </Panel>
  );
}
