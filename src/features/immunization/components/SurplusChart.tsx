import { LineChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { DEFAULT_CONFIG as C, money, moneyShort } from "../immunization.math";
import type { ImmunizationModel } from "../useImmunizationGame";

/// Your surplus after each round against the two benchmarks on the same seed (shown up to the current round).
export default function SurplusChart({ model }: { model: ImmunizationModel }) {
  const { t } = useI18n();
  const { game, bench } = model;
  const rows = Array.from({ length: game.round + 1 }, (_, r) => ({
    round: r,
    you: r === 0 ? 0 : game.history[r - 1].surplus,
    buyHold: bench.buyHold[r],
    auto: bench.autoImmunised[r],
  }));
  const extent = Math.max(0.01 * C.liability, ...rows.flatMap((r) => [Math.abs(r.you), Math.abs(r.buyHold), Math.abs(r.auto)]));

  return (
    <div className="chart-wrap" role="img" aria-label={t("imSurplusChart")}>
      <LineChart
        data={rows}
        xKey="round"
        series={[
          { key: "buyHold", label: t("imBuyHold"), color: "var(--muted)", strokeWidth: 1.6, dash: "5 4" },
          { key: "auto", label: t("imAuto"), color: "var(--positive)", strokeWidth: 1.8, dash: "2 3" },
          { key: "you", label: t("imYou"), color: "var(--primary)", strokeWidth: 2.8 },
        ]}
        xDomain={[0, C.years]}
        yDomain={[-extent * 1.1, extent * 1.1]}
        referenceLines={[{ axis: "y", value: 0, color: "var(--muted)", dash: "4 4" }]}
        curve="linear"
        xFormat={(v) => String(Math.round(v))}
        yFormat={moneyShort}
        valueFormat={money}
        tooltipLabel={(x) => `${t("imYear")} ${Math.round(x)}`}
      />
    </div>
  );
}
