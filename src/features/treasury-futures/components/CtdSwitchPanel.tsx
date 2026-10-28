import { useMemo } from "react";
import { Panel } from "../../../components/layout";
import { usePredictReveal } from "../../../components/ui/usePredictReveal";
import { useI18n } from "../../../i18n";
import { ctdTraits } from "../ctdSwitch.math";
import type { TreasuryFuturesModel } from "../useTreasuryFutures";
import CtdExplorer from "./CtdExplorer";
import CtdPredict from "./CtdPredict";

/// Shift asked about in the prediction round.
const PREDICT_SHIFT_BP = 150;

/// Yield-shift CTD explorer behind a predict round; absent for the bund scenario and unpriceable baskets.
export default function CtdSwitchPanel({ lab }: { lab: TreasuryFuturesModel }) {
  const { t } = useI18n();
  const { data, sw, ctd } = lab;
  const truthId = sw.curve?.find((p) => p.shiftBp === PREDICT_SHIFT_BP)?.ctd;
  const state = usePredictReveal({ truth: data.bonds.findIndex((b) => b.id === truthId), tolerance: 0, resetKey: sw.curve });
  const traits = useMemo(() => (truthId ? ctdTraits(data.bonds, data.delivery, truthId) : null), [data.bonds, data.delivery, truthId]);
  if (!sw.curve || !traits) return null;
  return <Panel title={t("tfSwitchTitle")}>
    <CtdPredict state={state} bonds={data.bonds} traits={traits} shiftBp={PREDICT_SHIFT_BP} />
    {state.revealed && <CtdExplorer sw={sw} bonds={data.bonds} ctdId={ctd?.id} notionalCoupon={data.notionalCoupon} />}
  </Panel>;
}
