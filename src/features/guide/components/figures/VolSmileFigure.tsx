import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { hestonSmile, type HestonModel } from "../../guide.volatility.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";

const BASE: Omit<HestonModel, "rho" | "xi"> = { S0: 100, r: 0, T: 1, v0: 0.04, theta: 0.04, kappa: 2 };
const FLAT = Math.sqrt(BASE.theta);

/// Black–Scholes implied volatility of Heston prices against strike: correlation tilts the smile, vol of vol bends it.
export default function VolSmileFigure() {
  const { t } = useI18n();
  const [rho, setRho] = useState(-0.7);
  const [xi, setXi] = useState(0.5);
  const smile = useMemo(() => hestonSmile({ ...BASE, rho, xi }).map((p) => ({ ...p, flat: FLAT })), [rho, xi]);
  const ivAt = (K: number) => smile.find((p) => p.K === K)?.iv ?? NaN;

  return (
    <GuideFigure title={t("gfSmileTitle")} labId="heston">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRho")} min={-0.9} max={0.5} step={0.05} value={rho} onChange={setRho} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFieldVolOfVol")} min={0.1} max={1} step={0.05} value={xi} onChange={setXi} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfSmileAria")}>
        <LineChart
          data={smile}
          xKey="K"
          series={[
            { key: "iv", label: t("gfHestonIv"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "flat", label: t("gfFlatVol"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "6 4" },
          ]}
          referenceLines={[{ axis: "x", value: BASE.S0, color: "var(--muted)", dash: "4 4" }]}
          yFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `K = ${x.toFixed(1)}`}
          valueFormat={(v) => pct(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          ...[80, 100, 120].map((K) => ({ label: t("gfIvAt", { k: K }), value: pct(ivAt(K), 2) })),
          { label: t("gfSkew"), value: `${((ivAt(80) - ivAt(120)) * 100).toFixed(2)} pp`, tone: "accent" as const },
        ]}
      />
    </GuideFigure>
  );
}
