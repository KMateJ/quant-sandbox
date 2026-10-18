type Props = { x: number; height: number; label: string };

/// The reader's IRR guess on the NPV profile: a dashed vertical line with its label at the bottom.
export default function NpvGuessMarker({ x, height, label }: Props) {
  return (
    <g pointerEvents="none">
      <line x1={x} x2={x} y1={0} y2={height} stroke="var(--primary)" strokeWidth={2} strokeDasharray="6 4" />
      <text x={x + 4} y={height - 6} fill="var(--primary)" fontSize={11} fontWeight={600}>
        {label}
      </text>
    </g>
  );
}
