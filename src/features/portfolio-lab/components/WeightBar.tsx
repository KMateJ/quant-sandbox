import { useRef, type KeyboardEvent, type PointerEvent } from "react";

type Props = {
  label: string;
  color: string;
  value: number;
  /// Accessible name of the bar (slider role).
  ariaLabel: string;
  onChange: (value: number) => void;
};

const KEY_DIR: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// One horizontal weight bar that is itself the input: drag along it (pointer / touch) to set the share,
/// or focus it and use the arrow keys (±1%, Shift ±5%), Home / End for 0% / 100%.
export default function WeightBar({ label, color, value, ariaLabel, onChange }: Props) {
  const track = useRef<HTMLDivElement>(null);

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const v = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    onChange(Math.round(v * 1000) / 1000);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dir = KEY_DIR[event.key];
    let next: number | undefined;
    if (dir !== undefined) next = value + dir * (event.shiftKey ? 0.05 : 0.01);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    if (next === undefined) return;
    event.preventDefault();
    onChange(Math.max(0, Math.min(1, Math.round(next * 1000) / 1000)));
  };

  return (
    <div className="weight-row">
      <span className="weight-row-dot" style={{ background: color }} />
      <span className="weight-row-name">{label}</span>
      <div
        ref={track}
        className="pl-weight-track"
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 1000) / 10}
        aria-valuetext={pct(value)}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus();
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
      >
        <div className="pl-weight-fill" style={{ width: pct(value), background: color }} />
      </div>
      <span className="weight-row-pct">{pct(value)}</span>
    </div>
  );
}
