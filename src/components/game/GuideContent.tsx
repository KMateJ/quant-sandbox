import { Fragment, useState, type ReactNode } from "react";
import { useI18n } from "../../i18n";
import { ObjectiveList, type ObjectiveView } from "./GamePanels";

export type GuideSection = { id: string; title: string; body: ReactNode };

/// Guide tab: one open `<details>` section at a time.
export function GuideAccordion({ sections, defaultOpen }: { sections: GuideSection[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? sections[0]?.id ?? null);
  return (
    <div className="gdesk-guide">
      {sections.map((s) => (
        <details
          key={s.id}
          className="gdesk-help-section"
          open={open === s.id}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            if (isOpen) setOpen(s.id);
            else setOpen((cur) => (cur === s.id ? null : cur));
          }}
        >
          <summary className="gdesk-help-h">{s.title}</summary>
          {s.body}
        </details>
      ))}
    </div>
  );
}

/// Term/text rows as a definition list (keys, mistakes, glossary).
export function GuideList({ items }: { items: { term: string; text: string }[] }) {
  return (
    <dl className="gdesk-help-kv">
      {items.map((item) => (
        <Fragment key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.text}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

/// Panels with a "Show me" button that outlines each one on the desk.
export function GuidePanels({ panels, onPoint }: { panels: { anchor: string; text: string }[]; onPoint: (anchor: string) => void }) {
  const { t } = useI18n();
  return (
    <ul className="gdesk-guide-panels">
      {panels.map((p) => (
        <li key={p.anchor}>
          <p className="gdesk-help-p">{p.text}</p>
          <button type="button" className="gdesk-btn" onClick={() => onPoint(p.anchor)}>{t("gkHelpShowMe")}</button>
        </li>
      ))}
    </ul>
  );
}

type PlaybookProps = { brief: string; objectives?: ObjectiveView[]; steps: string[]; traps: string[] };

/// One mission's playbook: brief, live objectives (current mission only), steps to pass and traps.
export function GuidePlaybook({ brief, objectives, steps, traps }: PlaybookProps) {
  const { t } = useI18n();
  return (
    <div className="gdesk-guide-playbook">
      <p className="gdesk-help-p">{brief}</p>
      {objectives && objectives.length > 0 && <ObjectiveList items={objectives} />}
      <h4 className="gdesk-guide-sub">{t("gkGuideHowToWin")}</h4>
      <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <h4 className="gdesk-guide-sub">{t("gkGuideTraps")}</h4>
      <ul>{traps.map((s) => <li key={s}>{s}</li>)}</ul>
    </div>
  );
}
