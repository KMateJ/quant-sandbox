import type { AdviceView, GameHelp } from "../../../components/game";
import { pct } from "../../../components/game/gameFormat";
import type { TranslationKey } from "../../../i18n";
import { amount, spct } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";
import type { RetirementAdvice, RetirementAdviceAction } from "./advice.math";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const AMOUNTS = new Set(["wealth", "guard", "legacy", "amount"]);
const SHARES = new Set(["odds", "guardOdds", "rate"]);

/// Copy variables for one advice item: amounts, percentages and signed returns.
function adviceVars(a: RetirementAdvice): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(a.vars)) {
    out[k] = AMOUNTS.has(k) ? amount(v) : SHARES.has(k) ? pct(v, k === "rate" ? 1 : 0) : k === "r" ? spct(v) : v;
  }
  return out;
}

function actionView(x: RetirementAdviceAction, desk: RetirementDeskModel, help: GameHelp, t: T): AdviceView["action"] {
  const live = !desk.state.settled;
  switch (x.kind) {
    case "fill":
      return { label: t("retrAdvUseAmount"), disabled: !live, run: () => { desk.setAmount(String(x.amount)); help.point("ticket"); } };
    case "equity":
      return { label: t("retrAdvUseAmount"), disabled: !live, run: () => { desk.setEquity(x.equity); help.point("ticket"); } };
    case "key": {
      const run = { F2: desk.take, F3: () => desk.takeGuard(), F4: desk.useGuard }[x.code];
      return { label: t("retrAdvKey", { code: x.code }), run, disabled: !live };
    }
    case "screen":
      return { label: t("retrAdvOpenDebrief"), run: () => { help.close(); desk.setScreen(x.screen); } };
    case "tab":
      return { label: t(x.tab === "whatIf" ? "gkHelpTabWhatIf" : "gkHelpTabGuide"), run: () => help.show(x.tab) };
    case "point":
      return { label: t("gkHelpShowMe"), run: () => help.point(x.anchor) };
  }
}

/// Advice items as kit rows with translated text and wired actions.
export function adviceViews(items: RetirementAdvice[], desk: RetirementDeskModel, help: GameHelp, t: T): AdviceView[] {
  return items.map((a) => {
    const vars = adviceVars(a);
    return {
      id: a.id,
      tone: a.tone,
      title: t(`retrAdv_${a.id}_title` as TranslationKey, vars),
      body: t(`retrAdv_${a.id}_body` as TranslationKey, vars),
      action: a.action && actionView(a.action, desk, help, t),
    };
  });
}
