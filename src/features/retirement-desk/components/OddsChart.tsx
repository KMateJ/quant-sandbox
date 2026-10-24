import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import type { RetirementDeskModel } from "../useRetirementDesk";

const COMFORT = 0.85;

/// Success odds recorded at each decision, plus the pending decision, against the 85% comfort line.
export default function OddsChart({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { state, mission, oddsNow } = desk;
  const data = useMemo(() => {
    const past = state.rows.map((r) => ({ y: r.y - 1, odds: r.odds }));
    return state.settled ? past : [...past, { y: state.year, odds: oddsNow }];
  }, [state, oddsNow]);
  const series: ChartSeries[] = [{ key: "odds", label: t("retrOddsLabel"), color: SERIES_PALETTE[0], strokeWidth: 1.75 }];
  return (
    <Panel id="retr-odds" title={t("retrOddsTitle")} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <LineChart data={data} xKey="y" series={series} xDomain={[0, mission.years]} yDomain={[0, 1]} curve="linear" legend={false}
          tooltipLabel={(x) => t("retrYearShort", { y: Math.round(x) + 1 })} xFormat={(x) => String(Math.round(x))}
          valueFormat={(v) => pct(v, 0)} yFormat={(v) => pct(v, 0)}
          referenceLines={[{ axis: "y", value: COMFORT, color: SERIES_ROLE.estimate, dash: "4 3" }]} />
      </div>
    </Panel>
  );
}
