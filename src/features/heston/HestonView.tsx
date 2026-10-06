import { useI18n } from "../../i18n";
import SliderDock from "../../components/SliderDock";
import HestonControls from "./components/HestonControls";
import HestonGreeksChart from "./components/HestonGreeksChart";
import HestonGreeksSummary from "./components/HestonGreeksSummary";
import HestonPathsChart from "./components/HestonPathsChart";
import HestonPriceComparisonChart from "./components/HestonPriceComparisonChart";
import HestonSmileChart from "./components/HestonSmileChart";
import HestonVarianceChart from "./components/HestonVarianceChart";
import { PageHeader } from "../../components/layout";
import { useHestonView } from "./useHestonView";
import { IntuitionTrigger } from "../../components/intuition";

export default function HestonView() {
  const model = useHestonView();
  const { language, isMobile, S0, strike, controlsOpen, setControlsOpen, priceComparisonData, smileData, greeksData, greeksProfileData, stockPathData, variancePathData, currentControls, pathsParams, feller, pathKeys, controlSetters, sliders } = model;
  const { t: translate } = useI18n();
  return (<>
    <PageHeader title={translate("navHeston")} />
    <div className="view-layout">
      {!isMobile ? (
        <div className="view-controls">
          <HestonControls
            language={language}
            controlsOpen={controlsOpen}
            setControlsOpen={setControlsOpen}
            values={currentControls}
            setters={controlSetters}
            feller={feller}
          />
        </div>
      ) : null}

      <div className="view-main view-main--docked heston-main">
        <div className="intuition-chart-help">
          <span>κ, θ <IntuitionTrigger sectionId="mean-reversion" /></span>
          <span>ξ <IntuitionTrigger sectionId="vol-of-vol" /></span>
          <span>ρ <IntuitionTrigger sectionId="correlation" /></span>
          <span>{translate("intuitionSmileTitle")} <IntuitionTrigger sectionId="smile" /></span>
          <span>{translate("intuitionFellerTitle")} <IntuitionTrigger sectionId="feller-condition" /></span>
        </div>
        <div className="heston-chart-grid">
          <HestonPathsChart
            data={stockPathData}
            pathKeys={pathKeys}
            strike={pathsParams.strike}
          />

          <HestonVarianceChart
            data={variancePathData}
            pathKeys={pathKeys}
            theta={pathsParams.theta}
          />

          <HestonPriceComparisonChart
            data={priceComparisonData}
            strike={strike}
          />

          <HestonSmileChart
            data={smileData}
            strikeRatio={Number((strike / S0).toFixed(3))}
          />

          <div className="heston-grid-span">
            <HestonGreeksChart data={greeksProfileData} strike={strike} />
          </div>
        </div>

        <HestonGreeksSummary data={greeksData} />
      </div>

      {isMobile ? <SliderDock sliders={sliders} /> : null}
    </div>
  </>);
}
