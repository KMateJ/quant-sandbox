import { money, num, signed } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import type { RatesMission } from "./engine/rates.types";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const bp = (x: number) => num(x * 1e4, 1);

/// Plain-words curve drift of a mission.
function driftText(m: RatesMission, t: T): string {
  const { level, slope } = m.shock.drift;
  const parts: string[] = [];
  if (level > 0) parts.push(t("ratdMsDriftLevelUp", { bp: bp(level) }));
  if (level < 0) parts.push(t("ratdMsDriftLevelDown", { bp: bp(-level) }));
  if (slope < 0) parts.push(t("ratdMsDriftSteepen"));
  if (slope > 0) parts.push(t("ratdMsDriftFlatten"));
  return parts.length ? parts.join("; ") : t("ratdMsDriftNone");
}

/// Briefing setup rows: book, futures, opening position, days, vols, drift, cost and expiries.
export function setupRows(m: RatesMission, t: T): { label: string; value: string }[] {
  const { sigma } = m.shock;
  const opening = m.futures.flatMap((f, j) => (m.opening[j] ? [t("ratdMsSetupOpeningRow", { qty: signed(m.opening[j]), id: f.id })] : []));
  const expiries = m.futures.flatMap((f) => (f.expiryDay !== undefined ? [t("ratdMsSetupExpiryRow", { id: f.id, day: f.expiryDay })] : []));
  return [
    {
      label: t("ratdMsSetupBook"),
      value: m.book.length
        ? m.book.map((b) => t("ratdMsSetupBond", { id: b.id, c: num(b.coupon * 100, 2), face: money(b.face) })).join(" · ")
        : t("ratdMsSetupBookNone"),
    },
    { label: t("ratdMsSetupFutures"), value: m.futures.map((f) => t("ratdMsSetupFuture", { id: f.id, size: money(f.size) })).join(" · ") },
    { label: t("ratdMsSetupOpening"), value: opening.length ? opening.join(" · ") : t("ratdMsSetupOpeningNone") },
    { label: t("ratdMsSetupDays"), value: String(m.days) },
    { label: t("ratdMsSetupVol"), value: [sigma.level, sigma.slope, sigma.curvature].map(bp).join(" · ") },
    { label: t("ratdMsSetupDrift"), value: driftText(m, t) },
    { label: t("ratdMsSetupCost"), value: money(m.costPerContract) },
    { label: t("ratdMsSetupExpiry"), value: expiries.length ? expiries.join(" · ") : t("ratdMsSetupExpiryNone") },
  ];
}

/// Desk rules shown beside the briefing.
export const deskRules = (t: T) =>
  [1, 2, 3, 4].map((i) => ({ title: t(`ratdMsRule${i}Title` as TranslationKey), body: t(`ratdMsRule${i}Body` as TranslationKey) }));
