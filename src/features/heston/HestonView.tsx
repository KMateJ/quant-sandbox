import { useState } from "react";
import { useI18n } from "../../i18n";
import HestonControls from "./components/HestonControls";
import HestonGreeksChart from "./components/HestonGreeksChart";
import HestonGreeksSummary from "./components/HestonGreeksSummary";
import HestonPathsChart from "./components/HestonPathsChart";
import HestonPriceComparisonChart from "./components/HestonPriceComparisonChart";
import HestonSmileChart from "./components/HestonSmileChart";
import HestonVarianceChart from "./components/HestonVarianceChart";
import { PageHeader, Workspace, Panel } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useHestonView } from "./useHestonView";

type HestonTab = "paths" | "pricing" | "greeks";

export default function HestonView() {
  const model = useHestonView();
  const {
    S0, strike, priceComparisonData, smileData, greeksData, greeksProfileData,
    greeks3d, setGreeks3d, greeksSurface, vol3d, setVol3d, volSurface,
    stockPathData, variancePathData, currentControls, pathsParams, feller, pathKeys, sliders,
  } = model;
  const { t } = useI18n();
  const [tab, setTab] = useState<HestonTab>("paths");

  const tabs: TabItem<HestonTab>[] = [
    { id: "paths", label: t("hestonTabPaths") },
    { id: "pricing", label: t("hestonTabPricing") },
    { id: "greeks", label: t("hestonTabGreeks") },
  ];

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("navHeston")} />

      <Workspace columns="sidebar" className="heston-workspace">
        <Panel title={t("hestonControlsTitle")}>
          <HestonControls values={currentControls} sliders={sliders} feller={feller} />
        </Panel>

        <div className="module-main heston-main">
          <Tabs<HestonTab>
            className="heston-view-tabs"
            items={tabs}
            value={tab}
            onChange={setTab}
            ariaLabel={t("navHeston")}
          />

          {tab === "paths" && (
            <div className="heston-pair">
              <HestonPathsChart data={stockPathData} pathKeys={pathKeys} strike={pathsParams.strike} />
              <HestonVarianceChart data={variancePathData} pathKeys={pathKeys} theta={pathsParams.theta} />
            </div>
          )}

          {tab === "pricing" && (
            <div className="heston-pair">
              <HestonPriceComparisonChart data={priceComparisonData} strike={strike} />
              <HestonSmileChart
                data={smileData}
                strikeRatio={Number((strike / S0).toFixed(3))}
                vol3d={vol3d}
                setVol3d={setVol3d}
                surface={volSurface}
              />
            </div>
          )}

          {tab === "greeks" && (
            <>
              <HestonGreeksChart
                data={greeksProfileData}
                strike={strike}
                greeks3d={greeks3d}
                setGreeks3d={setGreeks3d}
                surface={greeksSurface}
              />
              <HestonGreeksSummary data={greeksData} />
            </>
          )}
        </div>
      </Workspace>
    </div>
  );
}
