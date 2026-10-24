import type { AdviceView, GameHelp } from "../../../components/game";
import { money, signed, signedMoney } from "../../../components/game/gameFormat";
import type { TranslationKey } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";
import type { RatesAdvice, RatesAdviceAction } from "./advice.math";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const SIGNED_MONEY = new Set(["net", "value", "gap", "pnl", "target"]);
const MONEY = new Set(["band", "limit", "costs"]);
const BUCKETS: TranslationKey[] = ["ratdBucket0", "ratdBucket1", "ratdBucket2"];

/// Copy variables for one advice item: dollars, contract ids, bucket names and side words.
function adviceVars(a: RatesAdvice, desk: RatesDeskModel, t: T): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(a.vars)) {
    if (SIGNED_MONEY.has(k)) out[k] = signedMoney(v);
    else if (MONEY.has(k)) out[k] = money(v);
    else if (k === "future") out[k] = desk.mission.futures[v]?.id ?? "";
    else if (k === "bucket") out[k] = t(BUCKETS[v]);
    else if (k === "bp") out[k] = signed(v);
    else out[k] = Math.abs(v);
  }
  if (a.action?.kind === "ticket") out.side = t(a.action.side === "BUY" ? "ratdBuy" : "ratdSell");
  return out;
}

function actionView(x: RatesAdviceAction, desk: RatesDeskModel, help: GameHelp, t: T): AdviceView["action"] {
  switch (x.kind) {
    case "ticket":
      return {
        label: t("gkHelpUseTicket"),
        run: () => {
          desk.setFuture(x.future);
          desk.setSide(x.side === "BUY" ? "buy" : "sell");
          desk.setQty(String(x.qty));
          help.point("ticket");
        },
      };
    case "krdHedge":
      return { label: t("ratdAdvDoKrd"), run: desk.hedgeKrd, disabled: desk.state.settled };
    case "key": {
      const run = { F2: () => desk.step(1), F3: () => desk.step(5), F4: desk.hedgeDv01, F6: desk.hedgeKrd }[x.code];
      return { label: t("ratdAdvDoKey", { code: x.code }), run, disabled: desk.state.settled };
    }
    case "screen":
      return { label: t("ratdAdvOpenDebrief"), run: () => { help.close(); desk.setScreen(x.screen); } };
    case "tab":
      return { label: t("ratdAdvOpenWhatIf"), run: () => help.show(x.tab) };
    case "point":
      return { label: t("gkHelpShowMe"), run: () => help.point(x.anchor) };
  }
}

/// Advice items as kit rows with translated text and wired actions.
export function adviceViews(items: RatesAdvice[], desk: RatesDeskModel, help: GameHelp, t: T): AdviceView[] {
  return items.map((a) => {
    const vars = adviceVars(a, desk, t);
    return {
      id: a.id,
      tone: a.tone,
      title: t(`ratdAdv_${a.id}Title` as TranslationKey, vars),
      body: t(`ratdAdv_${a.id}Body` as TranslationKey, vars),
      action: a.action && actionView(a.action, desk, help, t),
    };
  });
}
