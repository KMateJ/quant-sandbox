import { useMediaQuery } from "../../components/useMediaQuery";
import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import { SegmentedControl, Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import { nextSeed } from "../../lib/game/seed";
import type { SpeMode, SpeTab } from "./spreadEstimation.types";
import { useSpreadEstimationLab } from "./useSpreadEstimationLab";
import ChallengePanel from "./components/ChallengePanel";
import PredictPanel from "./components/PredictPanel";
import SlopeTab from "./components/SlopeTab";
import SpeControls from "./components/SpeControls";
import SpeReadouts from "./components/SpeReadouts";
import SplitTab from "./components/SplitTab";
import TapeTab from "./components/TapeTab";

export default function SpreadEstimationView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lab = useSpreadEstimationLab();
  const { mode, tab, setState } = lab;

  const modes = (["simulate", "predict", "challenge"] as const).map((value) => ({ value, label: t(`speMode_${value}`) }));
  const tabs: TabItem<SpeTab>[] = [
    { id: "tape", label: t("speTabTape") },
    { id: "slope", label: t("speTabSlope") },
    { id: "split", label: t("speTabSplit") },
  ];
  const actions = (
    <>
      <SegmentedControl<SpeMode> ariaLabel={t("speModeAria")} value={mode} onChange={(next) => setState({ mode: next })} options={modes} />
      <button type="button" className="preset-btn" onClick={() => setState({ seed: nextSeed(lab.seed) })}>{t("speNewSeed")}</button>
    </>
  );

  return (
    <>
      <PageHeader title={t("speTitle")} description={t("speDesc")} actions={actions} />
      {mode === "simulate" ? (
        <Workspace columns="sidebar">
          <Panel title={t("speMarketTitle")}>
            <SpeControls lab={lab} />
          </Panel>
          <div className="module-main">
            <ChartContainer
              title={t("speChartTitle")}
              actions={<Tabs<SpeTab> segmented items={tabs} value={tab} onChange={(next) => setState({ tab: next })} ariaLabel={t("speChartTitle")} />}
            >
              {tab === "tape" && <TapeTab lab={lab} isMobile={isMobile} />}
              {tab === "slope" && <SlopeTab lab={lab} isMobile={isMobile} />}
              {tab === "split" && <SplitTab lab={lab} isMobile={isMobile} />}
            </ChartContainer>
            <SpeReadouts lab={lab} />
          </div>
        </Workspace>
      ) : (
        <Workspace>
          <ChartContainer title={t(mode === "predict" ? "spePredictTitle" : "speChallengeTitle")}>
            {mode === "predict" ? <PredictPanel seed={lab.seed} isMobile={isMobile} /> : <ChallengePanel seed={lab.seed} isMobile={isMobile} />}
          </ChartContainer>
        </Workspace>
      )}
    </>
  );
}
