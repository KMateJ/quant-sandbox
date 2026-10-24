import type { CSSProperties } from "react";
import Panel from "../layout/Panel";
import type { ChartSeries } from "../charts";
import { useI18n } from "../../i18n";
import type { ObjectiveStatus } from "../../lib/game/game.types";
import { STATUS_KEY } from "./gameCopy";
import { heatCell } from "./gameFormat";

export type EventRow = { t: string; kind: string; tone: "up" | "down" | "accent" | "muted" | ""; text: string };

/// Newest-first event log: clock tick, kind tag and text.
export function EventLog({ id, title, rows }: { id: string; title: string; rows: EventRow[] }) {
  return (
    <Panel id={id} title={title} className="gdesk-panel" flush>
      <ol className="gdesk-blotter">
        {rows.map((r, i) => (
          <li key={rows.length - i} className={["gdesk-blotter-row", r.tone && `gdesk-blotter-row--${r.tone}`].filter(Boolean).join(" ")}>
            <span className="gdesk-num">{r.t}</span>
            <span className="gdesk-blotter-kind">{r.kind}</span>
            <span className="gdesk-blotter-text">{r.text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

type MeterProps = { value: number; min: number; max: number; lo: number; hi: number; scale: [string, string, string]; label: string };

const at = (x: number, min: number, max: number) => Math.min(100, Math.max(0, ((x - min) / (max - min)) * 100));

/// Horizontal meter with the target band tinted and a marker at `value` (flagged when outside the band).
export function BandMeter({ value, min, max, lo, hi, scale, label }: MeterProps) {
  const left = at(lo, min, max);
  const inBand = value >= lo && value <= hi;
  return (
    <div className="gdesk-meter" role="img" aria-label={label}>
      <span className="gdesk-meter-band" style={{ left: `${left}%`, width: `${at(hi, min, max) - left}%` }} />
      <span className={`gdesk-meter-mark ${inBand ? "" : "gdesk-meter-mark--out"}`} style={{ left: `${at(value, min, max)}%` }} />
      <span className="gdesk-meter-scale gdesk-label">
        {scale.map((s, i) => <span key={i}>{s}</span>)}
      </span>
    </div>
  );
}

type GridProps = {
  id: string; title: string; caption: string; corner: string; cols: string[];
  rows: { label: string; cells: { display: string; value: number }[] }[];
};

/// Heat grid of scenario results; cells tinted by sign and size relative to the largest |value|.
export function ScenarioGrid({ id, title, caption, corner, cols, rows }: GridProps) {
  const max = Math.max(0, ...rows.flatMap((r) => r.cells.map((c) => Math.abs(c.value))));
  return (
    <Panel id={id} title={title} className="gdesk-panel">
      <div className="gdesk-scroll">
        <table className="gdesk-matrix" aria-describedby={`${id}-note`}>
          <thead>
            <tr>
              <th scope="col">{corner}</th>
              {cols.map((c) => <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.cells.map((c, j) => {
                  const h = heatCell(c.value, max);
                  return (
                    <td key={j} className={`gdesk-matrix__cell gdesk-matrix__cell--${h.tone}`} style={{ "--gdesk-tint": h.alpha } as CSSProperties}>
                      {c.display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p id={`${id}-note`} className="gdesk-matrix__note">{caption}</p>
    </Panel>
  );
}

/// Compact inline key for a chart whose own legend would crowd a short plot.
export function SeriesKey({ series }: { series: ChartSeries[] }) {
  return (
    <span className="gdesk-key">
      {series.map((s) => (
        <span key={s.key} className="gdesk-key__item">
          <svg width="14" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="14" y2="3" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
          </svg>
          {s.label}
        </span>
      ))}
    </span>
  );
}

export type ObjectiveView = { label: string; value: string; status: ObjectiveStatus };

/// Objectives with a status word (never colour alone) and the measured value.
export function ObjectiveList({ items }: { items: ObjectiveView[] }) {
  const { t } = useI18n();
  return (
    <ul className="gdesk-objectives">
      {items.map((o, i) => (
        <li key={i} className={`gdesk-objective gdesk-objective--${o.status}`}>
          <span className="gdesk-objective-text">{o.label}</span>
          <span className="gdesk-objective-status">{t(STATUS_KEY[o.status])}</span>
          <span className="gdesk-objective-value">{o.value}</span>
        </li>
      ))}
    </ul>
  );
}
