import SliderField from "../../../components/SliderField";
import NumberInput from "../../../components/NumberInput";
import { Panel } from "../../../components/layout";
import { ControlGroup, Tabs } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { RR_RANGES } from "../riskReturn.url";
import type { RiskReturnLab } from "../useRiskReturnLab";
import AssetInputs from "./AssetInputs";
import OptimalAllocation from "./OptimalAllocation";

export default function RiskReturnControls({ lab }: { lab: RiskReturnLab }) {
  const { t } = useI18n();
  const { state, set, maxWeight } = lab;
  const { cmp } = state;

  const marks = [
    { value: 0, label: t("riskReturnMarkRiskFree") },
    { value: 1, label: t("riskReturnMarkRisky") },
    { value: maxWeight, label: t("riskReturnMarkLeveraged") },
  ];

  return (
    <Panel title={t("riskReturnControlsTitle")}>
      <ControlGroup label={t("riskReturnRiskyAssetGroup")}>
        <AssetInputs mu={state.mu} sigma={state.sigma} onChange={(v) => set({ mu: v.mu, sigma: v.sigma })} />
      </ControlGroup>

      <ControlGroup label={t("riskReturnRiskFreeGroup")}>
        <div className="num-grid">
          <NumberInput
            label={t("riskReturnRiskFreeLabel")}
            value={state.rf}
            onChange={(rf) => set({ rf })}
            min={RR_RANGES.riskFree[0]}
            max={RR_RANGES.riskFree[1]}
            percent
            step={0.25}
          />
        </div>
      </ControlGroup>

      <ControlGroup label={t("riskReturnAllocationGroup")}>
        <SliderField
          label={t("riskReturnWeightLabel")}
          min={0}
          max={maxWeight}
          step={0.01}
          value={state.w}
          onChange={(w) => set({ w })}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          marks={marks}
        />
        <p className="control-hint">{t("riskReturnDragHint")}</p>
      </ControlGroup>

      <OptimalAllocation lab={lab} />

      <ControlGroup label={t("riskReturnAssetB")}>
        <Tabs
          segmented
          ariaLabel={t("riskReturnAssetB")}
          value={cmp ? "compare" : "single"}
          onChange={(id) => set({ cmp: id === "compare" })}
          items={[
            { id: "single", label: t("riskReturnSingle") },
            { id: "compare", label: t("riskReturnCompare") },
          ]}
        />
        {cmp && <AssetInputs mu={state.muB} sigma={state.sigmaB} onChange={(v) => set({ muB: v.mu, sigmaB: v.sigma })} />}
      </ControlGroup>
    </Panel>
  );
}
