import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useI18n } from "../../i18n";
import { moveInOrder } from "./tvm.math";

type Props = {
  returns: number[];
  order: number[];
  onOrder: (next: number[]) => void;
};

const pct = (r: number) => `${r >= 0 ? "+" : "−"}${Math.abs(r * 100).toFixed(0)}%`;

/// The yearly returns as bars in the order they occur; drag a bar sideways (or focus it and press ← / →) to move it.
export default function TvmSequenceBars({ returns, order, onOrder }: Props) {
  const { t } = useI18n();
  const rowRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const [dragging, setDragging] = useState<number | null>(null);
  const [focusItem, setFocusItem] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const peak = Math.max(...returns.map(Math.abs));
  // The order lives in the URL and updates a render later; fast key repeats and drag moves build on the latest one.
  const latest = useRef(order);
  useEffect(() => {
    latest.current = order;
  }, [order]);

  // Keep keyboard focus on the bar that just moved.
  useEffect(() => {
    if (focusItem !== null) buttons.current.get(focusItem)?.focus();
  }, [order, focusItem]);

  const move = (item: number, to: number) => {
    const from = latest.current.indexOf(item);
    if (from < 0 || to < 0 || to >= latest.current.length || to === from) return;
    latest.current = moveInOrder(latest.current, from, to);
    onOrder(latest.current);
    setAnnounce(t("tvmSeqMoved", { r: pct(returns[item]), year: to + 1 }));
  };
  const slotAt = (event: PointerEvent<HTMLButtonElement>) => {
    const box = rowRef.current!.getBoundingClientRect();
    return Math.min(order.length - 1, Math.max(0, Math.floor(((event.clientX - box.left) / box.width) * order.length)));
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, item: number) => {
    const step = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    const pos = latest.current.indexOf(item);
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setFocusItem(item);
      return move(item, event.key === "Home" ? 0 : latest.current.length - 1);
    }
    if (!step) return;
    event.preventDefault();
    setFocusItem(item);
    move(item, pos + step);
  };

  return (
    <>
      <div ref={rowRef} className="tvm-seq-bars" role="listbox" aria-label={t("tvmSeqBarsAria")} aria-orientation="horizontal">
        {order.map((item, pos) => {
          const r = returns[item];
          const h = (Math.abs(r) / peak) * 50;
          return (
            <button
              key={item}
              ref={(el) => { if (el) buttons.current.set(item, el); else buttons.current.delete(item); }}
              type="button"
              role="option"
              aria-selected={dragging === item}
              aria-label={t("tvmSeqBarLabel", { year: pos + 1, r: pct(r) })}
              className={`tvm-seq-bar${r < 0 ? " is-down" : ""}${dragging === item ? " is-dragging" : ""}`}
              onKeyDown={(e) => onKey(e, item)}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(item); }}
              onPointerMove={(e) => { if (dragging === item) move(item, slotAt(e)); }}
              onPointerUp={() => setDragging(null)}
              onPointerCancel={() => setDragging(null)}
            >
              <span className="tvm-seq-fill" style={r >= 0 ? { bottom: "50%", height: `${h}%` } : { top: "50%", height: `${h}%` }} />
              <span className="tvm-seq-value">{pct(r)}</span>
              <span className="tvm-seq-year">{pos + 1}</span>
            </button>
          );
        })}
      </div>
      <p className="tvm-seq-live" aria-live="polite">{announce}</p>
    </>
  );
}
