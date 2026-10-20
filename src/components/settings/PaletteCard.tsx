import type { CSSProperties } from "react";
import { useI18n } from "../../i18n";
import { paletteDeclarations, type Palette } from "../../lib/palettes";

type Props = { palette: Palette; selected: boolean; isDefault: boolean; onSelect: () => void };

/// Turns `--a:x;--b:y` into a React style object, so a card paints itself in its own palette.
function tokenStyle(p: Palette): CSSProperties {
  return Object.fromEntries(paletteDeclarations(p).split(";").map((d) => d.split(":"))) as CSSProperties;
}

/// Selectable swatch drawn in its own colours: a ruled mini page with a key line.
export default function PaletteCard({ palette, selected, isDefault, onSelect }: Props) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={selected ? "palette-card palette-card--selected" : "palette-card"}
      style={tokenStyle(palette)}
      onClick={onSelect}
    >
      <svg className="palette-card-viz" viewBox="0 0 120 48" aria-hidden="true">
        <path d="M0 12 H120 M0 24 H120 M0 36 H120" className="palette-card-grid" />
        <path d="M4 40 C30 38 44 30 60 26 S96 10 116 8" className="palette-card-sub" />
        <path d="M4 42 C34 40 50 22 70 20 S100 14 116 4" className="palette-card-key" />
      </svg>
      <span className="palette-card-name">{palette.name}</span>
      <span className="palette-card-meta">
        <span className="palette-card-dots" aria-hidden="true">
          {[palette.bg, palette.surface, palette.ruleStrong, palette.muted, palette.text, palette.accent].map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        {isDefault && <span className="palette-card-default">{t("settingsDefault")}</span>}
        {palette.mid && <span className="palette-card-default">{t("settingsMidTone")}</span>}
      </span>
    </button>
  );
}
