import { useMemo } from "react";
import { AdviceList, type AdviceView, type GameHelp } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { PortfolioDeskModel } from "../usePortfolioDesk";
import { portfolioAdvice, type PortfolioAdviceAction } from "./advice.math";
import { adviceText } from "./adviceText";

/// Ranked next-move advice for the live book; each action fills the ticket, runs a key, or opens a view.
export default function PortfolioNextMove({ desk, help }: { desk: PortfolioDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, path } = desk;
  const items = useMemo(() => portfolioAdvice(mission, state, path.R), [mission, state, path]);

  const run = (a: PortfolioAdviceAction) => {
    switch (a.kind) {
      case "fill":
        ({ scale: desk.fillScale, parity: desk.fillParity, bench: desk.fillBench })[a.preset]();
        help.point("ticket");
        return;
      case "key":
        ({ F2: () => desk.step(1), F3: () => desk.step(6), F4: desk.scaleNow, F6: desk.parityNow })[a.code]();
        return;
      case "screen":
        help.close();
        desk.setScreen(a.screen);
        return;
      case "tab":
        help.show(a.tab);
        return;
      case "point":
        help.point(a.anchor);
    }
  };

  const views: AdviceView[] = items.map((a) => {
    const text = adviceText(a, t);
    const action = a.action;
    return {
      id: a.id,
      tone: a.tone,
      title: text.title,
      body: text.body,
      action: action && text.actionLabel ? { label: text.actionLabel, run: () => run(action), disabled: desk.demo } : undefined,
    };
  });
  return <AdviceList items={views} />;
}
