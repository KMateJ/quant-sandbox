import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import { isTyping } from "./isTyping";
import SearchPalette from "./SearchPalette";

/// Top-bar search trigger; Ctrl/⌘ K opens the palette from anywhere outside a text field.
export default function SearchButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.ctrlKey || e.metaKey) || e.altKey || isTyping(e.target)) return;
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="nav-search-button"
        aria-haspopup="dialog"
        aria-label={t("searchOpen")}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <span className="nav-search-label">{t("searchOpen")}</span>
        <kbd className="nav-search-key">{t("searchShortcut")}</kbd>
      </button>
      {open && <SearchPalette onClose={close} />}
    </>
  );
}
