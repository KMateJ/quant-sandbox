import Panel from "../layout/Panel";
import { useI18n } from "../../i18n";
import { toneClass } from "./gameFormat";
import { ObjectiveList, type ObjectiveView } from "./GamePanels";

type Stat = { label: string; value: string; tone?: "up" | "down" };

/// Verdict line: pass/fail word and the run's headline numbers.
export function DebriefBanner({ id, passed, stats }: { id: string; passed: boolean; stats: Stat[] }) {
  const { t } = useI18n();
  return (
    <div id={id} className={`gdesk-verdict ${passed ? "is-pass" : "is-fail"}`} role="status">
      <strong className="gdesk-verdict-word">{t(passed ? "gkDebriefPassed" : "gkDebriefFailed")}</strong>
      <dl className="gdesk-verdict-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="gdesk-label">{s.label}</dt>
            <dd className={["gdesk-num", s.tone && `gdesk-${s.tone}`].filter(Boolean).join(" ")}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type PendingProps = { title: string; note: string; runLabel: string; onRun: () => void; onBack: () => void };

/// Shown before the run ends: finish it or go back to the desk.
export function DebriefPending({ title, note, runLabel, onRun, onBack }: PendingProps) {
  const { t } = useI18n();
  return (
    <Panel title={title} className="gdesk-panel">
      <p className="gdesk-debrief-note">{note}</p>
      <div className="gdesk-debrief-actions">
        <button type="button" className="gdesk-debrief-btn gdesk-debrief-btn--primary" onClick={onRun}>{runLabel}</button>
        <button type="button" className="gdesk-debrief-btn" onClick={onBack}>{t("gkDebriefBackToDesk")}</button>
      </div>
    </Panel>
  );
}

type AttributionProps = {
  id: string;
  title: string;
  rows: { label: string; value: number; display: string }[];
  total: { label: string; value: number; display: string };
};

/// Horizontal bars centred on zero, one per component, with the total last.
export function AttributionBars({ id, title, rows, total }: AttributionProps) {
  const all = [...rows, total];
  const scale = Math.max(1e-12, ...all.map((r) => Math.abs(r.value)));
  return (
    <Panel id={id} title={title} className="gdesk-panel">
      <ul className="gdesk-attr">
        {all.map((r, i) => {
          const w = (Math.abs(r.value) / scale) * 50;
          return (
            <li key={r.label} className={i === rows.length ? "is-net" : undefined}>
              <span className="gdesk-attr-label">{r.label}</span>
              <span className="gdesk-attr-track" aria-hidden="true">
                <span className={`gdesk-attr-bar ${r.value < 0 ? "is-down" : "is-up"}`} style={{ width: `${w}%`, left: r.value < 0 ? `${50 - w}%` : "50%" }} />
              </span>
              <span className={`gdesk-num ${toneClass(r.value)}`}>{r.display}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

type PolicyProps = {
  id: string;
  title: string;
  columns: string[];
  rows: { name: string; cells: string[]; highlight?: boolean }[];
  note?: string;
};

/// Simple policies replayed on the same path, with the player's run highlighted.
export function PolicyTable({ id, title, columns, rows, note }: PolicyProps) {
  return (
    <Panel id={id} title={title} className="gdesk-panel" flush>
      <div className="gdesk-debrief-tablewrap">
        <table className="gdesk-debrief-table">
          <thead>
            <tr>
              {columns.map((c, i) => <th key={c} scope="col" className={i > 0 ? "gdesk-num" : undefined}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className={r.highlight ? "is-own" : undefined}>
                <th scope="row">{r.name}</th>
                {r.cells.map((c, i) => <td key={i} className="gdesk-num">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="gdesk-debrief-note">{note}</p>}
    </Panel>
  );
}

/// Final objectives with their status words and measured values.
export function DebriefObjectives({ items }: { items: ObjectiveView[] }) {
  const { t } = useI18n();
  return (
    <Panel title={t("gkDebriefObjectivesTitle")} className="gdesk-panel">
      <ObjectiveList items={items} />
    </Panel>
  );
}
