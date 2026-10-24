import { useMemo } from "react";
import { AdviceList, type AdviceView } from "../../../../components/game";
import type { GameHelp } from "../../../../components/game/useGameHelp";
import { useI18n } from "../../../../i18n";
import { adviceBodyKey, adviceTitleKey } from "../../help/adviceCopy";
import { adviceActionDisabled, adviceActionLabel, runAdviceAction } from "../../help/adviceRun";
import { deskAdvice } from "../../help/advice.math";
import { formatAdviceVars } from "../../help/adviceVars";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Live advice for the current book, grouped by urgency.
export default function NextMoveTab({ desk, help }: { desk: HedgingDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const items = useMemo(() => deskAdvice(desk.mission, desk.state, desk.market), [desk.mission, desk.state, desk.market]);
  const views: AdviceView[] = items.map((a) => {
    const vars = formatAdviceVars(a);
    const act = a.action;
    return {
      id: a.id,
      tone: a.tone,
      title: t(adviceTitleKey(a.id), vars),
      body: t(adviceBodyKey(a.id), vars),
      action: act && {
        label: adviceActionLabel(t, act),
        disabled: adviceActionDisabled(act, desk),
        run: () => runAdviceAction(act, desk, help),
      },
    };
  });
  return <AdviceList items={views} />;
}
