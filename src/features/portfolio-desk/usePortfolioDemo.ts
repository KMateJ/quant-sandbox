import { useMemo } from "react";
import { useDemoPlayer } from "../../components/game";
import { useI18n, type TranslationKey } from "../../i18n";
import { buildPortfolioDemo, demoStates } from "./demo/demo.script";
import type { PortfolioDeskModel } from "./usePortfolioDesk";

const STEPS = buildPortfolioDemo();

/// Scripted P1 playthrough: each step restores the folded book, shows its screen and lifts its panel.
/// Returns the player and caption, or null outside demo mode.
export function usePortfolioDemo(desk: PortfolioDeskModel) {
  const { t } = useI18n();
  const { demo, mission, path, seed } = desk;
  const states = useMemo(() => (demo ? demoStates(mission, path.R, seed) : []), [demo, mission, path, seed]);
  const player = useDemoPlayer({
    deskId: "portfolio",
    total: STEPS.length,
    holdMs: (i) => STEPS[i].holdMs,
    onEnter: (i) => {
      desk.dispatch({ type: "restore", state: states[i] });
      desk.setScreen(STEPS[i].screen);
    },
    focusId: (i) => `pmgr-${STEPS[i].anchor}`,
    onTakeOver: desk.takeOver,
    onExit: desk.exitDemo,
    active: demo,
  });
  if (!player) return null;
  const id = STEPS[player.index].id;
  return {
    player,
    caption: { title: t(`pmgrDemo_${id}_title` as TranslationKey), body: t(`pmgrDemo_${id}_body` as TranslationKey) },
  };
}
