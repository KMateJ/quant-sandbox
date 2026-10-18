import { useState } from "react";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { CorrPreset } from "../PortfolioUniverseContext";
import type { Asset } from "../portfolioLab.types";
import CorrelationMatrix from "./CorrelationMatrix";
import CorrScrubber from "./CorrScrubber";

type Props = {
  assets: Asset[];
  corr: number[][];
  corrValid: boolean;
  onChange: (i: number, j: number, v: number) => void;
  onReset: () => void;
  onPreset: (kind: CorrPreset) => void;
  onRepair: () => void;
  onScrub: (i: number, j: number, v: number) => void;
  onScrubStart: () => void;
};

/// Dedicated Correlations workspace view: presets, validity warning, the editable correlation heatmap,
/// a scrubber for the selected pair and a one-line note on how correlation drives diversification.
export default function CorrelationView({
  assets,
  corr,
  corrValid,
  onChange,
  onReset,
  onPreset,
  onRepair,
  onScrub,
  onScrubStart,
}: Props) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<[number, number]>([1, 0]);
  // Fall back to the first pair if an asset was removed from under the selection.
  const pair: [number, number] = picked[0] < assets.length ? picked : [1, 0];

  return (
    <ChartContainer title={t("portfolioCorrMatrixTitle")}>
      <div className="corr-view">
        <div className="preset-row corr-presets">
          <button type="button" className="preset-btn" onClick={onReset}>
            {t("portfolioCorrReset")}
          </button>
          <button type="button" className="preset-btn" onClick={() => onPreset("low")}>
            {t("portfolioCorrLow")}
          </button>
          <button type="button" className="preset-btn" onClick={() => onPreset("high")}>
            {t("portfolioCorrHigh")}
          </button>
          <button type="button" className="preset-btn" onClick={() => onPreset("identity")}>
            {t("portfolioCorrIdentity")}
          </button>
        </div>

        {!corrValid && (
          <div className="corr-warning" role="alert">
            <span className="corr-warning-text">{t("portfolioCorrInvalid")}</span>
            <button type="button" className="preset-btn" onClick={onRepair}>
              {t("portfolioCorrRepair")}
            </button>
          </div>
        )}

        <CorrelationMatrix
          assets={assets}
          corr={corr}
          onChange={onChange}
          selected={pair}
          onSelect={(i, j) => setPicked([i, j])}
        />

        <CorrScrubber assets={assets} corr={corr} pair={pair} onScrub={onScrub} onScrubStart={onScrubStart} />

        <p className="corr-explain">{t("portfolioCorrExplain")}</p>
      </div>
    </ChartContainer>
  );
}
