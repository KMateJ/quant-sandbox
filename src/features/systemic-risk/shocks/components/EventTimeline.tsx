import { useI18n, type TranslationKey } from "../../../../i18n";
import type { Marker, MarkerKind } from "../shocks.math";

const AFTERSHOCKS: MarkerKind[] = ["jolt", "rumour", "writedown"];

type Props = { markers: Marker[]; steps: number; cursor: number; onJump: (day: number) => void };

/// Track of days with the cursor and one button per key event ("Day 3 · Fire sales begin"); aftershocks are
/// clickable ticks on the track. Click to jump.
export default function EventTimeline({ markers, steps, cursor, onJump }: Props) {
  const { t } = useI18n();
  const at = (day: number) => `${(100 * day) / Math.max(1, steps)}%`;
  const label = (m: Marker) => `${t("syrShockDay", { day: m.day })} · ${t(`syrShockEv_${m.kind}` as TranslationKey)}`;
  const key = markers.filter((m) => !AFTERSHOCKS.includes(m.kind));
  return (
    <div className="syr-timeline">
      <div className="syr-timeline-track">
        {markers.map((m, i) =>
          AFTERSHOCKS.includes(m.kind) ? (
            <button key={i} type="button" className="syr-timeline-tick is-after" style={{ left: at(m.day) }} title={label(m)} aria-label={label(m)} onClick={() => onJump(m.day)} />
          ) : (
            <span key={i} className="syr-timeline-tick" style={{ left: at(m.day) }} aria-hidden="true" />
          ),
        )}
        <span className="syr-timeline-cursor" style={{ left: at(cursor) }} />
      </div>
      {key.length === 0 ? (
        <p className="syr-timeline-empty">{t("syrShockNoEvents")}</p>
      ) : (
        <ul className="syr-timeline-list">
          {key.map((m, i) => (
            <li key={i}>
              <button type="button" className={m.day === cursor ? "preset-btn preset-btn--active" : "preset-btn"} onClick={() => onJump(m.day)}>
                {label(m)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
