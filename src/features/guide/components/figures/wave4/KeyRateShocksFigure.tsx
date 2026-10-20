import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import {
  CURVE_ZEROS, KEY_RATES, barbellCashflows, bulletCashflows, keyRateDurations, shockCurve, shockReturn, zeroAt,
  type CurveShock,
} from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";

const BULLET = bulletCashflows(0.04, 5);
const BARBELL = barbellCashflows(BULLET, CURVE_ZEROS, 2, 30);
const KRD_ROWS = (() => {
  const a = keyRateDurations(BULLET, CURVE_ZEROS, KEY_RATES);
  const b = keyRateDurations(BARBELL, CURVE_ZEROS, KEY_RATES);
  return KEY_RATES.map((t, i) => ({ t, bullet: a[i], barbell: b[i] }));
})();
const MATURITIES = Array.from({ length: 30 }, (_, i) => i + 1);

/// A zero curve is shocked in one of the yield-curve lab's shapes; a 5-year bullet and a duration-matched 2/30 barbell react differently.
export default function KeyRateShocksFigure() {
  const { t } = useI18n();
  const [shock, setShock] = useState<CurveShock>("steepen");
  const [bp, setBp] = useState(50);
  const curve = useMemo(() => {
    const after = shockCurve(CURVE_ZEROS, shock, bp);
    return MATURITIES.map((m) => ({ t: m, before: zeroAt(CURVE_ZEROS, m), after: zeroAt(after, m) }));
  }, [shock, bp]);
  const [rb, rbar] = [BULLET, BARBELL].map((c) => shockReturn(c, CURVE_ZEROS, shock, bp));

  return (
    <GuideFigure title={t("gfW4KeyRateShocksTitle")} labId="yield-curve">
      <div className="gf-toolbar">
        <SegmentedControl<CurveShock>
          ariaLabel={t("gfW4ShockLabel")}
          value={shock}
          onChange={setShock}
          options={[
            { value: "parallel", label: t("gfW4ShockParallel") },
            { value: "steepen", label: t("gfW4ShockSteepen") },
            { value: "flatten", label: t("gfW4ShockFlatten") },
            { value: "curvature", label: t("gfW4ShockButterfly") },
          ]}
        />
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfW4ShockSize")} min={-100} max={100} step={5} value={bp} onChange={setBp} formatValue={(v) => `${v > 0 ? "+" : ""}${v} bp`} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4ZeroAria")}>
        <LineChart
          data={curve}
          xKey="t"
          series={[
            { key: "before", label: t("gfW4ZeroBefore"), color: SERIES_PALETTE[0], strokeWidth: 2 },
            { key: "after", label: t("gfW4ZeroAfter"), color: SERIES_PALETTE[1], strokeWidth: 2.5 },
          ]}
          xFormat={(v) => `${v}y`}
          tooltipLabel={(x) => `${x}y`}
          valueFormat={(v) => pct(v, 2)}
        />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4KrdAria")}>
        <LineChart
          data={KRD_ROWS}
          xKey="t"
          series={[
            { key: "bullet", label: t("gfW4Bullet"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "barbell", label: t("gfW4Barbell"), color: SERIES_PALETTE[1], strokeWidth: 2.5 },
          ]}
          xFormat={(v) => `${v}y`}
          tooltipLabel={(x) => `${x}y`}
          valueFormat={(v) => fmt(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4ReturnBullet"), value: pct(rb, 2), tone: "strong" },
          { label: t("gfW4ReturnBarbell"), value: pct(rbar, 2), tone: "strong" },
          { label: t("gfW4KrdSum"), value: fmt(KRD_ROWS.reduce((s, r) => s + r.bullet, 0), 2) },
        ]}
      />
    </GuideFigure>
  );
}
