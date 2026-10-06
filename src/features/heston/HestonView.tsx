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

export default function HestonView() {
  const model = useHestonView();
  const { isMobile, S0, strike, controlsOpen, setControlsOpen, priceComparisonData, smileData, greeksData, greeksProfileData, stockPathData, variancePathData, currentControls, pathsParams, feller, pathKeys, sliders } = model;
  const { t: translate } = useI18n();
  return (<div className="intuition-on-demand">
    <PageHeader title={translate("navHeston")} />
    <div className="view-layout">
      {!isMobile ? (
        <div className="view-controls">
          <HestonControls
            controlsOpen={controlsOpen}
            setControlsOpen={setControlsOpen}
            values={currentControls}
            sliders={sliders}
            feller={feller}
          />
        </div>
      ) : null}

      <div className="view-main view-main--docked heston-main">
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
  </div>);
}
