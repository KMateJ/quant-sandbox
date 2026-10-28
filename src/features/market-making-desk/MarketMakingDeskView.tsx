import { useCallback, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CommandBar, DemoBar, FunctionKeyBar, GameFrame, HelpSheet, QuoteStrip, ScreenTabs, ViewControls, useGameHelp, type GameHelp } from "../../components/game";
import { useExpandInPage } from "../../components/useExpandInPage";
import { useFullscreen } from "../../components/useFullscreen";
import { useI18n } from "../../i18n";
import MmDebriefScreen from "./components/MmDebriefScreen";
import MmDeskScreen from "./components/MmDeskScreen";
import MmMissionsScreen from "./components/MmMissionsScreen";
import MmSpeedControl from "./components/MmSpeedControl";
import { clockParts } from "./deskModel.math";
import MmGuide from "./help/MmGuide";
import MmNextMove from "./help/MmNextMove";
import MmWhatIf from "./help/MmWhatIf";
import { MM_SCREENS } from "./marketMakingDesk.url";
import { missionKeys, SCREEN_KEY } from "./mmCopy";
import { quoteCells } from "./quoteCells";
import { useMmSession, useMmUrl, type MmUrlModel } from "./useMarketMakingDesk";
import { useMmDemo } from "./useMmDemo";
import { useMmKeys } from "./useMmKeys";

const ID = "mmd-";

/// Market making desk: one route, three screens. The session is keyed on mission, seed and run;
/// expand / full-screen and help state live here so they survive a restart.
export default function MarketMakingDeskView() {
  const u = useMmUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: u.demo, idPrefix: ID });
  return (
    <MmSession key={`${u.mission.id}-${u.seed}-${u.run}`} u={u} rootRef={target} expanded={expanded} help={help}
      controls={<ViewControls deskId="mm" help={help} helpId={`${ID}help`} onDemo={u.startDemo} demo={u.demo}
        expanded={expanded} onExpand={toggle} fullscreen={fullscreen} />} />
  );
}

type SessionProps = { u: MmUrlModel; rootRef: (n: HTMLDivElement | null) => void; expanded: boolean; help: GameHelp; controls: ReactNode };

function MmSession({ u, rootRef, expanded, help, controls }: SessionProps) {
  const { t } = useI18n();
  const desk = useMmSession(u);
  const screen = u.url.screen;
  const keys = useMmKeys(desk, screen === "desk" && !u.demo);
  const demo = useMmDemo(desk);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((n: HTMLDivElement | null) => {
    setRoot(n);
    rootRef(n);
  }, [rootRef]);
  const clock = t("mmdClock", clockParts(desk.state.t, desk.mission.seconds));

  return (
    <GameFrame deskClass="mmd" expanded={expanded} demo={u.demo} rootRef={ref}>
      <CommandBar ticker="QSMM Market Maker" code="MMKR <GO>" title={t("mmdTitle")} demo={u.demo} clock={clock}
        actions={<><MmSpeedControl desk={desk} />{controls}<Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link></>} />
      <QuoteStrip id="mmd-quotes" cells={quoteCells(desk, t)} />
      <ScreenTabs id="mmd-tabs" screens={MM_SCREENS.map((id) => ({ id, label: t(SCREEN_KEY[id]) }))} value={screen}
        onChange={u.setScreen} intro={t("mmdIntro")} />
      {screen === "desk" && (
        <>
          <MmDeskScreen desk={desk} />
          {demo ? (
            <DemoBar id="mmd-demo" player={demo.player} caption={demo.caption} onMissions={() => u.setScreen("missions")} />
          ) : (
            <FunctionKeyBar id="mmd-keys" keys={keys} status={t("mmdStatusLine", { mission: desk.mission.id, seed: u.seed })} />
          )}
        </>
      )}
      {screen === "missions" && <MmMissionsScreen desk={desk} />}
      {screen === "debrief" && <MmDebriefScreen desk={desk} />}
      {root && (
        <HelpSheet help={help} idPrefix={ID} context={t(missionKeys(desk.mission.id).title)} container={root}
          next={<MmNextMove desk={desk} help={help} />} whatIf={<MmWhatIf desk={desk} />} guide={<MmGuide desk={desk} help={help} />} />
      )}
    </GameFrame>
  );
}
