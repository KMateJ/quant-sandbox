import { useState } from "react";
import { Panel, ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { PredictReveal, usePredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import ProjectInputs from "./ProjectInputs";
import KpiRow from "./KpiRow";
import InterpretationCard from "./InterpretationCard";
import NpvProfileChart from "./NpvProfileChart";
import { money, pct } from "../npvIrr.format";
import { RATE_MAX, type NpvLab } from "../useNpvLab";

type OverviewTabProps = { lab: NpvLab; advanced: boolean; setAdvanced: (v: boolean) => void };

/// The landing view: inputs, the interactive NPV profile, KPIs and interpretation.
export default function OverviewTab({ lab, advanced, setAdvanced }: OverviewTabProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showIrr, setShowIrr] = useState(true);
  const [showPi, setShowPi] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const { irr, irrSecondary } = lab.metrics;
  // Prediction needs one IRR inside the chart's range; a new IRR (other cash flows) starts a new round.
  const predictable = Number.isFinite(irr) && irrSecondary == null && irr >= 0 && irr <= RATE_MAX;
  const pr = usePredictReveal({ challengeId: "irr-guess", truth: irr, tolerance: 0.005 });
  const hideIrr = predicting && !pr.revealed;

  const toggle = (active: boolean, onClick: () => void, label: string) => (
    <button type="button" className={active ? "metric-button active" : "metric-button"} aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <div className="npv-overview">
      <Panel title={t("npvControlsTitle")}>
        <ProjectInputs model={lab.model} updateModel={lab.updateModel} advanced={advanced} setAdvanced={setAdvanced} />
      </Panel>

      <div className="module-main">
        <ChartContainer
          title={t("npvChartTitle")}
          actions={
            <div className="switch-group metric-switch" role="group" aria-label={t("npvChartTitle")}>
              {toggle(showIrr, () => setShowIrr((v) => !v), t("npvToggleIrr"))}
              {toggle(showPi, () => setShowPi((v) => !v), t("npvTogglePi"))}
              {toggle(predicting, () => setPredicting((v) => !v), t("npvPredictIrr"))}
            </div>
          }
        >
          <div className="chart-wrap">
            <NpvProfileChart
              profile={lab.profile}
              rate={lab.model.rate}
              onRateChange={(r) => lab.updateModel({ rate: r })}
              irr={lab.metrics.irr}
              npvAtRate={lab.metrics.npv}
              rateMax={RATE_MAX}
              showIrr={showIrr && !hideIrr}
              showPiRegion={showPi}
              isMobile={isMobile}
              valueFormat={money}
              rateFormat={(v) => pct(v)}
              predict={predicting && predictable ? { guess: pr.guess, onGuess: pr.setGuess, label: t("lpYourGuess") } : undefined}
            />
          </div>
          <p className="npv-chart-hint">{t(predicting && predictable ? "npvPredictHint" : "npvDragHint")}</p>
          {predicting && (predictable ? (
            <PredictReveal state={pr} prompt={t("npvPredictPrompt")} format={(v) => pct(v, 2)} input="plot"
              explain={{
                question: t("npvExplainQ"),
                options: [
                  { text: t("npvExplainChosen"), feedback: t("npvExplainChosenFb") },
                  { text: t("npvExplainRight"), feedback: t("npvExplainRightFb"), correct: true },
                  { text: t("npvExplainProfit"), feedback: t("npvExplainProfitFb") },
                  { text: t("npvExplainPeak"), feedback: t("npvExplainPeakFb") },
                ],
              }} />
          ) : (
            <p className="npv-chart-hint">{t("npvPredictNone")}</p>
          ))}
        </ChartContainer>

        <KpiRow metrics={lab.metrics} model={lab.model} />
        <InterpretationCard insights={lab.insights} />
      </div>
    </div>
  );
}
