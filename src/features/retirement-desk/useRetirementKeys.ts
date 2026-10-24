import { useFunctionKeys, type GameKey } from "../../components/game";
import { useI18n } from "../../i18n";
import type { RetirementDeskModel } from "./useRetirementDesk";

/// F2–F9 of the retirement desk, bound to the keyboard while the desk screen is live (not in the demo).
export function useRetirementKeys(desk: RetirementDeskModel, active: boolean): GameKey[] {
  const { t } = useI18n();
  const live = !desk.state.settled && !desk.demo;
  const keys: GameKey[] = [
    { code: "F2", label: t("retrKeyTake"), run: desk.take, enabled: live && desk.valid },
    { code: "F3", label: t("retrKeyGuard5"), run: () => desk.takeGuard(), enabled: live },
    { code: "F4", label: t("retrKeyUseGuard"), run: desk.useGuard, enabled: live },
    { code: "F8", label: t("retrKeyNewPath"), run: desk.newPath, enabled: !desk.demo },
    { code: "F9", label: t("retrKeyRestart"), run: desk.restart, enabled: !desk.demo },
  ];
  useFunctionKeys(keys, active);
  return keys;
}
