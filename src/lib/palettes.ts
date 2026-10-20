// Colour palettes the reader can pick in Settings. The first palette of each mode equals tokens.scss
// (so choosing it removes the override); the rest replace the themeable colour tokens.

export type PaletteMode = "dark" | "light";

export type PaletteBase = {
  bg: string;
  surface: string;
  rule: string;
  ruleStrong: string;
  text: string;
  muted: string;
  accent: string;
};

/// `mid`: a mid-tone palette (dim dark or overcast light), between the full dark and light grounds.
export type Palette = PaletteBase & { id: string; name: string; mode: PaletteMode; mid?: boolean };

const p = (mode: PaletteMode, id: string, name: string, base: PaletteBase, mid = false): Palette => ({ mode, id, name, ...base, mid });

export const PALETTES: Palette[] = [
  p("dark", "graphite", "Graphite", { bg: "#111214", surface: "#17181b", rule: "#26282c", ruleStrong: "#32353a", text: "#e8e8e6", muted: "#9a9b9c", accent: "#a8b8d8" }),
  p("dark", "steel-ink", "Steel ink", { bg: "#0d1117", surface: "#121821", rule: "#222b37", ruleStrong: "#2c3746", text: "#e6ebf1", muted: "#8b96a5", accent: "#8fb2dc" }),
  p("dark", "sapphire", "Sapphire", { bg: "#0a1222", surface: "#0f1a2e", rule: "#1c2840", ruleStrong: "#26344f", text: "#e8eef7", muted: "#8c9ab2", accent: "#6f9cf0" }),
  p("dark", "midnight-royal", "Midnight royal", { bg: "#060b18", surface: "#0b1224", rule: "#18213a", ruleStrong: "#232f4d", text: "#eef2fb", muted: "#8a97b3", accent: "#4d8dff" }),
  p("dark", "prussian", "Prussian", { bg: "#0b1b2b", surface: "#10233a", rule: "#1d3349", ruleStrong: "#284360", text: "#e9f0f6", muted: "#8fa4b8", accent: "#63b3e6" }),
  p("dark", "deep-cobalt", "Deep cobalt", { bg: "#0a1640", surface: "#0f1d4f", rule: "#1d2c63", ruleStrong: "#283a78", text: "#eef1fb", muted: "#98a5cc", accent: "#8fb0ff" }),
  p("dark", "bottle-green", "Bottle green", { bg: "#0b1512", surface: "#101d19", rule: "#1d2e28", ruleStrong: "#283e36", text: "#e6efe9", muted: "#8ca398", accent: "#7fc4a4" }),
  p("dark", "bordeaux", "Bordeaux", { bg: "#160d10", surface: "#1e1216", rule: "#302026", ruleStrong: "#3e2a31", text: "#f1e9ea", muted: "#a8949a", accent: "#d79aa6" }),
  p("dark", "dusk", "Dusk", { bg: "#232a35", surface: "#2a3240", rule: "#36404f", ruleStrong: "#435060", text: "#eef1f5", muted: "#a3adbb", accent: "#9cbcf0" }, true),
  p("dark", "slate-dim", "Slate dim", { bg: "#2b2e33", surface: "#32363c", rule: "#3e434a", ruleStrong: "#4b5159", text: "#eceef0", muted: "#a5abb2", accent: "#a9c1e0" }, true),
  p("light", "porcelain", "Porcelain", { bg: "#f5f7fb", surface: "#ffffff", rule: "#d6dce8", ruleStrong: "#c3cbdb", text: "#0f1b33", muted: "#5a6782", accent: "#1f55d1" }),
  p("light", "paper", "Paper", { bg: "#f6f3ec", surface: "#fbf9f4", rule: "#e2dccf", ruleStrong: "#cfc7b6", text: "#1d1a14", muted: "#6b6457", accent: "#1f4e8c" }),
  p("light", "fog", "Fog", { bg: "#eef0f2", surface: "#f8f9fa", rule: "#d9dde2", ruleStrong: "#c4cad1", text: "#14181d", muted: "#5d6670", accent: "#2f5d8a" }),
  p("light", "ivory-navy", "Ivory navy", { bg: "#faf8f3", surface: "#ffffff", rule: "#e6e1d6", ruleStrong: "#d3ccbc", text: "#0b1a33", muted: "#5f6878", accent: "#0b3d91" }),
  p("light", "snow", "Snow", { bg: "#fafafa", surface: "#ffffff", rule: "#e3e3e3", ruleStrong: "#d0d0d0", text: "#151515", muted: "#5f5f5f", accent: "#2457c5" }),
  p("light", "sky", "Sky", { bg: "#f1f6fb", surface: "#fbfdff", rule: "#d5e1ee", ruleStrong: "#bfd0e3", text: "#0d1e30", muted: "#55697f", accent: "#0f6fb8" }),
  p("light", "sage", "Sage", { bg: "#f2f4ef", surface: "#fafbf8", rule: "#dce1d6", ruleStrong: "#c7cfbf", text: "#17201a", muted: "#5b665d", accent: "#2f6b4f" }),
  p("light", "sand", "Sand", { bg: "#f3eee4", surface: "#faf7f1", rule: "#e0d7c6", ruleStrong: "#cdc1ac", text: "#211a10", muted: "#6c604e", accent: "#7a4b1e" }),
  p("light", "rose", "Rosé", { bg: "#f8f2f1", surface: "#fdfafa", rule: "#e9dcda", ruleStrong: "#d8c6c3", text: "#24151a", muted: "#6e5a5f", accent: "#8c2f45" }),
  p("light", "overcast", "Overcast", { bg: "#dfe3e8", surface: "#e9ecf0", rule: "#c9cfd7", ruleStrong: "#b6bec9", text: "#111823", muted: "#4b5563", accent: "#1d4fa8" }, true),
  p("light", "stone", "Stone", { bg: "#dcd9d2", surface: "#e6e3dd", rule: "#c8c4bb", ruleStrong: "#b5b0a5", text: "#1a1915", muted: "#555149", accent: "#2c4f7c" }, true),
];

