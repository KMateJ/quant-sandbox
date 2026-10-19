// Strings for the "iv-surface" guide figure. Keys are prefixed ixIv to stay unique.
import type { ivSurfaceHu } from "./ivSurface.hu";

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
