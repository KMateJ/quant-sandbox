import { num, pct } from "../../../components/game/gameFormat";
import type { TranslationKey } from "../../../i18n";
import { ASSET_KEY } from "../portfolioCopy";
import { ASSET_CODES, navIndex } from "../portfolioFormat";
import type { PortfolioAdvice } from "./advice.math";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const PCT_VARS = ["vol", "lo", "hi", "share", "limit", "dd", "change"];

/// Title, body and action label of one advice item, with its numbers formatted.
export function adviceText(a: PortfolioAdvice, t: Translate): { title: string; body: string; actionLabel?: string } {
  const v: Record<string, string | number> = { ...a.vars };
  for (const k of PCT_VARS) if (k in a.vars) v[k] = pct(a.vars[k]);
  if ("asset" in a.vars) v.asset = t(ASSET_KEY[ASSET_CODES[a.vars.asset]]);
  if ("costs" in a.vars) v.costs = num(a.vars.costs, 1);
  if (a.id === "ended") Object.assign(v, { nav: navIndex(a.vars.nav), bench: navIndex(a.vars.bench) });
  if (a.id === "costsHigh") v.limit = a.vars.limit;
  const variant = (a.id === "volOff" && !a.vars.hot) ? "_bodyCold" : (a.id === "quarterEnd" && !a.vars.over) ? "_bodyOk" : "_body";
  return {
    title: t(`pmgrAdv_${a.id}_title` as TranslationKey),
    body: t(`pmgrAdv_${a.id}${variant}` as TranslationKey, v),
    actionLabel: a.action ? t(actionKey(a.action)) : undefined,
  };
}

function actionKey(action: NonNullable<PortfolioAdvice["action"]>): TranslationKey {
  switch (action.kind) {
    case "fill":
      return action.preset === "scale" ? "pmgrAdvFillScale" : action.preset === "parity" ? "pmgrAdvFillParity" : "pmgrAdvFillBench";
    case "key":
      return ({ F2: "pmgrKeyNext", F3: "pmgrKeyPlus6", F4: "pmgrKeyScale", F6: "pmgrKeyParity" } as const)[action.code];
    case "screen":
      return "pmgrAdvOpenDebrief";
    case "tab":
      return action.tab === "whatIf" ? "pmgrAdvOpenWhatIf" : "pmgrAdvOpenGuide";
    case "point":
      return "gkHelpShowMe";
  }
}
