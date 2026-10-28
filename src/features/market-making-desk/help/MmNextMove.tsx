import { AdviceList, type AdviceView, type GameHelp } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { MmDeskModel } from "../useMarketMakingDesk";
import { mmAdvice, type MmAdviceAction, type MmKeyCode } from "./advice.math";
import { adviceText } from "./adviceText";

/// Ranked next-move advice for the live desk; "Do it" runs the key, "Show me" lifts a panel.
export default function MmNextMove({ desk, help }: { desk: MmDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const items = mmAdvice(desk.mission, desk.state);
  const keys: Record<MmKeyCode, () => void> = {
    F2: desk.play, F4: desk.join, F5: desk.widen, F6: desk.tighten, F7: desk.skewToSell, F8: desk.skewToBuy,
    F9: desk.state.quote.live ? desk.pull : desk.restore, F10: desk.hedgeFlat,
  };

  const run = (a: MmAdviceAction) => {
    switch (a.kind) {
      case "key":
        keys[a.code]();
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
