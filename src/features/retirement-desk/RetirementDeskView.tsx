import { useCallback, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CommandBar,
  DemoBar,
  FunctionKeyBar,
  GameFrame,
  HelpSheet,
  QuoteStrip,
  ScreenTabs,
  ViewControls,
  useGameHelp,
  type GameHelp,
} from "../../components/game";
import { useExpandInPage } from "../../components/useExpandInPage";
import { useFullscreen } from "../../components/useFullscreen";
import { useI18n } from "../../i18n";
import RetirementDebriefScreen from "./components/RetirementDebriefScreen";
import RetirementDeskScreen from "./components/RetirementDeskScreen";
import RetirementMissionsScreen from "./components/RetirementMissionsScreen";
import RetirementGuide from "./help/RetirementGuide";
import RetirementNextMove from "./help/RetirementNextMove";
import RetirementWhatIf from "./help/RetirementWhatIf";
import { useRetirementDemo } from "./demo/useRetirementDemo";
import { SCREEN_KEY } from "./retirementCopy";
import { RETIREMENT_SCREENS } from "./retirementDesk.url";
import { quoteCells } from "./quoteCells";
import { useRetirementKeys } from "./useRetirementKeys";
import { useRetirementSession, useRetirementUrl, type RetirementUrlModel } from "./useRetirementDesk";

const ID = "retr-";

/// Retirement desk: one route, three screens. The session is keyed on mission, seed and run;
/// expand / full-screen and help state live here so they survive a restart.
export default function RetirementDeskView() {
  const u = useRetirementUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: u.demo, idPrefix: ID });
  return (
    <RetirementSession key={`${u.mission.id}-${u.seed}-${u.run}`} u={u} rootRef={target} expanded={expanded} help={help}
      controls={<ViewControls deskId="retirement" help={help} helpId={`${ID}help`} onDemo={u.demoSteps.length > 0 ? u.startDemo : undefined} demo={u.demo}
        expanded={expanded} onExpand={toggle} fullscreen={fullscreen} />} />
  );
}

type SessionProps = { u: RetirementUrlModel; rootRef: (n: HTMLDivElement | null) => void; expanded: boolean; help: GameHelp; controls: ReactNode };

function RetirementSession({ u, rootRef, expanded, help, controls }: SessionProps) {
  const { t } = useI18n();
  const desk = useRetirementSession(u);
  const demo = useRetirementDemo(desk);
  const screen = u.url.screen;
  const keys = useRetirementKeys(desk, screen === "desk");
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((n: HTMLDivElement | null) => {
    setRoot(n);
    rootRef(n);
  }, [rootRef]);
  const { year, broke } = desk.state;
  const { years } = desk.mission;
  const clock = broke ? t("retrClockBroke", { y: year }) : t("retrClock", { y: year, years, left: years - year });

  const bar = demo.player && <DemoBar id="retr-keys" player={demo.player} caption={demo.caption} onMissions={() => u.setScreen("missions")} />;

  return (
    <GameFrame deskClass="retr" expanded={expanded} demo={u.demo} rootRef={ref}>
      <CommandBar ticker="QSRT Retirement Plan" code="RETR <GO>" title={t("retrTitle")} demo={u.demo} clock={clock}
        actions={<>{controls}<Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link></>} />
      <QuoteStrip id="retr-quotes" cells={quoteCells(desk, t)} />
      <ScreenTabs id="retr-tabs" screens={RETIREMENT_SCREENS.map((id) => ({ id, label: t(SCREEN_KEY[id]) }))} value={screen}
        onChange={u.setScreen} intro={t("retrIntro")} />
      {screen === "desk" && (
        <>
          <RetirementDeskScreen desk={desk} />
          {bar ?? <FunctionKeyBar id="retr-keys" keys={keys} status={t("retrStatusLine", { mission: desk.mission.id, seed: u.seed })} />}
        </>
      )}
      {screen === "missions" && <RetirementMissionsScreen desk={desk} />}
      {screen === "debrief" && (
        <>
          <RetirementDebriefScreen desk={desk} />
          {bar}
        </>
      )}
      {root && (
        <HelpSheet help={help} idPrefix={ID} context={t("retrHelpContext", { id: desk.mission.id, y: year + 1 })} container={root}
          next={<RetirementNextMove desk={desk} help={help} />} whatIf={<RetirementWhatIf desk={desk} help={help} />}
          guide={<RetirementGuide desk={desk} help={help} />} />
      )}
    </GameFrame>
  );
}
