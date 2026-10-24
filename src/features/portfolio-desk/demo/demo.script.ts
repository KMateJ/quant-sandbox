import { foldStates } from "../../../lib/game/demo";
import type { DemoStepBase } from "../../../lib/game/game.types";
import { reducePortfolio, startPortfolio } from "../engine/book.math";
import type { PortfolioAction, PortfolioMission, PortfolioState } from "../engine/portfolio.types";
import type { PortfolioScreen } from "../portfolioDesk.url";

export type PortfolioDemoStep = DemoStepBase<PortfolioScreen, PortfolioAction>;

/// Mission and path the playthrough runs on.
export const PORTFOLIO_DEMO_MISSION = "P1";
export const PORTFOLIO_DEMO_SEED = 3;
const HOLD = 6500;

/// The six narrated steps of the P1 playthrough: welcome, scale, six months, risk parity, six more, your turn.
export function buildPortfolioDemo(): PortfolioDemoStep[] {
  const step = (id: string, anchor: string, actions: PortfolioAction[]): PortfolioDemoStep => ({ id, screen: "desk", anchor, actions, holdMs: HOLD });
  return [
    step("welcome", "quotes", []),
    step("scale", "risk", [{ type: "scaleToTarget" }]),
    step("sixMonths", "nav", [{ type: "step", months: 6 }]),
    step("parity", "ticket", [{ type: "riskParity" }]),
    step("sixMore", "heat", [{ type: "step", months: 6 }]),
    step("yourTurn", "mission", []),
  ];
}

/// Book after each demo step, folded through the reducer from a fresh start (deterministic per mission + seed).
export function demoStates(mission: PortfolioMission, R: number[][], seed: number): PortfolioState[] {
  return foldStates(startPortfolio(mission, seed), buildPortfolioDemo(), (s, a) => reducePortfolio(s, a, mission, R));
}
