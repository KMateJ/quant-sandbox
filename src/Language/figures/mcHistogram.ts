// Strings for the "mc-histogram" guide figure. Keys are prefixed ixMc to stay unique.
import type { mcHistogramHu } from "./mcHistogram.hu";

export const mcHistogramEn: Record<keyof typeof mcHistogramHu, string> = {
  ixMcTitle: "A Monte Carlo simulation, live",
  ixMcPlay: "Play",
  ixMcPause: "Pause",
  ixMcReset: "Reset",
  ixMcControlsAria: "Simulation controls",
  ixMcHistAria: "Histogram of simulated terminal prices S_T; the call pays in the bins above the strike K",
  ixMcStripAria: "Running Monte Carlo estimate with its 95% band and the Black–Scholes price",
  ixMcEmpty: "Press +1 or Play to make the first draw.",
  ixMcStrike: "K = {{k}}",
  ixMcPays: "the call pays here",
  ixMcLast: "last draw: S_T = {{s}}",
  ixMcEstimateLabel: "Running estimate ± 1.96·SE",
  ixMcBsLabel: "Black–Scholes: {{v}}",
  ixMcDraws: "Draws",
  ixMcEstimate: "Estimated call price",
  ixMcSe: "Standard error",
  ixMcItm: "Share in the money",
  ixMcItmHint: "N(d₂) = {{v}}",
};
