// Strings for the "euler-convergence" guide figure. Keys are prefixed ixEu to stay unique.
import type { eulerConvergenceHu } from "./eulerConvergence.hu";

export const eulerConvergenceEn: Record<keyof typeof eulerConvergenceHu, string> = {
  ixEuTitle: "Euler–Maruyama on the same Brownian path",
  ixEuStepsAria: "Number of steps",
  ixEuSteps: "n = {{n}}",
  ixEuNewPath: "New path",
  ixEuExact: "exact solution",
  ixEuEuler: "Euler, {{n}} steps",
  ixEuPathsAria: "Exact geometric Brownian motion path and its Euler approximation on the same Brownian path. Use the arrow keys to step between grid points.",
  ixEuInspect: "Hover over the chart (or focus it and use the arrow keys) to compare the two values at one time.",
  ixEuAt: "t = {{t}}: exact {{exact}}, Euler {{euler}}, error {{err}}",
  ixEuErrorsHead: "Strong error at T against the time step (average over 500 paths, log–log scale)",
  ixEuErrorsAria: "Mean absolute error of the Euler scheme at maturity for the four step sizes, on a log–log scale, with a reference line of slope one half",
  ixEuSlopeRef: "slope ½",
  ixEuExactT: "Exact value at T",
  ixEuEulerT: "Euler value at T",
  ixEuErrT: "Error on this path",
  ixEuMeanErr: "Mean strong error (n = {{n}})",
};
