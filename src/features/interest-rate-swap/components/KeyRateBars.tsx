import { WaterfallChart } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { MATURITIES } from "../../yield-curve/presets";
import { money, signedMoney } from "../swapFormat";
import type { SwapModel } from "../useSwap";

/// MTM change when each curve node is bumped 1 bp on its own; every bar stands on zero.
export default function KeyRateBars({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const d = lab.derived;
  if (!d) return null;
  const steps = d.krd.map((k) => ({
    key: String(k.tenor),
    label: MATURITIES.find((m) => m.t === k.tenor)?.label ?? String(k.tenor),
    value: k.dv01,
    kind: "total" as const,
  }));
  const sum = d.krd.reduce((a, k) => a + k.dv01, 0);
  return (
    <ChartContainer title={t("irsKrdTitle")}>
      <WaterfallChart steps={steps} ariaLabel={t("irsKrdAria")} valueFormat={money} height={200} />
      <p className="irs-hint">{t("irsKrdNote", { sum: signedMoney(sum), parallel: signedMoney(d.dv01) })}</p>
    </ChartContainer>
  );
}
