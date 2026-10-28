import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartDatum, type ChartSeries } from "../../../components/charts";
import { ChartContainer, Panel } from "../../../components/layout";
import SeedControl from "../../../components/SeedControl";
import SliderField from "../../../components/SliderField";
import { StatCard } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import MiniSeriesChart from "./MiniSeriesChart";
import { QV_MAX_K, ZOOM_WIDTHS, expectedAbsSum, finePath, partitionTable, qvBand, zoomWindow } from "./quadraticVariation.math";

const T = 1;
const MIN_K = 3;
const logTick = (v: number) => (Number.isInteger(v) ? String(2 ** v) : "");

/// Σ(ΔW)² settles at T while Σ|ΔW| keeps growing as one fine path is cut into n pieces; zooming shows the same roughness at every scale.
export default function QuadraticVariationExplore() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [seed, setSeed] = useState(5);
  const [k, setK] = useState(6);
  const path = useMemo(() => finePath(seed, T), [seed]);
  const rows = useMemo(() => partitionTable(path), [path]);
  const shown = useMemo(() => rows.filter((r) => r.k >= MIN_K), [rows]);
  const qvData = useMemo(
    () => shown.map((r) => ({ x: r.k, qv: r.qv, target: T, lo: qvBand(r.n, T).lo, hi: qvBand(r.n, T).hi })),
    [shown],
  );
  const tvData = useMemo(() => shown.map((r) => ({ x: r.k, tv: r.tv, expected: expectedAbsSum(r.n, T) })), [shown]);
  const zooms = useMemo(() => ZOOM_WIDTHS.map((w) => ({ w, data: zoomWindow(path, T, w) })), [path]);
  const row = rows[k - 1];

  const mark = [{ axis: "x" as const, value: k, color: SERIES_ROLE.candidate, dash: "4 4" }];
  const qvSeries: ChartSeries[] = [
    { key: "qv", label: "Σ(ΔW)²", color: SERIES_PALETTE[0], strokeWidth: 2.25 },
    { key: "target", label: "T", color: SERIES_ROLE.reference, strokeWidth: 1.5, dash: "6 4" },
    { key: "lo", label: t("stochQvBand"), color: SERIES_ROLE.reference, strokeWidth: 1, dash: "2 3" },
    { key: "hi", label: t("stochQvBand"), color: SERIES_ROLE.reference, strokeWidth: 1, dash: "2 3", legend: false },
  ];
  const tvSeries: ChartSeries[] = [
    { key: "tv", label: "Σ|ΔW|", color: SERIES_PALETTE[1], strokeWidth: 2.25 },
    { key: "expected", label: "√(2nT/π)", color: SERIES_ROLE.reference, strokeWidth: 1.5, dash: "6 4" },
  ];
  const twin = (title: string, data: ChartDatum[], series: ChartSeries[]) => (
    <ChartContainer title={title}>
      <div className="bl-mini-chart bl-mini-chart--tall" role="img" aria-label={title}>
        <LineChart data={data} xKey="x" series={series} xDomain={[MIN_K, QV_MAX_K]} curve="linear" xFormat={logTick} isMobile={isMobile}
          referenceLines={mark} tooltipLabel={(x) => `n = ${2 ** Math.round(x)}`} valueFormat={(v) => v.toFixed(3)} />
      </div>
    </ChartContainer>
  );

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochQvControls")}>
          <div className="controls-grid">
            <SliderField label={t("stochQvPartition")} min={MIN_K} max={QV_MAX_K} step={1} value={k} onChange={setK} formatValue={(v) => String(2 ** v)} />
            <SeedControl seed={seed} setSeed={setSeed} compact />
          </div>
          <div className="stoch-metric-grid">
            <StatCard label="Σ(ΔW)²" value={row.qv.toFixed(3)} />
            <StatCard label="T" value={T.toFixed(3)} />
            <StatCard label="Σ|ΔW|" value={row.tv.toFixed(2)} />
            <StatCard label="√(2nT/π)" value={expectedAbsSum(row.n, T).toFixed(2)} />
          </div>
        </Panel>
      </aside>
      <div className="stoch-stage">
        <div className="bl-grid">
          {twin(t("stochQvChartQv"), qvData, qvSeries)}
          {twin(t("stochQvChartTv"), tvData, tvSeries)}
        </div>
        <ChartContainer title={t("stochQvZoomTitle")}>
          <div className="bl-grid bl-grid--four">
            {zooms.map(({ w, data }) => (
              <MiniSeriesChart key={w} title={t("stochQvZoomPanel", { n: Math.round(1 / w) })} data={data}
                series={[{ key: "y", label: "W", color: SERIES_PALETTE[2], strokeWidth: 1.5 }]} ariaLabel={t("stochQvZoomPanel", { n: Math.round(1 / w) })} />
            ))}
          </div>
          <p className="stoch-chart-caption">{t("stochQvZoomCaption")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
