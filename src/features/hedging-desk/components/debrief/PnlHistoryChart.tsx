import { useMemo } from "react";
import ChartContainer from "../../../../components/layout/ChartContainer";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import type { PlotFrame } from "../../../../components/charts";
import { useI18n } from "../../../../i18n";
import { money, signedMoney } from "../../../../components/game/gameFormat";
import type { DebriefModel } from "../../useDebrief";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Cumulative P&L line with daily changes drawn as bars in the chart's overlay layer.
export default function PnlHistoryChart({ desk, debrief }: { desk: HedgingDeskModel; debrief: DebriefModel }) {
  const { t } = useI18n();
  const { daily } = debrief;
  const { state, pnl, market } = desk;
  // Close of each recorded day, then the settled P&L at expiry; `daily[i]` is the change into point i.
  const data = useMemo(
    () => [...state.history.map((r) => ({ day: r.day, cum: r.pnl })), { day: market.days, cum: pnl }],
    [state.history, market.days, pnl],
  );
  const yDomain = useMemo((): [number, number] => {
    const all = [0, ...data.map((d) => d.cum), ...daily];
    return [Math.min(...all), Math.max(...all)];
  }, [data, daily]);

  const layer = (f: PlotFrame) => {
    const w = Math.max(1, (f.width / (daily.length + 1)) * 0.6);
    const y0 = f.y(0);
    return (
      <g aria-hidden="true" className="hdesk-daily-bars">
        {daily.map((d, i) => (
          <rect
            key={i}
            x={f.x(data[i].day) - w / 2}
            y={Math.min(y0, f.y(d))}
            width={w}
            height={Math.abs(f.y(d) - y0)}
            className={d < 0 ? "is-down" : "is-up"}
          />
        ))}
      </g>
    );
  };

  return (
    <ChartContainer id="hd-debrief-history" title={t("hdDebriefHistoryTitle")} height={260} className="gdesk-panel gdesk-debrief-chart">
      <LineChart
        data={data}
        xKey="day"
        xDomain={[0, market.days]}
        yDomain={yDomain}
        curve="linear"
        series={[{ key: "cum", label: t("hdDebriefCumulative"), color: SERIES_PALETTE[0] }]}
        referenceLines={[{ axis: "y", value: 0 }]}
        tooltipLabel={(x) => t("hdDebriefDay", { day: x })}
        valueFormat={signedMoney}
        yFormat={money}
        layer={layer}
      />
    </ChartContainer>
  );
}
