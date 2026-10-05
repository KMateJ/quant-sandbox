import { Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { Asset } from "../portfolioLab.types";

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
  assets: Asset[];
  weights: number[];
  contributions: number[];
  cashWeight: number;
  riskFree: number;
  cashLabel: string;
};

const CASH_COLOR = "#94a3b8";
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Per-asset weight / risk-contribution breakdown table.
export default function RiskDecomposition({
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
    <Panel title={t("portfolioBreakdownTitle")}>
      <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />
    </Panel>
  );
}
