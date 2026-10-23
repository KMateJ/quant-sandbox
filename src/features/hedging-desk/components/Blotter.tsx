import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { eventTag, eventText } from "../blotterText";
import type { HedgingDeskModel } from "../useHedgingDesk";

const ROWS = 14;

/// The newest desk events: day, kind tag and formatted text.
export default function Blotter({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const events = desk.state.events.slice(0, ROWS);
  return (
    <Panel id="hd-blotter" title={t("hdBlotterTitle")} className="hdesk-panel" flush>
      <ol className="hdesk-blotter" aria-label={t("hdSideBlotterAria")}>
        {events.map((e, i) => (
          <li key={desk.state.events.length - i} className={`hdesk-blotter-row hdesk-blotter-row--${e.kind}`}>
            <span className="hdesk-num">{t("hdDayShort", { day: String(e.day).padStart(2, "0") })}</span>
            <span className="hdesk-blotter-kind">{eventTag(t, e)}</span>
            <span className="hdesk-blotter-text">{eventText(t, e, desk.mission)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
