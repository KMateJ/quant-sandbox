import { FunctionKeyBar, useFunctionKeys, type GameKey } from "../../../components/game";
import { useI18n } from "../../../i18n";
import type { AlmDeskModel } from "../useAlmDesk";

/// F2 next year, F4 match duration, F8 new path, F9 restart (bound to the keyboard on the desk screen).
export default function AlmKeys({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const live = !desk.state.settled;
  const keys: GameKey[] = [
    { code: "F2", label: t("almdKeyNext"), run: desk.step, enabled: live },
    { code: "F4", label: t("almdKeyMatch"), run: desk.matchNow, enabled: live },
    { code: "F8", label: t("almdKeyNewPath"), run: desk.newPath, enabled: true },
    { code: "F9", label: t("almdKeyRestart"), run: desk.restart, enabled: true },
  ];
  useFunctionKeys(keys, !desk.demo && desk.url.screen === "desk");
  return <FunctionKeyBar id="almd-keys" keys={keys} status={t("almdStatusLine", { seed: desk.seed, bp: desk.cfg.costBp })} />;
}
