import { LineChart } from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { daySeed, simulateDay } from "../asSim.math";
import type { AsParams, Policy } from "../avellanedaStoikov.types";

/// The first tournament day under your policy: price with your quotes, then your inventory.
export default function SampleDay({ policy, params, seed }: { policy: Policy; params: AsParams; seed: number }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const day = simulateDay(policy, params, daySeed(seed, 0), true);
  const data = (day.path ?? []).filter((_, i) => i % 2 === 0).map((p) => ({ t: p.t, s: p.s, bid: p.bid, ask: p.ask, q: p.q }));
  return (
    <div className="avs-sample">
      <div className="avs-sample-price">
        <LineChart
          data={data}
          xKey="t"
          series={[
            { key: "ask", label: t("avsAsk"), color: "var(--negative)", strokeWidth: 1 },
            { key: "s", label: t("avsMid"), color: "var(--text)", strokeWidth: 1.5 },
            { key: "bid", label: t("avsBid"), color: "var(--positive)", strokeWidth: 1 },
          ]}
          isMobile={isMobile}
          curve="linear"
          xFormat={(v) => v.toFixed(1)}
          yFormat={(v) => v.toFixed(1)}
        />
      </div>
      <div className="avs-sample-q">
        <LineChart
          data={data}
          xKey="t"
          series={[{ key: "q", label: t("avsInventory"), color: "var(--primary)", area: true }]}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border)" }]}
          isMobile={isMobile}
          legend={false}
          curve="linear"
          xFormat={(v) => v.toFixed(1)}
        />
      </div>
      <p className="avs-caption">{t("avsSampleNote", { pnl: day.pnl.toFixed(2), q: day.finalQ })}</p>
    </div>
  );
}
