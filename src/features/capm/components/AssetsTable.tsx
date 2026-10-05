import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { alphaColor } from "../capm.colors";
import type { AssetRow } from "../capm.math";

type Props = { rows: AssetRow[] };

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

/// Compact cross-section table: beta, actual vs CAPM return and the resulting alpha.
export default function AssetsTable({ rows }: Props) {
  const { t } = useI18n();

  const columns: DataColumn<AssetRow>[] = [
    { key: "name", header: t("capmColAsset"), render: (r) => r.name },
    { key: "beta", header: t("capmBetaLabel"), align: "end", render: (r) => r.beta.toFixed(2) },
    { key: "actual", header: t("capmActualLabel"), align: "end", render: (r) => pct(r.expectedReturn) },
    { key: "capm", header: t("capmExpectedReturn"), align: "end", render: (r) => pct(r.capmReturn) },
    {
      key: "alpha",
      header: t("capmAlpha"),
      align: "end",
      render: (r) => <span style={{ color: alphaColor(r.alpha) }}>{signed(r.alpha)}</span>,
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(r) => r.name} />;
}
