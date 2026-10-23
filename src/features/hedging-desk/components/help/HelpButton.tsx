import { useI18n } from "../../../../i18n";
import type { DeskHelp } from "../../help/useDeskHelp";

/// Command-bar button that toggles the help drawer; hidden while the demo runs.
export default function HelpButton({ help, hidden }: { help: DeskHelp; hidden: boolean }) {
  const { t } = useI18n();
  const { buttonRef, open, toggle } = help;
  if (hidden) return null;
  return (
    <button
      ref={buttonRef}
      type="button"
      className="hdesk-cmd-btn"
      aria-expanded={open}
      aria-controls="hd-help"
      aria-keyshortcuts="F1"
      onClick={() => toggle()}
    >
      {t("hdHelpButton")}
    </button>
  );
}
