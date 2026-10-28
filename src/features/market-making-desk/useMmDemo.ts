import { useMemo } from "react";
import { useDemoPlayer } from "../../components/game";
import { useI18n, type TranslationKey } from "../../i18n";
import { buildMmDemo, demoStates } from "./demo/demo.script";
import type { MmDeskModel } from "./useMarketMakingDesk";

const STEPS = buildMmDemo();

/// Scripted MM1 playthrough: each step restores the folded desk state, shows its screen and lifts its panel.
/// Returns the player and caption, or null outside demo mode.
export function useMmDemo(desk: MmDeskModel) {
  const { t } = useI18n();
  const { demo, mission, market, seed } = desk;
  const states = useMemo(() => (demo ? demoStates(mission, market, seed) : []), [demo, mission, market, seed]);
  const player = useDemoPlayer({
    deskId: "mm",
    total: STEPS.length,
    holdMs: (i) => STEPS[i].holdMs,
    onEnter: (i) => {
      desk.pause();
      desk.dispatch({ type: "restore", state: states[i] });
      desk.setScreen(STEPS[i].screen);
    },
    focusId: (i) => `mmd-${STEPS[i].anchor}`,
    onTakeOver: desk.takeOver,
    onExit: desk.exitDemo,
    active: demo,
  });
  if (!player) return null;
  const id = STEPS[player.index].id;
  return {
    player,
    caption: { title: t(`mmdDemo_${id}_title` as TranslationKey), body: t(`mmdDemo_${id}_body` as TranslationKey) },
  };
}
