import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import SeedControl from "../../components/SeedControl";
import { SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import MkmChallengePanel from "./components/MkmChallengePanel";
import MkmControls from "./components/MkmControls";
import MkmPredict from "./components/MkmPredict";
import QuoteRail from "./components/QuoteRail";
import RoundHud from "./components/RoundHud";
import RoundsPanel from "./components/RoundsPanel";
import RoundSummary from "./components/RoundSummary";
import type { MkmMode } from "./marketMaking.url";
import { useMarketMakingLab } from "./useMarketMakingLab";

export default function MarketMakingView() {
  const { t } = useI18n();
  const lab = useMarketMakingLab();
  const { url, setUrl, live, params } = lab;
  const modes: { value: MkmMode; label: string }[] = [
    { value: "simulate", label: t("mkmModeSimulate") },
    { value: "predict", label: t("mkmModePredict") },
    { value: "challenge", label: t("mkmModeChallenge") },
  ];

  return (
    <>
      <PageHeader
        title={t("mkmTitle")}
        description={t("mkmDesc")}
        actions={
          <>
            <SegmentedControl ariaLabel={t("mkmModeLabel")} options={modes} value={url.mode} onChange={(mode) => setUrl({ mode })} />
            <SeedControl compact seed={url.seed} setSeed={(seed) => setUrl({ seed })} />
          </>
        }
      />
      <Workspace columns="sidebar" className="mkm-workspace">
        <Panel title={t("mkmSetup")}>
          <MkmControls lab={lab} />
        </Panel>
        <div className="module-main">
          {url.mode === "challenge" && <MkmChallengePanel scoring={lab.scoring} />}
          <ChartContainer title={t("mkmRailTitle")}>
            <QuoteRail live={live} params={params} />
            <RoundHud live={live} params={params} onNext={lab.nextRound} />
          </ChartContainer>
          {url.mode === "predict" && <MkmPredict lab={lab} />}
          {lab.last && live.done && <RoundSummary summary={lab.last} fills={live.round.fills} />}
          <RoundsPanel lab={lab} />
        </div>
      </Workspace>
    </>
  );
}
