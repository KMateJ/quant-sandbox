import SliderField from "../../components/SliderField";
import { useI18n } from "../../i18n";
import type { DepositPlan } from "./tvm.math";
import { PLAN_LABELS, RACE_YEARS } from "./tvm.url";

type Props = { plans: DepositPlan[]; onChange: (i: number, patch: Partial<Pick<DepositPlan, "amount" | "start">>) => void };

/// Amount and start year of each race plan.
export default function TvmRacePlans({ plans, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="tvm-race-plans">
      {plans.map((plan, i) => (
        <fieldset key={i} className="tvm-race-plan">
          <legend>{t(PLAN_LABELS[i])}</legend>
          <SliderField
            label={t(plan.kind === "lump" ? "tvmRaceAmountLump" : "tvmRaceAmountYearly")}
            min={0}
            max={plan.kind === "lump" ? 50_000 : 5000}
            step={plan.kind === "lump" ? 500 : 100}
            value={plan.amount}
            onChange={(v) => onChange(i, { amount: v })}
            formatValue={(v) => Math.round(v).toLocaleString()}
          />
          <SliderField
            label={t("tvmRaceStart")}
            min={0}
            max={RACE_YEARS - 1}
            step={1}
            value={plan.start}
            onChange={(v) => onChange(i, { start: v })}
            formatValue={(v) => v.toFixed(0)}
          />
        </fieldset>
      ))}
    </div>
  );
}
