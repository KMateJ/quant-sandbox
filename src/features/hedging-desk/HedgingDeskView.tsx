import { useI18n } from "../../i18n";
import { useCallback, useState, type ReactNode } from "react";
import { useFullscreen } from "../../components/useFullscreen";
import { useExpandInPage } from "../../components/useExpandInPage";
import FullscreenButton from "./components/FullscreenButton";
import { useDeskSession, useDeskUrl, type DeskUrlModel } from "./useHedgingDesk";
import DeskHeader from "./components/DeskHeader";
import ScreenTabs from "./components/ScreenTabs";
import DeskScreen from "./components/DeskScreen";
import FunctionKeys from "./components/FunctionKeys";
import MissionsScreen from "./components/MissionsScreen";
import DebriefScreen from "./components/DebriefScreen";
import DemoBar from "./components/demo/DemoBar";
import DemoButton from "./components/demo/DemoButton";
import HelpButton from "./components/help/HelpButton";
import HelpSheet from "./components/help/HelpSheet";
import { useDeskHelp, type DeskHelp } from "./help/useDeskHelp";

/// Trading simulator for a short option book: one route, three screens (desk, missions, debrief).
/// The session is keyed on the effective mission, seed and run, so a new path or a restart starts a fresh book;
/// the expand / full-screen view state lives here so it survives those resets.
export default function HedgingDeskView() {
  const deskUrl = useDeskUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useDeskHelp(deskUrl.demo);
  const viewControls = (
    <>
      <HelpButton help={help} hidden={deskUrl.demo} />
      <DemoButton onStart={deskUrl.startDemo} hidden={deskUrl.demo} />
      <FullscreenButton expanded={expanded} onExpand={toggle} fullscreen={fullscreen} />
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

type SessionProps = {
  deskUrl: DeskUrlModel;
  rootRef: (node: HTMLDivElement | null) => void;
  expanded: boolean;
  help: DeskHelp;
  viewControls: ReactNode;
};

function DeskSession({ deskUrl, rootRef, expanded, help, viewControls }: SessionProps) {
  const { t } = useI18n();
  const desk = useDeskSession(deskUrl);
  const { screen } = desk.url;
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    setRoot(node);
    rootRef(node);
  }, [rootRef]);

  return (
    <div className={["hdesk", expanded && "hdesk--expanded", desk.demo && "hdesk--demo"].filter(Boolean).join(" ")} ref={mergedRef} data-help-anchor={help.pointed ?? undefined}>
      <DeskHeader desk={desk} actions={viewControls} />
      <div className="hdesk-tabsrow" id="hd-tabs">
        <ScreenTabs desk={desk} />
        <p className="hdesk-intro">{t("hdDesc")}</p>
      </div>
      {screen === "desk" && (
        <>
          <DeskScreen desk={desk} />
          {desk.demo ? <DemoBar desk={desk} /> : <FunctionKeys desk={desk} />}
        </>
      )}
      {screen === "missions" && <MissionsScreen desk={desk} />}
      {screen === "debrief" && (
        <>
          <DebriefScreen desk={desk} />
          {desk.demo && <DemoBar desk={desk} />}
        </>
      )}
      {root && <HelpSheet desk={desk} help={help} container={root} />}
    </div>
  );
}
