/// Parse a `#rrggbb` hex colour into its [r, g, b] components (0–255).
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function channel(value: number): string {
  return Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, "0");
}

/// Weighted blend of hex colours (e.g. 80% A + 20% B) into a single `#rrggbb` string.
export function blendColors(colors: string[], weights: number[]): string {
  const total = weights.reduce((acc, w) => acc + Math.abs(w), 0);
  if (total <= 0) return colors[0] ?? "#64748b";
  let r = 0;
  let g = 0;
  let b = 0;
  colors.forEach((color, i) => {
    const w = Math.abs(weights[i]) / total;
    const [cr, cg, cb] = hexToRgb(color);
    r += cr * w;
    g += cg * w;
    b += cb * w;
  });
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}
