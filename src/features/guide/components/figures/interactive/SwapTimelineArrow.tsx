export type SwapLeg = "fixed" | "floating";

type Props = {
  leg: SwapLeg;
  /// Centre of the arrow shaft.
  x: number;
  axisY: number;
  width: number;
  /// Shaft length for the full amount and for its present value, in pixels.
  length: number;
  pvLength: number;
  selected: boolean;
  ariaLabel: string;
  onSelect: () => void;
};

const HEAD = 7;

/// One payment: a shaft from the axis (up when received, down when paid), the solid part its present
/// value and the faded remainder the discount. Hover, focus and tap all select it.
export default function SwapTimelineArrow({ leg, x, axisY, width, length, pvLength, selected, ariaLabel, onSelect }: Props) {
  const up = leg === "floating";
  const left = x - width / 2;
  // Rects grow away from the axis; for the upward leg the top edge moves, for the downward one the height.
  const rect = (len: number) => (up ? { y: axisY - len, height: len } : { y: axisY, height: len });
  const tip = up ? axisY - length - HEAD : axisY + length + HEAD;
  const base = up ? axisY - length : axisY + length;
  const head = `${left - 3},${base} ${left + width + 3},${base} ${x},${tip}`;

  return (
    <g
      className={`ix-sw-arrow ix-sw-arrow--${leg}${selected ? " is-selected" : ""}`}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-pressed={selected}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
    >
      <rect className="ix-sw-hit" x={left - 8} width={width + 16} {...(up ? { y: tip - 6, height: axisY - tip + 6 } : { y: axisY, height: tip - axisY + 6 })} />
      <rect className="ix-sw-discount" x={left} width={width} {...rect(length)} />
      <rect className="ix-sw-pv" x={left} width={width} {...rect(pvLength)} />
      <polygon className="ix-sw-head" points={head} />
    </g>
  );
}
