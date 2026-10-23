import type { KeyboardEvent } from "react";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { HELP_TABS } from "../../help/help.config";
import type { HelpTab } from "../../help/help.types";
import type { DeskHelp } from "../../help/useDeskHelp";

const LABELS: Record<HelpTab, TranslationKey> = {
  next: "hdHelpTabNext",
  whatIf: "hdHelpTabWhatIf",
  guide: "hdHelpTabGuide",
};

/// Tab row of the help drawer; left and right arrows move between tabs.
export default function HelpTabs({ help }: { help: DeskHelp }) {
  const { t } = useI18n();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const row = e.currentTarget;
    const next = HELP_TABS[(HELP_TABS.indexOf(help.tab) + step + HELP_TABS.length) % HELP_TABS.length];
    help.show(next);
    requestAnimationFrame(() => row.querySelector<HTMLElement>(`#hd-help-tab-${next}`)?.focus());
  };
  return (
    <div className="hdesk-help-tabs" role="tablist" aria-label={t("hdHelpTabsAria")} onKeyDown={onKeyDown}>
      {HELP_TABS.map((id) => (
        <button
          key={id}
          id={`hd-help-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={help.tab === id}
          tabIndex={help.tab === id ? 0 : -1}
          className="hdesk-help-tab"
          onClick={() => help.show(id)}
        >
          {t(LABELS[id])}
        </button>
      ))}
    </div>
  );
}
