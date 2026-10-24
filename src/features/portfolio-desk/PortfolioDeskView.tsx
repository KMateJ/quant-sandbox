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
import PortfolioDebriefScreen from "./components/PortfolioDebriefScreen";
import PortfolioDeskScreen from "./components/PortfolioDeskScreen";
import PortfolioMissionsScreen from "./components/PortfolioMissionsScreen";
import PortfolioGuide from "./help/PortfolioGuide";
import PortfolioNextMove from "./help/PortfolioNextMove";
import PortfolioWhatIf from "./help/PortfolioWhatIf";
import { missionKeys, SCREEN_KEY } from "./portfolioCopy";
import { PORTFOLIO_SCREENS } from "./portfolioDesk.url";
import { quoteCells } from "./quoteCells";
import { usePortfolioDemo } from "./usePortfolioDemo";
import { usePortfolioKeys } from "./usePortfolioKeys";
import { usePortfolioSession, usePortfolioUrl, type PortfolioUrlModel } from "./usePortfolioDesk";

const ID = "pmgr-";

/// Portfolio manager desk: one route, three screens. The session is keyed on mission, seed and run;
/// expand / full-screen and help state live here so they survive a restart.
export default function PortfolioDeskView() {
  const u = usePortfolioUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: u.demo, idPrefix: ID });
  return (
    <PortfolioSession key={`${u.mission.id}-${u.seed}-${u.run}`} u={u} rootRef={target} expanded={expanded} help={help}
      controls={<ViewControls deskId="portfolio" help={help} helpId={`${ID}help`} onDemo={u.startDemo} demo={u.demo}
        expanded={expanded} onExpand={toggle} fullscreen={fullscreen} />} />
  );
}

type SessionProps = { u: PortfolioUrlModel; rootRef: (n: HTMLDivElement | null) => void; expanded: boolean; help: GameHelp; controls: ReactNode };

function PortfolioSession({ u, rootRef, expanded, help, controls }: SessionProps) {
  const { t } = useI18n();
  const desk = usePortfolioSession(u);
  const screen = u.url.screen;
  const keys = usePortfolioKeys(desk, screen === "desk" && !u.demo);
  const demo = usePortfolioDemo(desk);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((n: HTMLDivElement | null) => {
    setRoot(n);
    rootRef(n);
  }, [rootRef]);
  const { month } = desk.state;
  const { months } = desk.mission;

  return (
    <GameFrame deskClass="pmgr" expanded={expanded} demo={u.demo} rootRef={ref}>
      <CommandBar ticker="QSMA Multi-Asset Fund" code="PMGR <GO>" title={t("pmgrTitle")} demo={u.demo}
        clock={t("pmgrClock", { m: month, months, left: months - month })}
        actions={<>{controls}<Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link></>} />
      <QuoteStrip id="pmgr-quotes" cells={quoteCells(desk, t)} />
      <ScreenTabs id="pmgr-tabs" screens={PORTFOLIO_SCREENS.map((id) => ({ id, label: t(SCREEN_KEY[id]) }))} value={screen}
        onChange={u.setScreen} intro={t("pmgrIntro")} />
      {screen === "desk" && (
        <>
          <PortfolioDeskScreen desk={desk} />
          {demo ? (
            <DemoBar id="pmgr-demo" player={demo.player} caption={demo.caption} onMissions={() => u.setScreen("missions")} />
          ) : (
            <FunctionKeyBar id="pmgr-keys" keys={keys} status={t("pmgrStatusLine", { mission: desk.mission.id, seed: u.seed })} />
          )}
        </>
      )}
      {screen === "missions" && <PortfolioMissionsScreen desk={desk} />}
      {screen === "debrief" && <PortfolioDebriefScreen desk={desk} />}
      {root && (
        <HelpSheet help={help} idPrefix={ID} context={t(missionKeys(desk.mission.id).title)} container={root}
          next={<PortfolioNextMove desk={desk} help={help} />} whatIf={<PortfolioWhatIf desk={desk} />} guide={<PortfolioGuide desk={desk} help={help} />} />
      )}
    </GameFrame>
  );
}
