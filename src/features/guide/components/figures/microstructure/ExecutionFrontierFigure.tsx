import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { useI18n } from "../../../../../i18n";
import { acFrontier, acTrajectory, firstQuarterShare, lambdaExponents, nearestExponent, type AcParams } from "../../../guide.micro.priceImpact.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import { FrontierChart, HoldingsChart } from "./ExecutionFrontierCharts";

const BASE: Omit<AcParams, "sigma" | "eta" | "lambdaRisk"> = { X: 1, N: 20, T: 1, gamma: 0.001 };
const EXPS = lambdaExponents();

/// Almgren–Chriss liquidation: optimal holdings for a chosen risk aversion and the cost-risk frontier.
export default function ExecutionFrontierFigure() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [exp, setExp] = useState(2);
  const [sigma, setSigma] = useState(2);
  const [eta, setEta] = useState(20);
  const base = useMemo<AcParams>(() => ({ ...BASE, sigma: sigma / 100, eta: eta / 1e4, lambdaRisk: 0 }), [sigma, eta]);
  const p = { ...base, lambdaRisk: 10 ** exp };
  const points = useMemo(() => acFrontier(base, EXPS.map((e) => 10 ** e)), [base]);
  const twap = useMemo(() => acTrajectory(base), [base]);
  const current = acFrontier(p, [p.lambdaRisk])[0];

  return (
    <GuideFigure title={t("gfMsExecutionFrontierTitle")} labId="order-book">
      <div className="gf-sliders">
        <SliderField label={t("gfMsEfRisk")} min={-2} max={3} step={0.1} value={exp} onChange={setExp} formatValue={(v) => fmt(10 ** v, v < 0 ? 2 : 1)} />
        <SliderField label={t("gfMsEfSigma")} min={0.5} max={4} step={0.1} value={sigma} onChange={setSigma} formatValue={(v) => `${v.toFixed(1)}%`} />
        <SliderField label={t("gfMsEfEta")} min={5} max={50} step={1} value={eta} onChange={setEta} formatValue={(v) => `${v} bp`} />
      </div>
      <p className="gf-hint">{t("gfMsEfUnits")}</p>
      <div className="gf-ms-price-impact-charts">
        <div className="gf-chart" role="img" aria-label={t("gfMsEfAriaHoldings")}>
          <HoldingsChart x={current.x} twap={twap} isMobile={isMobile} />
        </div>
        <div className="gf-chart" role="img" aria-label={t("gfMsEfAriaFrontier")}>
          <FrontierChart points={points} current={current} onPick={(sd) => setExp(nearestExponent(points, EXPS, sd))} isMobile={isMobile} />
        </div>
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsEfCost"), value: `${fmt(current.cost * 1e4, 1)} bp`, tone: "strong" },
          { label: t("gfMsEfSd"), value: `${fmt(current.sd * 1e4, 1)} bp` },
          { label: t("gfMsEfFirstQuarter"), value: pct(firstQuarterShare(p, current.x), 1), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
