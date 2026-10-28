import { num } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import type { MmMission } from "./engine/mm.types";
import { clockParts } from "./deskModel.math";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

/// Missions whose briefing states the informed share outright.
const ANNOUNCED_INFORMED = new Set(["MM3"]);

/// Informed-flow word shown in the briefing: low, some or high.
export const informedLevel = (share: number) => (share >= 0.25 ? "high" : share >= 0.1 ? "some" : "low");

/// Briefing setup rows: session, quote size, rebate and fee, limit, informed flow, news.
export function missionSetup(m: MmMission, t: Translate): { label: string; value: string }[] {
  const share = m.flow.informedShare;
  const informed = ANNOUNCED_INFORMED.has(m.id)
    ? t("mmdSetupInformedExact", { pct: Math.round(share * 100) })
    : t(`mmdSetupInformed_${informedLevel(share)}` as TranslationKey);
  const rows = [
    { label: t("mmdSetupSession"), value: t("mmdSetupSessionValue", { min: m.seconds / 60, s: m.seconds }) },
    { label: t("mmdSetupSize"), value: t("mmdShares", { n: num(m.quoteSize, 0) }) },
    { label: t("mmdSetupFees"), value: t("mmdSetupFeesValue", { rebate: (m.rebate * 100).toFixed(1), fee: (m.takerFee * 100).toFixed(1) }) },
    { label: t("mmdSetupLimit"), value: t("mmdShares", { n: num(m.limit, 0) }) },
    { label: t("mmdSetupInformed"), value: informed },
  ];
  if (m.news) {
    const c = clockParts(m.news.t, m.seconds);
    rows.push({ label: t("mmdSetupNews"), value: t("mmdSetupNewsValue", { mm: c.mm, ss: c.ss }) });
  }
  return rows;
}

/// The four desk rules shown beside the briefing.
export const RULE_KEYS: readonly { title: TranslationKey; body: TranslationKey }[] = [
  { title: "mmdRule1Title", body: "mmdRule1Body" },
  { title: "mmdRule2Title", body: "mmdRule2Body" },
  { title: "mmdRule3Title", body: "mmdRule3Body" },
  { title: "mmdRule4Title", body: "mmdRule4Body" },
];
