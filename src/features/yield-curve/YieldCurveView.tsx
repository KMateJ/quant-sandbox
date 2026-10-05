import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { yieldCurve } from "./yieldCurve.math";

export default function YieldCurveView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [base, setBase] = useState(0.025);
  const [slope, setSlope] = useState(0.02);
  const [curvature, setCurvature] = useState(0.005);
  const [maturities, setMaturities] = useState(10);

  const data = useMemo(
    () => yieldCurve(base, slope, curvature, maturities),
    [base, slope, curvature, maturities]
  );

  const shortSpot = data[0]?.spot ?? 0;
  const longSpot = data[data.length - 1]?.spot ?? 0;
  const spread = longSpot - shortSpot;

  const values = data.flatMap((d) => [d.par, d.spot]);
  const yDomain: [number, number] = [
    Math.min(0, ...values),
    Math.max(...values) * 1.1,
  ];
  const xDomain: [number, number] = [1, maturities];

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  const series: ChartSeries[] = [
    { key: "par", label: t("yieldCurveParLabel"), color: "#38bdf8", strokeWidth: 2.5 },
    { key: "spot", label: t("yieldCurveSpotLabel"), color: "#f59e0b", strokeWidth: 2.5 },
  ];

  return (
    <>
      <PageHeader title={t("yieldCurveTitle")} description={t("yieldCurveDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("yieldCurveControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("yieldCurveBaseLabel")} min={0} max={0.1} step={0.0025} value={base} onChange={setBase} formatValue={pct} />
            <SliderField label={t("yieldCurveSlopeLabel")} min={-0.03} max={0.05} step={0.0025} value={slope} onChange={setSlope} formatValue={pct} />
            <SliderField label={t("yieldCurveCurvatureLabel")} min={-0.02} max={0.02} step={0.0025} value={curvature} onChange={setCurvature} formatValue={pct} />
            <SliderField label={t("yieldCurveMaturitiesLabel")} min={3} max={20} step={1} value={maturities} onChange={setMaturities} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("yieldCurveMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("yieldCurveShortSpot")}</div>
                <div className="stat-value">{pct(shortSpot)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("yieldCurveLongSpot")}</div>
                <div className="stat-value">{pct(longSpot)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("yieldCurveSpread")}
                  <InfoTooltip content={t("yieldCurveSpreadHelp")} />
                </div>
                <div className="stat-value">{pct(spread)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("yieldCurveChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="t"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("yieldCurveMaturitiesLabel")} = ${x.toFixed(0)}`}
              valueFormat={pct}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
