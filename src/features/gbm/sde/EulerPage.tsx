import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, ScatterChart } from "../../../components/charts";
import type { ChartSeries, ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { EULER_URL_SCHEMA } from "../gbm.sde.url";
import { errorCurves, eulerComparison, loglogSlope } from "../gbm.euler.math";
import SdeLayout from "./SdeLayout";

const dec = (v: number, d = 2) => v.toFixed(d);

/// Exact GBM and its Euler–Maruyama approximation on shared Brownian increments, with log-log error orders.
export default function EulerPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(EULER_URL_SCHEMA);
  const { mu, sigma, n, seed } = url;

  const paths = useMemo(() => eulerComparison(seed, n, mu, sigma), [seed, n, mu, sigma]);
  const errors = useMemo(() => errorCurves(mu, sigma), [mu, sigma]);
  const strongSlope = loglogSlope(errors.map((e) => ({ dt: e.dt, value: e.strong })));
  const weakSlope = loglogSlope(errors.map((e) => ({ dt: e.dt, value: e.weak })));

  const pathSeries: ChartSeries[] = [
    { key: "exact", label: t("sdeEulerExact"), color: "var(--text)", strokeWidth: 2 },
    { key: "euler", label: t("sdeEulerApprox"), color: "var(--primary)", strokeWidth: 2 },
  ];

  const log = (v: number) => Math.log10(v);
  const pts = (key: "strong" | "weak") => errors.map((e) => ({ x: log(e.dt), y: log(e[key]) }));
  const ref = (key: "strong" | "weak", slope: number) => {
    const [a, b] = [pts(key)[0], pts(key)[errors.length - 1]];
    return [a, b].map((p) => ({ x: p.x, y: b.y + slope * (p.x - b.x) - 0.35 }));
  };
  const here = errors.find((e) => e.n === n);
  const scatter: ScatterSeries[] = [
    { key: "strong", label: t("sdeEulerStrong"), color: "var(--primary)", points: pts("strong"), line: true, strokeWidth: 2 },
    { key: "strongDots", label: t("sdeEulerStrong"), color: "var(--primary)", points: pts("strong"), radius: 3.5, legend: false },
    { key: "weak", label: t("sdeEulerWeak"), color: "var(--warning-title)", points: pts("weak"), line: true, strokeWidth: 2 },
    { key: "weakDots", label: t("sdeEulerWeak"), color: "var(--warning-title)", points: pts("weak"), radius: 3.5, legend: false },
    { key: "refHalf", label: t("sdeEulerRefHalf"), color: "var(--muted)", points: ref("strong", 0.5), line: true, dash: "5 4", strokeWidth: 1.5 },
    { key: "refOne", label: t("sdeEulerRefOne"), color: "var(--muted)", points: ref("weak", 1), line: true, dash: "2 3", strokeWidth: 1.5 },
    ...(here ? [{ key: "here", label: t("sdeEulerHere"), color: "var(--text)", points: [{ x: log(here.dt), y: log(here.strong) }], radius: 7, hollow: true }] : []),
  ];

  return (
    <SdeLayout
      titleKey="sdeEulerTitle"
      descKey="sdeEulerDesc"
      controls={
        <>
          <SliderField label={t("sdeEulerStepsLabel")} min={2} max={8} step={1} value={Math.log2(n)} onChange={(v) => setUrl({ n: 2 ** v })} formatValue={() => String(n)} />
          <SliderField label={t("gbmDriftLabel")} min={-0.3} max={0.3} step={0.01} value={mu} onChange={(v) => setUrl({ mu: v })} formatValue={dec} />
          <SliderField label={t("gbmVolLabel")} min={0.1} max={0.8} step={0.05} value={sigma} onChange={(v) => setUrl({ sigma: v })} formatValue={dec} />
          <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
        </>
      }
      stats={[
        { label: t("sdeEulerTerminalError"), value: dec(paths.terminalError) },
        { label: t("sdeEulerStrongOrder"), value: dec(strongSlope) },
        { label: t("sdeEulerWeakOrder"), value: dec(weakSlope) },
      ]}
    >
      <ChartContainer title={t("sdeEulerPathsTitle", { n })}>
        <div className="sde-chart">
          <LineChart data={paths.rows} xKey="t" series={pathSeries} xDomain={[0, 1]} curve="linear" isMobile={isMobile} legend
            tooltipLabel={(x) => `t = ${dec(x)}`} valueFormat={dec} />
        </div>
      </ChartContainer>
      <ChartContainer title={t("sdeEulerErrorTitle")}>
        <div className="sde-chart">
          <ScatterChart series={scatter} isMobile={isMobile} legend xLabel={t("sdeEulerXLabel")} yLabel={t("sdeEulerYLabel")}
            xTickValues={errors.map((e) => log(e.dt))} xFormat={(v) => `1/${Math.round(10 ** -v)}`}
            yFormat={(v) => String(Number((10 ** v).toPrecision(1)))} />
        </div>
      </ChartContainer>
    </SdeLayout>
  );
}
