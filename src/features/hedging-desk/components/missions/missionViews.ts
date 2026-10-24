import type { MissionListItem } from "../../../../components/game/MissionScreen";
import { signedMoney } from "../../../../components/game/gameFormat";
import type { TranslationKey } from "../../../../i18n";
import type { ProgressMap } from "../../../../lib/game/game.types";
import { MISSIONS } from "../../engine/missions.data";
import { missionTaglineKey, missionTitleKey, type Translate } from "../../missionCopy";

const GREEK_SYMBOL = { delta: "Δ", gamma: "Γ", vega: "ν" } as const;

/// Four short cards on how the simulated desk works: title key, body key.
export const RULES: [TranslationKey, TranslationKey][] = [
  ["hdMsRuleStepTitle", "hdMsRuleStep"],
  ["hdMsRuleSpreadTitle", "hdMsRuleSpread"],
  ["hdMsRuleMarkTitle", "hdMsRuleMark"],
  ["hdMsRuleCloseTitle", "hdMsRuleClose"],
];

/// Mission list rows: title, tagline, Greeks as tags, and the saved best P&L.
export function missionItems(t: Translate, progress: ProgressMap): MissionListItem[] {
  return MISSIONS.map((m) => {
    const saved = progress[m.id];
    return {
      id: m.id,
      title: t(missionTitleKey(m.id)),
      tagline: t(missionTaglineKey(m.id)),
      tags: m.greeks.map((g) => GREEK_SYMBOL[g]).join(" "),
      done: Boolean(saved?.completed),
      best: saved?.best == null ? undefined : signedMoney(saved.best),
    };
  });
}
