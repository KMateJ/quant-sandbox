const UNIT = 100;
const CELL = 26;
const SIZE = 22;
const PAD = 8;

type Props = { ahead: number; size: number; filled: number; maxAhead: number; ariaLabel: string; front: string; back: string; you: string };

const fraction = (shares: number) => Math.max(0, Math.min(1, shares / UNIT));

/// One square per 100 shares at the best bid; the front of the queue is on the right, the reader's order is outlined.
export default function QueueFillBlocks({ ahead, size, filled, maxAhead, ariaLabel, front, back, you }: Props) {
  const slots = Math.ceil(maxAhead / UNIT) + Math.ceil(size / UNIT);
  const width = slots * CELL + 2 * PAD;
  const x = (slot: number) => width - PAD - (slot + 1) * CELL + (CELL - SIZE);
  const theirs = Math.ceil(ahead / UNIT - 1e-9);
  const mine = Math.ceil(size / UNIT);
  return (
    <svg viewBox={`0 0 ${width} 62`} role="img" aria-label={ariaLabel} style={{ width: "100%", height: "auto" }}>
      {Array.from({ length: theirs }, (_, i) => {
        const part = fraction(ahead - i * UNIT);
        return (
          <g key={`a${i}`}>
            <rect x={x(i)} y={8} width={SIZE} height={SIZE} fill="none" stroke="var(--border)" />
            <rect x={x(i)} y={8 + SIZE * (1 - part)} width={SIZE} height={SIZE * part} fill="var(--muted)" opacity={0.4} />
          </g>
        );
      })}
      {Array.from({ length: mine }, (_, j) => {
        const part = fraction(filled - j * UNIT);
        return (
          <g key={`m${j}`}>
            <rect x={x(theirs + j)} y={8} width={SIZE} height={SIZE} fill="var(--primary)" fillOpacity={0.14} stroke="var(--primary)" />
            <rect x={x(theirs + j)} y={8 + SIZE * (1 - part)} width={SIZE} height={SIZE * part} fill="var(--primary)" />
          </g>
        );
      })}
      <text x={width - PAD} y={52} textAnchor="end" fontSize={11} fill="var(--muted)">{front} →</text>
      <text x={PAD} y={52} fontSize={11} fill="var(--muted)">← {back}</text>
      <text x={x(theirs + mine - 1)} y={52} fontSize={11} fill="var(--primary)">{you}</text>
    </svg>
  );
}
