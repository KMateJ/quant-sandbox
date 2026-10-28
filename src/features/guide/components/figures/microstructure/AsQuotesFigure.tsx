import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { asQuotes } from "../../../../../lib/market/quotes";
import { AS_BASE, AS_GAMMAS, gammaFromLog, spreadVsTime } from "../../../guide.micro.avellanedaStoikov.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import AsQuotesColumn from "./AsQuotesColumn";

const { s, sigma, k, T } = AS_BASE;

/// Reservation price and optimal quotes for a chosen inventory, time of day and risk aversion, next to the spread against time left.
export default function AsQuotesFigure() {
  const { t } = useI18n();
  const [q, setQ] = useState(6);
  const [time, setTime] = useState(0.5);
  const [logGamma, setLogGamma] = useState(-1);
  const gamma = gammaFromLog(logGamma);
  const tLeft = T - time;
  const quotes = asQuotes({ s, q, gamma, sigma, k, tLeft });
  const rows = useMemo(() => spreadVsTime(AS_GAMMAS, sigma, k, T, 100), []);
  const colors = [SERIES_PALETTE[2], SERIES_PALETTE[0], SERIES_PALETTE[3]];

  return (
    <GuideFigure title={t("gfMsAsQuotesTitle")} labId="avellaneda-stoikov">
      <div className="gf-sliders">
        <SliderField label={t("gfMsAsInventory")} min={-10} max={10} step={1} value={q} onChange={setQ} formatValue={(v) => String(v)} />
        <SliderField label={t("gfMsAsTime")} min={0} max={T} step={0.01} value={time} onChange={setTime} formatValue={(v) => fmt(v, 2)} />
        <SliderField label={t("gfMsAsGamma")} min={-2} max={0} step={0.05} value={logGamma} onChange={setLogGamma} formatValue={() => fmt(gamma, 2)} />
      </div>
      <AsQuotesColumn s={s} reservation={quotes.reservation} bid={quotes.bid} ask={quotes.ask} />
      <p className="gf-hint">{t("gfMsAsSpreadHint")}</p>
      <div className="gf-chart gf-chart--tall" role="img" aria-label={t("gfMsAsChartAria")}>
        <LineChart
          data={rows}
          xKey="tau"
          xDomain={[0, T]}
          series={AS_GAMMAS.map((g, i) => ({ key: `g${i}`, label: `γ = ${g}`, color: colors[i], strokeWidth: 2 }))}
          curve="linear"
          referenceLines={[{ axis: "x", value: tLeft, color: SERIES_PALETTE[1], width: 1.5 }]}
          tooltipLabel={(x) => `T − t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
          xFormat={(v) => v.toFixed(1)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsAsReservation"), value: fmt(quotes.reservation, 2), tone: "strong" },
          { label: t("gfMsAsSpread"), value: fmt(quotes.halfSpread * 2, 2) },
          { label: t("gfMsAsBid"), value: fmt(quotes.bid, 2), tone: "accent" },
          { label: t("gfMsAsAsk"), value: fmt(quotes.ask, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
