import type { GameHelp } from "../../../components/game/useGameHelp";
import type { Translate } from "../missionCopy";
import { FUNCTION_KEYS, keyEnabled } from "../useFunctionKeys";
import type { HedgingDeskModel } from "../useHedgingDesk";
import type { AdviceAction } from "./advice.types";

/// Button label of an advice action.
export function adviceActionLabel(t: Translate, action: AdviceAction): string {
  switch (action.kind) {
    case "ticket": return t("gkHelpUseTicket");
    case "key": return t("hdAdvActKey", { code: action.code });
    case "screen": return t("hdAdvActDebrief");
    case "tab": return t(action.tab === "whatIf" ? "hdHelpOpenWhatIf" : "hdHelpOpenGuide");
    case "point": return t("gkHelpShowMe");
  }
}

/// True when the action is a function key that cannot run now (e.g. after expiry).
export function adviceActionDisabled(action: AdviceAction, desk: HedgingDeskModel): boolean {
  const key = action.kind === "key" ? FUNCTION_KEYS.find((k) => k.code === action.code) : undefined;
  return key !== undefined && !keyEnabled(key, desk);
}

/// Runs an advice action through the desk model and the help drawer. The ticket is filled, never sent.
export function runAdviceAction(action: AdviceAction, desk: HedgingDeskModel, help: GameHelp) {
  switch (action.kind) {
    case "ticket":
      desk.setTicketId(action.id);
      desk.setSide(action.side);
      desk.setQty(String(action.qty));
      help.point("ticket");
      break;
    case "key":
      FUNCTION_KEYS.find((k) => k.code === action.code)?.run(desk);
      break;
    case "screen":
      help.close();
      desk.setScreen(action.screen);
      break;
    case "tab":
      help.show(action.tab);
      break;
    case "point":
      help.point(action.anchor);
      break;
  }
}
