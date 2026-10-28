import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { rollBounce } from "../../../guide.micro.spreadMeasurement.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import RollBounceScatter from "./RollBounceScatter";
import RollBounceTape from "./RollBounceTape";

const SIZES = [120, 1000, 10000] as const;
type Size = (typeof SIZES)[number];
const cents = (v: number) => (Number.isFinite(v) ? `${v.toFixed(2)}¢` : "–");

/// Bid–ask bounce on a simulated tape, the Δp scatter behind Roll's estimator, and how informed trading biases it.
export default function RollBounceFigure() {
  const { t } = useI18n();
  const [S, setS] = useState(10);
  const [alpha, setAlpha] = useState(0.35);
  const [sigma, setSigma] = useState(2.5);
  const [n, setN] = useState<Size>(120);
  const [reveal, setReveal] = useState(false);
  const r = useMemo(() => rollBounce({ S, alpha, sigma, n }), [S, alpha, sigma, n]);
  const signed = (v: number) => (Number.isFinite(v) ? `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%` : "–");

  return (
    <GuideFigure title={t("gfMsRollBounceTitle")} labId="spread-estimation">
      <div className="gf-sliders">
        <SliderField label={t("gfMsRbSpread")} min={2} max={20} step={1} value={S} onChange={setS} formatValue={(v) => `${v}¢`} />
        <SliderField label={t("gfMsRbAlpha")} min={0} max={0.9} step={0.05} value={alpha} onChange={setAlpha} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfMsRbSigma")} min={0} max={10} step={0.5} value={sigma} onChange={setSigma} formatValue={(v) => `${v}¢`} />
      </div>
      <div className="gf-toolbar">
        <SegmentedControl<Size> ariaLabel={t("gfMsRbSample")} value={n} onChange={setN} options={SIZES.map((v) => ({ value: v, label: t("gfMsRbTrades", { n: v.toLocaleString("en-US") }) }))} />
        <button type="button" className="preset-btn" aria-pressed={reveal} onClick={() => setReveal((x) => !x)}>{t(reveal ? "gfMsRbHide" : "gfMsRbShow")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsRbTapeAria")}>
        <RollBounceTape prints={r.shown} reveal={reveal} labels={{ trades: t("gfMsRbTradesLabel"), efficient: t("gfMsRbEfficient"), x: t("gfMsRbTradeAxis"), y: t("gfMsRbPriceAxis") }} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsRbScatterAria")}>
        <RollBounceScatter points={r.scatter} slope={r.slope} labels={{ pairs: t("gfMsRbPairs"), fit: t("gfMsRbFit"), x: t("gfMsRbDpPrev"), y: t("gfMsRbDpNow") }} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsRbRoll"), value: cents(r.roll), tone: "strong" },
          { label: t("gfMsRbLimit"), value: cents(r.limit) },
          { label: t("gfMsRbEffective"), value: cents(r.effective) },
          { label: t("gfMsRbHs"), value: pct(r.hsAlpha, 1), tone: "accent" },
          { label: t("gfMsRbError"), value: signed(r.errorPct) },
        ]}
      />
      <p className="gf-hint">{t("gfMsRbNote", { slope: fmt(r.slope, 3) })}</p>
    </GuideFigure>
  );
}
