import { DraggableBars } from "../../../../components/charts";
import { useI18n } from "../../../../i18n";
import { FACTOR_LABEL } from "../../famaFrench.math";
import type { FundTabModel } from "../../useFundTab";

const fmt = (v: number) => v.toFixed(2);

/// Draggable loading per factor; after the reveal the OLS loadings show as ghost bars.
export default function LoadingBars({ m }: { m: FundTabModel }) {
  const { t } = useI18n();
  return (
    <DraggableBars
      height={230}
      values={m.loadings}
      onChange={m.setLoading}
      min={-1.5}
      max={1.5}
      step={0.05}
      shadows={m.revealed ? m.fit.betas.map((b) => b.b) : undefined}
      xLabels={m.factors.map((id) => FACTOR_LABEL[id])}
      barAriaLabel={(i) => t("ffmLoadingAria", { factor: FACTOR_LABEL[m.factors[i]] })}
      valueFormat={fmt}
      yFormat={fmt}
      ariaLabel={t("ffmLoadingsAria")}
    />
  );
}
