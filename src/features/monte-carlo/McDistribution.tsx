import { useMemo, useState } from "react";
import { Histogram, PathCloudChart, type BinRange, type PathOverlay } from "../../components/charts";
import { Workspace } from "../../components/layout";
import { binValues, pathPoints, pathsEndingIn } from "../../lib/stats";
import { useI18n } from "../../i18n";
import { brushShare, terminalDomain } from "./monteCarloLab.math";
import type { McLabParams, McLabResult } from "./monteCarlo.types";

type Props = { result: McLabResult; params: McLabParams; isMobile: boolean };

const BINS = 40;
const MAX_BRUSHED = 40;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Histogram of every simulated S_T (the call pays in the tinted bins) linked to sample paths that end at those draws:
/// brushing bins highlights the paths behind them and shows how much of the price comes from that range.
export default function McDistribution({ result, params, isMobile }: Props) {
  const { t } = useI18n();
  const [brush, setBrush] = useState<{ range: BinRange | null; result: McLabResult }>({ range: null, result });
  // A new run invalidates a selection made on the old bins.
  if (brush.result !== result) setBrush({ range: null, result });
  const selection = brush.range;

  const { strike, maturity } = params;
  const domain = useMemo(() => terminalDomain(params), [params]);
  const bins = useMemo(() => binValues(result.terminal, domain, BINS).bins, [result, domain]);
  const steps = result.pathSteps + 1;
  const dx = maturity / result.pathSteps;
  const brushed = useMemo(() => {
    if (!selection || !bins[selection[1]]) return null;
    const range = { lo: bins[selection[0]].x0, hi: bins[selection[1]].x1 };
    const ends = pathsEndingIn(result.terminal.subarray(0, result.pathCount), range.lo, range.hi);
    return {
      range,
      share: brushShare(result.terminal, result.payoff, range.lo, range.hi),
      count: ends.length,
      overlays: ends.slice(0, MAX_BRUSHED).map((j): PathOverlay => ({ key: `b${j}`, color: "var(--primary)", strokeWidth: 1.4, points: pathPoints(result.paths, result.pathCount, steps, j, dx) })),
    };
  }, [selection, bins, result, steps, dx]);
  const strikeLine: PathOverlay = { key: "K", color: "#22c55e", dash: "6 4", strokeWidth: 1.5, points: [{ x: 0, y: strike }, { x: maturity, y: strike }] };
  const fmt = (v: number) => v.toFixed(0);

  return (
    <div className="module-main">
      <Workspace columns="split">
        <Histogram
          bins={bins} color="var(--border-hover)" tint={(b) => (b.x0 >= strike ? "accent" : undefined)}
          markers={[{ value: strike, label: t("monteCarloStrikeMarker"), color: "#22c55e", dash: "6 4" }]}
          selection={selection} onSelectionChange={(r) => setBrush({ range: r, result })}
          xFormat={fmt} height={isMobile ? 210 : 280} ariaLabel={t("monteCarloHistAria")}
        />
        <div className="chart-wrap" style={{ height: isMobile ? 210 : 280 }}>
          <PathCloudChart
            values={result.paths} pathCount={result.pathCount} stepCount={steps} dx={dx} xDomain={[0, maturity]}
            color="#38bdf8" maxOpacity={selection ? 0.15 : 0.45} overlays={[strikeLine, ...(brushed?.overlays ?? [])]} isMobile={isMobile}
            ariaLabel={t("monteCarloPathsAria", { n: result.pathCount })}
          />
        </div>
      </Workspace>
      {brushed ? (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-title">{t("monteCarloBrushRange")}</div><div className="stat-value">{fmt(brushed.range.lo)}–{fmt(brushed.range.hi)}</div></div>
            <div className="stat-card"><div className="stat-title">{t("monteCarloBrushDraws")}</div><div className="stat-value">{pct(brushed.share.draws)}</div></div>
            <div className="stat-card"><div className="stat-title">{t("monteCarloBrushPayoff")}</div><div className="stat-value">{pct(brushed.share.payoff)}</div></div>
          </div>
          <p className="control-hint">{t("monteCarloBrushPaths", { n: brushed.count })}</p>
        </>
      ) : (
        <p className="control-hint">{t("monteCarloBrushHint")}</p>
      )}
    </div>
  );
}
