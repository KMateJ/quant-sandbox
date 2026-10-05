import { Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { Asset, PortfolioMetrics } from "../portfolioLab.types";

type AssetRow = {
  id: string;
  name: string;
  color: string;
  mu: number;
  sigma: number;
  weight: number;
  contribution: number;
};

type Props = {
  current: PortfolioMetrics;
  diversification: number;
  assets: Asset[];
  weights: number[];
  contributions: number[];
  cashWeight: number;
  riskFree: number;
  cashLabel: string;
};

const CASH_COLOR = "#94a3b8";
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Metric strip plus a per-asset weight / risk-contribution breakdown table.
export default function PortfolioLabResults({
  current,
  diversification,
  assets,
  weights,
  contributions,
  cashWeight,
  riskFree,
  cashLabel,
}: Props) {
  const { t } = useI18n();

  const rows: AssetRow[] = assets.map((a, i) => ({
    ...a,
    weight: weights[i],
    contribution: contributions[i],
  }));
  if (cashWeight > 0.0001) {
    rows.push({
      id: "cash",
      name: cashLabel,
      color: CASH_COLOR,
      mu: riskFree,
      sigma: 0,
      weight: cashWeight,
      contribution: 0,
    });
  }

  const columns: DataColumn<AssetRow>[] = [
    {
      key: "name",
      header: t("portfolioColAsset"),
      render: (r) => (
        <span className="weight-item">
          <span className="weight-dot" style={{ background: r.color }} />
          {r.name}
        </span>
      ),
    },
    { key: "mu", header: t("portfolioColReturn"), align: "end", render: (r) => pct(r.mu) },
    { key: "sigma", header: t("portfolioColVol"), align: "end", render: (r) => pct(r.sigma) },
    { key: "weight", header: t("portfolioColWeight"), align: "end", render: (r) => pct(r.weight) },
    {
      key: "contribution",
      header: t("portfolioColRiskShare"),
      align: "end",
      render: (r) => pct(r.contribution),
    },
  ];

  return (
    <>
      <div className="metric-strip">
        <div className="stat-card">
          <div className="stat-title">{t("portfolioReturn")}</div>
          <div className="stat-value">{pct(current.ret)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("portfolioVol")}</div>
          <div className="stat-value">{pct(current.vol)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("portfolioSharpe")}</div>
          <div className="stat-value">{current.sharpe.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("portfolioDiversification")}</div>
          <div className="stat-value">{pct(diversification)}</div>
        </div>
      </div>

      <Panel title={t("portfolioBreakdownTitle")}>
        <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />
      </Panel>
    </>
  );
}
