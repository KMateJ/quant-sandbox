import { useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { PageHeader } from "../../components/layout";
import { Tabs, type TabItem, HelpDrawer } from "../../components/ui";
import { useI18n } from "../../i18n";
import { useNpvLab } from "./useNpvLab";
import NpvHeaderActions from "./components/NpvHeaderActions";
import LearnDrawerContent from "./components/LearnDrawerContent";
import OverviewTab from "./components/OverviewTab";
import CashflowTab from "./components/CashflowTab";
import ScenariosTab from "./components/ScenariosTab";
import SensitivityTab from "./components/SensitivityTab";
import MonteCarloTab from "./components/MonteCarloTab";
import RealOptionsTab from "./components/RealOptionsTab";
import { NPV_TAB_SCHEMA, type NpvTab } from "./npvIrr.url";

export default function NpvIrrView() {
  const { t } = useI18n();
  const lab = useNpvLab(t);
  const [{ tab }, setUrl] = useUrlState(NPV_TAB_SCHEMA);
  const setTab = (next: NpvTab) => setUrl({ tab: next });
  const [advanced, setAdvanced] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  const tabs: TabItem<NpvTab>[] = [
    { id: "overview", label: t("npvTabOverview") },
    { id: "cashflow", label: t("npvTabCashflow") },
    { id: "scenarios", label: t("npvTabScenarios") },
    { id: "sensitivity", label: t("npvTabSensitivity") },
    { id: "montecarlo", label: t("npvTabMonteCarlo") },
    { id: "realoptions", label: t("npvTabRealOptions") },
  ];

  return (
    <div className="npv-lab">
      <PageHeader
        title={t("npvTitle")}
        description={t("npvDesc")}
        actions={<NpvHeaderActions lab={lab} onOpenLearn={() => setLearnOpen(true)} />}
      />

      <div className="npv-tabbar">
        <Tabs<NpvTab> items={tabs} value={tab} onChange={setTab} ariaLabel={t("npvTitle")} />
      </div>

      {tab === "overview" && <OverviewTab lab={lab} advanced={advanced} setAdvanced={setAdvanced} />}
      {tab === "cashflow" && <CashflowTab lab={lab} />}
      {tab === "scenarios" && <ScenariosTab lab={lab} advanced={advanced} setAdvanced={setAdvanced} />}
      {tab === "sensitivity" && <SensitivityTab lab={lab} />}
      {tab === "montecarlo" && <MonteCarloTab lab={lab} />}
      {tab === "realoptions" && <RealOptionsTab lab={lab} />}

      <HelpDrawer open={learnOpen} onClose={() => setLearnOpen(false)} title={t("npvLearnTitle")} closeLabel={t("npvClose")}>
        <LearnDrawerContent />
      </HelpDrawer>
    </div>
  );
}
