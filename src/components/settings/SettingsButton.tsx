import { useCallback, useRef, useState } from "react";
import { useI18n } from "../../i18n";
import SettingsModal from "./SettingsModal";

/// Top-bar gear that opens the appearance settings.
export default function SettingsButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="nav-icon-button"
        aria-haspopup="dialog"
        aria-label={t("settingsOpen")}
        title={t("settingsOpen")}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
      </button>
      {open && <SettingsModal onClose={close} />}
    </>
  );
}
