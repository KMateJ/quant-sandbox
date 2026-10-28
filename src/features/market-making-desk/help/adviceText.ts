import { money, num, pct, signed, signedMoney } from "../../../components/game/gameFormat";
import type { TranslationKey } from "../../../i18n";
import type { MmAdvice } from "./advice.math";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const KEY_LABEL: Record<string, TranslationKey> = {
  F2: "mmdKeyPlay", F4: "mmdKeyJoin", F5: "mmdKeyWiden", F6: "mmdKeyTighten", F7: "mmdKeySkewSell",
  F8: "mmdKeySkewBuy", F9: "mmdAdvPullOrRestore", F10: "mmdKeyHedge",
};

/// Title, body and action label of one advice item, with its numbers formatted.
export function adviceText(a: MmAdvice, t: Translate): { title: string; body: string; actionLabel?: string } {
  const v: Record<string, string | number> = { ...a.vars };
  if ("pnl" in a.vars) v.pnl = signedMoney(a.vars.pnl);
  if ("inv" in a.vars) v.inv = a.id === "inventoryNear" ? num(Math.abs(a.vars.inv), 0) : signed(a.vars.inv, 0);
  if ("limit" in a.vars) v.limit = num(a.vars.limit, 0);
  if ("share" in a.vars) v.share = pct(a.vars.share, 0);
  if ("adverse" in a.vars) v.adverse = money(a.vars.adverse);
  if ("warn" in a.vars) v.warn = money(a.vars.warn);
  if ("ahead" in a.vars) v.ahead = num(a.vars.ahead, 0);
  const variant = (a.id === "inventoryNear" && !a.vars.long) || (a.id === "oneSided" && !a.vars.bought) ? "_bodyShort" : "_body";
  return {
    title: t(`mmdAdv_${a.id}_title` as TranslationKey),
    body: t(`mmdAdv_${a.id}${variant}` as TranslationKey, v),
    actionLabel: a.action ? t(actionKey(a.action)) : undefined,
  };
}

function actionKey(action: NonNullable<MmAdvice["action"]>): TranslationKey {
  switch (action.kind) {
    case "key":
      return KEY_LABEL[action.code];
    case "screen":
      return "mmdAdvOpenDebrief";
    case "tab":
      return action.tab === "whatIf" ? "mmdAdvOpenWhatIf" : "mmdAdvOpenGuide";
    case "point":
      return "gkHelpShowMe";
  }
}
