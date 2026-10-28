import { ChartContainer, Panel, Workspace } from "../../../../components/layout";
import { ChallengeRecord, ControlGroup, PredictExplain, SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { FfTabProps, ModelId } from "../../famaFrench.types";
import { EXPLORE_FUND_IDS, FUND_IDS } from "../../fund.math";
import { useFundTab } from "../../useFundTab";
import FitReadout from "../fund/FitReadout";
import FundPicker from "../fund/FundPicker";
import LoadingBars from "../fund/LoadingBars";
import ReplicaChart from "../fund/ReplicaChart";
import ResidualStrip from "../fund/ResidualStrip";

const MODELS: ModelId[] = ["capm", "ff3", "carhart", "ff5"];

/// Mystery fund: drag loadings until the replica tracks the fund, then reveal the regression.
export default function FundTab({ data, window }: FfTabProps) {
  const { t } = useI18n();
  const m = useFundTab(data, window);
  const synthetic = m.choice.kind !== "industry";
  return (
    <Workspace columns="sidebar" className="ffm-fund-workspace">
      <Panel title={t("ffmFundPick")}>
        <FundPicker ids={FUND_IDS} value={m.choice.id} onChange={m.setFund} />
        <ControlGroup label={t("ffmModelLabel")}>
          {m.isChallenge ? (
            <p className="control-hint">{t("ffmChallengeBrief", { model: t(`ffmModel_${m.model}`) })}</p>
          ) : (
            <SegmentedControl<ModelId> options={MODELS.map((v) => ({ value: v, label: t(`ffmModel_${v}`) }))} value={m.model} onChange={m.setModel} ariaLabel={t("ffmModelAria")} />
          )}
        </ControlGroup>
        <div className="ffm-actions">
          {m.isChallenge && (
            <button type="button" className="preset-btn preset-btn--active" onClick={m.submit} disabled={m.revealed}>{t("ffmSubmit")}</button>
          )}
          <button type="button" className="preset-btn" onClick={m.reset}>{t("ffmReset")}</button>
          {synthetic && <button type="button" className="preset-btn" onClick={m.newSeed}>{t("ffmNewSeed")}</button>}
        </div>
        {m.result !== null && <p className="ffm-verdict" role="status">{t(m.result ? "ffmHit" : "ffmMiss")}</p>}
        {m.isChallenge && <ChallengeRecord id="ffm-loadings" />}
      </Panel>
      <div className="module-main ffm-fund-main">
        <ChartContainer title={t("ffmLoadingsTitle")} height={280}>
          <LoadingBars m={m} />
        </ChartContainer>
        <FitReadout m={m} />
        <ChartContainer title={t("ffmReplicaTitle")} height={300}>
          <ReplicaChart m={m} data={data} window={window} />
        </ChartContainer>
        <ChartContainer title={t("ffmResidualsTitle")}>
          <ResidualStrip residuals={m.residuals} />
        </ChartContainer>
        {EXPLORE_FUND_IDS.includes(m.choice.id) && (
          <PredictExplain
            question={t("ffmExplainQuestion")}
            options={(["A", "B", "C"] as const).map((k) => ({ text: t(`ffmExplain${k}`), feedback: t(`ffmExplain${k}Feedback`), correct: k === "A" }))}
          />
        )}
      </div>
    </Workspace>
  );
}
