import { useRef } from "react";
import { useI18n } from "../../../../i18n";
import { useDemo } from "../../demo/useDemo";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import DemoCaption from "./DemoCaption";
import DemoControls from "./DemoControls";

/// Caption dock that replaces the function keys while the demo plays.
export default function DemoBar({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const barRef = useRef<HTMLElement>(null);
  const demo = useDemo(desk, barRef);
  if (!demo) return null;
  const openMissions = () => {
    demo.exit();
    desk.setScreen("missions");
  };
  return (
    <footer ref={barRef} id="hd-keys" className="hdesk-footer hdesk-demo-bar" role="region" aria-label={t("hdDemoBarAria")}>
      <div className="hdesk-demo-row">
        <DemoControls demo={demo} onMissions={openMissions} />
        <DemoCaption demo={demo} />
      </div>
      <p className="hdesk-status">{t("hdDemoKeysHint")}</p>
    </footer>
  );
}
