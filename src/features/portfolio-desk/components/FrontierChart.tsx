import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { ScatterChart, SERIES_PALETTE, SERIES_ROLE, type ScatterSeries } from "../../../components/charts";
import { pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { BENCH_WEIGHTS, exAnteVol, frontier } from "../engine/risk.math";
import { ASSET_CODES } from "../portfolioFormat";
import type { PortfolioMission } from "../engine/portfolio.types";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

const X_MAX = 0.3;
const Y_MAX = 0.12;

/// Calm expected return of risky weights `w` with the rest in cash.
const expected = (w: number[], m: PortfolioMission) =>
  w.reduce((a, wi, i) => a + wi * m.calm.mu[i], 0) + (1 - w.reduce((a, b) => a + b, 0)) * m.riskFree;

/// Frontier under today's EWMA risk model with the assets, the fund, the 60/40 and the vol target.
export default function FrontierChart({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { S, mission, state, exAnte } = desk;
  const series = useMemo<ScatterSeries[]>(() => {
    const curve = frontier(S, mission).filter((p) => p.vol <= X_MAX && p.ret >= 0 && p.ret <= Y_MAX);
    return [
      { key: "frontier", label: t("pmgrSeriesFrontier"), color: SERIES_ROLE.reference, line: true, strokeWidth: 1.5, points: curve.map((p) => ({ x: p.vol, y: p.ret })) },
      {
        key: "assets", label: t("pmgrSeriesAssets"), color: SERIES_PALETTE[2], radius: 4,
        points: ASSET_CODES.map((code, i) => ({ x: Math.sqrt(S[i][i] * 12), y: mission.calm.mu[i], label: code })),
      },
      { key: "bench", label: t("pmgrSeriesBench"), color: SERIES_PALETTE[3], radius: 5, points: [{ x: exAnteVol(BENCH_WEIGHTS, S), y: expected(BENCH_WEIGHTS, mission), label: t("pmgrSeriesBench") }] },
      { key: "fund", label: t("pmgrSeriesFund"), color: SERIES_PALETTE[0], radius: 6, points: [{ x: exAnte, y: expected(state.w, mission), label: t("pmgrSeriesFund") }] },
    ];
  }, [S, mission, state.w, exAnte, t]);

  return (
    <Panel id="pmgr-frontier" title={t("pmgrFrontierTitle")} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <ScatterChart series={series} xDomain={[0, X_MAX]} yDomain={[0, Y_MAX]} xFormat={(v) => pct(v, 0)} yFormat={(v) => pct(v, 0)}
          xLabel={t("pmgrAxisVol")} yLabel={t("pmgrAxisReturn")} legend={false}
          referenceLines={[{ axis: "x", value: mission.target, color: SERIES_ROLE.estimate, dash: "4 3" }]} />
      </div>
    </Panel>
  );
}
