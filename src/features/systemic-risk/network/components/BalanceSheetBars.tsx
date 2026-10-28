import { SERIES_PALETTE } from "../../../../components/charts/chart.theme";
import { useI18n } from "../../../../i18n";
import type { FinNetwork, Institution } from "../../engine/systemic.types";
import type { Segment } from "../network.types";
import { sheetSegments } from "../networkView.math";

function Stack({ title, segments }: { title: string; segments: Segment[] }) {
  const { t } = useI18n();
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="syr-stack">
      <p className="syr-stack-title">{title} <span>${total.toFixed(1)}bn</span></p>
      <div className="syr-bar" role="img" aria-label={`${title}: ${segments.map((x) => `${t(`syrSeg_${x.key}`)} ${x.value.toFixed(1)}`).join(", ")}`}>
        {segments.map((x, i) => (
          <span key={x.key} className="syr-bar-seg" style={{ flexGrow: x.value, background: SERIES_PALETTE[i % SERIES_PALETTE.length] }} title={`${t(`syrSeg_${x.key}`)}: $${x.value.toFixed(1)}bn`} />
        ))}
      </div>
      <ul className="syr-bar-legend">
        {segments.map((x, i) => (
          <li key={x.key}>
            <span className="syr-swatch" style={{ background: SERIES_PALETTE[i % SERIES_PALETTE.length] }} aria-hidden="true" />
            {t(`syrSeg_${x.key}`)} <span className="syr-num">{x.value.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/// Two square stacked bars, assets and liabilities with equity, with a legend that carries the numbers ($bn).
export default function BalanceSheetBars({ inst, net }: { inst: Institution; net: FinNetwork }) {
  const { t } = useI18n();
  const { assets, liabilities } = sheetSegments(inst, net);
  return (
    <div className="syr-sheet">
      <Stack title={t("syrAssets")} segments={assets} />
      <Stack title={t("syrLiabilities")} segments={liabilities} />
    </div>
  );
}
