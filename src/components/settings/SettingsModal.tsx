import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";
import { defaultPalette, palettesFor, type PaletteMode } from "../../lib/palettes";
import SegmentedControl from "../ui/SegmentedControl";
import { setPalette, usePalette } from "./paletteStore";
import PaletteCard from "./PaletteCard";
import PalettePreview from "./PalettePreview";
import PaletteTokens from "./PaletteTokens";

/// Appearance dialog: pick the theme and its palette, with a live preview of the result.
export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const mode: PaletteMode = resolvedTheme;
  const current = usePalette(mode);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => dialogRef.current?.focus(), []);

  return createPortal(
    <div className="settings-backdrop" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <header className="settings-head">
          <div>
            <p className="home-eyebrow">{t("settingsOpen")}</p>
            <h2 id="settings-title" className="settings-title">{t("settingsAppearance")}</h2>
          </div>
          <button type="button" className="nav-icon-button" aria-label={t("settingsClose")} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="settings-body">
          <section className="settings-pick">
            <div className="settings-row">
              <span className="settings-label">{t("settingsTheme")}</span>
              <SegmentedControl
                ariaLabel={t("settingsTheme")}
                value={mode}
                onChange={(m) => setTheme(m)}
                options={[
                  { value: "dark", label: t("settingsDark") },
                  { value: "light", label: t("settingsLight") },
                ]}
              />
            </div>
            <div className="settings-row">
              <span className="settings-label">{t("settingsPalette")}</span>
              <button
                type="button"
                className="settings-reset"
                disabled={current.id === defaultPalette(mode).id}
                onClick={() => setPalette(mode, null)}
              >
                {t("settingsReset")}
              </button>
            </div>
            <div className="settings-cards" role="radiogroup" aria-label={t("settingsPalette")}>
              {palettesFor(mode).map((p, i) => (
                <PaletteCard key={p.id} palette={p} isDefault={i === 0} selected={p.id === current.id} onSelect={() => setPalette(mode, i === 0 ? null : p.id)} />
              ))}
            </div>
            <PaletteTokens palette={current} />
          </section>
          <PalettePreview />
        </div>
      </div>
    </div>,
    document.body,
  );
}
