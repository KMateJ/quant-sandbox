import { PageHeader, Workspace } from "../../components/layout";
import { useI18n } from "../../i18n";
import CallablePredict from "./components/CallablePredict";
import CallableInputs from "./components/CallableInputs";
import CallTimeline from "./components/CallTimeline";
import PriceYieldPanel from "./components/PriceYieldPanel";
import { useCallable } from "./useCallable";

/// Callable bond lab: drag the yield and watch the call cap the price, negative convexity appear and the issuer's call date move.
export default function CallableView() {
  const { t } = useI18n();
  const lab = useCallable();
  return (
    <div className="callable-bond">
      <PageHeader title={t("cbTitle")} description={t("cbDesc")} />
      <Workspace columns="sidebar">
        <div className="cb-side">
          <CallableInputs lab={lab} />
          <CallablePredict lab={lab} />
        </div>
        <div className="module-main">
          <PriceYieldPanel lab={lab} />
          <CallTimeline lab={lab} />
        </div>
      </Workspace>
    </div>
  );
}
