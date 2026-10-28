import { Panel } from "../../../../components/layout";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { CROSS_MODELS, type CrossModel } from "../../cross.types";
import type { FfTabProps } from "../../famaFrench.types";
import { useCrossTab } from "../../useCrossTab";
import AlphaGrid from "../cross/AlphaGrid";
import CornerChallenge from "../cross/CornerChallenge";
import CrossPredict from "../cross/CrossPredict";
import CrossScatter from "../cross/CrossScatter";
import CrossSummary from "../cross/CrossSummary";

/// Cross-section tab: do the factors price the 25 size and value portfolios? Switch model, read the alphas, play the challenge.
export default function CrossSectionTab({ data, window }: FfTabProps) {
  const { t } = useI18n();
  const model = useCrossTab(data, window);

  return (
    <div className="ffm-cross">
      <Panel>
        <p className="control-hint">{t("ffmCrossHint")}</p>
        <SegmentedControl<CrossModel>
          ariaLabel={t("ffmCrossModel")}
          value={model.model}
          onChange={model.setModel}
          options={CROSS_MODELS.map((m) => ({ value: m, label: m.toUpperCase() }))}
        />
      </Panel>
      <div className="ffm-cross-grid">
        <CrossScatter rows={model.rows} extent={model.extent} selected={model.selected?.label ?? ""} onSelect={model.select} ariaLabel={t("ffmCrossAria")} />
        <AlphaGrid rows={model.rows} selected={model.selected?.label ?? ""} onSelect={model.select} />
      </div>
      <CrossSummary model={model} />
      <CrossPredict model={model} />
      <CornerChallenge data={data} />
    </div>
  );
}
