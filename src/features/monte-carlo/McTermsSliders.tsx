import SliderField from "../../components/SliderField";
import { useI18n } from "../../i18n";

export type McTerms = { K: number; T: number; r: number; sigma: number; n: number; seed: number };

type Props = { terms: McTerms; onChange: (patch: Partial<McTerms>) => void };

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Sliders shared by the Monte Carlo sub-pages: the call terms, the number of draws and the seed.
export default function McTermsSliders({ terms, onChange }: Props) {
  const { t } = useI18n();
  return (
    <>
      <SliderField label={t("monteCarloStrikeLabel")} min={10} max={300} step={5} value={terms.K} onChange={(K) => onChange({ K })} formatValue={(v) => v.toFixed(0)} />
      <SliderField label={t("monteCarloMaturityLabel")} min={0.25} max={3} step={0.25} value={terms.T} onChange={(T) => onChange({ T })} formatValue={(v) => v.toFixed(2)} />
      <SliderField label={t("monteCarloRateLabel")} min={0} max={0.1} step={0.0025} value={terms.r} onChange={(r) => onChange({ r })} formatValue={pct} />
      <SliderField label={t("monteCarloVolLabel")} min={0.05} max={0.6} step={0.01} value={terms.sigma} onChange={(sigma) => onChange({ sigma })} formatValue={pct} />
      <SliderField label={t("monteCarloSimsLabel")} min={200} max={20000} step={200} value={terms.n} onChange={(n) => onChange({ n })} formatValue={(v) => v.toFixed(0)} />
      <SliderField label={t("monteCarloSeedLabel")} min={1} max={100} step={1} value={terms.seed} onChange={(seed) => onChange({ seed })} formatValue={(v) => v.toFixed(0)} />
    </>
  );
}
