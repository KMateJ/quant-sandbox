import NumberInput from "../../../components/NumberInput";
import { useI18n } from "../../../i18n";
import { RR_RANGES } from "../riskReturn.url";

type Asset = { mu: number; sigma: number };

/// Precise μ / σ entry for one risky asset (the chart handle is the coarse alternative).
export default function AssetInputs({ mu, sigma, onChange }: Asset & { onChange: (asset: Asset) => void }) {
  const { t } = useI18n();
  return (
    <div className="num-grid">
      <NumberInput
        label={t("riskReturnMuLabel")}
        value={mu}
        onChange={(v) => onChange({ mu: v, sigma })}
        min={RR_RANGES.mu[0]}
        max={RR_RANGES.mu[1]}
        percent
        step={0.5}
      />
      <NumberInput
        label={t("riskReturnSigmaLabel")}
        value={sigma}
        onChange={(v) => onChange({ mu, sigma: v })}
        min={RR_RANGES.sigma[0]}
        max={RR_RANGES.sigma[1]}
        percent
        step={0.5}
      />
    </div>
  );
}
