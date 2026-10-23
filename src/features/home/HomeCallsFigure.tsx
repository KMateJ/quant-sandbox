import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { buildCallCurves, HERO_CALLS } from "./home.calls.math";

const GRID = [0.25, 0.5, 0.75].map((f) => HERO_CALLS.yTop + f * (HERO_CALLS.yBottom - HERO_CALLS.yTop));

/// Alternate hero figure: call value curves collapsing onto the payoff as expiry nears.
export default function HomeCallsFigure({ sigma }: { sigma: number }) {
  const { t } = useI18n();
  const art = useMemo(() => buildCallCurves(HERO_CALLS, sigma), [sigma]);
  const { x0, x1, yTop, yBottom, taus } = HERO_CALLS;

  return (
    <figure className="home-fig">
      <svg className="home-fan" viewBox="0 0 720 420" role="img" aria-label={t("homeFigCallsAria")}>
        {GRID.map((y) => (
          <line key={y} x1={x0} x2={x1} y1={y} y2={y} className="home-fan-grid" />
        ))}
        <path d={`M${x0} ${yTop} V${yBottom} H${x1}`} className="home-fan-axis" fill="none" />
        {art.curves.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className="home-fan-path home-fan-curve"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        <path d={art.payoff} pathLength={1} className="home-fan-path home-fan-key" style={{ animationDelay: `${taus.length * 0.35}s` }} />
        <text x={art.xK} y={yBottom + 22} className="home-fan-label" textAnchor="middle">K 100</text>
        <text x={x1} y={yBottom + 22} className="home-fan-label" textAnchor="end">S</text>
        <text x={x0 + 8} y={yTop - 14} className="home-fan-label">C(S, τ)</text>
      </svg>
      <figcaption className="home-fig-caption">
        <span>{t("homeFigCallsCaption", { sigma: Math.round(sigma * 100) })}</span>
        <span>{t("homeFigCallsTaus", { taus: taus.join(" · ") })}</span>
      </figcaption>
    </figure>
  );
}
