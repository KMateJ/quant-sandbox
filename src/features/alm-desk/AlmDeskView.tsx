import { useCallback, useState, type ReactNode } from "react";
import { DemoBar, GameFrame, HelpSheet, ScreenTabs, ViewControls, useGameHelp, type GameHelp } from "../../components/game";
import { useExpandInPage } from "../../components/useExpandInPage";
import { useFullscreen } from "../../components/useFullscreen";
import { useI18n } from "../../i18n";
import { ALM_SCREENS } from "./almDesk.url";
import AlmCommand from "./components/AlmCommand";
import AlmDebriefScreen from "./components/AlmDebriefScreen";
import AlmDeskScreen from "./components/AlmDeskScreen";
import AlmKeys from "./components/AlmKeys";
import AlmMissionsScreen from "./components/AlmMissionsScreen";
import { useAlmDemo } from "./demo/useAlmDemo";
import AlmGuide from "./help/AlmGuide";
import AlmNextMove from "./help/AlmNextMove";
import AlmWhatIf from "./help/AlmWhatIf";
import { missionTitleKey } from "./missionCopy";
import { useAlmSession, useAlmUrl, type AlmUrlModel } from "./useAlmDesk";

const ID = "almd-";

/// Pension ALM desk: fund a liability with a bond ladder, one year per step; three screens on one route.
/// The session is keyed on mission, seed and run; view state (expand, full screen, help) lives here.
export default function AlmDeskView() {
  const url = useAlmUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: url.demo, idPrefix: ID });
  const controls = (
    <ViewControls
      deskId="alm"
      help={help}
      helpId={`${ID}help`}
      onDemo={url.demoSteps.length > 0 ? url.startDemo : undefined}
      demo={url.demo}
      expanded={expanded}
      onExpand={toggle}
      fullscreen={fullscreen}
    />
  );
  return (
    <AlmSession key={`${url.mission.id}-${url.seed}-${url.run}`} url={url} rootRef={target} expanded={expanded} help={help} controls={controls} />
  );
}

type SessionProps = { url: AlmUrlModel; rootRef: (node: HTMLDivElement | null) => void; expanded: boolean; help: GameHelp; controls: ReactNode };

function AlmSession({ url, rootRef, expanded, help, controls }: SessionProps) {
  const { t } = useI18n();
  const desk = useAlmSession(url);
  const demo = useAlmDemo(desk);
  const screen = desk.url.screen;
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    setRoot(node);
    rootRef(node);
  }, [rootRef]);
  const screens = ALM_SCREENS.map((id) => ({ id, label: t(id === "desk" ? "gkScreenDesk" : id === "missions" ? "gkScreenMissions" : "gkScreenDebrief") }));

  return (
    <GameFrame deskClass="almd" expanded={expanded} demo={desk.demo} rootRef={ref}>
      <AlmCommand desk={desk} actions={controls} />
      <ScreenTabs id={`${ID}tabs`} screens={screens} value={screen} onChange={desk.setScreen} intro={t("almdDesc")} />
      {screen === "desk" && (
        <>
          <AlmDeskScreen desk={desk} />
          {demo.player ? <DemoBar id="almd-keys" player={demo.player} caption={demo.caption} onMissions={() => desk.setScreen("missions")} /> : <AlmKeys desk={desk} />}
        </>
      )}
      {screen === "missions" && <AlmMissionsScreen desk={desk} />}
      {screen === "debrief" && <AlmDebriefScreen desk={desk} />}
      {root && (
        <HelpSheet
          help={help}
          idPrefix={ID}
          context={t("almdHelpContext", { mission: t(missionTitleKey(desk.mission.id)), n: desk.state.game.round })}
          container={root}
          next={<AlmNextMove desk={desk} help={help} />}
          whatIf={<AlmWhatIf desk={desk} help={help} />}
          guide={<AlmGuide desk={desk} help={help} />}
        />
      )}
    </GameFrame>
  );
}
