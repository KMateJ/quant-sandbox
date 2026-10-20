import { useI18n } from "../../i18n";
import { paletteTokens, type Palette } from "../../lib/palettes";

const SHOWN = ["bg", "surface", "rule", "rule-strong", "text", "text-sub", "muted", "text-dim", "accent"];

/// The chosen palette's main tokens with their hex values, for reference.
export default function PaletteTokens({ palette }: { palette: Palette }) {
  const { t } = useI18n();
  const tokens = paletteTokens(palette);

  return (
    <div className="palette-tokens">
      <span className="settings-label">{t("settingsTokens")}</span>
      <dl>
        {SHOWN.map((k) => (
          <div key={k} className="palette-token">
            <i style={{ background: tokens[k] }} aria-hidden="true" />
            <dt>--{k}</dt>
            <dd>{tokens[k]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
