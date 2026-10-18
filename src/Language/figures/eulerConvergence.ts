// Strings for the "euler-convergence" guide figure. Keys are prefixed ixEu to stay unique.

export const eulerConvergenceHu = {
  ixEuTitle: "Euler–Maruyama ugyanazon a Brown-pályán",
  ixEuStepsAria: "Lépések száma",
  ixEuSteps: "n = {{n}}",
  ixEuNewPath: "Új pálya",
  ixEuExact: "pontos megoldás",
  ixEuEuler: "Euler, {{n}} lépés",
  ixEuPathsAria: "A geometriai Brown-mozgás pontos pályája és Euler-közelítése ugyanazon a Brown-pályán. A nyílbillentyűkkel lehet a rácspontok között lépkedni.",
  ixEuInspect: "Vidd az egeret a grafikon fölé (vagy fókuszálj rá, és használd a nyílbillentyűket), hogy egy időpontban összevesd a két értéket.",
  ixEuAt: "t = {{t}}: pontos {{exact}}, Euler {{euler}}, eltérés {{err}}",
  ixEuErrorsHead: "Erős hiba T-ben az időlépés függvényében (500 pálya átlaga, log–log skála)",
  ixEuErrorsAria: "Az Euler-séma átlagos abszolút hibája a lejáratkor a négy lépésközre, log–log skálán, egy ½ meredekségű referenciavonallal",
  ixEuSlopeRef: "½ meredekség",
  ixEuExactT: "Pontos érték T-ben",
  ixEuEulerT: "Euler-érték T-ben",
  ixEuErrT: "Eltérés ezen a pályán",
  ixEuMeanErr: "Átlagos erős hiba (n = {{n}})",
};

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
