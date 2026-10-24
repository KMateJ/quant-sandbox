import { useMemo } from "react";
import { Panel } from "../../../components/layout";
import PredictReveal from "../../../components/ui/PredictReveal";
import { usePredictReveal } from "../../../components/ui/usePredictReveal";
import { useI18n } from "../../../i18n";
import { shockOutcome } from "../swap.math";
import { signedMoney } from "../swapFormat";
import type { SwapModel } from "../useSwap";

const SHOCK_BP = 50;
/// A guess within a quarter of the true change (and on the right side of zero) counts as a hit.
const TOLERANCE_SHARE = 0.25;

/// After the lock: guess the MTM change for a +50 bp parallel move, then compare with full revaluation and DV01 × 50.
export default function SwapPredict({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const { spec, nodes, locked, curve } = lab;
  const outcome = useMemo(() => (curve ? shockOutcome(spec, nodes, SHOCK_BP) : null), [curve, spec, nodes]);
  const truth = outcome?.actual ?? 0;
  const state = usePredictReveal({ truth, tolerance: Math.abs(truth) * TOLERANCE_SHARE, resetKey: `${spec.payer}-${spec.tenor}-${spec.freq}-${spec.notional}` });
  return (
    <Panel title={t("irsPredictTitle")}>
      {!locked || !outcome ? (
        <p className="irs-hint">{t("irsPredictLockFirst")}</p>
      ) : (
        <>
          <PredictReveal state={state} prompt={t(spec.payer ? "irsPredictPromptPayer" : "irsPredictPromptReceiver", { bp: SHOCK_BP })}
            format={signedMoney} step={10000} />
          {state.revealed && (
            <p className="irs-hint">{t("irsPredictCompare", { actual: signedMoney(outcome.actual), estimate: signedMoney(outcome.estimate), bp: SHOCK_BP })}</p>
          )}
        </>
      )}
    </Panel>
  );
}
