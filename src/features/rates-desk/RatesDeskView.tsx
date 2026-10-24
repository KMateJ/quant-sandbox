import { useCallback, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { useFullscreen } from "../../components/useFullscreen";
import { useExpandInPage } from "../../components/useExpandInPage";
import {
  CommandBar, DemoBar, FunctionKeyBar, GameFrame, HelpSheet, QuoteStrip, ScreenTabs, ViewControls, useFunctionKeys, useGameHelp, type GameHelp,
} from "../../components/game";
import { useRatesSession, useRatesUrl, type RatesUrlModel } from "./useRatesDesk";
import { deskKeys, quoteCells, statusLine } from "./ratesCopy";
import RatesDeskScreen from "./components/RatesDeskScreen";
import RatesMissionsScreen from "./components/RatesMissionsScreen";
import RatesDebriefScreen from "./components/RatesDebriefScreen";
import RatesNextMove from "./help/RatesNextMove";
import RatesWhatIf from "./help/RatesWhatIf";
import RatesGuide from "./help/RatesGuide";
import { useRatesDemo } from "./demo/useRatesDemo";

const ID = "ratd-";

/// Rates desk: hedge a bond book with futures on a moving curve. View state (expand, full screen, help)
/// lives above the session key so a new path or restart keeps it.
export default function RatesDeskView() {
  const { t } = useI18n();
  const url = useRatesUrl();
  const { target, ...fullscreen } = useFullscreen<HTMLDivElement>();
  const { expanded, toggle } = useExpandInPage();
  const help = useGameHelp({ disabled: url.demo, idPrefix: ID });
  const controls = (
    <>
      <Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link>
      <ViewControls deskId="rates" help={help} helpId={`${ID}help`} onDemo={url.demoSteps.length > 0 ? url.startDemo : undefined} demo={url.demo} expanded={expanded} onExpand={toggle} fullscreen={fullscreen} />
    </>
  );
  return (
    <Session key={`${url.mission.id}-${url.seed}-${url.run}`} url={url} rootRef={target} expanded={expanded} help={help} controls={controls} />
  );
}

type SessionProps = { url: RatesUrlModel; rootRef: (n: HTMLDivElement | null) => void; expanded: boolean; help: GameHelp; controls: ReactNode };

function Session({ url, rootRef, expanded, help, controls }: SessionProps) {
  const { t } = useI18n();
  const desk = useRatesSession(url);
  const demo = useRatesDemo(desk);
  const { screen } = desk.url;
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const merged = useCallback((n: HTMLDivElement | null) => {
    setRoot(n);
    rootRef(n);
  }, [rootRef]);
  const keys = deskKeys(desk, t);
  useFunctionKeys(keys, screen === "desk" && !desk.demo);
  const { day, mission } = desk;
  const screens = [
    { id: "desk" as const, label: t("gkScreenDesk") },
    { id: "missions" as const, label: t("gkScreenMissions") },
    { id: "debrief" as const, label: t("gkScreenDebrief") },
  ];

  const bar = demo.player && <DemoBar id={`${ID}keys`} player={demo.player} caption={demo.caption} onMissions={() => desk.setScreen("missions")} />;

  return (
    <GameFrame deskClass="ratd" expanded={expanded} demo={desk.demo} rootRef={merged}>
      <CommandBar
        ticker={t("ratdTicker")}
        code={t("ratdCode")}
        title={t("ratdTitle")}
        clock={t("ratdClock", { day, days: mission.days, left: mission.days - day })}
        demo={desk.demo}
        actions={controls}
      />
      <QuoteStrip id={`${ID}quotes`} cells={quoteCells(desk, t)} />
      <ScreenTabs id={`${ID}tabs`} screens={screens} value={screen} onChange={desk.setScreen} intro={t("ratdDesc")} />
      {screen === "desk" && (
        <>
          <RatesDeskScreen desk={desk} />
          {demo.player ? bar : <FunctionKeyBar id={`${ID}keys`} keys={keys} status={statusLine(desk, t)} />}
        </>
      )}
      {screen === "missions" && <RatesMissionsScreen desk={desk} />}
      {screen === "debrief" && (
        <>
          <RatesDebriefScreen desk={desk} />
          {demo.player && bar}
        </>
      )}
      {root && (
        <HelpSheet
          help={help}
          idPrefix={ID}
          context={t("ratdHelpContext", { id: mission.id, day })}
          container={root}
          next={<RatesNextMove desk={desk} help={help} />}
          whatIf={<RatesWhatIf desk={desk} help={help} />}
          guide={<RatesGuide desk={desk} help={help} />}
        />
      )}
    </GameFrame>
  );
}
