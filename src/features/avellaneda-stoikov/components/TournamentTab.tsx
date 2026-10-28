import { ChartContainer } from "../../../components/layout";
import { DataTable } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { PolicyStats } from "../avellanedaStoikov.types";
import type { AvsLab } from "../useAvellanedaStoikovLab";
import FrontierChart from "./FrontierChart";
import PnlHistograms from "./PnlHistograms";
import SampleDay from "./SampleDay";

const usd = (v: number) => `$${v.toFixed(2)}`;

/// Tournament: run 500 shared days for your policy, AS and symmetric; histograms, frontier, table, a sample day.
export default function TournamentTab({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const { tour } = lab;
  const names = [t("avsYourPolicy"), t("avsAsName", { g: lab.params.gamma }), t("avsSymName")];
  const rows = tour.result.stats.map((s, i) => ({ s, name: names[i] }));
  const status = tour.pending ? t("avsRunning") : tour.full ? t("avsFullRun", { n: tour.result.days, seed: tour.result.seed }) : t("avsPreviewRun", { n: tour.result.days });

  return (
    <div className="avs-tour">
      <div className="avs-tour-head">
        <button type="button" className="lp-btn lp-btn--primary" onClick={tour.run} disabled={tour.pending || !lab.canRun}>{t("avsRun")}</button>
        <span className="avs-caption" aria-live="polite">{status}{tour.stale && !tour.pending ? ` · ${t("avsStale")}` : ""}</span>
      </div>
      <DataTable<{ s: PolicyStats; name: string }>
        rows={rows}
        getRowKey={(r) => r.name}
        columns={[
          { key: "n", header: t("avsColPolicy"), render: (r) => r.name },
          { key: "m", header: t("avsColMean"), align: "end", render: (r) => usd(r.s.mean) },
          { key: "sd", header: t("avsColSd"), align: "end", render: (r) => usd(r.s.sd) },
          { key: "ce", header: t("avsColCe", { g: lab.params.gamma }), align: "end", render: (r) => usd(r.s.ce) },
          { key: "q", header: t("avsColQSd"), align: "end", render: (r) => r.s.qSd.toFixed(2) },
        ]}
      />
      <PnlHistograms stats={tour.result.stats} names={names} />
      <ChartContainer title={t("avsFrontierTitle")}>
        <div className="avs-frontier-chart">
          <FrontierChart result={tour.result} names={names} />
        </div>
      </ChartContainer>
      <ChartContainer title={t("avsSampleTitle")}>
        <SampleDay policy={lab.tourPolicies[0]} params={lab.params} seed={lab.url.seed} />
      </ChartContainer>
    </div>
  );
}
