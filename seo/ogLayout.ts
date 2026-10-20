import { buildFan } from "../src/features/home/home.fan.math.ts";
import type { OgColors } from "./theme.ts";

/// What one Open Graph card shows.
export type OgCard = { title: string; kind: string; section?: string; site: string; tagline: string; icon: string };

/// Minimal element tree Satori accepts in place of JSX.
export type SatoriNode = { type: string; props: { style?: Record<string, unknown>; src?: string; width?: number; height?: number; children?: (SatoriNode | string)[] | SatoriNode | string } };

const el = (type: string, style: Record<string, unknown>, children?: SatoriNode["props"]["children"]): SatoriNode => ({
  type,
  props: { style, children },
});

/// Font families, one per subset (ogImages.ts registers them); Inter only fills glyphs the others lack (Greek).
export const OG_FONTS = {
  serif: { pkg: "newsreader", subsets: ["latin", "latin-ext"] },
  mono: { pkg: "geist-mono", subsets: ["latin", "latin-ext"] },
  inter: { pkg: "inter", subsets: ["latin", "latin-ext", "greek"] },
} as const;
const family = (key: keyof typeof OG_FONTS) => OG_FONTS[key].subsets.map((s) => `${OG_FONTS[key].pkg} ${s}`);
const SERIF = [...family("serif"), ...family("inter")].join(", ");
const MONO = [...family("mono"), ...family("inter")].join(", ");

const FAN_W = 420;
const FAN_H = 330;

/// The home page's Monte Carlo fan as an SVG data URI: quiet paths, one key path in the accent.
function fanImage(colors: OgColors): string {
  const fan = buildFan({ seed: 7, paths: 40, steps: 48, mu: 0.07, sigma: 0.3, s0: 100, lo: 40, hi: 230, x0: 6, x1: FAN_W - 6, yTop: 10, yBottom: FAN_H - 10, bins: 1 });
  const paths = fan.paths
    .map((p, i) => (i === fan.keyIndex ? "" : `<path d="${p.d}" stroke="${colors.muted}" stroke-opacity="0.28" stroke-width="1" fill="none"/>`))
    .join("");
  const key = `<path d="${fan.paths[fan.keyIndex].d}" stroke="${colors.accent}" stroke-width="2.4" fill="none"/>`;
  const mean = `<path d="${fan.mean}" stroke="${colors.text}" stroke-opacity="0.7" stroke-width="1.2" stroke-dasharray="4 5" fill="none"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${FAN_W}" height="${FAN_H}" viewBox="0 0 ${FAN_W} ${FAN_H}">${paths}${mean}${key}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

const titleSize = (title: string) => (title.length > 80 ? 48 : title.length > 48 ? 58 : 72);
const eyebrow = (color: string, text: string) => el("div", { fontFamily: MONO, fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color }, text);

/// 1200×630 card in the site's style: serif wordmark and title, mono labels, hairline rules, one accent mark. Pure.
export function ogLayout(card: OgCard, colors: OgColors): SatoriNode {
  const header = el("div", { display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 26, borderBottom: `1px solid ${colors.rule}` }, [
    el("div", { fontFamily: SERIF, fontSize: 34, color: colors.text, letterSpacing: -0.3 }, card.site),
    eyebrow(colors.muted, card.tagline),
  ]);
  const size = titleSize(card.title);
  const title = el(
    "div",
    { display: "block", fontFamily: SERIF, fontSize: size, lineHeight: 1.08, letterSpacing: -0.5, color: colors.text, maxHeight: size * 1.08 * 4, overflow: "hidden", lineClamp: 4 },
    card.title
  );
  const fan: SatoriNode = { type: "img", props: { src: fanImage(colors), width: FAN_W, height: FAN_H, style: {} } };
  const middle = el("div", { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexGrow: 1 }, [
    el("div", { display: "flex", flexGrow: 1, flexBasis: 0 }, [title]),
    fan,
  ]);
  // The home and fallback cards use the tagline as their kind; it is already in the header.
  const kind = card.kind === card.tagline ? "" : card.section ? `${card.kind} · ${card.section}` : card.kind;
  const footer = el("div", { display: "flex", alignItems: "center", gap: 16, paddingTop: 26, borderTop: `1px solid ${colors.rule}` }, [
    el("div", { width: 14, height: 14, backgroundColor: colors.accent }),
    el("div", { display: "block", flexGrow: 1, flexBasis: 0, fontFamily: MONO, fontSize: 20, letterSpacing: 2, textTransform: "uppercase", color: colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, kind || card.site),
  ]);
  // Satori sizes boxes without their padding, so the padding lives on an inner column that fills the card.
  return el("div", { display: "flex", width: "100%", height: "100%", backgroundColor: colors.bg }, [
    el("div", { display: "flex", flexDirection: "column", flexGrow: 1, padding: "56px 64px", gap: 28 }, [header, middle, footer]),
  ]);
}
