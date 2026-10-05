import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import {
  bondPrice,
  convexity,
  macaulayDuration,
  modifiedDuration,
  priceYieldCurve,
} from "./bondPricing.math";

const FACE = 100;
const FREQ = 2;
const MAX_YTM = 0.2;
const STEPS = 80;

export default function BondPricingView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [coupon, setCoupon] = useState(0.05);
  const [ytm, setYtm] = useState(0.06);
  const [years, setYears] = useState(10);

  const price = bondPrice(FACE, coupon, ytm, years, FREQ);
  const macaulay = useMemo(() => macaulayDuration(FACE, coupon, ytm, years, FREQ), [coupon, ytm, years]);
  const modified = useMemo(() => modifiedDuration(FACE, coupon, ytm, years, FREQ), [coupon, ytm, years]);
  const convex = useMemo(() => convexity(FACE, coupon, ytm, years, FREQ), [coupon, ytm, years]);

  const data = useMemo(
    () => priceYieldCurve(FACE, coupon, years, FREQ, MAX_YTM, STEPS),
    [coupon, years]
  );

  const yTop = bondPrice(FACE, coupon, 0.001, years, FREQ);
  const xDomain: [number, number] = [0, MAX_YTM];
  const yDomain: [number, number] = [0, yTop * 1.05];

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const num = (v: number) => v.toFixed(2);

  const series: ChartSeries[] = [
    { key: "price", label: t("bondPricingCurveLabel"), color: "#f59e0b", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: ytm, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: price, color: "#38bdf8", dash: "4 4" },
  ];

  return (
    <>
      <PageHeader title={t("bondPricingTitle")} description={t("bondPricingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("bondPricingControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("bondPricingCouponLabel")} min={0} max={0.15} step={0.0025} value={coupon} onChange={setCoupon} formatValue={pct} />
            <SliderField label={t("bondPricingYtmLabel")} min={0.001} max={MAX_YTM} step={0.0025} value={ytm} onChange={setYtm} formatValue={pct} />
            <SliderField label={t("bondPricingYearsLabel")} min={1} max={30} step={1} value={years} onChange={setYears} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("bondPricingMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("bondPricingPrice")}</div>
                <div className="stat-value">{num(price)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("bondPricingMacaulay")}</div>
                <div className="stat-value">{num(macaulay)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("bondPricingModified")}</div>
                <div className="stat-value">{num(modified)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("bondPricingConvexity")}
                  <InfoTooltip content={t("bondPricingConvexityHelp")} />
                </div>
                <div className="stat-value">{num(convex)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("bondPricingChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="ytm"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("bondPricingYtmLabel")} = ${pct(x)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
