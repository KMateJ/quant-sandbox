import { useMemo } from "react";
import { DragHandles, ScatterChart, type DragHandle, type PlotFrame } from "../../../../components/charts";
import { ChartContainer } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import { percentileStep } from "../../sort.math";
import type { PortfolioId } from "../../sort.types";
import type { SortModel } from "../../useSortTab";

const PAD = 0.4;

/// The simulated universe (size on x, book-to-market on y) with the three draggable breakpoints and the six tinted regions.
export default function UniverseScatter({ model }: { model: SortModel }) {
  const { t } = useI18n();
  const { universe, values, url, sorted, regions, hover, setHover, setCut } = model;
  const dom = useMemo(() => {
    const ext = (key: "logSize" | "logBm") => {
      const v = universe.map((s) => s[key]);
      return [Math.min(...v) - PAD, Math.max(...v) + PAD] as [number, number];
    };
    return { x: ext("logSize"), y: ext("logBm") };
  }, [universe]);

  const points = universe.map((s, i) => ({ x: s.logSize, y: s.logBm, opacity: hover ? (regions[i] === hover ? 0.95 : 0.25) : 0.7 }));
  const pct = (p: number) => `${Math.round(p * 100)}%`;
  const handles: DragHandle[] = [
    { id: "size", axis: "x", x: values.size, min: dom.x[0], max: dom.x[1], label: t("ffmSortCutSize"), step: percentileStep(universe, "logSize", url.ssz / 100), format: () => pct(url.ssz / 100) },
    { id: "lo", axis: "y", y: values.lo, min: dom.y[0], max: dom.y[1], label: t("ffmSortCutLo"), step: percentileStep(universe, "logBm", url.slo / 100), format: () => pct(url.slo / 100) },
    { id: "hi", axis: "y", y: values.hi, min: dom.y[0], max: dom.y[1], label: t("ffmSortCutHi"), step: percentileStep(universe, "logBm", url.shi / 100), format: () => pct(url.shi / 100) },
  ];

  const layer = (frame: PlotFrame) => {
    const xs = [dom.x[0], values.size, dom.x[1]];
    const ys = [dom.y[1], values.hi, values.lo, dom.y[0]];
    const cells = (["S", "B"] as const).flatMap((sz, c) =>
      (["H", "M", "L"] as const).map((bm, r) => ({ id: `${sz}${bm}` as PortfolioId, x0: frame.x(xs[c]), x1: frame.x(xs[c + 1]), y0: frame.y(ys[r]), y1: frame.y(ys[r + 1]) }))
    );
    return (
      <g>
        <g>
          {cells.map((c) => (
            <rect key={c.id} className={hover === c.id ? "ffm-region is-hover" : "ffm-region"} x={c.x0} y={c.y0} width={Math.max(0, c.x1 - c.x0)} height={Math.max(0, c.y1 - c.y0)} onPointerEnter={() => setHover(c.id)} onPointerLeave={() => setHover(null)} />
          ))}
          {cells.map((c) => (
            <text key={`${c.id}-t`} className="ffm-region-label" x={c.x0 + 6} y={(c.y0 + c.y1) / 2}>{`${c.id} · ${sorted.counts[c.id]}`}</text>
          ))}
        </g>
        <DragHandles frame={frame} handles={handles} onChange={(id, v) => setCut(id as "size" | "lo" | "hi", (id === "size" ? v.x : v.y) ?? 0)} />
      </g>
    );
  };

  return (
    <ChartContainer title={t("ffmSortUniverseTitle")} height={380} className="ffm-universe">
      <ScatterChart
        series={[{ key: "stocks", label: t("ffmSortStocks"), color: "var(--chart-1)", radius: 2.6, outline: false, legend: false, points }]}
        xDomain={dom.x}
        xTickValues={[-4, -2, 0, 2, 4]}
        yDomain={dom.y}
        xLabel={t("ffmSortXAxis")}
        yLabel={t("ffmSortYAxis")}
        legend={false}
        layer={layer}
      />
    </ChartContainer>
  );
}
