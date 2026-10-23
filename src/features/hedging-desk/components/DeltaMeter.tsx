import { useI18n } from "../../../i18n";
import { signed } from "../deskFormat";
import { meterPosition } from "../sidePanels.math";

const RANGE = 400;

/// Horizontal ±400 sh meter with the band tinted and a marker at net delta.
export default function DeltaMeter({ delta, band }: { delta: number; band: number }) {
  const { t } = useI18n();
  const lo = meterPosition(-band, RANGE);
  const hi = meterPosition(band, RANGE);
  return (
    <div className="hdesk-meter" role="img" aria-label={t("hdSideMeterAria", { delta: signed(delta), band })}>
      <span className="hdesk-meter-band" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
      <span className="hdesk-meter-zero" />
      <span
        className={`hdesk-meter-mark ${Math.abs(delta) <= band ? "" : "hdesk-meter-mark--out"}`}
        style={{ left: `${meterPosition(delta, RANGE)}%` }}
      />
      <span className="hdesk-meter-scale hdesk-label">
        <span>{signed(-RANGE)}</span>
        <span>0</span>
        <span>{signed(RANGE)}</span>
      </span>
    </div>
  );
}
