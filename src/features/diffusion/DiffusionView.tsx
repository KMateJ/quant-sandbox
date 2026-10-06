import SectionCard from "../../components/SectionCard";
import SliderDock from "../../components/SliderDock";
import { LineChart } from "../../components/charts";
import DiffusionControls from "./DiffusionControls";
import { PageHeader } from "../../components/layout";
import { useDiffusionView } from "./useDiffusionView";
import { IntuitionTrigger } from "../../components/intuition";
import { IntuitionProvider } from "../../components/intuition";
import { diffusionIntuition } from "../../modules/intuition";
function DiffusionWorkspace() {
  const model = useDiffusionView();
  const { t, isMobile, chartData, amplitudeBound, chartSeries, sliders } = model;
  return (<>
    <PageHeader title={t("navDiffusion")} />
    <div className="view-layout">
      {!isMobile ? (
        <DiffusionControls model={model} />
      ) : null}

      <div className="view-main view-main--docked">
        <SectionCard
          className="chart-card"
          title={t("diffusionChartTitle")}
          headerRight={<IntuitionTrigger sectionId="diffusion" />}
        >
          <div className="chart-wrap">
            <LineChart
              data={chartData}
              xKey="x"
              series={chartSeries}
              xDomain={[0, 2 * Math.PI]}
              yDomain={[-amplitudeBound, amplitudeBound]}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("diffusionTooltipX")} = ${x.toFixed(3)}`}
              valueFormat={(v) => v.toFixed(4)}
            />
          </div>
        </SectionCard>
      </div>

      {isMobile ? <SliderDock sliders={sliders} /> : null}
    </div>
  </>);
}

export default function DiffusionView() {
  return <IntuitionProvider document={diffusionIntuition}><DiffusionWorkspace /></IntuitionProvider>;
}
