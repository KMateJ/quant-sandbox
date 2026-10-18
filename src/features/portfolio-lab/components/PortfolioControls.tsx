import SliderField from "../../../components/SliderField";
import { Panel } from "../../../components/layout";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { usePortfolioModel } from "../usePortfolioModel";
import AssetEditor from "./AssetEditor";
import WeightBars from "./WeightBars";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Props = { m: ReturnType<typeof usePortfolioModel> };

/// Sidebar: asset assumptions, draggable allocation bars with presets, risk-free rate and the random cloud.
export default function PortfolioControls({ m }: Props) {
  const { t } = useI18n();

  return (
    <Panel title={t("portfolioControlsTitle")}>
      <ControlGroup label={t("portfolioAssetsLabel")}>
        <AssetEditor
          assets={m.assets}
          canRemove={m.canRemove}
          onParam={m.setAssetParam}
          onName={m.setAssetName}
          onRemove={m.removeAsset}
          onAdd={m.addAsset}
        />
      </ControlGroup>

      <ControlGroup label={t("portfolioWeightsLabel")}>
        <WeightBars assets={m.assets} allocation={m.allocation} onChange={m.setShare} />
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
  );
}
