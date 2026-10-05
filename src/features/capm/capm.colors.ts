/// Shared chart colours for the CAPM views (SML stays dominant; alpha uses semantic accents).
export const CAPM_COLORS = {
  sml: "#38bdf8",
  riskFree: "#94a3b8",
  market: "#f59e0b",
  capmPoint: "#64748b",
  alphaPositive: "#22c55e",
  alphaNegative: "#ef4444",
  guide: "#475569",
} as const;

/// Accent for an alpha value: green when positive, red when negative, neutral at zero.
export function alphaColor(value: number): string {
  if (value > 1e-5) return CAPM_COLORS.alphaPositive;
  if (value < -1e-5) return CAPM_COLORS.alphaNegative;
  return CAPM_COLORS.capmPoint;
}
