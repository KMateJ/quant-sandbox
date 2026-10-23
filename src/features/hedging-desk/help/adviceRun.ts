import type { TranslationKey } from "../../../i18n";
import { FUNCTION_KEYS } from "../useFunctionKeys";
import type { HedgingDeskModel } from "../useHedgingDesk";
import type { AdviceAction } from "./advice.types";
import type { DeskHelp } from "./useDeskHelp";

/// Label key for an advice button (vars for `hdAdvActKey` come from `adviceActionVars`).
export function adviceActionLabel(action: AdviceAction): TranslationKey {
  switch (action.kind) {
    case "ticket": return "hdHelpUseTicket";
    case "key": return "hdAdvActKey";
    case "screen": return "hdAdvActDebrief";
    case "tab": return action.tab === "whatIf" ? "hdHelpOpenWhatIf" : "hdHelpOpenGuide";
    case "point": return "hdHelpShowMe";
  }
}

/// Runs an advice action through the desk model and the help drawer. The ticket is filled, never sent.
export function runAdviceAction(action: AdviceAction, desk: HedgingDeskModel, help: DeskHelp) {
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
