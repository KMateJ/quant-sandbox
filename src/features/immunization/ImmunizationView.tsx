import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import GameSummary from "./components/GameSummary";
import HoldingsEditor from "./components/HoldingsEditor";
import MatchGauges from "./components/MatchGauges";
import RoundControls from "./components/RoundControls";
import RoundWaterfall from "./components/RoundWaterfall";
import SurplusChart from "./components/SurplusChart";
import { DEFAULT_CONFIG as C, money } from "./immunization.math";
import { IM_SCHEMA } from "./immunization.url";
import { useImmunizationGame } from "./useImmunizationGame";

/// Immunization Lab: fund a liability with bonds, then keep the portfolio matched through yearly rate shocks.
export default function ImmunizationView() {
  const { t } = useI18n();
  const [{ seed }, setUrl] = useUrlState(IM_SCHEMA);
  const model = useImmunizationGame(seed);
  const last = model.game.history[model.game.history.length - 1];

  return (
    <>
      <PageHeader title={t("immunizationTitle")} description={t("immunizationDesc")} />
      <p className="im-scenario">{t("imScenario", { amount: money(C.liability), years: C.years })}</p>
      <Workspace columns="sidebar">
        <Panel title={t("imPortfolio")}>
          <HoldingsEditor model={model} />
        </Panel>
        <div className="module-main">
          <Panel title={t("imGauges")}>
            <MatchGauges game={model.game} />
            <RoundControls model={model} seed={seed} setSeed={(next) => setUrl({ seed: next })} />
          </Panel>
          <ChartContainer title={t("imSurplusChart")}>
            <SurplusChart model={model} />
            <p className="im-hint">{t("imTwistNote")}</p>
          </ChartContainer>
          {last && (
            <ChartContainer>
              <RoundWaterfall result={last} />
            </ChartContainer>
          )}
          {model.done && <GameSummary model={model} />}
        </div>
      </Workspace>
    </>
  );
}
