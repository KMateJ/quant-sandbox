import { useCallback, useState, type ReactNode } from "react";
import {
  CommandBar, DemoBar, FunctionKeyBar, GameFrame, HelpSheet, QuoteStrip, ScreenTabs, type GameHelp,
} from "../../components/game";
import { useI18n } from "../../i18n";
import DeskScreen from "./components/DeskScreen";
import DebriefScreen from "./components/DebriefScreen";
import MissionsScreen from "./components/MissionsScreen";
import NextMoveTab from "./components/help/NextMoveTab";
import WhatIfTab from "./components/help/WhatIfTab";
import GuideTab from "./components/help/GuideTab";
import { stepBodyKey, stepTitleKey } from "./demo/demoCopy";
import { useDeskDemo } from "./demo/useDeskDemo";
import { deskQuotes } from "./deskQuotes";
import { DESK_SCREENS, useDeskSession, type DeskUrlModel } from "./useHedgingDesk";
import { useDeskKeys } from "./useFunctionKeys";

/// Fictional ticker and function code shown on the command bar (not user copy).
const TICKER = "QSBX US Equity";
const FUNCTION_CODE = "HDGS <GO>";
const SCREEN_LABELS = { desk: "gkScreenDesk", missions: "gkScreenMissions", debrief: "gkScreenDebrief" } as const;

type Props = {
  deskUrl: DeskUrlModel;
  rootRef: (node: HTMLDivElement | null) => void;
  expanded: boolean;
  help: GameHelp;
  viewControls: ReactNode;
};

/// One run of a mission: frame, command bar, quotes, the active screen, function keys or demo bar, help drawer.
export default function DeskSession({ deskUrl, rootRef, expanded, help, viewControls }: Props) {
  const { t } = useI18n();
  const desk = useDeskSession(deskUrl);
  const keys = useDeskKeys(desk);
  const { player, step } = useDeskDemo(desk);
  const { screen } = desk.url;
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    setRoot(node);
    rootRef(node);
  }, [rootRef]);
  const demoBar = player && step && (
    <DemoBar
      id="hd-keys"
      player={player}
      caption={{ title: t(stepTitleKey(step.id)), body: t(stepBodyKey(step.id)) }}
      onMissions={() => desk.setScreen("missions")}
    />
  );

  return (
    <GameFrame deskClass="hdesk" expanded={expanded} demo={desk.demo} rootRef={mergedRef}>
      <CommandBar
        ticker={TICKER}
        code={FUNCTION_CODE}
        title={t("hdTitle")}
        clock={t("hdSimClock", { day: desk.day, days: desk.market.days, left: desk.market.days - desk.day })}
        demo={desk.demo}
        actions={viewControls}
      />
      <QuoteStrip id="hd-quotes" cells={deskQuotes(t, desk)} />
      <ScreenTabs
        id="hd-tabs"
        screens={DESK_SCREENS.map((id) => ({ id, label: t(SCREEN_LABELS[id]) }))}
        value={screen}
        onChange={desk.setScreen}
        intro={t("hdDesc")}
      />
      {screen === "desk" && (
        <>
          <DeskScreen desk={desk} />
          {demoBar || <FunctionKeyBar id="hd-keys" keys={keys} status={t("hdStatusLine", { seed: desk.seed })} />}
        </>
      )}
      {screen === "missions" && <MissionsScreen desk={desk} />}
      {screen === "debrief" && (
        <>
          <DebriefScreen desk={desk} />
          {demoBar}
        </>
      )}
      {root && (
        <HelpSheet
          help={help}
          idPrefix="hd-"
          context={t("hdHelpContext", { mission: desk.mission.id, day: desk.day, days: desk.market.days })}
          container={root}
          next={<NextMoveTab desk={desk} help={help} />}
          whatIf={<WhatIfTab desk={desk} help={help} />}
          guide={<GuideTab desk={desk} point={help.point} />}
        />
      )}
    </GameFrame>
  );
}
