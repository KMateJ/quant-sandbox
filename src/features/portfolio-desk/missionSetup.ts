import { pct } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import type { PortfolioMission } from "./engine/portfolio.types";
import { volBandOf } from "./help/advice.math";
import { ASSET_CODES } from "./portfolioFormat";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const weights = (w: readonly number[]) => ASSET_CODES.map((c, i) => `${c} ${pct(w[i], 0)}`).join(" · ");

/// Briefing setup rows: assets and their long-run vols, opening weights, target and band, run, stress, cost, risk model.
export function missionSetup(m: PortfolioMission, t: Translate): { label: string; value: string }[] {
  const [lo, hi] = volBandOf(m);
  const stress =
    m.stressStart === "random"
      ? t("pmgrSetupStressRandom", { n: m.stressLength })
      : t("pmgrSetupStressFixed", { from: m.stressStart, to: m.stressStart + m.stressLength - 1 });
  return [
    { label: t("pmgrSetupAssets"), value: weights(m.calm.sigma) },
    { label: t("pmgrSetupStart"), value: weights(m.start) },
    { label: t("pmgrSetupTarget"), value: t("pmgrSetupTargetValue", { target: pct(m.target, 0), lo: pct(lo), hi: pct(hi) }) },
    { label: t("pmgrSetupMonths"), value: t("pmgrSetupMonthsValue", { n: m.months }) },
    { label: t("pmgrSetupStress"), value: stress },
    { label: t("pmgrSetupCost"), value: t("pmgrSetupCostValue", { bp: m.costBp }) },
    { label: t("pmgrSetupModel"), value: t("pmgrSetupModelValue", { lambda: m.lambda }) },
  ];
}

/// The four desk rules shown beside the briefing.
export const RULE_KEYS: readonly { title: TranslationKey; body: TranslationKey }[] = [
  { title: "pmgrRule1Title", body: "pmgrRule1Body" },
  { title: "pmgrRule2Title", body: "pmgrRule2Body" },
  { title: "pmgrRule3Title", body: "pmgrRule3Body" },
  { title: "pmgrRule4Title", body: "pmgrRule4Body" },
];
