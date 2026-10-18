import SectionCard from "../../../../components/SectionCard";
import SliderField from "../../../../components/SliderField";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { MarketParams } from "../replication.types";
import type { ReplicationModel } from "../useReplication";

type SliderSpec = {
  key: keyof MarketParams;
  label: TranslationKey;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

const SLIDERS: SliderSpec[] = [
  { key: "spot", label: "replSpot", min: 50, max: 150, step: 1, format: (v) => v.toFixed(0) },
  { key: "rate", label: "replRate", min: 0, max: 0.12, step: 0.0025, format: pct },
  { key: "sigma", label: "replSigma", min: 0.05, max: 0.8, step: 0.01, format: pct },
  { key: "maturity", label: "replMaturity", min: 0.1, max: 5, step: 0.05, format: (v) => v.toFixed(2) },
  { key: "skew", label: "replSkew", min: -0.4, max: 0.2, step: 0.01, format: (v) => v.toFixed(2) },
];

/// Black–Scholes market inputs with a log-moneyness skew; drive every option price.
export default function MarketControls({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { market, updateMarket } = model;
  return (
    <SectionCard title={t("replMarket")}>
      {SLIDERS.map((s) => (
        <SliderField
          key={s.key}
          label={t(s.label)}
          min={s.min}
          max={s.max}
          step={s.step}
          value={market[s.key]}
          onChange={(value) => updateMarket({ [s.key]: value })}
          formatValue={s.format}
          sectionId={s.key === "skew" ? "breeden-litzenberger" : undefined}
        />
      ))}
    </SectionCard>
  );
}
