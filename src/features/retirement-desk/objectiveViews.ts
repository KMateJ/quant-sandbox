import type { ObjectiveView } from "../../components/game/GamePanels";
import { pct } from "../../components/game/gameFormat";
import type { ObjectiveResult } from "../../lib/game/game.types";
import type { RetirementObjective } from "./engine/retirement.types";
import { amount } from "./retirementFormat";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// Objective label (with its limits) and measured value, ready for the kit's objective list.
export function objectiveView(r: ObjectiveResult<RetirementObjective>, t: Translate, years: number): ObjectiveView {
  const d = r.def;
  const view = (label: string, value: string): ObjectiveView => ({ label, value, status: r.status });
  switch (d.kind) {
    case "moneyLasts":
      return view(t("retrObj_moneyLasts", { years }), t("retrObjOddsValue", { odds: pct(r.value, 0) }));
    case "avgSpendAtLeast":
      return view(t("retrObj_avgSpendAtLeast", { amount: amount(d.amount) }), amount(r.value));
    case "cutsAtMost":
      return view(t("retrObj_cutsAtMost", { allowed: d.allowed }), String(r.value));
    case "legacyAtLeast":
      return view(t("retrObj_legacyAtLeast", { amount: amount(d.amount) }), amount(r.value));
    case "oddsNeverBelow":
      return view(t("retrObj_oddsNeverBelow", { floor: pct(d.floor, 0) }), pct(r.value, 0));
    default: {
      const never: never = d;
      return never;
    }
  }
}
