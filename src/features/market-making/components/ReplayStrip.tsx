import { useI18n } from "../../../i18n";
import { ROUND_SECONDS, type FillRecord } from "../marketMaking.types";

const W = 640;
const H = 120;
const MID = H / 2;

/// The finished round replayed: each fill on the time axis (triangle = informed, circle = noise) with its
/// markout as a vertical stroke (up = the move went your way).
export default function ReplayStrip({ fills }: { fills: FillRecord[] }) {
  const { t } = useI18n();
  const maxMark = Math.max(1, ...fills.map((f) => Math.abs(f.markout)));
  const x = (s: number) => 8 + (s / ROUND_SECONDS) * (W - 16);
  const y = (m: number) => MID - (m / maxMark) * (MID - 10);
  return (
    <figure className="mkm-replay">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t("mkmReplayAria", { n: fills.length, informed: fills.filter((f) => f.informed).length })}>
        <line className="mkm-replay-axis" x1={0} x2={W} y1={MID} y2={MID} />
        {fills.map((f, i) => {
          const cx = x(f.t);
          const tone = f.markout >= 0 ? "gain" : "loss";
          return (
            <g key={i} className={`mkm-replay-fill mkm-replay-fill--${tone}`}>
              <line x1={cx} x2={cx} y1={MID} y2={y(f.markout)} />
              {f.informed ? <path d={`M${cx} ${MID - 5} L${cx + 5} ${MID + 4} L${cx - 5} ${MID + 4} Z`} /> : <circle cx={cx} cy={MID} r={3.5} />}
            </g>
          );
        })}
      </svg>
      <figcaption className="mkm-legend">
        <span><svg width="12" height="12" aria-hidden="true"><path d="M6 1 L11 10 L1 10 Z" className="mkm-legend-shape" /></svg>{t("mkmLegendInformed")}</span>
        <span><svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4" className="mkm-legend-shape" /></svg>{t("mkmLegendNoise")}</span>
        <span>{t("mkmLegendMarkout")}</span>
      </figcaption>
    </figure>
  );
}
