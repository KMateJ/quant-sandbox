import { useState } from "react";
import { DraggableBars } from "../../../../../components/charts";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { KYLE_FIG, KYLE_FIG_ORDERS, kyleSchedule } from "../../../guide.micro.kyleModel.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import KyleSchedulePath from "./KyleSchedulePath";

type View = "insider" | "maker";

const shares = (v: number) => `${Math.round(v)}`;
const yFmt = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v)));
const clampOrder = (v: number) => Math.max(-KYLE_FIG.range, Math.min(KYLE_FIG.range, Math.round(v / KYLE_FIG.lot) * KYLE_FIG.lot));

/// Ten auctions with one constant λ: drag the insider's orders (ghosts = optimal) and watch the price close the gap to V.
export default function KyleScheduleFigure() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<number[]>(() => [...KYLE_FIG_ORDERS]);
  const [view, setView] = useState<View>("insider");
  const r = kyleSchedule(orders);
  const maker = view === "maker";
  const setOrder = (i: number, x: number) => setOrders((o) => o.map((v, j) => (j === i ? clampOrder(x) : v)));
  const flowMax = KYLE_FIG.range + 2000;

  return (
    <GuideFigure title={t("gfMsKyleScheduleTitle")} labId="kyle">
      <div className="gf-toolbar">
        <SegmentedControl<View>
          ariaLabel={t("gfMsKyleViewLabel")}
          value={view}
          onChange={setView}
          options={[
            { value: "insider", label: t("gfMsKyleViewInsider") },
            { value: "maker", label: t("gfMsKyleViewMaker") },
          ]}
        />
        <button type="button" className="preset-btn" onClick={() => setOrders([...KYLE_FIG_ORDERS])}>{t("gfMsKyleReset")}</button>
      </div>
      <p className="gf-hint">{t(maker ? "gfMsKyleHintMaker" : "gfMsKyleHintInsider")}</p>
      <div className="gf-chart">
        <DraggableBars
          values={maker ? r.rows.map((row) => row.flow) : orders}
          shadows={maker ? undefined : r.ghosts}
          onChange={(i, v) => setOrder(i, maker ? v - r.rows[i].u : v)}
          min={maker ? -flowMax : -KYLE_FIG.range}
          max={maker ? flowMax : KYLE_FIG.range}
          step={KYLE_FIG.lot}
          xLabels={orders.map((_, i) => String(i + 1))}
          barAriaLabel={(i) => t(maker ? "gfMsKyleFlowAria" : "gfMsKyleOrderAria", { n: i + 1 })}
          ariaLabel={t(maker ? "gfMsKyleFlowLabel" : "gfMsKyleOrdersLabel")}
          valueFormat={shares}
          yFormat={yFmt}
        />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsKylePathAria", { p: fmt(r.path[r.path.length - 1].p, 2) })}>
        <KyleSchedulePath path={r.path} v={KYLE_FIG.params.p0 + KYLE_FIG.gap} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsKyleYours"), value: `${fmt(r.yours, 0)} USD`, tone: "strong" },
          { label: t("gfMsKyleOptimal"), value: `${fmt(r.optimal, 0)} USD`, tone: "accent" },
          { label: t("gfMsKyleGap"), value: pct(r.gapClosed, 0) },
          { label: t("gfMsKyleLambda"), value: fmt(r.lambda, 5) },
        ]}
      />
    </GuideFigure>
  );
}
