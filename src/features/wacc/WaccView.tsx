import { CapitalSplitBar } from "../../components/charts";
import { PageHeader, Workspace, ChartContainer } from "../../components/layout";
import { PredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import WaccChart from "./WaccChart";
import WaccControls from "./WaccControls";
import { MAX_DEBT_RATIO, useWaccLab } from "./useWaccLab";

const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;

export default function WaccView() {
  const { t } = useI18n();
  const lab = useWaccLab();
  const dv = lab.debtRatio;

  return (
    <>
      <PageHeader title={t("waccTitle")} description={t("waccDesc")} />

      <Workspace columns="sidebar">
        <WaccControls lab={lab} />

        <ChartContainer title={t("waccChartTitle")}>
          <div className="csb-bars">
            <CapitalSplitBar
              label={t("waccSplitLabel")}
              segments={[{ key: "d", value: dv, tone: "debt" }, { key: "e", value: 1 - dv, tone: "equity" }]}
              scaleMax={1}
              handle={{
                ariaLabel: t("waccSplitHandle"),
                valueNow: Math.round(dv * 100),
                valueMin: 0,
                valueMax: MAX_DEBT_RATIO * 100,
                valueText: t("waccSplitText", { dv: pct0(dv), ev: pct0(1 - dv) }),
                onPointerValue: lab.setDebtRatio,
                onKeyStep: (s) => lab.setDebtRatio(s === "min" ? 0 : s === "max" ? MAX_DEBT_RATIO : dv + s / 100),
              }}
            />
          </div>
          <ul className="csb-legend">
            <li><span className="csb-swatch csb-debt" />{t("waccSplitDebt")} {pct0(dv)}</li>
            <li><span className="csb-swatch csb-equity" />{t("waccSplitEquity")} {pct0(1 - dv)}</li>
          </ul>
          <WaccChart lab={lab} />
          <p className="control-hint">{t("waccDragHint")}</p>
          {lab.realistic && (
            <PredictReveal state={lab.predict} prompt={t("waccPredictPrompt")} format={pct0} input="plot"
              explain={{
                question: t("waccExplainQ"),
                options: [
                  { text: t("waccExplainCheaper"), feedback: t("waccExplainCheaperFb") },
                  { text: t("waccExplainFlat"), feedback: t("waccExplainFlatFb") },
                  { text: t("waccExplainRight"), feedback: t("waccExplainRightFb"), correct: true },
                ],
              }} />
          )}
        </ChartContainer>
      </Workspace>
    </>
  );
}
