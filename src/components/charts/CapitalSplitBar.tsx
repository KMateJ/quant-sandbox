import { useRef, type KeyboardEvent, type PointerEvent } from "react";

export type SplitTone = "debt" | "equity" | "shield";

/// One slice of the bar, drawn left to right in value units.
export type SplitSegment = { key: string; value: number; tone: SplitTone };

/// Makes the right edge of the first segment draggable (pointer, touch, slider keys).
export type SplitHandle = {
  ariaLabel: string;
  valueNow: number;
  valueMin: number;
  valueMax: number;
  valueText: string;
  /// The value (in bar units) under the pointer while dragging.
  onPointerValue: (value: number) => void;
  /// Arrow keys send ±1, PageUp / PageDown ±10, Home / End "min" / "max".
  onKeyStep: (step: number | "min" | "max") => void;
};

export type CapitalSplitBarProps = {
  label: string;
  segments: SplitSegment[];
  /// Value lost from the right end of the bar (e.g. expected distress costs), drawn hatched over the last slices.
  loss?: number;
  scaleMax: number;
  /// Dashed mark, e.g. the unlevered value V_U.
  reference?: { value: number; label?: string };
  handle?: SplitHandle;
};

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 };

/// A firm-value bar split into debt, equity and tax-shield slices, with an optional draggable debt/equity boundary.
export default function CapitalSplitBar({ label, segments, loss = 0, scaleMax, reference, handle }: CapitalSplitBarProps) {
  const track = useRef<HTMLDivElement>(null);
  const at = (value: number) => `${(Math.max(0, value) / scaleMax) * 100}%`;
  const total = segments.reduce((s, x) => s + x.value, 0);
  // Left edge of each slice: the sum of the slices before it.
  const starts = segments.map((_, i) => segments.slice(0, i).reduce((s, x) => s + x.value, 0));

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = track.current?.getBoundingClientRect();
    if (rect && handle) handle.onPointerValue(Math.max(0, ((event.clientX - rect.left) / rect.width) * scaleMax));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!handle) return;
    const step = event.key === "Home" ? "min" : event.key === "End" ? "max" : KEY_STEP[event.key];
    if (step === undefined) return;
    event.preventDefault();
    handle.onKeyStep(step);
  };

  return (
    <div className="csb-row">
      <span className="csb-label">{label}</span>
      <div>
        <div
          ref={track}
          className={handle ? "csb-track csb-track--drag" : "csb-track"}
          onPointerDown={handle ? (e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); } : undefined}
          onPointerMove={handle ? (e) => e.currentTarget.hasPointerCapture(e.pointerId) && fromPointer(e) : undefined}
        >
          {segments.map((s, i) => (
            <div key={s.key} className={`csb-seg csb-${s.tone}`} style={{ left: at(starts[i]), width: at(s.value) }} />
          ))}
          {loss > 0 && <div className="csb-seg csb-loss" style={{ left: at(total - loss), width: at(loss) }} />}
          {reference && <span className="csb-mark" style={{ left: at(reference.value) }} />}
          {handle && segments[0] && (
            <div
              className="csb-handle"
              role="slider"
              tabIndex={0}
              style={{ left: at(segments[0].value) }}
              aria-label={handle.ariaLabel}
              aria-valuemin={handle.valueMin}
              aria-valuemax={handle.valueMax}
              aria-valuenow={handle.valueNow}
              aria-valuetext={handle.valueText}
              onKeyDown={onKeyDown}
            />
          )}
        </div>
        {reference?.label && (
          <div className="csb-axis">
            <span className="csb-mark-label" style={{ left: at(reference.value) }}>{reference.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
