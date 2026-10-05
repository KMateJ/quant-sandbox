import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import {
  approximationCurve,
  bondPrice,
  convexity,
  modifiedDuration,
} from "./durationConvexity.math";

const FACE = 100;
const FREQ = 2;
const HALF_WIDTH = 0.04;
const STEPS = 60;

export default function DurationConvexityView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [coupon, setCoupon] = useState(0.05);
  const [ytm, setYtm] = useState(0.06);
  const [years, setYears] = useState(10);

  const price = bondPrice(FACE, coupon, ytm, years, FREQ);
  const modified = useMemo(() => modifiedDuration(FACE, coupon, ytm, years, FREQ), [coupon, ytm, years]);
  const convex = useMemo(() => convexity(FACE, coupon, ytm, years, FREQ), [coupon, ytm, years]);

  const data = useMemo(
    () => approximationCurve(FACE, coupon, ytm, years, FREQ, HALF_WIDTH, STEPS),
    [coupon, ytm, years]
  );

  const values = data.flatMap((d) => [d.actual, d.duration, d.durConvex]);
  const yDomain: [number, number] = [Math.min(...values) * 0.98, Math.max(...values) * 1.02];
  const xDomain: [number, number] = [Math.max(ytm - HALF_WIDTH, 0), ytm + HALF_WIDTH];

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const num = (v: number) => v.toFixed(2);

  const series: ChartSeries[] = [
    { key: "actual", label: t("durationConvexityActualLabel"), color: "#22c55e", strokeWidth: 2.5 },
    { key: "duration", label: t("durationConvexityDurationLabel"), color: "#38bdf8", strokeWidth: 2, dash: "5 4" },
    { key: "durConvex", label: t("durationConvexityDurConvexLabel"), color: "#f59e0b", strokeWidth: 2, dash: "2 3" },
  ];
  const referenceLines: ChartReferenceLine[] = [{ axis: "x", value: ytm, color: "#64748b", dash: "4 4" }];

  return (
    <>
      <PageHeader title={t("durationConvexityTitle")} description={t("durationConvexityDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("durationConvexityControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("durationConvexityCouponLabel")} min={0} max={0.15} step={0.0025} value={coupon} onChange={setCoupon} formatValue={pct} />
            <SliderField label={t("durationConvexityYtmLabel")} min={0.01} max={0.15} step={0.0025} value={ytm} onChange={setYtm} formatValue={pct} />
            <SliderField label={t("durationConvexityYearsLabel")} min={1} max={30} step={1} value={years} onChange={setYears} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("durationConvexityMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("durationConvexityPrice")}</div>
                <div className="stat-value">{num(price)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("durationConvexityModified")}</div>
                <div className="stat-value">{num(modified)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("durationConvexityConvexity")}
                  <InfoTooltip content={t("durationConvexityConvexityHelp")} />
                </div>
                <div className="stat-value">{num(convex)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("durationConvexityChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="ytm"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("durationConvexityYtmLabel")} = ${pct(x)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
