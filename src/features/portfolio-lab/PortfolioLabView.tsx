import { useCallback } from "react";
import { usePinnedScatter } from "../../components/charts";
import { PageHeader, Workspace } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import CorrelationView from "./components/CorrelationView";
import PortfolioControls from "./components/PortfolioControls";
import PortfolioMetricStrip from "./components/PortfolioMetricStrip";
import RiskDecomposition from "./components/RiskDecomposition";
import RiskReturnChart from "./components/RiskReturnChart";
import VolCalibration from "./components/VolCalibration";
import { PORTFOLIO_URL_SCHEMA, type PortfolioTab } from "./portfolioLab.url";
import { usePortfolioModel } from "./usePortfolioModel";
import { usePortfolioUrlSync } from "./usePortfolioUrlSync";
import { useRiskReturnSeries } from "./useRiskReturnSeries";

export default function PortfolioLabView() {
  const { t } = useI18n();
  const [url, setUrl] = useUrlState(PORTFOLIO_URL_SCHEMA);
  const m = usePortfolioModel(url.w);
  usePortfolioUrlSync(m.allocation, m.riskFree, m.setRiskFree, url, setUrl);
  const { assets } = m;
  const { tab } = url;

  // One pin for both chart placements, so a frontier pinned before scrubbing ρ stays as the ghost on every tab.
  const liveSeries = useRiskReturnSeries(m);
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedScatter(liveSeries, ghostLabel);
  const chart = (compact: boolean) => <RiskReturnChart m={m} series={pin.series} pin={pin} compact={compact} />;

  const tabs: TabItem<PortfolioTab>[] = [
    { id: "riskReturn", label: t("portfolioTabRiskReturn") },
    { id: "correlations", label: t("portfolioTabCorrelations") },
    { id: "riskDecomp", label: t("portfolioTabRiskDecomp") },
  ];

  return (
    <>
      <PageHeader title={t("portfolioTitle")} description={t("portfolioDesc")} />

      <Workspace columns="sidebar">
        <PortfolioControls m={m} />

        <div className="module-main">
          <PortfolioMetricStrip current={m.current} diversification={m.diversification} />

          <Tabs<PortfolioTab>
            items={tabs}
            value={tab}
            onChange={(next) => setUrl({ tab: next })}
            ariaLabel={t("portfolioMetricsLabel")}
            segmented
          />

          {tab === "riskReturn" && chart(false)}

          {tab === "correlations" && (
            <div className="pl-corr-split">
              <CorrelationView
                assets={assets}
                corr={m.corr}
                corrValid={m.corrValid}
                onChange={m.setCorrelation}
                onReset={m.resetCorr}
                onPreset={m.applyCorrPreset}
                onRepair={m.repairCorr}
                onScrub={m.scrubCorrelation}
                onScrubStart={() => {
                  if (!pin.pinned) pin.pin();
                }}
              />
              {chart(true)}
            </div>
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

          {/* Mounted on every tab, so the calibration history survives tab switches. */}
          <VolCalibration m={m} />
        </div>
      </Workspace>
    </>
  );
}
