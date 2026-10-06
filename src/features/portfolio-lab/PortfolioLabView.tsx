import { useState } from "react";
import SliderField from "../../components/SliderField";
import { PageHeader, Workspace, Panel } from "../../components/layout";
import { ControlGroup, Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import AssetEditor from "./components/AssetEditor";
import AssetWeightList from "./components/AssetWeightList";
import CorrelationView from "./components/CorrelationView";
import PortfolioMetricStrip from "./components/PortfolioMetricStrip";
import RiskDecomposition from "./components/RiskDecomposition";
import RiskReturnChart from "./components/RiskReturnChart";
import { usePortfolioModel } from "./usePortfolioModel";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type TabId = "riskReturn" | "correlations" | "riskDecomp";

export default function PortfolioLabView() {
  const { t } = useI18n();
  const m = usePortfolioModel();
  const { assets } = m;
  const [tab, setTab] = useState<TabId>("riskReturn");

  const tabs: TabItem<TabId>[] = [
    { id: "riskReturn", label: t("portfolioTabRiskReturn") },
    { id: "correlations", label: t("portfolioTabCorrelations") },
    { id: "riskDecomp", label: t("portfolioTabRiskDecomp") },
  ];

  return (
    <>
      <PageHeader title={t("portfolioTitle")} description={t("portfolioDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("portfolioControlsTitle")}>
          <ControlGroup label={t("portfolioAssetsLabel")}>
            <AssetEditor
              assets={assets}
              canRemove={m.canRemove}
              onParam={m.setAssetParam}
              onName={m.setAssetName}
              onRemove={m.removeAsset}
              onAdd={m.addAsset}
            />
          </ControlGroup>

          <ControlGroup label={t("portfolioWeightsLabel")}>
            <AssetWeightList
              assets={assets}
              rawWeights={m.rawWeights}
              weights={m.finalWeights}
              cashWeight={m.cashWeight}
              cashLabel={t("portfolioCashLabel")}
              onChange={m.setWeight}
              onCashChange={m.setCashWeight}
              totalLabel={t("portfolioTotalLabel")}
            />
            <div className="preset-row">
              <button type="button" className="preset-btn" onClick={m.applyEqual}>
                {t("portfolioPresetEqual")}
              </button>
              <button type="button" className="preset-btn" onClick={m.applyMinVar}>
                {t("portfolioPresetMinVar")}
              </button>
              <button type="button" className="preset-btn" onClick={m.applyMaxSharpe}>
                {t("portfolioPresetMaxSharpe")}
              </button>
            </div>
          </ControlGroup>

          <div className="controls-grid">
            <SliderField label={t("portfolioRiskFreeLabel")} min={0} max={0.1} step={0.0025} value={m.riskFree} onChange={m.setRiskFree} formatValue={pct} />
          </div>

          <ControlGroup label={t("portfolioCloudLabel")}>
            <SliderField label={t("portfolioCloudCountLabel")} min={0} max={5000} step={50} value={m.cloudCount} onChange={m.setCloudCount} formatValue={(v) => v.toFixed(0)} />
            <div className="preset-row">
              <button type="button" className={m.showCloud ? "preset-btn preset-btn--active" : "preset-btn"} onClick={() => m.setShowCloud(!m.showCloud)}>
                {m.showCloud ? t("portfolioCloudHide") : t("portfolioCloudShow")}
              </button>
              <button type="button" className="preset-btn" onClick={m.regenerateCloud} disabled={!m.showCloud}>
                {t("portfolioCloudRegenerate")}
              </button>
            </div>
          </ControlGroup>
        </Panel>

        <div className="module-main">
          <PortfolioMetricStrip current={m.current} diversification={m.diversification} />

          <Tabs<TabId> items={tabs} value={tab} onChange={setTab} ariaLabel={t("portfolioMetricsLabel")} segmented />

          {tab === "riskReturn" && <RiskReturnChart m={m} />}

          {tab === "correlations" && (
            <CorrelationView
              assets={assets}
              corr={m.corr}
              corrValid={m.corrValid}
              onChange={m.setCorrelation}
              onReset={m.resetCorr}
              onPreset={m.applyCorrPreset}
              onRepair={m.repairCorr}
            />
          )}

          {tab === "riskDecomp" && (
            <RiskDecomposition
              assets={assets}
              weights={m.finalWeights}
              contributions={m.contributions}
              cashWeight={m.cashWeight}
              riskFree={m.riskFree}
              cashLabel={t("portfolioCashLabel")}
            />
          )}
        </div>
      </Workspace>
    </>
  );
}
