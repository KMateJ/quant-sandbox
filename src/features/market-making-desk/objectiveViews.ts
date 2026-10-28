import type { ObjectiveView } from "../../components/game/GamePanels";
import { money, num, signedMoney } from "../../components/game/gameFormat";
import type { ObjectiveResult } from "../../lib/game/game.types";
import type { MmObjective } from "./engine/mm.types";
import { POLICY_KEY } from "./mmCopy";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// Objective label (with its limits) and measured value, ready for the kit's objective list.
export function objectiveView(r: ObjectiveResult<MmObjective>, t: Translate): ObjectiveView {
  const d = r.def;
  const view = (label: string, value: string): ObjectiveView => ({ label, value, status: r.status });
  switch (d.kind) {
    case "pnlFloor":
      return view(t("mmdObj_pnlFloor", { floor: signedMoney(d.floor) }), signedMoney(r.value));
    case "inventoryCap":
      return view(t("mmdObj_inventoryCap", { limit: num(d.limit, 0), allowed: d.allowed }), String(r.value));
    case "adverseCap":
      return view(t("mmdObj_adverseCap", { limit: money(d.limit) }), money(r.value));
    case "maxDrawdown":
      return view(t("mmdObj_maxDrawdown", { limit: money(d.limit) }), money(r.value));
    case "beatPolicy":
      return view(t("mmdObj_beatPolicy", { policy: t(POLICY_KEY[d.policy]) }), signedMoney(r.value));
    default: {
      const never: never = d;
      return never;
    }
  }
}
