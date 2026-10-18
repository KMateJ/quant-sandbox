import { useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../../components/charts";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { ASSET_A, ASSET_B, minVarianceWeight, twoAssetPoint, type Asset } from "../../../guide.markets.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";

const RHOS = [-0.5, 0, 0.5, 0.9] as const;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/// Drag the two assets around the risk–return plane; the curve of their mixes and the minimum-variance point follow.
export default function DragAssetsFigure() {
  const { t } = useI18n();
  const [assets, setAssets] = useState<[Asset, Asset]>([ASSET_A, ASSET_B]);
  const [rho, setRho] = useState<number>(0);
  const [a, b] = assets;
  const curve = Array.from({ length: 101 }, (_, i) => twoAssetPoint(i / 100, rho, a, b));
  const wMin = clamp(minVarianceWeight(rho, a, b), 0, 1);
  const minVar = twoAssetPoint(wMin, rho, a, b);
  const move = (x: number, y: number, index: number) => {
    const next: [Asset, Asset] = [...assets];
    next[index] = { sigma: clamp(x, 0.02, 0.45), mu: clamp(y, 0, 0.2) };
    setAssets(next);
  };

  return (
    <GuideFigure title={t("gi2DragTitle")} labId="portfolio-lab">
      <div className="gf-toolbar">
        <SegmentedControl<number>
          ariaLabel={t("gfFieldRho")}
          value={rho}
          onChange={setRho}
          options={RHOS.map((v) => ({ value: v, label: `ρ = ${v}` }))}
        />
        <button type="button" className="preset-btn" onClick={() => setAssets([ASSET_A, ASSET_B])}>{t("gi2Reset")}</button>
      </div>
      <p className="gf-hint">{t("gi2DragHint")}</p>
      <div className="gf-chart gf-chart--tall" role="img" aria-label={t("gi2DragAria")}>
        <ScatterChart
          series={[
            { key: "mix", label: t("gfPortfolios"), color: SERIES_PALETTE[0], line: true, strokeWidth: 2.5, points: curve.map((p) => ({ x: p.sigma, y: p.mu })) },
            { key: "min", label: t("gfMinVariance"), color: SERIES_PALETTE[2], radius: 6, points: [{ x: minVar.sigma, y: minVar.mu }] },
            { key: "assets", label: t("gfAssets"), color: "var(--text)", radius: 9, draggable: true, points: [{ x: a.sigma, y: a.mu, label: "A" }, { x: b.sigma, y: b.mu, label: "B" }] },
          ]}
          xDomain={[0, 0.45]}
          yDomain={[0, 0.2]}
          onDrag={move}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          xLabel={t("gfAxisVolatility")}
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: "A", value: `${pct(a.mu, 1)} / ${pct(a.sigma, 1)}` },
          { label: "B", value: `${pct(b.mu, 1)} / ${pct(b.sigma, 1)}` },
          { label: t("gfMinVarWeight"), value: pct(wMin, 1), tone: "accent" },
          { label: t("gfMinVol"), value: pct(minVar.sigma, 2), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
