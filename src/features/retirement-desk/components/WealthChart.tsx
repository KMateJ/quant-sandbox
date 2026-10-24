import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ChartSeries } from "../../../components/charts";
import { SeriesKey } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { amount, compact } from "../retirementFormat";
import { fixedRulePath } from "../ticket.math";
import type { RetirementDeskModel } from "../useRetirementDesk";

/// Your wealth against the fixed-target rule on the same returns, with a "now" line, and the yearly withdrawals against the target.
export default function WealthChart({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { state, mission } = desk;
  const data = useMemo(() => {
    const rule = fixedRulePath(mission, state);
    return [{ y: 0, you: mission.start, rule: mission.start, take: Number.NaN }, ...state.rows.map((r, i) => ({ y: r.y, you: r.end, rule: rule[i + 1], take: r.take }))];
  }, [mission, state]);
  const axis = {
    xDomain: [0, mission.years] as [number, number],
    tooltipLabel: (x: number) => t("retrYearShort", { y: Math.round(x) }),
    xFormat: (x: number) => String(Math.round(x)),
  };
  const now: ChartReferenceLine = { axis: "x", value: state.year, color: SERIES_ROLE.reference, dash: "3 3" };
  const series: ChartSeries[] = [
    { key: "you", label: t("retrSeriesYou"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "rule", label: t("retrSeriesFixed", { amount: amount(mission.target) }), color: SERIES_PALETTE[3], strokeWidth: 1.5, dash: "5 4" },
  ];
  const takeSeries: ChartSeries[] = [{ key: "take", label: t("retrSeriesTake"), color: SERIES_PALETTE[1], strokeWidth: 1.5 }];
  const hi = Math.max(mission.start * 1.3, ...data.map((d) => Math.max(d.you, d.rule)));
  const takeHi = Math.max(mission.target * 2, ...state.rows.map((r) => r.take * 1.1));

  return (
    <Panel id="retr-wealth" title={t("retrWealthTitle")} actions={<SeriesKey series={[...series, ...takeSeries]} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart data={data} xKey="y" series={series} {...axis} curve="linear" legend={false} yDomain={[0, hi]}
          valueFormat={amount} yFormat={compact} referenceLines={[now]} />
      </div>
      <div className="gdesk-chart gdesk-chart--strip">
        <LineChart data={data} xKey="y" series={takeSeries} {...axis} curve="linear" legend={false} yDomain={[0, takeHi]}
          valueFormat={amount} yFormat={compact}
          referenceLines={[now, { axis: "y", value: mission.target, color: SERIES_ROLE.estimate, dash: "4 3" }]} />
      </div>
    </Panel>
  );
}
