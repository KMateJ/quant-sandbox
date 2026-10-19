import type { OgColors } from "./theme.ts";

/// What one Open Graph card shows.
export type OgCard = { title: string; kind: string; section?: string; site: string; tagline: string; icon: string };

/// Minimal element tree Satori accepts in place of JSX.
export type SatoriNode = { type: string; props: { style?: Record<string, unknown>; src?: string; width?: number; height?: number; children?: (SatoriNode | string)[] | SatoriNode | string } };

const el = (type: string, style: Record<string, unknown>, children?: SatoriNode["props"]["children"]): SatoriNode => ({
  type,
  props: { style, children },
});

/// Font family list; ogImages.ts registers one family per Inter subset under these names.
export const OG_FONT_SUBSETS = ["latin", "latin-ext", "greek"] as const;
const OG_FONT_FAMILY = OG_FONT_SUBSETS.map((s) => `Inter ${s}`).join(", ");

const titleSize = (title: string) => (title.length > 80 ? 44 : title.length > 48 ? 52 : 64);

/// 1200×630 card: site row, title, then kind · section above a full-width primary rule. Pure; no React.
export function ogLayout(card: OgCard, colors: OgColors): SatoriNode {
  const icon: SatoriNode = { type: "img", props: { src: card.icon, width: 56, height: 56, style: { borderRadius: 8 } } };
  const header = el("div", { display: "flex", alignItems: "center", gap: 20 }, [
    icon,
    el("div", { fontSize: 32, fontWeight: 700, color: colors.text }, card.site),
    el("div", { fontSize: 24, color: colors.muted }, card.tagline),
  ]);
  const size = titleSize(card.title);
  const title = el(
    "div",
    { display: "block", fontSize: size, fontWeight: 700, lineHeight: 1.1, color: colors.text, maxHeight: size * 1.1 * 3, overflow: "hidden", lineClamp: 3 },
    card.title
  );
  // The home and fallback cards use the tagline as their kind; it is already in the header, so leave the row empty.
  const meta = el("div", { fontSize: 28, color: colors.muted }, card.kind === card.tagline ? " " : card.section ? `${card.kind} · ${card.section}` : card.kind);
  // Satori sizes boxes without their padding, so the padding lives on an inner column that fills the card.
  const body = el("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1, padding: 64 }, [header, title, meta]);
  const rule = el("div", { height: 6, backgroundColor: colors.primary });
  return el("div", { display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: colors.bg, fontFamily: OG_FONT_FAMILY }, [body, rule]);
}
