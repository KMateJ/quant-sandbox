import { useMemo } from "react";
import { useI18n } from "../../../../i18n";
import { adviceHeadKey } from "../../help/adviceCopy";
import { deskAdvice } from "../../help/advice.math";
import type { AdviceTone } from "../../help/advice.types";
import type { DeskHelp } from "../../help/useDeskHelp";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import AdviceItem from "./AdviceItem";

const TONES: AdviceTone[] = ["urgent", "suggest", "info", "done"];

/// Live advice for the current book, grouped by urgency.
export default function NextMoveTab({ desk, help }: { desk: HedgingDeskModel; help: DeskHelp }) {
  const { t } = useI18n();
  const items = useMemo(() => deskAdvice(desk.mission, desk.state, desk.market), [desk.mission, desk.state, desk.market]);
  const urgent = items.filter((a) => a.tone === "urgent").length;
  return (
    <div>
      <div aria-live="polite" className="hdesk-advice-count">
        {urgent > 0 ? `${t(adviceHeadKey("urgent"))}: ${urgent}` : ""}
      </div>
      {items.length === 0 && <p className="hdesk-help-p">{t("hdAdvEmpty")}</p>}
      {TONES.map((tone) => {
        const group = items.filter((a) => a.tone === tone);
        if (group.length === 0) return null;
        return (
          <section key={tone}>
            <h3 className="hdesk-help-h">{t(adviceHeadKey(tone))}</h3>
            <ul className="hdesk-advice-list">
              {group.map((a) => (
                <AdviceItem key={a.id} advice={a} desk={desk} help={help} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
