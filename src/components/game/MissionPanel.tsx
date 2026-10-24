import Panel from "../layout/Panel";
import { ObjectiveList, type ObjectiveView } from "./GamePanels";

type Props = {
  id: string;
  title: string;
  /// Mission title and brief, already translated.
  heading: string;
  brief: string;
  clockLabel: string;
  /// 0–1 share of the run elapsed.
  progress: number;
  objectives: ObjectiveView[];
};

/// Mission name, brief, run clock and live objectives; the list is hidden in free play (no objectives).
export default function MissionPanel({ id, title, heading, brief, clockLabel, progress, objectives }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <Panel id={id} title={title} className="gdesk-panel">
      <h3 className="gdesk-mission-title">{heading}</h3>
      <p className="gdesk-mission-brief">{brief}</p>
      <div className="gdesk-clock" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={clockLabel}>
        <span className="gdesk-clock-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="gdesk-label gdesk-num">{clockLabel}</p>
      {objectives.length > 0 && <ObjectiveList items={objectives} />}
    </Panel>
  );
}
