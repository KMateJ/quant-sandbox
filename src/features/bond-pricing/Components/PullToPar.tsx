import { useMemo } from "react";
import { LineChart, markerLine } from "../../../components/charts";
import { PlaybackControls, usePlayback } from "../../../components/playback";
import { useI18n } from "../../../i18n";
import type { BondSpec } from "../../../lib/finance/bond";
import { PULL_TO_PAR_SPREAD, pullToParPath } from "../bondPricing.math";
import { BOND_COLORS } from "../bondColors";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Price as time passes at a constant yield: premium and discount bonds both converge to face value at maturity.
/// Play or scrub time; the cursor shows today's price and how far it still is from par.
export default function PullToPar({ bond }: { bond: BondSpec }) {
  const { t } = useI18n();
  const rows = useMemo(() => pullToParPath(bond), [bond]);
  const last = rows.length - 1;
  const playback = usePlayback({ steps: last, initial: 0, durationMs: 6000 });
  const at = rows[Math.min(playback.step, last)];
  const yLo = Math.min(...rows.map((r) => r.lower)) * 0.97;
  const yHi = Math.max(...rows.map((r) => r.higher)) * 1.03;

  return (
    <div className="bond-ptp">
      <PlaybackControls
        playback={playback}
        steps={last}
        label={t("bondPtpElapsed")}
        formatStep={(k) => t("bondPtpYears", { y: (k / bond.freq).toFixed(1) })}
        showStepButtons
        showSpeed
      />
      <div className="chart-wrap" role="img" aria-label={t("bondPtpAria")}>
        <LineChart
          data={rows}
          xKey="t"
          series={[
            { key: "higher", label: t("bondPtpHigher", { c: pct(bond.couponRate + PULL_TO_PAR_SPREAD) }), color: BOND_COLORS.premium, strokeWidth: 1.5, dash: "6 3" },
            { key: "lower", label: t("bondPtpLower", { c: pct(Math.max(bond.couponRate - PULL_TO_PAR_SPREAD, 0)) }), color: BOND_COLORS.discount, strokeWidth: 1.5, dash: "6 3" },
            { key: "bond", label: t("bondPtpThis", { c: pct(bond.couponRate) }), color: BOND_COLORS.current, strokeWidth: 2.75 },
          ]}
          xDomain={[0, bond.years]}
          yDomain={[yLo, yHi]}
          referenceLines={[markerLine(at.t), { axis: "y", value: bond.face, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => t("bondPtpYears", { y: x.toFixed(1) })}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <p className="bond-ptp-readout" aria-live="polite">
        {t("bondPtpReadout", { left: (bond.years - at.t).toFixed(1), price: at.bond.toFixed(2), gap: (at.bond - bond.face).toFixed(2) })}
      </p>
    </div>
  );
}
