import { PageHeader } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import { useYieldCurve } from "./useYieldCurve";
import { useYieldCurveUrl } from "./useYieldCurveUrl";
import type { YcTab } from "./yieldCurve.url";
import CurveView from "./components/CurveView";
import BootstrapView from "./components/BootstrapView";
import ForwardsView from "./components/ForwardsView";
import FactorsView from "./components/FactorsView";

/// Yield Curve Lab: an interactive term-structure workbench where par quotes, zero
/// rates, discount factors and forwards are all derived from one shared curve.
export default function YieldCurveView() {
  const { t } = useI18n();
  const model = useYieldCurve();
  const [tab, setTab] = useYieldCurveUrl(model);

  const tabs: TabItem<YcTab>[] = [
    { id: "curve", label: t("ycTabCurve") },
    { id: "bootstrap", label: t("ycTabBootstrap") },
    { id: "forwards", label: t("ycTabForwards") },
    { id: "factors", label: t("ycTabFactors") },
  ];

  return (
    <>
      <PageHeader title={t("yieldCurveTitle")} description={t("yieldCurveDesc")} />
      {model.error && <p className="yc-error" role="alert">{t("ycInvalidQuote")}</p>}

      <div className="yc-tabbar">
        <Tabs<YcTab> items={tabs} value={tab} onChange={setTab} ariaLabel={t("yieldCurveTitle")} />
      </div>

      {tab === "curve" && <CurveView model={model} />}
      {tab === "bootstrap" && <BootstrapView model={model} />}
      {tab === "forwards" && <ForwardsView model={model} />}
      {tab === "factors" && <FactorsView model={model} />}
    </>
  );
}
