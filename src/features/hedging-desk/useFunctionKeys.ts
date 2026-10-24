import { useFunctionKeys, type GameKey } from "../../components/game/gameHooks";
import { useI18n, type TranslationKey } from "../../i18n";
import type { HedgingDeskModel } from "./useHedgingDesk";

/// One terminal-style function key: its keyboard key, label and action.
export type FunctionKey = {
  code: string;
  label: TranslationKey;
  run: (desk: HedgingDeskModel) => void;
  /// Stays enabled after expiry.
  always?: boolean;
};

export const FUNCTION_KEYS: FunctionKey[] = [
  { code: "F2", label: "hdKeyNextDay", run: (d) => d.step(1) },
  { code: "F3", label: "hdKeyPlus5", run: (d) => d.step(5) },
  { code: "F4", label: "hdKeyAutoHedge", run: (d) => d.autoHedge() },
  { code: "F5", label: "hdKeyPlus21", run: (d) => d.step(21) },
  { code: "F8", label: "hdKeyNewPath", run: (d) => d.newPath(), always: true },
  { code: "F9", label: "hdKeyRestart", run: (d) => d.restart(), always: true },
];

/// True when the key can run now (desk keys are off after expiry).
export const keyEnabled = (key: FunctionKey, desk: HedgingDeskModel) => key.always || !desk.state.settled;

/// The desk's keys for the kit's function-key bar, bound to F2–F9 while the desk screen shows and no demo runs.
export function useDeskKeys(desk: HedgingDeskModel): GameKey[] {
  const { t } = useI18n();
  const keys = FUNCTION_KEYS.map((k) => ({
    code: k.code,
    label: t(k.label),
    run: () => k.run(desk),
    enabled: Boolean(keyEnabled(k, desk)),
  }));
  useFunctionKeys(keys, desk.url.screen === "desk" && !desk.demo);
  return keys;
}
