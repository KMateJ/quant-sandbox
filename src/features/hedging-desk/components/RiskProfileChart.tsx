import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { num, signedMoney } from "../deskFormat";
import { riskProfile } from "../engine/risk.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { compactTick } from "./deskChart";

/// Book P&L across spot ±20%, today and at expiry, with a marker at the current spot.
export default function RiskProfileChart({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, market, S } = desk;
  const data = useMemo(() => riskProfile(state, market), [state, market]);
  const series: ChartSeries[] = [
    { key: "now", label: t("hdChartRiskNow"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "expiry", label: t("hdChartRiskExpiry"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "5 4" },
  ];

  return (
    <Panel id="hd-profile" title={t("hdRiskProfileTitle")} className="hdesk-panel" flush>
      <div className="hdesk-chart hdesk-chart--half">
        <LineChart
          data={data}
          xKey="spot"
          series={series}
          curve="linear"
          valueFormat={signedMoney}
          yFormat={compactTick}
          tooltipLabel={(x) => `${t("hdChartSpot")} ${num(x, 2)}`}
          xFormat={(x) => num(x, 0)}
          referenceLines={[
            { axis: "y", value: 0, color: SERIES_ROLE.reference },
            { axis: "x", value: S, color: SERIES_PALETTE[2], dash: "3 3" },
          ]}
        />
      </div>
    </Panel>
  );
}
