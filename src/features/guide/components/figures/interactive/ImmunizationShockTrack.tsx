import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useI18n } from "../../../../../i18n";
import { IMMUNIZATION } from "../../../guide.interactive.immunizationShock.math";
import { pct } from "../figureFormat";

type Props = { shock: number; onChange: (shock: number) => void };

const BP = 0.0001;
const KEY_STEP: Record<string, number> = { ArrowRight: 10 * BP, ArrowUp: 10 * BP, ArrowLeft: -10 * BP, ArrowDown: -10 * BP, PageUp: 50 * BP, PageDown: -50 * BP };
const snap = (shock: number) => {
  const max = IMMUNIZATION.maxShock;
  return Math.round(Math.min(max, Math.max(-max, shock)) / (5 * BP)) * 5 * BP;
};
const at = (shock: number) => `${((shock + IMMUNIZATION.maxShock) / (2 * IMMUNIZATION.maxShock)) * 100}%`;

/// Horizontal −300…+300 bp track with a draggable (and keyboard-adjustable) shock marker.
export default function ImmunizationShockTrack({ shock, onChange }: Props) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const bp = Math.round(shock / BP);

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect) return;
    const u = (event.clientX - rect.left) / rect.width;
    onChange(snap((2 * u - 1) * IMMUNIZATION.maxShock));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = event.key === "Home" ? -IMMUNIZATION.maxShock : event.key === "End" ? IMMUNIZATION.maxShock : KEY_STEP[event.key] !== undefined ? shock + KEY_STEP[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    onChange(snap(next));
  };

  return (
    <div className="im-shock">
      <span className="im-shock-label">{t("ixImShock")}</span>
      <div
        ref={track}
        className="im-track"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
      >
        <span className="im-track-zero" style={{ left: at(0) }} />
        <div
          className="im-handle"
          role="slider"
          tabIndex={0}
          style={{ left: at(shock) }}
          aria-label={t("ixImShockAria")}
          aria-valuemin={-300}
          aria-valuemax={300}
          aria-valuenow={bp}
          aria-valuetext={t("ixImShockText", { bp: bp > 0 ? `+${bp}` : bp, y: pct(IMMUNIZATION.yield0 + shock, 2) })}
          onKeyDown={onKeyDown}
        >
          <span className="im-handle-value">{bp > 0 ? `+${bp}` : bp} bp</span>
        </div>
      </div>
      <div className="im-track-scale" aria-hidden="true">
        <span>−300 bp</span>
        <span>0</span>
        <span>+300 bp</span>
      </div>
    </div>
  );
}
