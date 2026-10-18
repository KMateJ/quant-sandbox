// Strings for the "iv-surface" guide figure. Keys are prefixed ixIv to stay unique.

export const ivSurfaceHu = {
  ixIvTitle: "A Heston-modell implikált volatilitási felülete",
  ixIvRho: "Korreláció ρ",
  ixIvXi: "Volatilitás volatilitása ξ",
  ixIvAxisStrike: "Kötési ár K",
  ixIvAxisMaturity: "Lejárat T (év)",
  ixIvValue: "Implikált volatilitás",
  ixIvAt: "IV, K = {{k}}, T = 1",
  ixIvSkew: "Ferdeség IV(80) − IV(120), T = {{t}}",
  ixIvHint: "Húzással forgatható, görgetéssel nagyítható.",
  ixIvComputing: "Felület számítása…",
  ixIvAria: "Forgatható háromdimenziós felület: a Heston-modell implikált volatilitása a kötési ár és a lejárat függvényében",
};

export const ivSurfaceEn: Record<keyof typeof ivSurfaceHu, string> = {
  ixIvTitle: "Heston implied-volatility surface",
  ixIvRho: "Correlation ρ",
  ixIvXi: "Vol of vol ξ",
  ixIvAxisStrike: "Strike K",
  ixIvAxisMaturity: "Maturity T (years)",
  ixIvValue: "Implied volatility",
  ixIvAt: "IV at K = {{k}}, T = 1",
  ixIvSkew: "Skew IV(80) − IV(120), T = {{t}}",
  ixIvHint: "Drag to rotate, scroll to zoom.",
  ixIvComputing: "Computing surface…",
  ixIvAria: "Rotatable 3D surface: Heston implied volatility against strike and maturity",
};
