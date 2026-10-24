import { money, pct } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import { TENORS } from "../immunization/immunization.math";
import { almConfig } from "./engine/book.math";
import type { AlmMission } from "./engine/alm.types";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

/// Mix as "100% 5y bond" parts, skipping empty slots.
export function mixText(weights: number[], t: Translate): string {
  return weights
    .flatMap((w, i) => {
      if (w <= 1e-9) return [];
      const line = i < TENORS.length ? t("almdHoldBond", { tenor: TENORS[i] }) : t("almdHoldCash");
      return [t("almdSetupMixPart", { pct: pct(w, 0), line })];
    })
    .join(" · ");
}

/// Briefing setup rows of a mission.
export function setupRows(mission: AlmMission, t: Translate): { label: string; value: string }[] {
  const cfg = almConfig(mission);
  const rows = [
    { label: t("almdSetupLiability"), value: t("almdSetupLiabilityValue", { amount: money(cfg.liability), years: cfg.years }) },
    { label: t("almdSetupStart"), value: mixText(mission.startWeights, t) },
    { label: t("almdSetupShocks"), value: t("almdSetupShocksValue", { p: cfg.maxParallelBp, tw: cfg.maxTwistBp }) },
    { label: t("almdSetupCost"), value: t("almdSetupCostValue", { bp: cfg.costBp }) },
  ];
  if (mission.maxTrades !== undefined) rows.push({ label: t("almdSetupTrades"), value: t("almdSetupTradesValue", { n: mission.maxTrades }) });
  for (const e of cfg.extraLiabilities ?? [])
    rows.push({ label: t("almdSetupExtra"), value: t("almdSetupExtraValue", { amount: money(e.amount), year: e.year, from: e.from }) });
  return rows;
}
