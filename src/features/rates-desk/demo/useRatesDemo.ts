import { useMemo } from "react";
import { useDemoPlayer } from "../../../components/game";
import { foldStates } from "../../../lib/game/demo";
import { useI18n, type TranslationKey } from "../../../i18n";
import { reduceRates, startRates } from "../engine/book.math";
import type { RatesDeskModel } from "../useRatesDesk";

/// Playthrough player for the session: each step restores the folded book and screen; null outside demo mode.
export function useRatesDemo(desk: RatesDeskModel) {
  const { t } = useI18n();
  const { demoSteps: steps, mission, seed, path } = desk;
  const states = useMemo(
    () => foldStates(startRates(mission, seed, path), steps, (s, a) => reduceRates(s, a, mission, path)),
    [mission, seed, path, steps],
  );
  const player = useDemoPlayer({
    deskId: "rates",
    total: steps.length,
    holdMs: (i) => steps[i]?.holdMs ?? 0,
    onEnter: (i) => {
      desk.dispatch({ type: "restore", state: states[i] });
      desk.setScreen(steps[i].screen);
    },
    focusId: (i) => (steps[i] ? `ratd-${steps[i].anchor}` : null),
    onTakeOver: desk.takeOver,
    onExit: desk.exitDemo,
    active: desk.demo && steps.length > 0,
  });
  const id = steps[player?.index ?? 0]?.id ?? "";
  const caption = { title: t(`ratdDemo_${id}Title` as TranslationKey), body: t(`ratdDemo_${id}Body` as TranslationKey) };
  return { player, caption };
}
