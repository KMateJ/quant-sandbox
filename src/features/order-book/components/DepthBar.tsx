import type { Side } from "../../../lib/market/market.types";

type Props = { side: Side; size: number; maxSize: number; mine?: { ahead: number; size: number } };

const pct = (v: number, max: number) => `${max ? (v / max) * 100 : 0}%`;

/// A level's depth bar; your shares draw as a segment at their queue offset (front of the queue at the inner edge).
export default function DepthBar({ side, size, maxSize, mine }: Props) {
  if (size <= 0) return null;
  const edge = side === "buy" ? "right" : "left";
  return (
    <>
      <span className={`obk-bar obk-bar--${side === "buy" ? "bid" : "ask"}`} style={{ width: pct(size, maxSize) }} />
      {mine && <span className="obk-bar obk-bar--mine" style={{ [edge]: pct(mine.ahead, maxSize), width: pct(mine.size, maxSize) }} />}
    </>
  );
}
