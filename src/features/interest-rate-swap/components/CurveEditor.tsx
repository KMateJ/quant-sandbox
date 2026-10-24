import { useMemo, useState } from "react";
import { ChartContainer } from "../../../components/layout";
import type { ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import MaturityChart from "../../yield-curve/components/MaturityChart";
import { MATURITY_LABELS } from "../../yield-curve/presets";
import type { CurveNode } from "../../yield-curve/yieldCurve.types";
import { rate } from "../swapFormat";
import type { SwapModel } from "../useSwap";

const DOMAIN: [number, number] = [0, 0.08];

const series = (key: string, label: string, color: string, nodes: CurveNode[], draggable: boolean, dash?: string): ScatterSeries[] => [
  { key, label, color, line: true, strokeWidth: draggable ? 2.5 : 1.5, dash, points: nodes.map((n, i) => ({ x: i, y: n.rate })) },
  ...(draggable ? [{ key: `${key}-nodes`, label, color, radius: 6, draggable: true, legend: false, points: nodes.map((n, i) => ({ x: i, y: n.rate, label: n.label })) }] : []),
];

/// Par quotes on the yield-curve lab's maturity chart: drag a node or type a quote; once locked, the lock-time curve stays as a dashed line.
export default function CurveEditor({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState(5);
  const all = useMemo(() => [
    ...(lab.lockNodes ? series("lock", t("irsCurveLocked"), "var(--chart-reference)", lab.lockNodes, false, "5 4") : []),
    ...series("par", t("irsCurveNow"), "var(--chart-1)", lab.nodes, true),
  ], [lab.nodes, lab.lockNodes, t]);
  const node = lab.nodes[selected];
  return (
    <ChartContainer title={t("irsCurveTitle")}>
      <div className="irs-curve">
        <MaturityChart labels={MATURITY_LABELS} series={all} yDomain={DOMAIN} yFormat={(v) => rate(v, 1)} yLabel={t("irsParAxis")}
          selectedIndex={selected} onSelectIndex={setSelected} onDragRate={(i, y) => lab.setRate(i, y)} legend={!!lab.lockNodes} yNumTicks={5} />
      </div>
      <div className="irs-quote">
        <label>
          <span>{t("irsQuoteFor")}</span>
          <select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>
            {lab.nodes.map((n, i) => <option key={n.label} value={i}>{n.label}</option>)}
          </select>
        </label>
        <label>
          <span>{t("irsQuote")}</span>
          <input type="number" min={0} max={12} step={0.05} value={Number((node.rate * 100).toFixed(3))}
            onChange={(e) => e.target.value !== "" && lab.setRate(selected, e.target.valueAsNumber / 100)} />
          <span aria-hidden="true">%</span>
        </label>
      </div>
      {!lab.curve && <p className="irs-error" role="alert">{t("irsBadCurve")}</p>}
    </ChartContainer>
  );
}
