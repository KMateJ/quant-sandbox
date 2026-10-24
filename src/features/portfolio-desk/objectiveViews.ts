import type { ObjectiveView } from "../../components/game/GamePanels";
import { num, pct, signed } from "../../components/game/gameFormat";
import type { ObjectiveResult } from "../../lib/game/game.types";
import type { PortfolioObjective } from "./engine/portfolio.types";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// Objective label (with its limits) and measured value, ready for the kit's objective list.
export function objectiveView(r: ObjectiveResult<PortfolioObjective>, t: Translate): ObjectiveView {
  const d = r.def;
  const view = (label: string, value: string): ObjectiveView => ({ label, value, status: r.status });
  switch (d.kind) {
    case "realizedVolBand":
      return view(t("pmgrObj_realizedVolBand", { lo: pct(d.lo), hi: pct(d.hi) }), pct(r.value));
    case "maxDrawdown":
      return view(t("pmgrObj_maxDrawdown", { limit: pct(d.limit, 0) }), pct(r.value));
    case "costsBelow":
      return view(t("pmgrObj_costsBelow", { limit: d.limitBp }), t("pmgrBp", { v: num(r.value, 1) }));
    case "riskShareMisses":
      return view(t("pmgrObj_riskShareMisses", { limit: pct(d.limit, 0), allowed: d.allowed }), String(r.value));
    case "beatBenchmarkSharpe":
      return view(t("pmgrObj_beatBenchmarkSharpe"), signed(r.value, 2));
    default: {
      const never: never = d;
      return never;
    }
  }
}
