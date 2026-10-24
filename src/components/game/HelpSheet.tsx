import type { KeyboardEvent, ReactNode } from "react";
import HelpDrawer from "../ui/HelpDrawer";
import { useI18n, type TranslationKey } from "../../i18n";
import { HELP_TABS, type GameHelp, type HelpTab } from "./useGameHelp";

const LABELS: Record<HelpTab, TranslationKey> = { next: "gkHelpTabNext", whatIf: "gkHelpTabWhatIf", guide: "gkHelpTabGuide" };

/// Tab row of the help drawer; left and right arrows move between tabs.
function HelpTabs({ help, idPrefix }: { help: GameHelp; idPrefix: string }) {
  const { t } = useI18n();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const row = e.currentTarget;
    const next = HELP_TABS[(HELP_TABS.indexOf(help.tab) + step + HELP_TABS.length) % HELP_TABS.length];
    help.show(next);
    requestAnimationFrame(() => row.querySelector<HTMLElement>(`#${idPrefix}help-tab-${next}`)?.focus());
  };
  return (
    <div className="gdesk-help-tabs" role="tablist" aria-label={t("gkHelpTabsAria")} onKeyDown={onKeyDown}>
      {HELP_TABS.map((id) => (
        <button
          key={id}
          id={`${idPrefix}help-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={help.tab === id}
          tabIndex={help.tab === id ? 0 : -1}
          className="gdesk-help-tab"
          onClick={() => help.show(id)}
        >
          {t(LABELS[id])}
        </button>
      ))}
    </div>
  );
}

type Props = {
  help: GameHelp;
  /// Desk id prefix, e.g. "almd-"; the drawer gets id `<prefix>help`.
  idPrefix: string;
  context: string;
  container: Element;
  next: ReactNode;
  whatIf: ReactNode;
  guide: ReactNode;
};

/// Help drawer portalled into the `.gdesk` root (keeps the terminal tokens and shows in full screen).
/// Only the active tab's content is rendered.
export default function HelpSheet({ help, idPrefix, context, container, next, whatIf, guide }: Props) {
  const { t } = useI18n();
  const body = { next, whatIf, guide }[help.tab];
  return (
    <HelpDrawer
      open={help.open}
      onClose={help.close}
      title={t("gkHelpTitle")}
      closeLabel={t("gkHelpClose")}
      id={`${idPrefix}help`}
      container={container}
      className="gdesk-help"
      returnFocusRef={help.buttonRef}
      context={context}
    >
      <HelpTabs help={help} idPrefix={idPrefix} />
      <div role="tabpanel" aria-labelledby={`${idPrefix}help-tab-${help.tab}`}>{body}</div>
      <p className="gdesk-help-hint">{t("gkHelpKeysHint")}</p>
    </HelpDrawer>
  );
}
