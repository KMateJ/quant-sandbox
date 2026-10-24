import { useState } from "react";
import { WaterfallChart, type WaterfallStep } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { MATURITIES } from "../../yield-curve/presets";
import { money, signedMoney } from "../swapFormat";
import type { SwapModel } from "../useSwap";

const label = (tenor: number) => MATURITIES.find((m) => m.t === tenor)?.label ?? String(tenor);

/// MTM and DV01 readouts; once the rate is locked, a waterfall splits the MTM since the lock by curve node.
export default function MtmPanel({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const d = lab.derived;
  const parts = d?.attribution?.filter((p) => Math.abs(p.change) >= 0.5) ?? [];
  const steps: WaterfallStep[] = d
    ? [
        { key: "start", label: t("irsWfStart"), value: 0, kind: "total" },
        ...parts.map((p) => ({ key: String(p.tenor), label: label(p.tenor), value: p.change })),
        { key: "end", label: t("irsWfEnd"), value: d.mtm, kind: "total" },
      ]
    : [];
  return (
    <ChartContainer title={t("irsMtmTitle")}>
      <dl className="irs-metrics">
        <div><dt>{t("irsMtm")}</dt><dd className={d && d.mtm > 0.5 ? "is-up" : d && d.mtm < -0.5 ? "is-down" : undefined}>{d ? signedMoney(d.mtm) : "—"}</dd></div>
        <div><dt>{t("irsDv01")}</dt><dd>{d ? signedMoney(d.dv01) : "—"}</dd></div>
        <div><dt>{t("irsPvFloating")}</dt><dd>{d ? money(d.legs.pvFloating) : "—"}</dd></div>
        <div><dt>{t("irsPvFixed")}</dt><dd>{d ? money(d.legs.pvFixed) : "—"}</dd></div>
      </dl>
      {lab.locked && d?.attribution ? (
        parts.length ? (
          <WaterfallChart steps={steps} ariaLabel={t("irsWfAria")} valueFormat={money} selected={selected} onSelect={setSelected} height={220} />
        ) : (
          <p className="irs-hint">{t("irsWfFlat")}</p>
        )
      ) : (
        <p className="irs-hint">{t("irsWfLockFirst")}</p>
      )}
    </ChartContainer>
  );
}
