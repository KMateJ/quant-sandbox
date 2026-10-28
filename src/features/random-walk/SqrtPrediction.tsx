import SliderField from "../../components/SliderField";
import { PredictReveal, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import { explainSpec } from "../../components/lesson/predictRound";
import { spreadFactor } from "./scalingLaws.math";

type Props = { k: number; setK: (value: number) => void };

const fmt = (v: number) => `×${v.toFixed(2)}`;

/// "Multiply the steps by k — how much wider does the walk get?" committed before the √k answer is shown.
export default function SqrtPrediction({ k, setK }: Props) {
  const { t } = useI18n();
  const state = usePredictReveal({ challengeId: "sqrt-scaling", truth: spreadFactor(k), tolerance: 0.1 });
  const vars = { k, factor: fmt(spreadFactor(k)) };

  return (
    <div className="stoch-predict-round">
      <SliderField label={t("stochSqrtPredictorK")} min={2} max={16} step={1} value={k} onChange={setK} formatValue={(v) => `×${v.toFixed(0)}`} />
      <PredictReveal
        state={state}
        prompt={t("stochSqrtPredictPrompt", vars)}
        format={fmt}
        step={0.1}
        min={0}
        explain={explainSpec(t, "stochSqrtEx", 1, vars)}
      />
    </div>
  );
}
