import Tabs from "../../../components/ui/Tabs";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { DeskScreen } from "../hedgingDesk.url";
import { DESK_SCREENS, type HedgingDeskModel } from "../useHedgingDesk";

const LABELS: Record<DeskScreen, TranslationKey> = {
  desk: "hdScreenDesk",
  missions: "hdScreenMissions",
  debrief: "hdScreenDebrief",
};

/// Desk / Missions / Debrief switch; the active screen lives in `?screen=`.
export default function ScreenTabs({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  return (
    <Tabs
      className="hdesk-tabs"
      ariaLabel={t("hdScreensAria")}
      items={DESK_SCREENS.map((id) => ({ id, label: t(LABELS[id]) }))}
      value={desk.url.screen}
      onChange={desk.setScreen}
    />
  );
}
