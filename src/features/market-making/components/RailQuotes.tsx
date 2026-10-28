import { memo, useRef } from "react";
import { useI18n } from "../../../i18n";
import { ROUND_DT, type Quotes, type RoundSchedule, type RoundState } from "../marketMaking.types";
import { RAIL_GUTTER, RAIL_W, RAIL_WINDOW, railPath, type RailFrame } from "../rail.math";

type Props = {
  frame: RailFrame;
  schedule: RoundSchedule;
  round: RoundState;
  quotes: Quotes;
  onQuotes: (q: Partial<Quotes>) => void;
};

const HANDLE = 22;

/// Fair value, your quote history and the two draggable quote lines with square handles in the gutter.
function RailQuotes({ frame, schedule, round, quotes, onQuotes }: Props) {
  const { t } = useI18n();
  const drag = useRef<"bid" | "ask" | null>(null);
  const first = Math.max(0, round.step - Math.round(RAIL_WINDOW / ROUND_DT));
  const steps = Array.from({ length: round.step - first + 1 }, (_, i) => first + i);
  const fairPts = steps.map((i) => ({ x: frame.x(i * ROUND_DT), y: frame.y(schedule.fair[i]) }));
  const side = (s: "bid" | "ask") =>
    railPath(
      steps.map((i) => {
        const q = i < round.step ? round.quotes[i] : quotes;
        if (!q?.live) return null;
        const c = schedule.fair[i] + (s === "ask" ? q.ask : -q.bid);
        return { x: frame.x(i * ROUND_DT), y: frame.y(c) };
      }),
    );
  const fairNow = schedule.fair[round.step];
  const yBid = frame.y(fairNow - quotes.bid);
  const yAsk = frame.y(fairNow + quotes.ask);
  const edge = RAIL_W - RAIL_GUTTER;

  const toLocal = (e: React.PointerEvent<SVGElement>) => {
    const svg = (e.currentTarget as SVGElement).ownerSVGElement!;
    const box = svg.getBoundingClientRect();
    return ((e.clientY - box.top) / box.height) * svg.viewBox.baseVal.height;
  };
  const down = (s: "bid" | "ask") => (e: React.PointerEvent<SVGRectElement>) => {
    drag.current = s;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    const c = frame.cents(toLocal(e));
    onQuotes(drag.current === "ask" ? { ask: c - fairNow } : { bid: fairNow - c });
  };
  const up = () => (drag.current = null);

  const handle = (s: "bid" | "ask", y: number) => (
    <g className={`mkm-handle mkm-handle--${s}`}>
      <line x1={edge} x2={RAIL_W} y1={y} y2={y} />
      <rect x={edge + 4} y={y - HANDLE / 2} width={HANDLE} height={HANDLE} />
      <rect className="mkm-hit" x={edge} y={y - 32} width={RAIL_GUTTER} height={64} onPointerDown={down(s)} onPointerMove={move} onPointerUp={up}
        role="slider" aria-label={t(s === "ask" ? "mkmAsk" : "mkmBid")} aria-valuenow={s === "ask" ? quotes.ask : quotes.bid} />
      <text x={edge - 6} y={y - 6} textAnchor="end">{t(s === "ask" ? "mkmAskShort" : "mkmBidShort")}</text>
    </g>
  );

  return (
    <g>
      {quotes.live && <rect className="mkm-band" x={0} y={yAsk} width={edge} height={Math.max(0, yBid - yAsk)} />}
      <path className="mkm-fair" d={railPath(fairPts)} />
      <path className="mkm-quote mkm-quote--ask" d={side("ask")} />
      <path className="mkm-quote mkm-quote--bid" d={side("bid")} />
      {handle("ask", yAsk)}
      {handle("bid", yBid)}
    </g>
  );
}

export default memo(RailQuotes);
