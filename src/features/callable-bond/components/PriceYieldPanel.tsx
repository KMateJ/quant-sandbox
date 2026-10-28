import { LineChart, SERIES_ROLE, type ChartDatum, type ChartSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { pct, price } from "../callableFormat";
import { Y_MAX, Y_MIN } from "../callable.url";
import type { CallableModel } from "../useCallable";
import CallableReadout from "./CallableReadout";
import PriceYieldLayer from "./PriceYieldLayer";

const X_DOMAIN: [number, number] = [Y_MIN, Y_MAX];

/// Straight vs callable price–yield curves with the call's value shaded, negative convexity marked and a draggable yield.
export default function PriceYieldPanel({ lab }: { lab: CallableModel }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = [
    { key: "straight", label: t("cbStraight"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "5 4" },
    { key: "callable", label: t("cbCallable"), color: "var(--chart-1)", strokeWidth: 2.75 },
  ];
  const prices = lab.curve.flatMap((p) => [p.straight, p.callable]);
  const yDomain: [number, number] = [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10];
  return (
    <ChartContainer title={t("cbChartTitle")}>
      <div className="cb-chart">
        <LineChart
          data={lab.curve as unknown as ChartDatum[]}
          xKey="y"
          series={series}
          xDomain={X_DOMAIN}
          yDomain={yDomain}
          isMobile={isMobile}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => v.toFixed(0)}
          valueFormat={price}
          tooltipLabel={(x) => `${t("cbYield")}: ${pct(x)}`}
          layer={(frame) => <PriceYieldLayer frame={frame} lab={lab} />}
        />
      </div>
      <CallableReadout lab={lab} />
    </ChartContainer>
  );
}