/// Palettes of one mode; the first is the default from tokens.scss.
export function palettesFor(mode: PaletteMode): Palette[] {
  return PALETTES.filter((x) => x.mode === mode);
}

export function defaultPalette(mode: PaletteMode): Palette {
  return palettesFor(mode)[0];
}

export function paletteById(mode: PaletteMode, id: string | null | undefined): Palette {
  return palettesFor(mode).find((x) => x.id === id) ?? defaultPalette(mode);
}

/// sRGB mix of two #rrggbb colours: `t` = share of `b` (0…1).
export function mixHex(a: string, b: string, t: number): string {
  const ch = (c: string, i: number) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
  return `#${[0, 1, 2].map((i) => Math.round(ch(a, i) * (1 - t) + ch(b, i) * t).toString(16).padStart(2, "0")).join("")}`;
}

/// Every themeable colour token for a palette (derived ones are mixed from the base colours).
export function paletteTokens(x: Palette): Record<string, string> {
  const dark = x.mode === "dark";
  return {
    bg: x.bg,
    surface: x.surface,
    "surface-soft": mixHex(x.surface, x.text, dark ? 0.04 : 0.05),
    "surface-muted": dark ? mixHex(x.bg, x.surface, 0.6) : mixHex(x.bg, x.text, 0.04),
    text: x.text,
    "text-inverse": x.bg,
    "text-sub": mixHex(x.muted, x.text, 0.4),
    muted: x.muted,
    "text-dim": mixHex(x.muted, x.bg, 0.35),
    border: x.ruleStrong,
    "border-hover": mixHex(x.ruleStrong, x.text, 0.12),
    rule: x.rule,
    "rule-strong": x.ruleStrong,
    primary: x.accent,
    "primary-strong": mixHex(x.accent, dark ? x.bg : x.text, 0.15),
    accent: x.accent,
    "topbar-bg": x.bg,
  };
}

/// Inline declarations (`--bg:#…;…`) for a palette.
export function paletteDeclarations(x: Palette): string {
  return Object.entries(paletteTokens(x)).map(([k, v]) => `--${k}:${v}`).join(";");
}

/// Stylesheet text overriding the chosen non-default palettes for their themes ("" when both are default).
export function paletteCss(dark: Palette, light: Palette): string {
  const rules: string[] = [];
  if (dark.id !== defaultPalette("dark").id) rules.push(`:root:not([data-theme="light"]){${paletteDeclarations(dark)}}`);
  if (light.id !== defaultPalette("light").id) rules.push(`:root[data-theme="light"]{${paletteDeclarations(light)}}`);
  return rules.join("\n");
}
