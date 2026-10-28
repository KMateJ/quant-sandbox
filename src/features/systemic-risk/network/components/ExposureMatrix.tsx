import { useMemo } from "react";
import HeatmapPicker from "../../../../components/charts/HeatmapPicker";
import { useI18n } from "../../../../i18n";
import { instCode, sortedIds, visibleMatrix } from "../networkView.math";
import type { NetworkPageModel } from "../useNetworkPage";

/// Exposures as a lender × borrower grid sorted by kind: the list-style view of the network, also for small screens.
export default function ExposureMatrix({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const ids = useMemo(() => sortedIds(m.net), [m.net]);
  const grid = useMemo(() => visibleMatrix(m.net, ids, m.types), [m.net, ids, m.types]);
  const index = useMemo(() => ids.map((_, k) => k), [ids]);
  const sel = ids.indexOf(m.s.sel);

  const pick = (borrower: number, lender: number) => {
    m.select(ids[lender]);
    if (!m.s.edit || lender === borrower) return;
    const found = m.net.exposures.find((e) => e.lender === ids[lender] && e.borrower === ids[borrower] && m.types.has(e.type));
    m.setForm(found ? { kind: "edit", id: found.id } : { kind: "new", lender: ids[lender], borrower: ids[borrower] });
  };

  return (
    <div className="syr-matrix">
      <HeatmapPicker
        height={Math.min(560, 120 + ids.length * 18)}
        xValues={index}
        yValues={index}
        value={(b, l) => (grid[l]?.[b] ?? 0)}
        scale="sequential"
        selected={sel >= 0 ? { x: sel, y: sel } : undefined}
        onPick={pick}
        xLabel={t("syrMatrixBorrower")}
        yLabel={t("syrMatrixLender")}
        xFormat={(k) => instCode(ids[k] ?? "")}
        yFormat={(k) => instCode(ids[k] ?? "")}
        valueFormat={(v) => `$${v.toFixed(1)}bn`}
        isValid={(b, l) => b !== l}
        ariaLabel={t("syrMatrixAria")}
      />
      <p className="control-hint">{t(m.s.edit ? "syrMatrixHintEdit" : "syrMatrixHint")}</p>
    </div>
  );
}
