import { useMemo } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { ScatterChart } from "../../components/charts";
import type { ChartReferenceLine, ScatterSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import AssetEditor from "./components/AssetEditor";
import AssetWeightList from "./components/AssetWeightList";
import PortfolioLabResults from "./components/PortfolioLabResults";
import { blendColors } from "./portfolioLab.colors";
import { gmvWeights, maxSharpeWeights } from "./portfolioLab.math";
import { usePortfolioModel } from "./usePortfolioModel";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function PortfolioLabView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const m = usePortfolioModel();
  const { assets, mus, cov, current } = m;

  const colors = useMemo(() => assets.map((a) => a.color), [assets]);
  const cloudPoints = useMemo(
    () =>
      m.cloud.map((p) => ({
        x: p.vol,
        y: p.ret,
        color: blendColors(colors, p.weights),
        tooltipRows: assets
          .map((a, i) => ({ label: a.name, value: pct(p.weights[i]), color: a.color, w: p.weights[i] }))
          .filter((r) => r.w >= 0.005)
          .sort((a, b) => b.w - a.w)
          .map(({ label, value, color }) => ({ label, value, color })),
      })),
    [m.cloud, colors, assets]
  );

  const series: ScatterSeries[] = [
    { key: "cloud", label: t("portfolioCloudLabel"), color: "#64748b", radius: 3, legend: true, points: cloudPoints },
    { key: "frontier", label: t("portfolioFrontierLabel"), color: "#3b82f6", line: true, strokeWidth: 2.5, points: m.frontier.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "cml", label: t("portfolioCmlLabel"), color: "#22c55e", line: true, dash: "6 4", strokeWidth: 2, points: m.cml.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "tangency", label: t("portfolioTangencyLabel"), color: "#22c55e", radius: 6, legend: false, points: [{ x: m.tangency.vol, y: m.tangency.ret, label: t("portfolioTangencyLabel") }] },
    { key: "gmv", label: t("portfolioGmvLabel"), color: "#38bdf8", radius: 6, legend: false, points: [{ x: m.gmv.vol, y: m.gmv.ret, label: t("portfolioGmvLabel") }] },
    { key: "cash", label: t("portfolioCashLabel"), color: "#94a3b8", radius: 5, legend: false, points: [{ x: 0, y: m.riskFree, label: t("portfolioCashLabel") }] },
    { key: "current", label: t("portfolioCurrentLabel"), color: "#f97316", radius: 8, points: [{ x: current.vol, y: current.ret, label: t("portfolioCurrentLabel") }] },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: current.vol, color: "#64748b", dash: "4 4" },
    { axis: "y", value: current.ret, color: "#64748b", dash: "4 4" },
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
              <button type="button" className="preset-btn" onClick={() => m.applyPreset(assets.map(() => 1 / assets.length))}>
                {t("portfolioPresetEqual")}
              </button>
              <button type="button" className="preset-btn" onClick={() => m.applyPreset(gmvWeights(cov))}>
                {t("portfolioPresetMinVar")}
              </button>
              <button type="button" className="preset-btn" onClick={() => m.applyPreset(maxSharpeWeights(mus, cov, m.riskFree))}>
                {t("portfolioPresetMaxSharpe")}
              </button>
            </div>
          </ControlGroup>

          <div className="controls-grid">
            <SliderField label={t("portfolioRhoLabel")} min={-0.5} max={0.95} step={0.05} value={m.rho} onChange={m.setRho} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("portfolioRiskFreeLabel")} min={0} max={0.1} step={0.0025} value={m.riskFree} onChange={m.setRiskFree} formatValue={pct} />
          </div>

          <ControlGroup label={t("portfolioCloudLabel")}>
            <SliderField label={t("portfolioCloudCountLabel")} min={0} max={1000} step={20} value={m.cloudCount} onChange={m.setCloudCount} formatValue={(v) => v.toFixed(0)} />
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
          <ChartContainer title={t("portfolioChartTitle")}>
            <div className="chart-wrap">
              <ScatterChart
                series={series}
                xDomain={[0, m.volMax]}
                yDomain={[m.retMin, m.retMax]}
                referenceLines={referenceLines}
                isMobile={isMobile}
                xFormat={pct}
                yFormat={pct}
                xLabel={t("portfolioVolAxis")}
                yLabel={t("portfolioRetAxis")}
              />
            </div>
          </ChartContainer>

          <PortfolioLabResults
            current={current}
            diversification={m.diversification}
            assets={assets}
            weights={m.finalWeights}
            contributions={m.contributions}
            cashWeight={m.cashWeight}
            riskFree={m.riskFree}
            cashLabel={t("portfolioCashLabel")}
          />
        </div>
      </Workspace>
    </>
  );
}
