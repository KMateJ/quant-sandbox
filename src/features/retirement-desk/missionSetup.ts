import { pct } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import type { RetirementMission } from "./engine/retirement.types";
import { amount } from "./retirementFormat";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

/// Briefing setup rows: pot, target, years, equity (and whether it is locked), return model and odds paths.
export function setupRows(m: RetirementMission, t: T): { label: string; value: string }[] {
  const model = (mu: number, sigma: number) => t("retrMsSetupModelValue", { mu: pct(mu, 1), sigma: pct(sigma, 0) });
  return [
    { label: t("retrMsSetupStart"), value: amount(m.start) },
    { label: t("retrMsSetupTarget"), value: amount(m.target) },
    { label: t("retrMsSetupYears"), value: String(m.years) },
    { label: t("retrMsSetupEquity"), value: pct(m.equity0, 0) },
    { label: t("retrMsSetupLocked"), value: t(m.equityLocked ? "retrMsSetupLockedYes" : "retrMsSetupLockedNo") },
    { label: t("retrMsSetupEquityModel"), value: model(m.muE, m.sigmaE) },
    { label: t("retrMsSetupBondModel"), value: model(m.muB, m.sigmaB) },
    { label: t("retrMsSetupPaths"), value: String(m.paths) },
  ];
}

/// Desk rules shown beside the briefing.
export const deskRules = (t: T) =>
  [1, 2, 3, 4].map((i) => ({ title: t(`retrMsRule${i}_title` as TranslationKey), body: t(`retrMsRule${i}_body` as TranslationKey) }));
