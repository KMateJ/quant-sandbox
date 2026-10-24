import Panel from "../layout/Panel";
import { useI18n } from "../../i18n";

export type MissionListItem = { id: string; title: string; tagline: string; tags?: string; done: boolean; best?: string };

type ListProps = { items: MissionListItem[]; selectedId: string; onSelect: (id: string) => void };

/// Every mission as a selectable row: id, title + tagline, optional tags, status.
export function MissionList({ items, selectedId, onSelect }: ListProps) {
  const { t } = useI18n();
  return (
    <Panel title={t("gkMsListTitle")} className="gdesk-panel" flush>
      <div className="gdesk-mlist-head gdesk-label" aria-hidden="true">
        <span />
        <span>{t("gkMsColMission")}</span>
        <span />
        <span>{t("gkMsColStatus")}</span>
      </div>
      <ul className="gdesk-mlist" aria-label={t("gkMsListAria")}>
        {items.map((m) => {
          const status = !m.done ? t("gkMsAvailable") : m.best ? t("gkMsCompleted", { best: m.best }) : t("gkMsCompletedPlain");
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`gdesk-mlist-row${m.id === selectedId ? " is-selected" : ""}`}
                aria-pressed={m.id === selectedId}
                onClick={() => onSelect(m.id)}
              >
                <span className="gdesk-mlist-id">{m.id}</span>
                <span className="gdesk-mlist-title">
                  <strong>{m.title}</strong>
                  <span>{m.tagline}</span>
                </span>
                <span className="gdesk-mlist-tags">{m.tags}</span>
                <span className={`gdesk-mlist-status${m.done ? " gdesk-up" : ""}`}>{status}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

type BriefingProps = {
  id: string;
  title: string;
  brief: string;
  setup: { label: string; value: string }[];
  objectives: string[];
  note?: string;
  onStart: () => void;
  onDemo?: () => void;
};

/// Briefing for one mission: setup table, numbered objectives (or the free-play note), start button.
export function MissionBriefing({ id, title, brief, setup, objectives, note, onStart, onDemo }: BriefingProps) {
  const { t } = useI18n();
  return (
    <Panel title={t("gkMsBriefingTitle")} className="gdesk-panel">
      <div className="gdesk-brief">
        <h2 className="gdesk-brief-title">
          <span className="gdesk-mlist-id">{id}</span> {title}
        </h2>
        <p className="gdesk-brief-text">{brief}</p>
        <h3 className="gdesk-label">{t("gkMsSetup")}</h3>
        <dl className="gdesk-brief-setup">
          {setup.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="gdesk-label">{t("gkMsObjectives")}</h3>
        {objectives.length > 0 ? (
          <ol className="gdesk-brief-objectives">{objectives.map((o) => <li key={o}>{o}</li>)}</ol>
        ) : (
          <p className="gdesk-brief-text">{t("gkMsFreePlay")}</p>
        )}
        {note && <p className="gdesk-brief-text">{note}</p>}
        <button type="button" className="gdesk-brief-start" onClick={onStart}>{t("gkMsStart", { id })}</button>
        {onDemo && (
          <button type="button" className="gdesk-btn gdesk-brief-demo" onClick={onDemo}>{t("gkDemoWatchFirst")}</button>
        )}
      </div>
    </Panel>
  );
}

/// Short cards on how the simulated desk works.
export function DeskRules({ rules }: { rules: { title: string; body: string }[] }) {
  const { t } = useI18n();
  return (
    <Panel title={t("gkMsRulesTitle")} className="gdesk-panel" flush>
      <div className="gdesk-rules">
        {rules.map((r) => (
          <div key={r.title} className="gdesk-rule">
            <strong>{r.title}</strong>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
