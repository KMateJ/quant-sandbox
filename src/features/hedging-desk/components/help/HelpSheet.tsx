import HelpDrawer from "../../../../components/ui/HelpDrawer";
import { useI18n } from "../../../../i18n";
import type { DeskHelp } from "../../help/useDeskHelp";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import HelpTabs from "./HelpTabs";
import NextMoveTab from "./NextMoveTab";
import WhatIfTab from "./WhatIfTab";
import GuideTab from "./GuideTab";

/// Desk help drawer, portalled into the `.hdesk` root so it keeps the terminal tokens and shows in full screen.
export default function HelpSheet({ desk, help, container }: { desk: HedgingDeskModel; help: DeskHelp; container: Element }) {
  const { t } = useI18n();
  return (
    <HelpDrawer
      open={help.open}
      onClose={help.close}
      title={t("hdHelpTitle")}
      closeLabel={t("hdHelpClose")}
      id="hd-help"
      container={container}
      className="hdesk-help"
      returnFocusRef={help.buttonRef}
      context={t("hdHelpContext", { mission: desk.mission.id, day: desk.day, days: desk.market.days })}
    >
      <HelpTabs help={help} />
      <div role="tabpanel" aria-labelledby={`hd-help-tab-${help.tab}`}>
        {help.tab === "next" && <NextMoveTab desk={desk} help={help} />}
        {help.tab === "whatIf" && <WhatIfTab desk={desk} help={help} />}
        {help.tab === "guide" && <GuideTab desk={desk} help={help} />}
      </div>
      <p className="hdesk-help-hint">{t("hdHelpKeysHint")}</p>
    </HelpDrawer>
  );
}
