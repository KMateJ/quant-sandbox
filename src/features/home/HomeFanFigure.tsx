import { useI18n } from "../../i18n";
import { buildFan, HERO_FAN } from "./home.fan.math";

const FAN = buildFan(HERO_FAN);
const GRID = [0.25, 0.5, 0.75].map((f) => HERO_FAN.yTop + f * (HERO_FAN.yBottom - HERO_FAN.yTop));
const HIST_X = 612;

/// Hero figure: seeded GBM paths with the terminal distribution; the draw-in animation is CSS only.
export default function HomeFanFigure() {
  const { t } = useI18n();
  const { x0, x1, yTop, yBottom } = HERO_FAN;

  return (
    <figure className="home-fig">
      <svg className="home-fan" viewBox="0 0 720 420" role="img" aria-label={t("homeFigAria")}>
        {GRID.map((y) => (
          <line key={y} x1={x0} x2={x1} y1={y} y2={y} className="home-fan-grid" />
        ))}
        <path d={`M${x0} ${yTop} V${yBottom} H${x1}`} className="home-fan-axis" fill="none" />
        {FAN.paths.map((p, i) =>
          i === FAN.keyIndex ? null : (
            <path key={i} d={p.d} pathLength={1} className="home-fan-path" style={{ animationDelay: `${i * 0.02}s` }} />
          ),
        )}
        <path d={FAN.mean} className="home-fan-mean" fill="none" />
        <path
          d={FAN.paths[FAN.keyIndex].d}
          pathLength={1}
          className="home-fan-path home-fan-key"
          style={{ animationDelay: `${FAN.keyIndex * 0.02}s` }}
        />
        {FAN.bins.map((b, i) => (
          <rect key={i} x={HIST_X} y={b.y} width={b.w} height={b.h} className="home-fan-bin" />
        ))}
        <circle cx={x0} cy={FAN.y0} r={3} className="home-fan-dot" />
        <text x={x0 + 8} y={FAN.y0 - 8} className="home-fan-label">S₀ 100</text>
        <text x={x0} y={yBottom + 22} className="home-fan-label">0</text>
        <text x={x1} y={yBottom + 22} className="home-fan-label" textAnchor="end">T</text>
        <text x={HIST_X} y={yTop - 14} className="home-fan-label">{t("homeFigDistribution")}</text>
      </svg>
      <figcaption className="home-fig-caption">
        <span>{t("homeFigCaption")}</span>
        <span>{t("homeFigPaths", { n: FAN.paths.length })}</span>
      </figcaption>
    </figure>
  );
}
