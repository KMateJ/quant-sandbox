import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import SeedControl from "../../components/SeedControl";
import { SegmentedControl, Tabs } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { AvsMode, AvsTab } from "./avellanedaStoikov.url";
import AsChallengePanel from "./components/AsChallengePanel";
import AsControls from "./components/AsControls";
import AsPredict from "./components/AsPredict";
import PolicySketch from "./components/PolicySketch";
import SkewTab from "./components/SkewTab";
import TournamentTab from "./components/TournamentTab";
import { useAvellanedaStoikovLab } from "./useAvellanedaStoikovLab";

export default function AvellanedaStoikovView() {
  const { t } = useI18n();
  const lab = useAvellanedaStoikovLab();
  const { url, setUrl } = lab;
  const modes: { value: AvsMode; label: string }[] = [
    { value: "simulate", label: t("avsModeSimulate") },
    { value: "predict", label: t("avsModePredict") },
    { value: "challenge", label: t("avsModeChallenge") },
  ];
  const tabs = [
    { id: "skew" as const, label: t("avsTabSkew") },
    { id: "policy" as const, label: t("avsTabPolicy") },
    { id: "tournament" as const, label: t("avsTabTournament") },
  ];

  return (
    <>
      <PageHeader
        title={t("avsTitle")}
        description={t("avsDesc")}
        actions={
          <div className="avs-actions">
            <SegmentedControl ariaLabel={t("avsModeLabel")} options={modes} value={url.mode} onChange={(mode) => setUrl({ mode })} />
            <SeedControl compact seed={url.seed} setSeed={(seed) => setUrl({ seed })} />
          </div>
        }
      />
      <Workspace columns="sidebar" className="avs-workspace">
        <Panel title={t("avsParams")}>
          <AsControls lab={lab} />
        </Panel>
        <div className="module-main">
          {url.mode === "challenge" && <AsChallengePanel lab={lab} />}
          {url.mode === "predict" ? (
            <ChartContainer title={t("avsPredictTitle")}>
              <AsPredict lab={lab} />
            </ChartContainer>
          ) : (
            <ChartContainer title={t("avsMainTitle")}>
              <Tabs<AvsTab> segmented items={tabs} value={url.tab} onChange={(tab) => setUrl({ tab })} ariaLabel={t("avsTabsLabel")} />
              {url.tab === "skew" && <SkewTab lab={lab} />}
              {url.tab === "policy" && <PolicySketch lab={lab} />}
              {url.tab === "tournament" && <TournamentTab lab={lab} />}
            </ChartContainer>
          )}
        </div>
      </Workspace>
    </>
  );
}
