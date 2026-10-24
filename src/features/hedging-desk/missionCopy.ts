import type { TranslationKey } from "../../i18n";
import type { ObjectiveView } from "../../components/game/GamePanels";
import type { ObjectiveDef, ObjectiveResult } from "./engine/desk.types";
import { money, num, signed, signedMoney } from "../../components/game/gameFormat";

/// Translator shape shared by the desk's copy helpers (matches `useI18n().t`).
export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/// Mission copy lives in `HedgingDeskMissions.ts` under `hdMission<id>Title|Tagline|Brief`.
export const missionTitleKey = (id: string) => `hdMission${id}Title` as TranslationKey;
export const missionTaglineKey = (id: string) => `hdMission${id}Tagline` as TranslationKey;
export const missionBriefKey = (id: string) => `hdMission${id}Brief` as TranslationKey;

const assertNever = (x: never): never => {
  throw new Error(`Unhandled objective kind: ${JSON.stringify(x)}`);
};

/// Objective label, e.g. "Net Δ inside ±100 sh at each close".
export function objectiveText(t: Translate, def: ObjectiveDef, band: number): string {
  switch (def.kind) {
    case "maxBreaches": return t("hdObjMaxBreaches", { band });
    case "pnlWithin": return t("hdObjPnlWithin", { limit: def.limit });
    case "costsBelow": return t("hdObjCostsBelow", { limit: def.limit });
    case "maxTrades": return t("hdObjMaxTrades", { limit: def.limit });
    case "pnlAbove": return t("hdObjPnlAbove", { limit: def.limit });
    case "gammaLimitFrom": return t("hdObjGammaLimitFrom", { limit: def.limit, fromDay: def.fromDay });
    case "gapLoss": return t("hdObjGapLoss", { limit: def.limit });
    case "vegaLimitBy": return t("hdObjVegaLimitBy", { limit: def.limit, byDay: def.byDay });
    case "beatPolicy": return t("hdObjBeatPolicy", { every: def.every });
    case "flatStock": return t("hdObjFlatStock");
    default: return assertNever(def);
  }
}

/// Live value line under an objective, e.g. "1 of 3 breaches allowed".
export function objectiveValueText(t: Translate, result: ObjectiveResult): string {
  const { def, value } = result;
  switch (def.kind) {
    case "maxBreaches": return t("hdObjMaxBreachesValue", { value, limit: def.limit });
    case "pnlWithin":
    case "pnlAbove": return t("hdObjPnlValue", { value: signedMoney(value) });
    case "costsBelow": return t("hdObjCostsBelowValue", { value: money(value) });
    case "maxTrades": return t("hdObjMaxTradesValue", { value, limit: def.limit });
    case "gammaLimitFrom": return t("hdObjGammaLimitFromValue", { value: num(value, 1) });
    case "gapLoss": return t("hdObjGapLossValue", { value: signedMoney(value) });
    case "vegaLimitBy": return t("hdObjVegaLimitByValue", { value: money(value) });
    case "beatPolicy": return t("hdObjBeatPolicyValue", { value: signedMoney(value) });
    case "flatStock": return t("hdObjFlatStockValue", { value: signed(value) });
    default: return assertNever(def);
  }
}

/// Kit rows for the mission's evaluated objectives: label, measured value and status word source.
export const objectiveViews = (t: Translate, results: ObjectiveResult[], band: number): ObjectiveView[] =>
  results.map((o) => ({ label: objectiveText(t, o.def, band), value: objectiveValueText(t, o), status: o.status }));
