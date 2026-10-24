import { useMemo } from "react";
import { AdviceList, type GameHelp } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { RetirementDeskModel } from "../useRetirementDesk";
import { retirementAdvice } from "./advice.math";
import { adviceViews } from "./adviceView";

/// Next-move tab: ranked advice for the pending decision, each with one action.
export default function RetirementNextMove({ desk, help }: { desk: RetirementDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, equity, oddsNow } = desk;
  const amount = desk.amount ?? 0;
  const items = useMemo(() => retirementAdvice(mission, state, { amount, equity }, oddsNow), [mission, state, amount, equity, oddsNow]);
  return <AdviceList items={adviceViews(items, desk, help, t)} />;
}
