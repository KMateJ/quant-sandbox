import NumberInput from "../../../components/NumberInput";
import { ControlGroup, Tabs } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { OptObjective } from "../portfolioOptimization.types";
import type { useOptimization } from "../useOptimization";
import ToggleField from "./ToggleField";

type Props = { model: ReturnType<typeof useOptimization> };

/// Compact optimization problem panel: objective, target and constraints.
export default function OptimizationControls({ model }: Props) {
  const { t } = useI18n();
  const { objective, setObjective, constraints: c, updateConstraint } = model;

  const objectives: { id: OptObjective; label: string }[] = [
    { id: "minVariance", label: t("optObjMinVar") },
    { id: "maxSharpe", label: t("optObjMaxSharpe") },
    { id: "targetReturn", label: t("optObjTargetReturn") },
    { id: "targetVolatility", label: t("optObjTargetVol") },
  ];

  return (
    <>
      <ControlGroup label={t("optObjectiveLabel")}>
        <Tabs<OptObjective>
          items={objectives}
          value={objective}
          onChange={setObjective}
          ariaLabel={t("optObjectiveLabel")}
          segmented
          className="opt-objective"
        />
        {objective === "targetReturn" && (
          <div className="num-grid opt-target">
            <NumberInput label={t("optTargetReturnLabel")} value={model.targetReturn} onChange={model.setTargetReturn} percent step={0.5} min={-0.5} max={1} />
          </div>
        )}
        {objective === "targetVolatility" && (
          <div className="num-grid opt-target">
            <NumberInput label={t("optTargetVolLabel")} value={model.targetVol} onChange={model.setTargetVol} percent step={0.5} min={0} max={1} />
          </div>
        )}
      </ControlGroup>

      <ControlGroup label={t("optConstraintsLabel")}>
        <div className="opt-constraints">
          {!c.allowShort && <ToggleField label={t("optLongOnly")} value={c.longOnly} onChange={(v) => updateConstraint("longOnly", v)} />}
          <ToggleField label={t("optAllowShort")} value={c.allowShort} onChange={(v) => updateConstraint("allowShort", v)} />
          <div className="num-grid">
            <NumberInput label={t("optMinWeight")} value={c.minWeight} onChange={(v) => updateConstraint("minWeight", v)} percent step={5} min={-1} max={c.maxWeight} />
            <NumberInput label={t("optMaxWeight")} value={c.maxWeight} onChange={(v) => updateConstraint("maxWeight", v)} percent step={5} min={c.minWeight} max={1} />
          </div>
        </div>
      </ControlGroup>

      <ControlGroup label={t("optRiskFreeAsset")}>
        <ToggleField label={t("optRiskFreeAsset")} value={c.useRiskFree} onChange={(v) => updateConstraint("useRiskFree", v)} />
        {c.useRiskFree && (
          <>
            <div className="num-grid">
              <NumberInput label={t("optRiskFreeRate")} value={c.riskFree} onChange={(v) => updateConstraint("riskFree", v)} percent step={0.25} min={0} max={0.2} />
            </div>
            <ToggleField label={t("optAllowLeverage")} value={c.allowLeverage} onChange={(v) => updateConstraint("allowLeverage", v)} />
            {c.allowLeverage && (
              <div className="num-grid">
                <NumberInput label={t("optMaxGross")} value={c.maxGross} onChange={(v) => updateConstraint("maxGross", v)} percent step={10} min={1} max={3} />
              </div>
            )}
          </>
        )}
      </ControlGroup>
    </>
  );
}
