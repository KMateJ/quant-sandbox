import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n";
import type { DemoPlayer } from "./useDemoPlayer";

type Props = {
  id: string;
  player: DemoPlayer;
  caption: { title: string; body: string };
  onMissions?: () => void;
};

/// Caption dock that replaces the function keys while the playthrough runs:
/// Back / Play–Pause / Next, Take the desk, Exit (and Missions on the last step).
export default function DemoBar({ id, player, caption, onMissions }: Props) {
  const { t } = useI18n();
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => nextRef.current?.focus({ preventScroll: true }), []);
  const missions = () => {
    player.exit();
    onMissions?.();
  };
  return (
    <footer id={id} className="gdesk-footer gdesk-demo-bar" role="region" aria-label={t("gkDemoBarAria")}>
      <div className="gdesk-demo-row">
        <div className="gdesk-demo-controls">
          <div className="gdesk-demo-group">
            <button type="button" className="gdesk-fkey gdesk-demo-key" disabled={player.atStart} onClick={player.back} aria-keyshortcuts="ArrowLeft">
              <span className="gdesk-fkey-code">←</span>
              <span className="gdesk-fkey-label">{t("gkDemoBack")}</span>
            </button>
            <button type="button" className="gdesk-fkey gdesk-demo-key" aria-pressed={player.playing} onClick={player.toggle} aria-keyshortcuts="Space">
              <span className="gdesk-fkey-code">␣</span>
              <span className="gdesk-fkey-label">{t(player.playing ? "gkDemoPause" : "gkDemoPlay")}</span>
            </button>
            <button ref={nextRef} type="button" className="gdesk-fkey gdesk-demo-key" disabled={player.atEnd} onClick={player.next} aria-keyshortcuts="ArrowRight">
              <span className="gdesk-fkey-code">→</span>
              <span className="gdesk-fkey-label">{t("gkDemoNext")}</span>
            </button>
          </div>
          <div className="gdesk-demo-group gdesk-demo-group--end">
            {player.atEnd && onMissions && (
              <button type="button" className="gdesk-fkey gdesk-demo-key" onClick={missions}>
                <span className="gdesk-fkey-label">{t("gkDemoMissions")}</span>
              </button>
            )}
            <button type="button" className="gdesk-fkey gdesk-demo-key gdesk-demo-take" title={t("gkDemoTakeOverHint")} onClick={player.takeOver}>
              <span className="gdesk-fkey-label">{t("gkDemoTakeOver")}</span>
            </button>
            <button type="button" className="gdesk-fkey gdesk-demo-key" onClick={player.exit} aria-keyshortcuts="Escape">
              <span className="gdesk-fkey-code">Esc</span>
              <span className="gdesk-fkey-label">{t("gkDemoExit")}</span>
            </button>
          </div>
        </div>
        <div className="gdesk-demo-caption" aria-live="polite">
          <span className="gdesk-label">{t("gkDemoStepOf", { n: player.index + 1, total: player.total })}</span>
          <h2 className="gdesk-demo-title">{caption.title}</h2>
          <p className="gdesk-demo-body">{caption.body}</p>
        </div>
      </div>
      <p className="gdesk-status">{t("gkDemoKeysHint")}</p>
    </footer>
  );
}
