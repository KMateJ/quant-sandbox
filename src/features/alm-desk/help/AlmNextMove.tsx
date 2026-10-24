import { useMemo } from "react";
import { AdviceList, num, signedMoney, money, type AdviceView, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { AlmDeskModel } from "../useAlmDesk";
import { almAdvice, type AlmAdvice, type AlmAdviceAction } from "./advice.math";

const MONEY_VARS = new Set(["surplus", "amount", "costs", "limit"]);

/// Live advice for the current book, with one action per item.
export default function AlmNextMove({ desk, help }: { desk: AlmDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const advice = useMemo(() => almAdvice(desk.mission, desk.state), [desk.mission, desk.state]);

  const fmt = (vars: Record<string, number>) =>
    Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, k === "surplus" ? signedMoney(v) : MONEY_VARS.has(k) ? money(v) : num(v, k === "gap" || k === "band" ? 2 : 0)]));
  const action = (a: AlmAdviceAction): NonNullable<AdviceView["action"]> => {
    switch (a.kind) {
      case "fillMatch":
        return { label: t("gkHelpUseTicket"), run: () => { desk.fillMatch(); help.point("ticket"); } };
      case "key":
        return a.code === "F2" ? { label: t("almdAdvActNext"), run: desk.step } : { label: t("almdKeyMatch"), run: desk.matchNow };
      case "screen":
        return { label: t("almdAdvActDebrief"), run: () => desk.setScreen(a.screen) };
      case "tab":
        return { label: t(a.tab === "whatIf" ? "almdAdvActWhatIf" : "almdAdvActGuide"), run: () => help.show(a.tab) };
      case "point":
        return { label: t("gkHelpShowMe"), run: () => help.point(a.anchor) };
      default: {
        const never: never = a;
        return never;
      }
    }
  };
  const items: AdviceView[] = advice.map((a: AlmAdvice) => ({
    id: `${a.id}-${a.tone}`,
    tone: a.tone,
    title: t(`almdAdv_${a.id}_title` as TranslationKey),
    body: t(`almdAdv_${a.id}_body` as TranslationKey, fmt(a.vars)),
    action: a.action && action(a.action),
  }));
  return <AdviceList items={items} />;
}
