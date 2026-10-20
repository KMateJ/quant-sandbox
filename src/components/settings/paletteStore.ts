import { useSyncExternalStore } from "react";
import { paletteById, paletteCss, type Palette, type PaletteMode } from "../../lib/palettes";

const STORAGE_KEY: Record<PaletteMode, string> = { dark: "qs-palette-dark", light: "qs-palette-light" };
const STYLE_ID = "qs-palette";
const listeners = new Set<() => void>();

function stored(mode: PaletteMode): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY[mode]);
  } catch {
    return null;
  }
}

/// Writes the chosen palettes into a <style> element (removed when both are the defaults).
export function applyStoredPalettes(): void {
  const css = paletteCss(paletteById("dark", stored("dark")), paletteById("light", stored("light")));
  let el = document.getElementById(STYLE_ID);
  if (!css) return void el?.remove();
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

/// Saves a palette choice for one theme and applies it at once.
export function setPalette(mode: PaletteMode, id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY[mode], id);
    else localStorage.removeItem(STORAGE_KEY[mode]);
  } catch {
    // Storage unavailable: the choice applies for this page only.
  }
  applyStoredPalettes();
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/// The palette chosen for a theme (the default before hydration).
export function usePalette(mode: PaletteMode): Palette {
  const id = useSyncExternalStore(subscribe, () => stored(mode), () => null);
  return paletteById(mode, id);
}
