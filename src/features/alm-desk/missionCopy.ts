import type { ObjectiveView } from "../../components/game/GamePanels";
import { money, num, signedMoney } from "../../components/game/gameFormat";
import type { ObjectiveResult } from "../../lib/game/game.types";
import type { TranslationKey } from "../../i18n";
import type { AlmObjective } from "./engine/alm.types";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

/// Copy keys of a mission's title and brief.
export const missionTitleKey = (id: string) => `almdMission${id}Title` as TranslationKey;
export const missionBriefKey = (id: string) => `almdMission${id}Brief` as TranslationKey;

/// Label and measured value of one objective.
export function objectiveText(def: AlmObjective, value: number, t: Translate): { label: string; value: string } {
  switch (def.kind) {
    case "surplusAtEnd":
      return { label: t("almdObjSurplusAtEnd", { floor: signedMoney(def.floor) }), value: signedMoney(value) };
    case "gapMisses":
      return { label: t("almdObjGapMisses", { band: num(def.band, 2), allowed: def.allowed }), value: String(value) };
    case "convexityMisses":
      return { label: t("almdObjConvMisses", { band: num(def.band, 0), allowed: def.allowed }), value: String(value) };
    case "costsBelow":
      return { label: t("almdObjCostsBelow", { limit: money(def.limit) }), value: money(value) };
    case "maxTrades":
      return { label: t("almdObjMaxTrades", { limit: def.limit }), value: String(value) };
    case "surplusFloor":
      return { label: t("almdObjSurplusFloor", { floor: signedMoney(def.floor) }), value: signedMoney(value) };
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Objective results as rows for the kit's objective list.
export const objectiveViews = (results: ObjectiveResult<AlmObjective>[], t: Translate): ObjectiveView[] =>
  results.map((r) => ({ ...objectiveText(r.def, r.value, t), status: r.status }));
