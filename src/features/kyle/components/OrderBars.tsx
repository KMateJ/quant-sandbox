import { DraggableBars } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { KyleLab } from "../useKyleLab";
import { fmtShares } from "./kyleFormat";

const yFmt = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v)));

/// Plan: drag all N orders (ghosts = optimal for your plan), then Run. Live: one bar for this auction, then Trade.
export default function OrderBars({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const r = lab.orderRange;
  const common = { min: -r, max: r, step: lab.lot, valueFormat: fmtShares, yFormat: yFmt, height: 200 };
  if (lab.live) {
    const k = lab.shown.length + 1;
    return (
      <div className="kyl-orders">
        <p className="kyl-caption">{lab.done ? t("kylLiveDone") : t("kylLiveHint", { n: k, ghost: fmtShares(lab.liveGhost) })}</p>
        <DraggableBars
          {...common}
          values={[lab.pending]}
          shadows={[lab.liveGhost]}
          onChange={(_, v) => lab.setPending(v)}
          xLabels={[t("kylAuctionN", { n: Math.min(k, lab.params.n) })]}
          barAriaLabel={() => t("kylOrderAria", { n: k })}
          ariaLabel={t("kylOrdersLabel")}
        />
        <div className="kyl-actions">
          <button type="button" className="preset-btn preset-btn--active" onClick={lab.trade} disabled={lab.done}>{t("kylTrade", { x: fmtShares(lab.pending) })}</button>
          <button type="button" className="preset-btn" onClick={lab.reset}>{t("kylRestart")}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="kyl-orders">
      <p className="kyl-caption">{t("kylPlanHint")}</p>
      <DraggableBars
        {...common}
        values={lab.orders}
        shadows={lab.ghosts}
        onChange={lab.setOrder}
        xLabels={lab.orders.map((_, i) => String(i + 1))}
        barAriaLabel={(i) => t("kylOrderAria", { n: i + 1 })}
        ariaLabel={t("kylOrdersLabel")}
      />
      <div className="kyl-actions">
        <button type="button" className="preset-btn preset-btn--active" onClick={lab.run}>{t("kylRun")}</button>
        <button type="button" className="preset-btn" onClick={lab.fillOptimal}>{t("kylUseGhosts")}</button>
        <button type="button" className="preset-btn" onClick={lab.reset}>{t("kylRestart")}</button>
      </div>
    </div>
  );
}
