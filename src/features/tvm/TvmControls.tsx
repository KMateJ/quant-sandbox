import NumberInput from "../../components/NumberInput";
import SliderField from "../../components/SliderField";
import { SegmentedControl } from "../../components/ui";
import { useI18n, type TranslationKey } from "../../i18n";
import type { TvmSolution } from "./tvm.math";
import type { SolveFor, TvmLab } from "./useTvmLab";

const money = (v: number) => v.toFixed(0);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Why a target can't be reached, per solved quantity.
function unreachableKey(solveFor: SolveFor, s: TvmSolution | null): TranslationKey | null {
  if (!s || !("reason" in s)) return null;
  if (s.reason === "never") return "tvmNever";
  if (solveFor === "payment") return "tvmTooLowPayment";
  return s.reason === "tooHigh" ? "tvmTooHighRate" : "tvmTooLowRate";
}

/// Solve-for switch, the input sliders (the solved one is hidden) and the target balance.
export default function TvmControls({ lab }: { lab: TvmLab }) {
  const { t } = useI18n();
  const { inputs, setters, solveFor } = lab;
  const message = unreachableKey(solveFor, lab.solution);
  const options: { value: SolveFor; label: string }[] = [
    { value: "fv", label: t("tvmSolveFv") },
    { value: "payment", label: t("tvmSolvePayment") },
    { value: "rate", label: t("tvmSolveRate") },
    { value: "years", label: t("tvmSolveYears") },
  ];

  return (
    <div className="controls-grid">
      <div className="tvm-solve-for">
        <span className="tvm-solve-label">{t("tvmSolveFor")}</span>
        <SegmentedControl<SolveFor> options={options} value={solveFor} onChange={lab.setSolveFor} ariaLabel={t("tvmSolveFor")} />
      </div>
      {solveFor !== "fv" && (
        <NumberInput label={t("tvmTargetLabel")} value={lab.target} onChange={lab.setTarget} min={0} step={500} />
      )}
      {message && <p className="tvm-unreachable" role="status">{t(message)}</p>}
      <SliderField label={t("tvmPrincipalLabel")} min={0} max={10000} step={100} value={inputs.principal} onChange={setters.setPrincipal} formatValue={money} />
      {solveFor !== "payment" && (
        <SliderField label={t("tvmPaymentLabel")} min={0} max={2000} step={50} value={inputs.payment} onChange={setters.setPayment} formatValue={money} />
      )}
      {solveFor !== "rate" && (
        <SliderField label={t("tvmRateLabel")} min={0} max={0.15} step={0.0025} value={inputs.rate} onChange={setters.setRate} formatValue={pct} />
      )}
      {solveFor !== "years" && (
        <SliderField label={t("tvmYearsLabel")} min={1} max={40} step={1} value={inputs.years} onChange={setters.setYears} formatValue={(v) => v.toFixed(0)} />
      )}
    </div>
  );
}
