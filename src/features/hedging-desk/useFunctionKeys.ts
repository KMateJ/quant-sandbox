import { useEffect, useRef } from "react";
import type { TranslationKey } from "../../i18n";
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

/// Binds F2–F9 to the desk actions while mounted, also while the ticket's quantity field has focus.
/// Keys with a modifier (e.g. Ctrl+F5) keep their browser meaning.
export function useFunctionKeys(desk: HedgingDeskModel) {
  const latest = useRef(desk);
  useEffect(() => {
    latest.current = desk;
  });
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (latest.current.demo) return;
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const key = FUNCTION_KEYS.find((k) => k.code === e.key);
      if (!key) return;
      e.preventDefault();
      if (keyEnabled(key, latest.current)) key.run(latest.current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
