import { useMemo } from "react";
import { useDemoPlayer } from "../../../components/game";
import { foldStates } from "../../../lib/game/demo";
import { useI18n, type TranslationKey } from "../../../i18n";
import { reduceRetirement, startRetirement } from "../engine/book.math";
import type { RetirementDeskModel } from "../useRetirementDesk";

/// Playthrough player for the session: each step restores the folded plan and screen; null outside demo mode.
export function useRetirementDemo(desk: RetirementDeskModel) {
  const { t } = useI18n();
  const { demoSteps: steps, mission, seed, shocks } = desk;
  const states = useMemo(
    () => foldStates(startRetirement(mission, seed), steps, (s, a) => reduceRetirement(s, a, mission, shocks)),
    [mission, seed, shocks, steps],
  );
  const player = useDemoPlayer({
    deskId: "retirement",
    total: steps.length,
    holdMs: (i) => steps[i]?.holdMs ?? 0,
    onEnter: (i) => {
      desk.dispatch({ type: "restore", state: states[i] });
      desk.setScreen(steps[i].screen);
    },
    focusId: (i) => (steps[i] ? `retr-${steps[i].anchor}` : null),
    onTakeOver: desk.takeOver,
    onExit: desk.exitDemo,
    active: desk.demo && steps.length > 0,
  });
  const id = steps[player?.index ?? 0]?.id ?? "";
  const caption = { title: t(`retrDemo_${id}_title` as TranslationKey), body: t(`retrDemo_${id}_body` as TranslationKey) };
  return { player, caption };
}
