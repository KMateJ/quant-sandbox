import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ChartSeries } from "../../../components/charts";
import { SeriesKey } from "../../../components/game";
import { pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { navIndex } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

/// Fund NAV against the 60/40 (base 100) with a "now" line, and the drawdown strip with the mission's limit.
export default function NavChart({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { state, mission } = desk;
  const data = useMemo(() => state.hist.map((h) => ({ m: h.m, nav: h.nav * 100, bench: h.bench * 100, dd: h.dd })), [state.hist]);
  const limit = mission.objectives.find((o) => o.kind === "maxDrawdown");
  const axis = {
    xDomain: [0, mission.months] as [number, number],
    tooltipLabel: (x: number) => t("pmgrMonthShort", { m: Math.round(x) }),
    xFormat: (x: number) => String(Math.round(x)),
  };
  const now: ChartReferenceLine = { axis: "x", value: state.month, color: SERIES_ROLE.reference, dash: "3 3" };
  const series: ChartSeries[] = [
    { key: "nav", label: t("pmgrSeriesFund"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "bench", label: t("pmgrSeriesBench"), color: SERIES_PALETTE[3], strokeWidth: 1.5, dash: "5 4" },
  ];
  const ddSeries: ChartSeries[] = [{ key: "dd", label: t("pmgrSeriesDrawdown"), color: SERIES_PALETTE[1], strokeWidth: 1.5 }];
  const ddLines: ChartReferenceLine[] = limit?.kind === "maxDrawdown" ? [now, { axis: "y", value: -limit.limit, color: SERIES_ROLE.estimate, dash: "4 3" }] : [now];

  return (
    <Panel id="pmgr-nav" title={t("pmgrNavTitle")} actions={<SeriesKey series={[...series, ...ddSeries]} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart data={data} xKey="m" series={series} {...axis} curve="linear" legend={false}
          valueFormat={(v) => navIndex(v / 100)} referenceLines={[now]} />
      </div>
      <div className="gdesk-chart gdesk-chart--strip">
        <LineChart data={data} xKey="m" series={ddSeries} {...axis} curve="linear" legend={false}
          yDomain={[Math.min(-0.05, -(limit?.kind === "maxDrawdown" ? limit.limit : 0) * 1.2, ...data.map((d) => d.dd * 1.1)), 0]}
          valueFormat={(v) => pct(v)} yFormat={(v) => pct(v, 0)} referenceLines={ddLines} />
      </div>
    </Panel>
  );
}
