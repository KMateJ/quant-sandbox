import { useI18n, type TranslationKey } from "../../../../i18n";
import { adviceBodyKey, adviceTitleKey } from "../../help/adviceCopy";
import { formatAdviceVars } from "../../help/adviceVars";
import type { Advice, AdviceAction } from "../../help/advice.types";
import type { DeskHelp } from "../../help/useDeskHelp";
import { FUNCTION_KEYS, keyEnabled } from "../../useFunctionKeys";
import type { HedgingDeskModel } from "../../useHedgingDesk";

const TAB_LABEL: Record<"whatIf" | "guide", TranslationKey> = {
  whatIf: "hdHelpOpenWhatIf",
  guide: "hdHelpOpenGuide",
};

/// One advice item: title, body and its single action button.
export default function AdviceItem({ advice, desk, help }: { advice: Advice; desk: HedgingDeskModel; help: DeskHelp }) {
  const { t } = useI18n();
  const vars = formatAdviceVars(advice);
  const action = advice.action;

  const run = (a: AdviceAction) => {
    switch (a.kind) {
      case "ticket":
        desk.setTicketId(a.id);
        desk.setSide(a.side);
        desk.setQty(String(a.qty));
        help.point("ticket");
        break;
      case "key":
        FUNCTION_KEYS.find((k) => k.code === a.code)?.run(desk);
        break;
      case "screen":
        help.close();
        desk.setScreen(a.screen);
        break;
      case "tab":
        help.show(a.tab);
        break;
      case "point":
        help.point(a.anchor);
        break;
    }
  };
  const label = (a: AdviceAction) => {
    switch (a.kind) {
      case "ticket": return t("hdHelpUseTicket");
      case "key": return t("hdAdvActKey", { code: a.code });
      case "screen": return t("hdAdvActDebrief");
      case "tab": return t(TAB_LABEL[a.tab]);
      case "point": return t("hdHelpShowMe");
    }
  };
  const disabled = action?.kind === "key" && !keyEnabled(FUNCTION_KEYS.find((k) => k.code === action.code)!, desk);

  return (
    <li className={`hdesk-help-section hdesk-advice hdesk-help-tone--${advice.tone}`}>
      <strong className="hdesk-advice-title">{t(adviceTitleKey(advice.id), vars)}</strong>
      <p className="hdesk-help-p">{t(adviceBodyKey(advice.id), vars)}</p>
      {action && (
        <div className="hdesk-help-actions">
          <button type="button" className="hdesk-btn" disabled={disabled} onClick={() => run(action)}>
            {label(action)}
          </button>
        </div>
      )}
    </li>
  );
}
