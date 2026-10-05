import { Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { PortfolioSummary } from "../efficientFrontier.types";

export type NamedPortfolio = PortfolioSummary & { name: string; sharpe: number };

type EfficientFrontierResultsProps = {
  targetVol: number;
  gmv: { ret: number; vol: number };
  tangencySharpe: number;
  portfolios: NamedPortfolio[];
  assetColors: string[];
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Metric strip plus the selected-portfolios table beneath the frontier scatter.
export default function EfficientFrontierResults({
  targetVol,
  gmv,
  tangencySharpe,
  portfolios,
  assetColors,
}: EfficientFrontierResultsProps) {
  const { t } = useI18n();

  const columns: DataColumn<NamedPortfolio>[] = [
    { key: "name", header: t("frontierColPortfolio"), render: (p) => p.name },
    { key: "ret", header: t("frontierColReturn"), align: "end", render: (p) => pct(p.ret) },
    { key: "vol", header: t("frontierColVol"), align: "end", render: (p) => pct(p.vol) },
    { key: "sharpe", header: t("frontierColSharpe"), align: "end", render: (p) => p.sharpe.toFixed(2) },
    {
      key: "weights",
      header: t("frontierColWeights"),
      render: (p) => (
        <span className="weight-list">
          {p.weights.map((w, i) => (
            <span key={i} className="weight-item">
              <span className="weight-dot" style={{ background: assetColors[i] }} />
              {pct(w)}
            </span>
          ))}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="metric-strip">
        <div className="stat-card">
          <div className="stat-title">{t("frontierTargetVol")}</div>
          <div className="stat-value">{pct(targetVol)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("frontierGmvReturn")}</div>
          <div className="stat-value">{pct(gmv.ret)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("frontierGmvVol")}</div>
          <div className="stat-value">{pct(gmv.vol)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("frontierSharpe")}</div>
          <div className="stat-value">{tangencySharpe.toFixed(2)}</div>
        </div>
      </div>

      <Panel title={t("frontierPortfoliosTitle")}>
        <DataTable columns={columns} rows={portfolios} getRowKey={(p) => p.name} />
      </Panel>
    </>
  );
}
