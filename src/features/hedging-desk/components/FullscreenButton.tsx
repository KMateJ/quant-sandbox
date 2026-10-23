import { useI18n, type TranslationKey } from "../../../i18n";

type ToggleProps = { active: boolean; onToggle: () => void; on: TranslationKey; off: TranslationKey };

/// One command-bar toggle; the label says what a click will do.
function CmdToggle({ active, onToggle, on, off }: ToggleProps) {
  const { t } = useI18n();
  return (
    <button type="button" className="hdesk-cmd-btn" aria-pressed={active} onClick={onToggle}>
      {t(active ? off : on)}
    </button>
  );
}

type Props = {
  expanded: boolean;
  onExpand: () => void;
  fullscreen: { supported: boolean; active: boolean; toggle: () => void };
};

/// Command-bar view controls: expand within the browser window, and full screen on the monitor
/// (hidden where the Fullscreen API is missing).
export default function FullscreenButton({ expanded, onExpand, fullscreen }: Props) {
  return (
    <>
      <CmdToggle active={expanded} onToggle={onExpand} on="hdExpandEnter" off="hdExpandExit" />
      {fullscreen.supported && (
        <CmdToggle active={fullscreen.active} onToggle={fullscreen.toggle} on="hdFullscreenEnter" off="hdFullscreenExit" />
      )}
    </>
  );
}
