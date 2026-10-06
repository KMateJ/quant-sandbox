import SectionCard from "../../components/SectionCard";
import SliderDock from "../../components/SliderDock";
import SwitchRow from "../../components/SwitchRow";
import { LineChart } from "../../components/charts";
import BlackScholesControls from "./BlackScholesControls";
import { PageHeader } from "../../components/layout";
import { useBlackScholesView } from "./useBlackScholesView";
import { IntuitionTrigger } from "../../components/intuition";

export default function BlackScholesView() {
  const model = useBlackScholesView();
  const { t, isMobile, strike, metric, setMetric, optionType, setOptionType, yDomain, chartData, chartSeries, tooltipDigits, sliders, metricOptions, getMetricTitle } = model;
  return (<div className="intuition-on-demand">
    <PageHeader title={t("navBlackScholes")} />
    <div className="view-layout">
      {!isMobile ? (
        <BlackScholesControls model={model} />
      ) : null}

      <div className="view-main view-main--docked">
        <SectionCard
          className="chart-card"
          title={getMetricTitle(metric, optionType, t)}
          headerRight={<IntuitionTrigger sectionId={metric} />}
        >
          {isMobile && (
            <SwitchRow
              groups={[
                {
                  key: "type",
                  options: [
                    {
                      label: t("blackScholesOptionCall"),
                      active: optionType === "call",
                      onSelect: () => setOptionType("call"),
                    },
                    {
                      label: t("blackScholesOptionPut"),
                      active: optionType === "put",
                      onSelect: () => setOptionType("put"),
                    },
                  ],
                },
                {
                  key: "metric",
                  options: metricOptions.map((option) => ({
                    label: option.label,
                    active: metric === option.key,
                    onSelect: () => setMetric(option.key),
                  })),
                },
              ]}
            />
          )}
          <div className="chart-wrap">
            <LineChart
              data={chartData}
              xKey="S"
              series={chartSeries}
              xDomain={[10, 200]}
              yDomain={yDomain}
              referenceLines={[
                { axis: "x", value: strike, color: "#94a3b8", dash: "4 4" },
              ]}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("blackScholesTooltipStock")} = ${x}`}
              valueFormat={(v) => v.toFixed(tooltipDigits)}
            />
          </div>
        </SectionCard>
      </div>

      {isMobile ? <SliderDock sliders={sliders} /> : null}
    </div>
  </div>);
}
