import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { gapAverages, riemannSums } from "../itoIntegral.math";
import { INTEGRAL_URL_SCHEMA } from "../itoPages.url";

const PATHS = 100;
const f3 = (v: number) => v.toFixed(3);

/// Left, midpoint and right Riemann sums of ∫W dW on one seeded path as the grid refines.
export default function ItoIntegralPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [{ T, seed }, setUrl] = useUrlState(INTEGRAL_URL_SCHEMA);
  const rows = useMemo(() => riemannSums(T, seed), [T, seed]);
  const gaps = useMemo(() => gapAverages(T, seed, PATHS), [T, seed]);
  const last = rows[rows.length - 1];

  const series: ChartSeries[] = [
    { key: "left", label: t("itoIntLeft"), color: "#f59e0b", strokeWidth: 2.25 },
    { key: "mid", label: t("itoIntMid"), color: "#22c55e", strokeWidth: 2.25 },
    { key: "right", label: t("itoIntRight"), color: "#60a5fa", strokeWidth: 2.25 },
    { key: "ito", label: t("itoIntIto"), color: "#f59e0b", strokeWidth: 1.5, dash: "6 4" },
    { key: "strat", label: t("itoIntStrat"), color: "#22c55e", strokeWidth: 1.5, dash: "6 4" },
  ];

  return (
    <>
      <PageHeader title={t("itoIntTitle")} description={t("itoIntDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("itoIntControls")}>
          <div className="controls-grid">
            <SliderField label={t("itoProcessHorizonLabel")} min={0.25} max={5} step={0.25} value={T} onChange={(v) => setUrl({ T: v })} formatValue={(v) => v.toFixed(2)} />
            <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
          </div>
          <dl className="lp-ensemble-readout">
            <div><dt>{t("itoIntIto")}</dt><dd>{f3(last.ito)}</dd></div>
            <div><dt>{t("itoIntStrat")}</dt><dd>{f3(last.strat)}</dd></div>
            <div><dt>{t("itoIntLeft")}, n = {last.n}</dt><dd>{f3(last.left)}</dd></div>
            <div><dt>{t("itoIntMidGap", { paths: PATHS })}</dt><dd>{f3(gaps.midGap)} ({t("itoIntHalfT")} = {f3(T / 2)})</dd></div>
            <div><dt>{t("itoIntRightGap", { paths: PATHS })}</dt><dd>{f3(gaps.rightGap)} ({t("itoIntT")} = {f3(T)})</dd></div>
          </dl>
          <p className="lp-ensemble-hint">{t("itoIntHint")}</p>
        </Panel>
        <ChartContainer title={t("itoIntChartTitle")}>
          <div className="chart-wrap" role="img" aria-label={t("itoIntChartAria")}>
            <LineChart data={rows} xKey="x" series={series} curve="linear" isMobile={isMobile}
              xFormat={(v) => (Number.isInteger(v) ? String(2 ** v) : "")}
              tooltipLabel={(x) => `n = ${Math.round(2 ** x)}`} valueFormat={f3} />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
