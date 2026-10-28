import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { useI18n } from "../../../../../i18n";
import { ROUND_TRIP_SEED, roundTrip } from "../../../guide.micro.marketMakers.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import RoundTripChart from "./RoundTripChart";

const PRESETS = { calm: 0.5, volatile: 2.5 };
type Preset = keyof typeof PRESETS;

/// A maker sells at the ask to one customer and buys back at the bid from another; the mid moves in between.
export default function RoundTripFigure() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [halfSpread, setHalfSpread] = useState(2);
  const [sigma, setSigma] = useState(1);
  const [seed, setSeed] = useState(ROUND_TRIP_SEED);
  const trip = useMemo(() => roundTrip({ halfSpread, sigma, seed }), [halfSpread, sigma, seed]);
  const cents = (v: number) => t("gfMsRtCents", { v: v.toFixed(0) });
  const preset = (Object.keys(PRESETS) as Preset[]).find((k) => PRESETS[k] === sigma);

  return (
    <GuideFigure title={t("gfMsRoundTripTitle")} labId="market-making">
      <div className="gf-sliders">
        <SliderField label={t("gfMsRtHalfSpread")} min={1} max={10} step={1} value={halfSpread} onChange={setHalfSpread} formatValue={cents} />
        <SliderField label={t("gfMsRtSigma")} min={0} max={3} step={0.1} value={sigma} onChange={setSigma} formatValue={(v) => t("gfMsRtCents", { v: v.toFixed(1) })} />
      </div>
      <div className="gf-toolbar">
        <SegmentedControl<Preset>
          ariaLabel={t("gfMsRtPreset")}
          value={preset ?? ("" as Preset)}
          onChange={(k) => setSigma(PRESETS[k])}
          options={[
            { value: "calm", label: t("gfMsRtCalm") },
            { value: "volatile", label: t("gfMsRtVolatile") },
          ]}
        />
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>{t("gfMsRtNewPath")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsRtAria")}>
        <RoundTripChart trip={trip} halfSpread={halfSpread} onHalfSpread={(c) => setHalfSpread(Math.min(10, Math.max(1, c)))} isMobile={isMobile} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsRtSpreadIncome"), value: fmt(trip.spreadIncome) },
          { label: t("gfMsRtInventory"), value: fmt(trip.inventoryPnl) },
          { label: t("gfMsRtTotal"), value: fmt(trip.total), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
