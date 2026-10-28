import { useMemo, useState } from "react";
import { Panel, Workspace } from "../../../../components/layout";
import { PredictReveal, SegmentedControl, usePredictReveal, type PredictExplainSpec } from "../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { SWEEP_DEFAULTS } from "../../engine/fragility.math";
import { peakDegree } from "../fragility.protocol";
import { useFragilitySweep } from "../useFragilitySweep";
import FragilityChart from "./FragilityChart";
import FragilitySample from "./FragilitySample";

/// Robust yet fragile: guess the connectivity with the most cascades, then watch the worker's sweep draw the curve.
export default function FragilityPanel({ seed }: { seed: number }) {
  const { t } = useI18n();
  const sweep = useFragilitySweep(seed);
  const truth = sweep.done ? peakDegree(sweep.points) : NaN;
  const state = usePredictReveal({ truth, tolerance: 1.5, resetKey: seed, challengeId: "syr-fragile" });
  const [degree, setDegree] = useState(SWEEP_DEFAULTS.degrees[3]);
  // The guess only counts once the sweep has finished, so the reveal can never show a half-computed answer.
  const gated = useMemo(() => ({ ...state, guess: sweep.done ? state.guess : null }), [state, sweep.done]);
  const explain: PredictExplainSpec = {
    question: t("syrShockFragQ"),
    options: [0, 1, 2].map((i) => ({ text: t(`syrShockFragO${i}` as TranslationKey), feedback: t(`syrShockFragF${i}` as TranslationKey), correct: i === 1 })),
  };
  return (
    <Workspace columns="split">
      <Panel title={t("syrShockFragTitle")} dominant footer={<p>{sweep.done ? t("syrShockFragDone") : t("syrShockFragProgress", { n: sweep.points.length, total: sweep.total })}</p>}>
        <PredictReveal state={gated} prompt={t("syrShockFragPrompt")} format={(v) => t("syrShockLinks", { n: v.toFixed(1) })} input="plot" explain={explain} />
        <FragilityChart points={sweep.points} revealed={state.revealed} guess={state.guess} truth={truth} onGuess={state.setGuess} />
      </Panel>
      <Panel title={t("syrShockSampleTitle")}>
        {state.revealed ? (
          <>
            <SegmentedControl<number>
              ariaLabel={t("syrShockSampleDegree")}
              value={degree}
              onChange={setDegree}
              options={SWEEP_DEFAULTS.degrees.map((d) => ({ value: d, label: String(d) }))}
            />
            <FragilitySample degree={degree} seed={seed} />
          </>
        ) : (
          <p>{t("syrShockSampleLocked")}</p>
        )}
      </Panel>
    </Workspace>
  );
}
