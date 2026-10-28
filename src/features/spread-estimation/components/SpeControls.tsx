import SeedControl from "../../../components/SeedControl";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import { fmtCents } from "../spreadEstimation.math";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";

const pct = (v: number) => `${Math.round(v * 100)}%`;

/// The true market behind the tape, plus the estimator formulas with this tape's numbers.
export default function SpeControls({ lab }: { lab: SpreadEstimationLab }) {
  const { t } = useI18n();
  const { roll, effective } = lab.estimates;
  const set = lab.setState;
  return (
    <>
      <SliderField label={t("speSpreadS")} min={2} max={20} step={1} value={lab.S} onChange={(S) => set({ S })} formatValue={fmtCents} />
      <SliderField label={t("speSigma")} min={0} max={10} step={0.5} value={lab.sigma} onChange={(sigma) => set({ sigma })} formatValue={fmtCents} />
      <SliderField label={t("speAlpha")} min={0} max={0.9} step={0.05} value={lab.alpha} onChange={(alpha) => set({ alpha })} formatValue={pct} />
      <SliderField label={t("speTrades")} min={30} max={640} step={10} value={lab.n} onChange={(n) => set({ n })} />
      <SeedControl seed={lab.seed} setSeed={(seed) => set({ seed })} />
      <dl className="spe-formulas">
        <div><dt>{t("speRollFormula")}</dt><dd>{roll.defined ? `2√(${(-roll.cov).toFixed(2)}) = ${fmtCents(roll.s)}` : t("speRollUndefined")}</dd></div>
        <div><dt>{t("speEffFormula")}</dt><dd>{fmtCents(effective)}</dd></div>
        <div><dt>{t("speTheoryFormula")}</dt><dd>{fmtCents(lab.S * Math.sqrt(1 - lab.alpha))}</dd></div>
      </dl>
    </>
  );
}
