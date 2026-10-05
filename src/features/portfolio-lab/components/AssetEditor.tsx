import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import type { Asset } from "../portfolioLab.types";

type Props = {
  assets: Asset[];
  canRemove: boolean;
  onParam: (index: number, key: "mu" | "sigma", value: number) => void;
  onName: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Editable per-asset cards (name, expected return μ, volatility σ) with add / remove.
export default function AssetEditor({ assets, canRemove, onParam, onName, onRemove, onAdd }: Props) {
  const { t } = useI18n();

  return (
    <div className="asset-editor">
      {assets.map((asset, i) => (
        <div className="asset-edit-card" key={asset.id}>
          <div className="asset-edit-head">
            <span className="weight-row-dot" style={{ background: asset.color }} />
            <input
              className="asset-name-input"
              value={asset.name}
              onChange={(e) => onName(i, e.target.value)}
              aria-label={t("portfolioColAsset")}
            />
            <button
              type="button"
              className="asset-remove"
              disabled={!canRemove}
              onClick={() => onRemove(i)}
              aria-label={t("portfolioRemoveAsset")}
            >
              ×
            </button>
          </div>
          <SliderField label={t("portfolioColReturn")} min={-0.05} max={0.4} step={0.005} value={asset.mu} onChange={(v) => onParam(i, "mu", v)} formatValue={pct} />
          <SliderField label={t("portfolioColVol")} min={0.02} max={0.6} step={0.005} value={asset.sigma} onChange={(v) => onParam(i, "sigma", v)} formatValue={pct} />
        </div>
      ))}
      <button type="button" className="preset-btn asset-add" onClick={onAdd}>
        {t("portfolioAddAsset")}
      </button>
    </div>
  );
}
