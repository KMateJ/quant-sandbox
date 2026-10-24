import { useFunctionKeys, type GameKey } from "../../components/game";
import { useI18n } from "../../i18n";
import type { PortfolioDeskModel } from "./usePortfolioDesk";

const HALF_YEAR = 6;

/// F2–F9 of the portfolio desk, bound to the keyboard while the desk screen is live (not in the demo).
export function usePortfolioKeys(desk: PortfolioDeskModel, active: boolean): GameKey[] {
  const { t } = useI18n();
  const live = !desk.state.settled && !desk.demo;
  const keys: GameKey[] = [
    { code: "F2", label: t("pmgrKeyNext"), run: () => desk.step(1), enabled: live },
    { code: "F3", label: t("pmgrKeyPlus6"), run: () => desk.step(HALF_YEAR), enabled: live },
    { code: "F4", label: t("pmgrKeyScale"), run: desk.scaleNow, enabled: live },
    { code: "F6", label: t("pmgrKeyParity"), run: desk.parityNow, enabled: live },
    { code: "F8", label: t("pmgrKeyNewPath"), run: desk.newPath, enabled: !desk.demo },
    { code: "F9", label: t("pmgrKeyRestart"), run: desk.restart, enabled: !desk.demo },
  ];
  useFunctionKeys(keys, active);
  return keys;
}
