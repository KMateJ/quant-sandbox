import { DragHandles, LineChart } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import { LADDER_LOTS, MAX_THETA, ladderRow, thetaFromReservation } from "../../../guide.micro.inventoryRisk.math";

const LOTS = [-8, 8];
const REACH = 6.5;

type Props = { halfSpread: number; theta: number; onTheta: (theta: number) => void; isMobile: boolean };

/// Bid, reservation and ask (cents from the mid) against inventory; drag the marker to set the skew.
export default function InventorySkewLadder({ halfSpread, theta, onTheta, isMobile }: Props) {
  const { t } = useI18n();
  const data = [LOTS[0], 0, LOTS[1]].map((lots) => ladderRow(halfSpread, theta, lots));
  const step = 0.0005 * LADDER_LOTS * 100;
  return (
    <LineChart
      data={data}
      xKey="lots"
      xDomain={LOTS as [number, number]}
      yDomain={[-REACH, REACH]}
      curve="linear"
      isMobile={isMobile}
      yFormat={(v) => v.toFixed(0)}
      valueFormat={(v) => v.toFixed(2)}
      tooltipLabel={(x) => t("gfMsIsLots", { v: x.toFixed(0) })}
      referenceLines={[{ axis: "y", value: 0, color: "var(--text-muted)", dash: "3 3" }]}
      series={[
        { key: "ask", label: t("gfMsRtAsk"), color: "var(--negative)", strokeWidth: 1.5 },
        { key: "reservation", label: t("gfMsIsReservation"), color: "var(--text)", strokeWidth: 1, dash: "4 3" },
        { key: "bid", label: t("gfMsRtBid"), color: "var(--primary)", strokeWidth: 1.5 },
      ]}
      layer={(frame) => (
        <DragHandles
          frame={frame}
          onChange={(_, v) => v.y !== undefined && onTheta(thetaFromReservation(v.y))}
          handles={[{ id: "skew", axis: "xy", x: LADDER_LOTS, y: ladderRow(halfSpread, theta, LADDER_LOTS).reservation, bounds: { x: [LADDER_LOTS, LADDER_LOTS], y: [-MAX_THETA * LADDER_LOTS * 100, 0] }, step, label: t("gfMsIsHandle", { lots: LADDER_LOTS }), format: (v) => v.toFixed(2) }]}
        />
      )}
    />
  );
}
