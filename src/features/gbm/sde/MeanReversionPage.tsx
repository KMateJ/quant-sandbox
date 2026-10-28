import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { Histogram, PathCloudChart } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { binValues } from "../../../lib/stats";
import { normalLaw } from "../../../lib/stats/distributions";
import { densityCurve, terminalValues } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { OU_URL_SCHEMA } from "../gbm.sde.url";
import { negativeShares, ouHalfLife, ouMeanAt, ouSdAt, ouStationarySd, simulateOu } from "../gbm.ou.math";
import SdeLayout from "./SdeLayout";

const HORIZON = 5;
const STEPS = 200;
const PATHS = 600;

const dec = (v: number, d = 1) => v.toFixed(d);

/// Vasicek / Ornstein–Uhlenbeck rate paths (in percent) settling into the stationary band around θ.
export default function MeanReversionPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(OU_URL_SCHEMA);
  const { kappa, theta, sigma, x0, seed } = url;

  const values = useMemo(() => simulateOu(x0, theta, kappa, sigma, HORIZON, STEPS, PATHS, seed), [x0, theta, kappa, sigma, seed]);
  const shares = negativeShares(values, PATHS, STEPS + 1, x0, theta, kappa, sigma, HORIZON);
  const band = ouStationarySd(kappa, sigma);
  const half = ouHalfLife(kappa);

  const yDomain: [number, number] = [Math.min(x0, theta) - 4 * band, Math.max(x0, theta) + 4 * band];
  const dt = HORIZON / STEPS;
  const line = (key: string, color: string, f: (time: number) => number, dash?: string, w = 1.5): PathOverlay => ({
    key, color, dash, strokeWidth: w, points: [0, HORIZON].map((x) => ({ x, y: f(x) })),
  });
  const overlays: PathOverlay[] = [
    line("zero", "var(--danger, #dc2626)", () => 0, "2 3", 1),
    line("up", "var(--muted)", () => theta + band, "5 4"),
    line("down", "var(--muted)", () => theta - band, "5 4"),
    { key: "mean", color: "var(--text)", strokeWidth: 2.5, points: Array.from({ length: STEPS + 1 }, (_, s) => ({ x: s * dt, y: ouMeanAt(x0, theta, kappa, s * dt) })) },
    ...(half < HORIZON ? [{ key: "half", color: "var(--primary)", dash: "6 4", strokeWidth: 1.5, points: [{ x: half, y: yDomain[0] }, { x: half, y: yDomain[1] }] }] : []),
  ];

  const end = useMemo(() => terminalValues(values, PATHS, STEPS + 1), [values]);
  const mT = ouMeanAt(x0, theta, kappa, HORIZON);
  const sT = ouSdAt(kappa, sigma, HORIZON);
  const hist = binValues(end, yDomain, 40);

  return (
    <SdeLayout
      titleKey="sdeOuTitle"
      descKey="sdeOuDesc"
      controls={
        <>
          <SliderField label={t("sdeOuKappa")} min={0.1} max={6} step={0.1} value={kappa} onChange={(v) => setUrl({ kappa: v })} formatValue={dec} />
          <SliderField label={t("sdeOuTheta")} min={-0.02} max={0.1} step={0.005} value={theta} onChange={(v) => setUrl({ theta: v })} formatValue={(v) => `${dec(v * 100)}%`} />
          <SliderField label={t("sdeOuSigma")} min={0.005} max={0.06} step={0.005} value={sigma} onChange={(v) => setUrl({ sigma: v })} formatValue={(v) => `${dec(v * 100)}%`} />
          <SliderField label={t("sdeOuStart")} min={-0.05} max={0.1} step={0.005} value={x0} onChange={(v) => setUrl({ x0: v })} formatValue={(v) => `${dec(v * 100)}%`} />
          <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
        </>
      }
      stats={[
        { label: t("sdeOuHalfLife"), value: `${dec(half, 2)} ${t("sdeYears")}` },
        { label: t("sdeOuBand"), value: `±${dec(band * 100, 2)}%` },
        { label: t("sdeOuNegEver"), value: `${dec(shares.ever * 100, 0)}%` },
        { label: t("sdeOuNegEnd"), value: `${dec(shares.end * 100, 1)}% (${dec(shares.exact * 100, 1)}%)` },
      ]}
    >
      <ChartContainer title={t("sdeOuPathsTitle", { n: PATHS })}>
        <div className="sde-chart sde-chart--tall">
          <PathCloudChart values={values} pathCount={PATHS} stepCount={STEPS + 1} dx={dt} xDomain={[0, HORIZON]} yDomain={yDomain}
            maxOpacity={0.3} overlays={overlays} isMobile={isMobile} ariaLabel={t("sdeOuPathsAria")} />
        </div>
      </ChartContainer>
      <ChartContainer title={t("sdeOuHistTitle", { t: HORIZON })}>
        <Histogram bins={hist.bins} density={densityCurve(normalLaw(mT, sT), yDomain)} height={isMobile ? 200 : 240}
          xFormat={(v) => dec(v * 100, 0)} yFormat={(v) => String(Number(v.toPrecision(2)))} ariaLabel={t("sdeOuHistAria")} />
      </ChartContainer>
    </SdeLayout>
  );
}
