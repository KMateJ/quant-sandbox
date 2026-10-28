import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { Histogram } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup } from "../../components/ui";
import { binValues } from "../../lib/stats";
import { useI18n } from "../../i18n";
import McFkCurve from "./McFkCurve";
import McTermsSliders from "./McTermsSliders";
import { FK_URL_SCHEMA } from "./monteCarloPages.url";
import { feynmanKacRun } from "./monteCarloPages.math";
import { useMcJob } from "./useMcJob";

const BINS = 40;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Feynman–Kac: the PDE value u(t, x) equals the discounted average payoff of paths started at x at time t.
export default function McFeynmanKacView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(FK_URL_SCHEMA);
  const { x, K, T, r, sigma, n, seed } = url;
  const time = Math.min(url.t, T - 0.05);
  const params = { x, t: time, strike: K, maturity: T, rate: r, vol: sigma, sims: n, seed };
  const { result, params: shown, pending } = useMcJob("fk", params, feynmanKacRun);

  const bins = useMemo(() => {
    const top = result.payoffs.reduce((m, v) => Math.max(m, v), 0);
    return binValues(result.payoffs, [0, top > 0 ? top : 1], BINS).bins;
  }, [result]);
  const diff = result.estimate - result.closed;

  return (
    <>
      <PageHeader title={t("monteCarloFkTitle")} description={t("monteCarloFkDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("monteCarloControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("monteCarloFkXLabel")} min={20} max={300} step={5} value={x} onChange={(v) => setUrl({ x: v })} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("monteCarloFkTLabel")} min={0} max={Math.max(T - 0.05, 0)} step={0.05} value={time} onChange={(v) => setUrl({ t: v })} formatValue={(v) => v.toFixed(2)} />
            <McTermsSliders terms={url} onChange={setUrl} />
          </div>
          <ControlGroup label={t("monteCarloMetricsLabel")}>
            <div className="stats-grid" aria-busy={pending}>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloFkClosed")}</div>
                <div className="stat-value">{result.closed.toFixed(4)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloFkMc")}</div>
                <div className="stat-value">{result.estimate.toFixed(4)} ± {(1.96 * result.standardError).toFixed(4)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloFkDiff")}</div>
                <div className="stat-value">{diff >= 0 ? "+" : ""}{diff.toFixed(4)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <div className="module-main">
          <ChartContainer title={t("monteCarloFkCurveTitle")}>
            <p className="control-hint">{pending ? t("monteCarloUpdating") : t("monteCarloFkCurveHint")}</p>
            <div className="chart-wrap">
              <McFkCurve curve={result.curve} x={shown.x} isMobile={isMobile} />
            </div>
          </ChartContainer>
          <ChartContainer title={t("monteCarloFkHistTitle")}>
            <Histogram
              bins={bins} color="var(--border-hover)" height={isMobile ? 210 : 260}
              markers={[
                { value: result.closed, label: t("monteCarloFkMarker"), color: "#22c55e" },
                { value: result.estimate, color: "#38bdf8", dash: "6 4" },
              ]}
              xFormat={(v) => v.toFixed(0)} ariaLabel={t("monteCarloFkHistAria")}
            />
            <p className="control-hint">{t("monteCarloFkHistHint", { share: pct(result.payingShare) })}</p>
          </ChartContainer>
        </div>
      </Workspace>
    </>
  );
}
