import SliderField from "../../../components/SliderField";
import NumberInput from "../../../components/NumberInput";
import SwitchRow from "../../../components/SwitchRow";
import { Panel } from "../../../components/layout";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";

type RiskReturnControlsProps = {
  mu: number;
  sigma: number;
  riskFree: number;
  weight: number;
  maxWeight: number;
  compare: boolean;
  muB: number;
  sigmaB: number;
  onMu: (v: number) => void;
  onSigma: (v: number) => void;
  onRiskFree: (v: number) => void;
  onWeight: (v: number) => void;
  onCompare: (v: boolean) => void;
  onMuB: (v: number) => void;
  onSigmaB: (v: number) => void;
};

export default function RiskReturnControls(props: RiskReturnControlsProps) {
  const { t } = useI18n();
  const { mu, sigma, riskFree, weight, maxWeight, compare, muB, sigmaB } = props;

  const marks = [
    { value: 0, label: t("riskReturnMarkRiskFree") },
    { value: 1, label: t("riskReturnMarkRisky") },
    { value: maxWeight, label: t("riskReturnMarkLeveraged") },
  ];

  return (
    <Panel title={t("riskReturnControlsTitle")}>
      <ControlGroup label={t("riskReturnRiskyAssetGroup")}>
        <div className="num-grid">
          <NumberInput label={t("riskReturnMuLabel")} value={mu} onChange={props.onMu} min={0} max={0.5} percent step={0.5} />
          <NumberInput label={t("riskReturnSigmaLabel")} value={sigma} onChange={props.onSigma} min={0.01} max={0.6} percent step={0.5} />
        </div>
      </ControlGroup>

      <ControlGroup label={t("riskReturnRiskFreeGroup")}>
        <div className="num-grid">
          <NumberInput label={t("riskReturnRiskFreeLabel")} value={riskFree} onChange={props.onRiskFree} min={0} max={0.15} percent step={0.25} />
        </div>
      </ControlGroup>

      <ControlGroup label={t("riskReturnAllocationGroup")}>
        <SliderField
          label={t("riskReturnWeightLabel")}
          min={0}
          max={maxWeight}
          step={0.01}
          value={weight}
          onChange={props.onWeight}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          marks={marks}
        />
        <p className="control-hint">{t("riskReturnDragHint")}</p>
      </ControlGroup>

      <ControlGroup label={t("riskReturnAssetB")}>
        <SwitchRow
          groups={[
            {
              key: "compare",
              options: [
                { label: t("riskReturnSingle"), active: !compare, onSelect: () => props.onCompare(false) },
                { label: t("riskReturnCompare"), active: compare, onSelect: () => props.onCompare(true) },
              ],
            },
          ]}
        />
        {compare && (
          <div className="num-grid">
            <NumberInput label={t("riskReturnMuLabel")} value={muB} onChange={props.onMuB} min={0} max={0.5} percent step={0.5} />
            <NumberInput label={t("riskReturnSigmaLabel")} value={sigmaB} onChange={props.onSigmaB} min={0.01} max={0.6} percent step={0.5} />
          </div>
        )}
      </ControlGroup>
    </Panel>
  );
}
