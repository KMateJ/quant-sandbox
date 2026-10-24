import { useMemo } from "react";
import { AdviceList, type GameHelp } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";
import { ratesAdvice } from "./advice.math";
import { adviceViews } from "./adviceView";

/// Next-move tab: ranked advice for the current book, each with one action.
export default function RatesNextMove({ desk, help }: { desk: RatesDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, path } = desk;
  const items = useMemo(() => ratesAdvice(mission, state, path), [mission, state, path]);
  return <AdviceList items={adviceViews(items, desk, help, t)} />;
}
