import { useI18n } from "../../i18n";

type Props = {
  pinned: boolean;
  onPin: () => void;
  onClear: () => void;
};

/// "Pin" freezes the current curves as ghosts; once pinned, "Re-pin" moves the reference and "Clear" removes it.
export default function PinButton({ pinned, onPin, onClear }: Props) {
  const { t } = useI18n();
  return (
    <div className="pin-control" role="group" aria-label={t("pinGroupAria")}>
      <button type="button" className={pinned ? "pin-button is-pinned" : "pin-button"} aria-pressed={pinned} onClick={onPin} title={t("pinHint")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 17v5M9 3h6l-1 6 3 3H7l3-3-1-6z" />
        </svg>
        {pinned ? t("pinAgain") : t("pinCurrent")}
      </button>
      {pinned && (
        <button type="button" className="pin-clear" onClick={onClear}>
          {t("pinClear")}
        </button>
      )}
    </div>
  );
}
