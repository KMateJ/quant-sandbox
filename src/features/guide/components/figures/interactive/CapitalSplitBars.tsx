import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useI18n } from "../../../../../i18n";
import {
  CAPITAL_SPLIT,
  CAPITAL_SPLIT_SCALE_MAX,
  clampDebtRatio,
  ratioForDebt,
  type CapitalSplit,
} from "../../../guide.interactive.capitalSplit.math";
import { fmt, pct } from "../figureFormat";

type Props = { split: CapitalSplit; tax: number; onChange: (dv: number) => void };

const KEY_STEP: Record<string, number> = { ArrowRight: 0.01, ArrowUp: 0.01, ArrowLeft: -0.01, ArrowDown: -0.01, PageUp: 0.1, PageDown: -0.1 };
const at = (value: number) => `${(value / CAPITAL_SPLIT_SCALE_MAX) * 100}%`;

/// Unlevered and levered firm value as bars; the debt/equity boundary on the levered bar is draggable.
export default function CapitalSplitBars({ split, tax, onChange }: Props) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const { vU, maxDebtRatio } = CAPITAL_SPLIT;

  const setFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect) return;
    const debt = ((event.clientX - rect.left) / rect.width) * CAPITAL_SPLIT_SCALE_MAX;
    onChange(clampDebtRatio(ratioForDebt(Math.max(0, debt), tax)));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? maxDebtRatio : KEY_STEP[event.key] !== undefined ? split.dv + KEY_STEP[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    onChange(clampDebtRatio(next));
  };

  return (
    <div className="cs-bars">
      <div className="cs-row">
        <span className="cs-row-label">{t("ixCsUnlevered")}</span>
        <div className="cs-track">
          <div className="cs-seg cs-equity" style={{ left: 0, width: at(vU) }} />
          <span className="cs-vu-mark" style={{ left: at(vU) }} />
        </div>
      </div>
      <div className="cs-row">
        <span className="cs-row-label">{t("ixCsLevered")}</span>
        <div ref={track} className="cs-track cs-track--drag" onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
          <div className="cs-seg cs-debt" style={{ left: 0, width: at(split.debt) }} />
          <div className="cs-seg cs-equity" style={{ left: at(split.debt), width: at(vU - split.debt) }} />
          <div className="cs-seg cs-shield" style={{ left: at(vU), width: at(split.shield) }} />
          <span className="cs-vu-mark" style={{ left: at(vU) }} />
          <div
            className="cs-handle"
            role="slider"
            tabIndex={0}
            style={{ left: at(split.debt) }}
            aria-label={t("ixCsHandle")}
            aria-valuemin={0}
            aria-valuemax={maxDebtRatio * 100}
            aria-valuenow={Math.round(split.dv * 100)}
            aria-valuetext={t("ixCsHandleText", { dv: pct(split.dv, 0), debt: fmt(split.debt, 1) })}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div className="cs-axis">
        <span className="cs-vu-label" style={{ left: at(vU) }}>{t("ixCsVuMark")}</span>
      </div>
    </div>
  );
}
