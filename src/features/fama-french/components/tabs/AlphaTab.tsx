import { ChartContainer, Panel, Workspace } from "../../../../components/layout";
import { PredictExplain } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { FfTabProps } from "../../famaFrench.types";
import { EXPLORE_FUND_IDS } from "../../fund.math";
import { useAlphaTab } from "../../useAlphaTab";
import AlphaChallenge from "../alpha/AlphaChallenge";
import AlphaLadder from "../alpha/AlphaLadder";
import AttributionWaterfall from "../alpha/AttributionWaterfall";
import FactorTray from "../alpha/FactorTray";
import FundPicker from "../fund/FundPicker";

/// Alpha hunt: put factors into the model one at a time and watch the alpha shrink.
export default function AlphaTab({ data, window }: FfTabProps) {
  const { t } = useI18n();
  const m = useAlphaTab(data, window);
  const rungs = m.activePreset ? m.ladder : [...m.ladder, { ...m.custom }];
  return (
    <Workspace columns="sidebar" className="ffm-fund-workspace">
      <Panel title={t("ffmFundPick")}>
        <FundPicker ids={EXPLORE_FUND_IDS} value={m.fundId} onChange={m.setFund} />
      </Panel>
      <div className="module-main ffm-fund-main">
        <Panel title={t("ffmTrayTitle")}>
          <FactorTray m={m} />
        </Panel>
        <ChartContainer title={t("ffmWaterfallTitle")}>
          <AttributionWaterfall m={m} />
        </ChartContainer>
        <Panel title={t("ffmLadderTitle")}>
          <AlphaLadder rungs={rungs} current={m.activePreset ?? "custom"} />
        </Panel>
        <PredictExplain
          question={t("ffmAlphaExplainQuestion")}
          options={(["A", "B", "C"] as const).map((k) => ({ text: t(`ffmAlphaExplain${k}`), feedback: t(`ffmAlphaExplain${k}Feedback`), correct: k === "A" }))}
        />
        <AlphaChallenge data={data} />
      </div>
    </Workspace>
  );
}
