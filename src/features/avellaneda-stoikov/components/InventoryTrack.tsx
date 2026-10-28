import { useRef } from "react";
import { useI18n } from "../../../i18n";

const LIMIT = 10;
const pct = (q: number) => `${((q + LIMIT) / (2 * LIMIT)) * 100}%`;

/// Horizontal inventory track with a square puck: drag it, or focus it and use ←/→ (±1 share).
export default function InventoryTrack({ q, onChange }: { q: number; onChange: (q: number) => void }) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const fromPointer = (clientX: number) => {
    const box = track.current?.getBoundingClientRect();
    if (box) onChange(((clientX - box.left) / box.width) * 2 * LIMIT - LIMIT);
  };
  const word = q > 0 ? t("avsLongN", { n: q }) : q < 0 ? t("avsShortN", { n: -q }) : t("avsFlat");
  const tone = q > 0 ? "long" : q < 0 ? "short" : "flat";
  return (
    <div className="avs-track-wrap">
      <div className="avs-track-head">
        <span>{t("avsInventory")}</span>
        <strong className={`avs-tone--${tone}`}>{word}</strong>
      </div>
      <div
        ref={track}
        className="avs-track"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => e.buttons && fromPointer(e.clientX)}
      >
        {[-LIMIT, -5, 0, 5, LIMIT].map((v) => (
          <span key={v} className={v === 0 ? "avs-track-tick is-zero" : "avs-track-tick"} style={{ left: pct(v) }}>
            <em>{v > 0 ? `+${v}` : v}</em>
          </span>
        ))}
        <span
          className={`avs-puck avs-puck--${tone}`}
          style={{ left: pct(q) }}
          role="slider"
          tabIndex={0}
          aria-label={t("avsInventory")}
          aria-valuemin={-LIMIT}
          aria-valuemax={LIMIT}
          aria-valuenow={q}
          aria-valuetext={word}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(q + 1);
            else if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(q - 1);
            else return;
            e.preventDefault();
          }}
        />
      </div>
    </div>
  );
}
