import { useEffect, useRef } from "react";
import Tabs from "../ui/Tabs";
import { useI18n, type TranslationKey } from "../../i18n";
import { takeDemoButtonFocus } from "./demoPosition";
import type { GameKey } from "./gameHooks";
import type { GameHelp } from "./useGameHelp";

type ScreenTabsProps<S extends string> = {
  id: string; screens: { id: S; label: string }[]; value: S; onChange: (s: S) => void; intro: string;
};

/// Screen switch (desk / missions / debrief) with the desk's one-line intro beside it.
export function ScreenTabs<S extends string>({ id, screens, value, onChange, intro }: ScreenTabsProps<S>) {
  const { t } = useI18n();
  return (
    <div className="gdesk-tabsrow" id={id}>
      <Tabs className="gdesk-tabs" ariaLabel={t("gkScreensAria")} items={screens} value={value} onChange={onChange} />
      <p className="gdesk-intro">{intro}</p>
    </div>
  );
}

/// Function-key row (also bound to the keyboard by `useFunctionKeys`) and the status line.
export function FunctionKeyBar({ id, keys, status }: { id: string; keys: GameKey[]; status: string }) {
  const { t } = useI18n();
  return (
    <footer className="gdesk-footer">
      <div className="gdesk-keys" id={id} role="group" aria-label={t("gkKeysAria")}>
        {keys.map((key) => (
          <button key={key.code} type="button" className="gdesk-fkey" disabled={!key.enabled} aria-keyshortcuts={key.code} onClick={key.run}>
            <span className="gdesk-fkey-code">{key.code}</span>
            <span className="gdesk-fkey-label">{key.label}</span>
          </button>
        ))}
      </div>
      <p className="gdesk-status">{status}</p>
    </footer>
  );
}

type ToggleProps = { active: boolean; onToggle: () => void; on: TranslationKey; off: TranslationKey };

function CmdToggle({ active, onToggle, on, off }: ToggleProps) {
  const { t } = useI18n();
  return (
    <button type="button" className="gdesk-cmd-btn" aria-pressed={active} onClick={onToggle}>
      {t(active ? off : on)}
    </button>
  );
}

/// Command-bar button that toggles the help drawer.
export function HelpButton({ help, controls }: { help: GameHelp; controls: string }) {
  const { t } = useI18n();
  const { buttonRef, open, toggle } = help;
  return (
    <button ref={buttonRef} type="button" className="gdesk-cmd-btn" aria-expanded={open} aria-controls={controls} aria-keyshortcuts="F1" onClick={() => toggle()}>
      {t("gkHelpButton")}
    </button>
  );
}

/// Command-bar entry to the playthrough; takes focus back after the demo exits.
export function DemoButton({ deskId, onStart }: { deskId: string; onStart: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (takeDemoButtonFocus(deskId)) ref.current?.focus();
  }, [deskId]);
  return (
    <button ref={ref} type="button" className="gdesk-cmd-btn" onClick={onStart}>
      {t("gkDemoWatch")}
    </button>
  );
}

type ViewControlsProps = {
  deskId: string;
  help?: GameHelp;
  helpId?: string;
  onDemo?: () => void;
  demo: boolean;
  expanded: boolean;
  onExpand: () => void;
  fullscreen: { supported: boolean; active: boolean; toggle: () => void };
};

/// Help, Watch the playthrough (both hidden in the demo), Expand and Full screen.
export function ViewControls({ deskId, help, helpId = "", onDemo, demo, expanded, onExpand, fullscreen }: ViewControlsProps) {
  return (
    <>
      {help && !demo && <HelpButton help={help} controls={helpId} />}
      {onDemo && !demo && <DemoButton deskId={deskId} onStart={onDemo} />}
      <CmdToggle active={expanded} onToggle={onExpand} on="gkExpandEnter" off="gkExpandExit" />
      {fullscreen.supported && (
        <CmdToggle active={fullscreen.active} onToggle={fullscreen.toggle} on="gkFullscreenEnter" off="gkFullscreenExit" />
      )}
    </>
  );
}
