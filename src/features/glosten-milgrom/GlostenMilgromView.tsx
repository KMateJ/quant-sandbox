import { useState } from "react";
import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import SeedControl from "../../components/SeedControl";
import { SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import BeliefBars from "./components/BeliefBars";
import GmControls from "./components/GmControls";
import GmPredict from "./components/GmPredict";
import QuotePathChart from "./components/QuotePathChart";
import SpreadChart from "./components/SpreadChart";
import StepLog from "./components/StepLog";
import YouQuotePanel from "./components/YouQuotePanel";
import type { GmMode } from "./glostenMilgrom.url";
import { useGlostenMilgromLab } from "./useGlostenMilgromLab";
import { useYouQuote } from "./useYouQuote";

type SimView = "watch" | "quote";

export default function GlostenMilgromView() {
  const { t } = useI18n();
  const lab = useGlostenMilgromLab();
  const { url, setUrl, params } = lab;
  const [sim, setSim] = useState<SimView>("watch");
  const game = useYouQuote(params, url.seed, url.mode === "challenge");
  const modes: { value: GmMode; label: string }[] = [
    { value: "simulate", label: t("glmModeSimulate") },
    { value: "predict", label: t("glmModePredict") },
    { value: "challenge", label: t("glmModeChallenge") },
  ];

  return (
    <>
      <PageHeader
        title={t("glmTitle")}
        description={t("glmDesc")}
        actions={
          <>
            <SegmentedControl ariaLabel={t("glmModeLabel")} options={modes} value={url.mode} onChange={(mode) => setUrl({ mode })} />
            <SeedControl compact seed={url.seed} setSeed={(seed) => setUrl({ seed })} />
          </>
        }
      />
      <Workspace columns="sidebar" className="glm-workspace">
        <Panel title={t("glmSetup")}>
          <GmControls lab={lab} />
        </Panel>
        <div className="module-main">
          {url.mode === "simulate" && (
            <SegmentedControl<SimView>
              className="glm-sim-switch"
              ariaLabel={t("glmSimLabel")}
              options={[
                { value: "watch", label: t("glmSimWatch") },
                { value: "quote", label: t("glmSimQuote") },
              ]}
              value={sim}
              onChange={setSim}
            />
          )}
          {url.mode === "simulate" && sim === "watch" && (
            <>
              <QuotePathChart lab={lab} />
              <StepLog lab={lab} />
              <div className="glm-pair">
                <ChartContainer title={t("glmSpreadTitle")}>
                  <SpreadChart path={lab.path} />
                </ChartContainer>
                <ChartContainer title={t("glmBeliefTitle")}>
                  <BeliefBars belief={lab.belief} />
                </ChartContainer>
              </div>
            </>
          )}
          {(url.mode === "challenge" || (url.mode === "simulate" && sim === "quote")) && (
            <YouQuotePanel game={game} trueV={params.trueV} scored={url.mode === "challenge"} />
          )}
          {url.mode === "predict" && <GmPredict params={params} seed={url.seed} />}
        </div>
      </Workspace>
    </>
  );
}
