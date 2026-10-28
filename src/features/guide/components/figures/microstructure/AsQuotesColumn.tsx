import { useI18n } from "../../../../../i18n";

type Props = { s: number; reservation: number; bid: number; ask: number };

const H = 220;
const W = 240;

/// Vertical price column: mid, reservation price and the two quotes.
export default function AsQuotesColumn({ s, reservation, bid, ask }: Props) {
  const { t } = useI18n();
  const lo = Math.min(bid, s) - 1;
  const hi = Math.max(ask, s) + 1;
  const y = (v: number) => 10 + ((hi - v) / (hi - lo)) * (H - 20);
  const rows = [
    { v: ask, label: t("gfMsAsAsk"), color: "var(--accent)" },
    { v: s, label: t("gfMsAsMid"), color: "var(--muted)" },
    { v: reservation, label: t("gfMsAsReservation"), color: "var(--text)" },
    { v: bid, label: t("gfMsAsBid"), color: "var(--accent)" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gf-chart" role="img" aria-label={t("gfMsAsColumnAria")}>
      <line x1={90} x2={90} y1={y(ask)} y2={y(bid)} stroke="var(--border-hover)" strokeWidth={6} />
      {rows.map((r) => (
        <g key={r.label}>
          <line x1={60} x2={120} y1={y(r.v)} y2={y(r.v)} stroke={r.color} strokeWidth={2} strokeDasharray={r.label === t("gfMsAsMid") ? "4 3" : undefined} />
          <text x={128} y={y(r.v)} dy="0.32em" fill={r.color} fontSize={12}>{`${r.label} ${r.v.toFixed(2)}`}</text>
        </g>
      ))}
    </svg>
  );
}
