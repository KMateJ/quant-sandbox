import { PageHeader, Workspace } from "../../components/layout";
import { useI18n } from "../../i18n";
import CurveEditor from "./components/CurveEditor";
import KeyRateBars from "./components/KeyRateBars";
import LegLadder from "./components/LegLadder";
import MtmPanel from "./components/MtmPanel";
import SwapPredict from "./components/SwapPredict";
import SwapSetup from "./components/SwapSetup";
import { useSwap } from "./useSwap";

/// Interest rate swap lab: set the terms, shape the curve, lock the fixed rate and watch the legs and the MTM move.
export default function SwapView() {
  const { t } = useI18n();
  const lab = useSwap();
  return (
    <div className="interest-rate-swap">
      <PageHeader title={t("irsTitle")} description={t("irsDesc")} />
      <Workspace columns="sidebar">
        <div className="irs-side">
          <SwapSetup lab={lab} />
          <SwapPredict lab={lab} />
        </div>
        <div className="module-main">
          <LegLadder lab={lab} />
          <div className="irs-pair">
            <MtmPanel lab={lab} />
            <KeyRateBars lab={lab} />
          </div>
          <CurveEditor lab={lab} />
        </div>
      </Workspace>
    </div>
  );
}
