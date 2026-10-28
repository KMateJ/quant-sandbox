import type { FfFactor } from "../../../guide.famaFrench.math";
import { FF_FACTORS } from "../../../guide.famaFrench.math";

const W = 520;
const ROW = 34;
const LEFT = 64;
const RIGHT = 56;
const LO = -0.6;
const HI = 1.3;
const NAMES: Record<FfFactor, string> = { mkt: "MKT", smb: "SMB", hml: "HML", rmw: "RMW", cma: "CMA" };

interface Props {
  loadings: Record<FfFactor, number | null>;
  truth: Record<FfFactor, number>;
  labels: { omitted: string; truth: string };
}

/// Horizontal bars of the estimated loadings with a tick at each true loading.
export default function FfLoadingsBars({ loadings, truth, labels }: Props) {
  const x = (v: number) => LEFT + ((Math.min(HI, Math.max(LO, v)) - LO) / (HI - LO)) * (W - LEFT - RIGHT);
  const h = ROW * FF_FACTORS.length + 24;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} width="100%" style={{ maxHeight: h + 40 }}>
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={0} y2={h - 20} stroke="var(--border)" strokeDasharray={v === 0 ? undefined : "3 3"} />
          <text x={x(v)} y={h - 6} textAnchor="middle" fontSize={11} fill="var(--muted)">{v.toFixed(1)}</text>
        </g>
      ))}
      {FF_FACTORS.map((f, i) => {
        const y = i * ROW + 6;
        const b = loadings[f];
        return (
          <g key={f}>
            <text x={LEFT - 10} y={y + ROW / 2} textAnchor="end" dominantBaseline="middle" fontSize={12} fill="var(--text)">{NAMES[f]}</text>
            {b === null ? (
              <text x={x(0) + 6} y={y + ROW / 2} dominantBaseline="middle" fontSize={11} fill="var(--muted)">{labels.omitted}</text>
            ) : (
              <>
                <rect x={Math.min(x(0), x(b))} y={y + 6} width={Math.abs(x(b) - x(0))} height={ROW - 16} fill="var(--primary)" />
                <text x={W - RIGHT + 8} y={y + ROW / 2} dominantBaseline="middle" fontSize={12} fill="var(--text)">{b.toFixed(2)}</text>
              </>
            )}
            <line x1={x(truth[f])} x2={x(truth[f])} y1={y + 2} y2={y + ROW - 6} stroke="var(--text)" strokeWidth={2}>
              <title>{`${labels.truth}: ${truth[f].toFixed(2)}`}</title>
            </line>
          </g>
        );
      })}
    </svg>
  );
}
