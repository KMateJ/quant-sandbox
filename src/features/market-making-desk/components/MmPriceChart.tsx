import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ChartSeries } from "../../../components/charts";
import { SeriesKey } from "../../../components/game";
import { num, signed } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { CHART_WINDOW, chartRows, clockParts } from "../deskModel.math";
import type { MmDeskModel } from "../useMarketMakingDesk";

/// Mid with your bid and ask over the last two minutes, inventory strip below, news marker when announced.
export default function MmPriceChart({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { state, mission } = desk;
  const data = useMemo(() => chartRows(state.hist), [state.hist]);
  const from = Math.max(0, state.t - CHART_WINDOW);
  const axis = {
    xDomain: [from, Math.max(from + CHART_WINDOW, state.t)] as [number, number],
    tooltipLabel: (x: number) => t("mmdTimeShort", clockParts(Math.round(x), mission.seconds)),
    xFormat: (x: number) => String(Math.round(x)),
  };
  const news = mission.news?.announced ? mission.news.t : null;
  const lines: ChartReferenceLine[] = news !== null && news >= from ? [{ axis: "x", value: news, color: SERIES_ROLE.reference, dash: "3 3" }] : [];
  const series: ChartSeries[] = [
    { key: "mid", label: t("mmdSeriesMid"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "bid", label: t("mmdSeriesBid"), color: "var(--positive)", strokeWidth: 1.25, dash: "4 3" },
    { key: "ask", label: t("mmdSeriesAsk"), color: "var(--negative)", strokeWidth: 1.25, dash: "4 3" },
  ];
  const invSeries: ChartSeries[] = [{ key: "inv", label: t("mmdSeriesInv"), color: SERIES_PALETTE[1], strokeWidth: 1.5 }];
  const limit = mission.limit;
  const invLines: ChartReferenceLine[] = [...lines,
    { axis: "y", value: limit, color: SERIES_ROLE.estimate, dash: "4 3" },
    { axis: "y", value: -limit, color: SERIES_ROLE.estimate, dash: "4 3" }];

  return (
    <Panel id="mmd-price" title={t("mmdPriceTitle")} actions={<SeriesKey series={[...series, ...invSeries]} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart data={data} xKey="t" series={series} {...axis} curve="linear" legend={false}
          valueFormat={(v) => num(v, 2)} yFormat={(v) => num(v, 1)} referenceLines={lines} />
      </div>
      <div className="gdesk-chart gdesk-chart--strip">
        <LineChart data={data} xKey="t" series={invSeries} {...axis} curve="linear" legend={false}
          yDomain={[-1.5 * limit, 1.5 * limit]} valueFormat={(v) => signed(v, 0)} yFormat={(v) => signed(v / 1000, 1) + "k"} referenceLines={invLines} />
      </div>
    </Panel>
  );
}
