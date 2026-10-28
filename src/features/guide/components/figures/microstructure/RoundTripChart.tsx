import { DragHandles, LineChart } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import { MID_START, type RoundTrip } from "../../../guide.micro.marketMakers.math";

const usd = (cents: number) => cents / 100;
const START = usd(MID_START);

// Independent of the half-spread, so dragging the ask never rescales the axis.
const reach = (mid: number[]) => Math.max(0.15, Math.ceil((Math.max(...mid.map((m) => Math.abs(usd(m) - START))) + 0.1) * 20) / 20);

type Props = { trip: RoundTrip; halfSpread: number; onHalfSpread: (cents: number) => void; isMobile: boolean };

/// Mid, bid and ask over the path with the two customer fills marked and the ask draggable.
export default function RoundTripChart({ trip, halfSpread, onHalfSpread, isMobile }: Props) {
  const { t } = useI18n();
  const data = trip.mid.map((m, step) => ({ step, mid: usd(m), bid: usd(trip.bid[step]), ask: usd(trip.ask[step]) }));
  const { buy, sell } = trip.fills;
  return (
    <LineChart
      data={data}
      xKey="step"
      xDomain={[0, trip.mid.length - 1]}
      yDomain={[START - reach(trip.mid), START + reach(trip.mid)]}
      curve="linear"
      isMobile={isMobile}
      yFormat={(v) => v.toFixed(2)}
      valueFormat={(v) => v.toFixed(3)}
      series={[
        { key: "ask", label: t("gfMsRtAsk"), color: "var(--negative)", strokeWidth: 1.5 },
        { key: "mid", label: t("gfMsRtMid"), color: "var(--text)", strokeWidth: 2 },
        { key: "bid", label: t("gfMsRtBid"), color: "var(--primary)", strokeWidth: 1.5 },
      ]}
      layer={(frame) => (
        <g>
          {[
            { f: buy, label: t("gfMsRtSold") },
            { f: sell, label: t("gfMsRtBought") },
          ].map(({ f, label }) => (
            <g key={f.step}>
              <circle cx={frame.x(f.step)} cy={frame.y(usd(f.price))} r={5} fill="var(--bg-elevated, var(--bg))" stroke="var(--text)" strokeWidth={2} />
              <text x={frame.x(f.step)} y={frame.y(usd(f.price)) + (f === buy ? -10 : 18)} textAnchor="middle" fontSize={11} fill="var(--text)">{label}</text>
            </g>
          ))}
          <DragHandles
            frame={frame}
            onChange={(_, v) => v.y !== undefined && onHalfSpread(Math.round((v.y - START) * 100))}
            handles={[{ id: "ask", axis: "y", y: START + usd(halfSpread), min: START + 0.01, max: START + 0.1, step: 0.01, label: t("gfMsRtAskHandle"), format: (v) => v.toFixed(2) }]}
          />
        </g>
      )}
    />
  );
}
