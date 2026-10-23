import { useEffect, useRef } from "react";
import { useI18n } from "../../../../i18n";
import type { DemoModel } from "../../demo/useDemo";

/// Back / Play–Pause / Next, then Take the desk and Exit (and Missions on the last step).
export default function DemoControls({ demo, onMissions }: { demo: DemoModel; onMissions: () => void }) {
  const { t } = useI18n();
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => nextRef.current?.focus({ preventScroll: true }), []);
  return (
    <div className="hdesk-demo-controls">
      <div className="hdesk-demo-group">
        <button type="button" className="hdesk-fkey hdesk-demo-key" disabled={demo.atStart} onClick={demo.back} aria-keyshortcuts="ArrowLeft">
          <span className="hdesk-fkey-code">←</span>
          <span className="hdesk-fkey-label">{t("hdDemoBack")}</span>
        </button>
        <button type="button" className="hdesk-fkey hdesk-demo-key" aria-pressed={demo.playing} onClick={demo.toggle} aria-keyshortcuts="Space">
          <span className="hdesk-fkey-code">␣</span>
          <span className="hdesk-fkey-label">{t(demo.playing ? "hdDemoPause" : "hdDemoPlay")}</span>
        </button>
        <button ref={nextRef} type="button" className="hdesk-fkey hdesk-demo-key" disabled={demo.atEnd} onClick={demo.next} aria-keyshortcuts="ArrowRight">
          <span className="hdesk-fkey-code">→</span>
          <span className="hdesk-fkey-label">{t("hdDemoNext")}</span>
        </button>
      </div>
      <div className="hdesk-demo-group hdesk-demo-group--end">
        {demo.atEnd && (
          <button type="button" className="hdesk-fkey hdesk-demo-key" onClick={onMissions}>
            <span className="hdesk-fkey-label">{t("hdDemoMissions")}</span>
          </button>
        )}
        <button type="button" className="hdesk-fkey hdesk-demo-key hdesk-demo-take" title={t("hdDemoTakeOverHint")} onClick={demo.takeOver}>
          <span className="hdesk-fkey-label">{t("hdDemoTakeOver")}</span>
        </button>
        <button type="button" className="hdesk-fkey hdesk-demo-key" onClick={demo.exit} aria-keyshortcuts="Escape">
          <span className="hdesk-fkey-code">Esc</span>
          <span className="hdesk-fkey-label">{t("hdDemoExit")}</span>
        </button>
      </div>
    </div>
  );
}
