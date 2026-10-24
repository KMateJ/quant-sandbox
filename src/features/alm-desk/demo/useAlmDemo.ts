import { useMemo } from "react";
import { useDemoPlayer } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { AlmDeskModel } from "../useAlmDesk";
import { demoStates } from "./demo.script";

/// Playthrough player for the session: each step restores the folded book; null outside demo mode.
export function useAlmDemo(desk: AlmDeskModel) {
  const { t } = useI18n();
  const steps = desk.demoSteps;
  const states = useMemo(() => demoStates(desk.mission, desk.seed, steps), [desk.mission, desk.seed, steps]);
  const player = useDemoPlayer({
    deskId: "alm",
    total: steps.length,
    holdMs: (i) => steps[i]?.holdMs ?? 0,
    onEnter: (i) => {
      desk.dispatch({ type: "restore", state: states[i] });
      desk.setScreen(steps[i].screen);
    },
    focusId: (i) => (steps[i] ? `almd-${steps[i].anchor}` : null),
    onTakeOver: desk.takeOver,
    onExit: desk.exitDemo,
    active: desk.demo && steps.length > 0,
  });
  const id = steps[player?.index ?? 0]?.id ?? "";
  const caption = { title: t(`almdDemo_${id}_title` as TranslationKey), body: t(`almdDemo_${id}_body` as TranslationKey) };
  return { player, caption };
}
