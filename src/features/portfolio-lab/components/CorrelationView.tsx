import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { CorrPreset } from "../PortfolioUniverseContext";
import type { Asset } from "../portfolioLab.types";
import CorrelationMatrix from "./CorrelationMatrix";

type Props = {
  assets: Asset[];
  corr: number[][];
  corrValid: boolean;
  onChange: (i: number, j: number, v: number) => void;
  onReset: () => void;
  onPreset: (kind: CorrPreset) => void;
  onRepair: () => void;
};

/// Dedicated Correlations workspace view: presets, validity warning, the editable
/// correlation heatmap and a one-line note on how correlation drives diversification.
export default function CorrelationView({
  assets,
  corr,
  corrValid,
  onChange,
  onReset,
  onPreset,
  onRepair,
}: Props) {
  const { t } = useI18n();

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

        <CorrelationMatrix assets={assets} corr={corr} onChange={onChange} />

        <p className="corr-explain">{t("portfolioCorrExplain")}</p>
      </div>
    </ChartContainer>
  );
}
