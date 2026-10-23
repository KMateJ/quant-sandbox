import { useEffect, useRef } from "react";
import { useI18n } from "../../../../i18n";
import { takeDemoButtonFocus } from "../../demo/demoStore";

/// Command-bar entry to the scripted playthrough; hidden while it runs. After Exit (which unmounts the
/// bar that had focus) it takes focus back.
export default function DemoButton({ onStart, hidden }: { onStart: () => void; hidden: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!hidden && takeDemoButtonFocus()) ref.current?.focus();
  }, [hidden]);
  if (hidden) return null;
  return (
    <button ref={ref} type="button" className="hdesk-cmd-btn" onClick={onStart}>
      {t("hdDemoWatch")}
    </button>
  );
}
