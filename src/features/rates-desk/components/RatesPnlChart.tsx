import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { SeriesKey, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";
import { compactTick, useDayAxis } from "./ratesChart";

/// Hedged P&L against the bonds held alone, day by day.
export default function RatesPnlChart({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const axis = useDayAxis(desk);
  const series: ChartSeries[] = [
    { key: "hedged", label: t("ratdPnlHedged"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "naked", label: t("ratdPnlNaked"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "4 4" },
  ];
  return (
    <Panel id="ratd-pnl" title={t("ratdPnlTitle")} actions={<SeriesKey series={series} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <LineChart
          data={desk.state.hist}
          xKey="day"
          series={series}
          {...axis}
          curve="linear"
          legend={false}
          valueFormat={signedMoney}
          yFormat={compactTick}
          referenceLines={[{ axis: "y", value: 0, color: SERIES_ROLE.reference, dash: "3 3" }]}
        />
      </div>
    </Panel>
  );
}
