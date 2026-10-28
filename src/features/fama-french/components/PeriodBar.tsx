import { useMemo } from "react";
import { IntervalSelector, LineChart, SERIES_ROLE } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { cumulative, formatMonth } from "../famaFrench.math";
import { MIN_WINDOW_MONTHS, WINDOW_SNAP } from "../famaFrench.url";
import type { FfData, Window } from "../famaFrench.types";

type Props = {
  data: FfData;
  window: Window;
  onChange: (from: number, to: number) => void;
};

const SERIES = [{ key: "v", label: "Mkt-RF", color: SERIES_ROLE.empirical, strokeWidth: 1.6 }];
const growth = (v: number) => `${Number(Math.exp(v).toPrecision(2))}×`;

/// Sample-period brush: cumulative market excess return with a draggable window every tab shares.
export default function PeriodBar({ data, window: w, onChange }: Props) {
  const { t, language } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const points = useMemo(() => cumulative(data.factors.mkt).map((g, i) => ({ i, v: Math.log(g) })), [data]);
  const last = data.months.length - 1;
  const range = `${formatMonth(data.months[w.from], language)} – ${formatMonth(data.months[w.to], language)}`;

  return (
    <div className="ffm-period">
      <ChartContainer
        title={t("ffmPeriodChart")}
        actions={<span className="ffm-period-range">{t("ffmPeriod")}: {range}</span>}
        height={isMobile ? 120 : 150}
      >
        <LineChart
          data={points}
          xKey="i"
          series={SERIES}
          xDomain={[0, last]}
          curve="linear"
          legend={false}
          isMobile={isMobile}
          xFormat={(i) => data.months[Math.min(last, Math.max(0, Math.round(i)))].slice(0, 4)}
          yFormat={growth}
          valueFormat={growth}
          tooltipLabel={(i) => formatMonth(data.months[Math.min(last, Math.max(0, Math.round(i)))], language)}
          layer={(frame) => (
            <IntervalSelector
              frame={frame}
              from={w.from}
              to={w.to}
              onChange={onChange}
              bounds={[0, last]}
              minGap={MIN_WINDOW_MONTHS}
              snap={WINDOW_SNAP}
              color="var(--primary)"
              slidable
            />
          )}
        />
      </ChartContainer>
      <p className="control-hint">{t("ffmPeriodHint")}</p>
    </div>
  );
}
