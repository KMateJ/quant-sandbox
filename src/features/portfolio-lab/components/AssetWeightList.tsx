import type { CSSProperties } from "react";
import { sliderFill } from "../../../components/sliderFill";
import type { Asset } from "../portfolioLab.types";

const CASH_COLOR = "#94a3b8";

type Props = {
  assets: Asset[];
  rawWeights: number[];
  weights: number[];
  cashWeight: number;
  cashLabel: string;
  onChange: (index: number, value: number) => void;
  onCashChange: (value: number) => void;
  totalLabel: string;
};

/// Compact per-asset weight sliders with colour dots, a cash row and a normalised total.
export default function AssetWeightList({
  assets,
  rawWeights,
  weights,
  cashWeight,
  cashLabel,
  onChange,
  onCashChange,
  totalLabel,
}: Props) {
  return (
    <div className="weight-rows">
      {assets.map((asset, i) => (
        <div className="weight-row" key={asset.id}>
          <span className="weight-row-dot" style={{ background: asset.color }} />
          <span className="weight-row-name">{asset.name}</span>
          <input
            className="slider-input weight-row-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rawWeights[i]}
            style={{ ...sliderFill(rawWeights[i], 0, 1), "--primary": asset.color } as CSSProperties}
            onChange={(e) => onChange(i, Number(e.target.value))}
          />
          <span className="weight-row-pct">{(weights[i] * 100).toFixed(0)}%</span>
        </div>
      ))}
      <div className="weight-row">
        <span className="weight-row-dot" style={{ background: CASH_COLOR }} />
        <span className="weight-row-name">{cashLabel}</span>
        <input
          className="slider-input weight-row-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={cashWeight}
          style={{ ...sliderFill(cashWeight, 0, 1), "--primary": CASH_COLOR } as CSSProperties}
          onChange={(e) => onCashChange(Number(e.target.value))}
        />
        <span className="weight-row-pct">{(cashWeight * 100).toFixed(0)}%</span>
      </div>
      <div className="weight-row weight-row--total">
        <span className="weight-row-name">{totalLabel}</span>
        <span className="weight-row-pct">100%</span>
      </div>
    </div>
  );
}
