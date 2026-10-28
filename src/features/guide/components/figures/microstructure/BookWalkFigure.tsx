import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, markerLine } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import type { Side } from "../../../../../lib/market/market.types";
import { bookForFigure, ladder, slippageCurve, usd, walkBook, MID_TICKS } from "../../../guide.micro.limitOrderBook.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import BookWalkLadder from "./BookWalkLadder";
import { group } from "./bookWalkFormat";

const BOOK = bookForFigure();
const SIZES = Array.from({ length: 40 }, (_, i) => 100 * (i + 1));

/// A market order of chosen size and side walking a seeded ten-level book: rows taken, average price, slippage and cost against the mid.
export default function BookWalkFigure() {
  const { t } = useI18n();
  const [side, setSide] = useState<Side>("buy");
  const [size, setSize] = useState(1600);
  const walk = useMemo(() => walkBook(BOOK, side, size), [side, size]);
  const levels = useMemo(() => ladder(BOOK, side), [side]);
  const curve = useMemo(() => slippageCurve(BOOK, side, SIZES), [side]);
  const aria = t("gfMsBookCurveAria", { n: group(size) });
  const touch = t("gfMsBookTouch", {
    bid: usd(BOOK.bids[0].price).toFixed(2),
    mid: usd(MID_TICKS).toFixed(2),
    ask: usd(BOOK.asks[0].price).toFixed(2),
  });

  return (
    <GuideFigure title={t("gfMsBookWalkTitle")} labId="order-book">
      <div className="gf-toolbar">
        <SegmentedControl<Side>
          ariaLabel={t("gfMsBookSide")}
          value={side}
          onChange={setSide}
          options={[
            { value: "buy", label: t("gfMsBookBuy") },
            { value: "sell", label: t("gfMsBookSell") },
          ]}
        />
        <div className="gf-toolbar-slider">
          <SliderField label={t("gfMsBookSize")} min={100} max={4000} step={100} value={size} onChange={setSize} formatValue={group} />
        </div>
      </div>
      <p className="gf-ms-limit-order-book-touch">{touch}</p>
      <div className="gf-split">
        <div className="gf-visual">
          <BookWalkLadder levels={levels} walk={walk} label={t(side === "buy" ? "gfMsBookAsks" : "gfMsBookBids")} />
        </div>
        <div className="gf-visual gf-chart" role="img" aria-label={aria}>
          <LineChart
            data={curve}
            xKey="size"
            series={[{ key: "bp", label: t("gfMsBookCurveLabel"), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
            referenceLines={[markerLine(size)]}
            xFormat={group}
            tooltipLabel={(x) => group(x)}
            valueFormat={(v) => fmt(v, 2)}
            legend={false}
            curve="linear"
          />
        </div>
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsBookAvg"), value: walk.avgPrice === null ? "–" : fmt(usd(walk.avgPrice), 4) },
          { label: t("gfMsBookSlip"), value: walk.slippageBp === null ? "–" : `${fmt(walk.slippageBp, 2)} bp`, tone: "strong" },
          { label: t("gfMsBookLevels"), value: String(walk.rows.length) },
          { label: t("gfMsBookCost"), value: walk.costUsd === null ? "–" : `${fmt(walk.costUsd, 2)} USD`, tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
