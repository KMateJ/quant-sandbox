import { useMemo, useState } from "react";
import { Histogram } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { useI18n } from "../../../../../i18n";
import { binDensity, binValues } from "../../../../../lib/stats";
import { DEFAULT_SKEW, LOT, MAX_THETA, simulateSkew } from "../../../guide.micro.inventoryRisk.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import InventorySkewLadder from "./InventorySkewLadder";
import InventorySkewPaths from "./InventorySkewPaths";

const DOMAIN: [number, number] = [-1200, 1200];
const BINS = 24;

/// Poisson-fill makers with quotes shifted by θ per lot held: inventory paths, terminal inventory against θ = 0, and the P&L cost.
export default function InventorySkewFigure() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [theta, setTheta] = useState(0);
  const base = useMemo(() => simulateSkew({ ...DEFAULT_SKEW, theta: 0 }), []);
  const run = useMemo(() => simulateSkew({ ...DEFAULT_SKEW, theta }), [theta]);
  const bins = useMemo(() => binValues(run.terminal, DOMAIN, BINS).bins, [run]);
  const reference = useMemo(() => {
    const b = binValues(base.terminal, DOMAIN, BINS).bins;
    return binDensity(b, base.terminal.length).map((y, i) => ({ x: (b[i].x0 + b[i].x1) / 2, y }));
  }, [base]);
  const reach = useMemo(() => Math.ceil(Math.max(...base.paths.slice(0, 5).flat().map(Math.abs), LOT) / 200) * 200, [base]);

  return (
    <GuideFigure title={t("gfMsInventorySkewTitle")} labId="market-making">
      <div className="gf-sliders">
        <SliderField label={t("gfMsIsTheta")} min={0} max={MAX_THETA * 100} step={0.05} value={theta * 100} onChange={(v) => setTheta(v / 100)} formatValue={(v) => t("gfMsIsCents", { v: v.toFixed(2) })} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsIsLadderAria")}>
        <InventorySkewLadder halfSpread={DEFAULT_SKEW.halfSpread} theta={theta} onTheta={setTheta} isMobile={isMobile} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsIsPathsAria")}>
        <InventorySkewPaths paths={run.paths} reach={reach} isMobile={isMobile} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsIsHistAria")}>
        <Histogram bins={bins} normalize="density" density={reference} ariaLabel={t("gfMsIsHistAria")} xFormat={(v) => v.toFixed(0)} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsIsInvSd"), value: fmt(run.inventorySd, 0), tone: "strong" },
          { label: t("gfMsIsMeanPnl"), value: fmt(run.meanPnl) },
          { label: t("gfMsIsPnlSd"), value: fmt(run.pnlSd) },
        ]}
      />
    </GuideFigure>
  );
}
