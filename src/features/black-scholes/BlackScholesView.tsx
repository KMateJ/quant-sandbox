import SectionCard from "../../components/SectionCard";
import SliderDock from "../../components/SliderDock";
import SwitchRow from "../../components/SwitchRow";
import BlackScholesControls from "./BlackScholesControls";
import BlackScholesChart from "./BlackScholesChart";
import { PageHeader } from "../../components/layout";
import { useBlackScholesView } from "./useBlackScholesView";
import { IntuitionTrigger } from "../../components/intuition";

export default function BlackScholesView() {
  const model = useBlackScholesView();
  const { t, isMobile, metric, setMetric, optionType, setOptionType, metricOptions, getMetricTitle, view3d, setView3d } = model;
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
          <div className="metric-switch view-toggle">
            <button
              type="button"
              className={!view3d ? "metric-button active" : "metric-button"}
              onClick={() => setView3d(false)}
            >
              {t("blackScholesView2d")}
            </button>
            <button
              type="button"
              className={view3d ? "metric-button active" : "metric-button"}
              onClick={() => setView3d(true)}
            >
              {t("blackScholesView3d")}
            </button>
          </div>
          <BlackScholesChart model={model} />
        </SectionCard>
      </div>

      {isMobile ? <SliderDock sliders={model.sliders} /> : null}
    </div>
  </div>);
}
