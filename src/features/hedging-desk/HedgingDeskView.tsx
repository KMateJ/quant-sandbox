import { Link } from "react-router-dom";
import { ViewControls, useGameHelp } from "../../components/game";
import { useI18n } from "../../i18n";
import { useFullscreen } from "../../components/useFullscreen";
import { useExpandInPage } from "../../components/useExpandInPage";
import DeskSession from "./DeskSession";
import { useDeskUrl } from "./useHedgingDesk";

/// Trading simulator for a short option book: one route, three screens (desk, missions, debrief).
/// The session is keyed on the effective mission, seed and run, so a new path or a restart starts a fresh book;
/// the expand / full-screen / help state lives here so it survives those resets.
export default function HedgingDeskView() {
  const { t } = useI18n();
  const deskUrl = useDeskUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: deskUrl.demo, idPrefix: "hd-" });
  const viewControls = (
    <>
      <Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link>
      <ViewControls
        deskId="hedging"
        help={help}
        helpId="hd-help"
        onDemo={deskUrl.startDemo}
        demo={deskUrl.demo}
        expanded={expanded}
        onExpand={toggle}
        fullscreen={fullscreen}
      />
    </>
  );
  return (
    <DeskSession
      key={`${deskUrl.mission.id}-${deskUrl.seed}-${deskUrl.run}`}
      deskUrl={deskUrl}
      rootRef={target}
      expanded={expanded}
      help={help}
      viewControls={viewControls}
    />
  );
}
