import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useI18n } from "../../../../../i18n";
import { PEERS, TARGET, impliedValue } from "../../../guide.interactive.multiplesPeers.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import MultiplesPeersChart from "./MultiplesPeersChart";

/// Peers' EV/EBITDA against growth: drag the target along the fitted line, click peers to drop them from the fit.
export default function MultiplesPeersFigure() {
  const { t } = useI18n();
  const [growth, setGrowth] = useState(TARGET.growth);
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set());
  const included = useMemo(() => PEERS.filter((p) => !excluded.has(p.id)), [excluded]);
  const value = impliedValue(included, growth);
  const togglePeer = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      // Keep at least two peers in the fit.
      else if (PEERS.length - next.size > 2) next.add(id);
      return next;
    });

  return (
    <GuideFigure title={t("ixMpTitle")} labId="valuation">
      <div className="gf-toolbar ixmp-toolbar">
        <p className="ixmp-hint">{t("ixMpHint")}</p>
        <button type="button" className="preset-btn" disabled={excluded.size === 0} onClick={() => setExcluded(new Set())}>
          {t("ixMpReset")}
        </button>
      </div>
      <div className="gf-chart ixmp-chart" role="group" aria-label={t("ixMpAria")}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <MultiplesPeersChart
                width={width}
                height={height}
                excluded={excluded}
                onTogglePeer={togglePeer}
                line={value.line}
                growth={growth}
                multiple={value.multiple}
                onGrowth={setGrowth}
              />
            ) : null
          }
        </ParentSize>
      </div>
      <ul className="ixmp-legend" aria-hidden="true">
        <li><span className="ixmp-swatch" />{t("ixMpLegendIncluded")}</li>
        <li><span className="ixmp-swatch ixmp-swatch--excluded" />{t("ixMpLegendExcluded")}</li>
        <li><span className="ixmp-swatch ixmp-swatch--line" />{t("ixMpLegendLine")}</li>
      </ul>
      <p className="ixmp-note">{t("ixMpNote")}</p>
      <FigureReadout
        items={[
          { label: t("ixMpMedian"), value: `${fmt(value.median)}×` },
          { label: t("ixMpLineMultiple"), value: `${fmt(value.multiple)}×`, tone: "accent" },
          { label: t("ixMpEv"), value: fmt(value.ev, 1) },
          { label: t("ixMpEquity"), value: fmt(value.equity, 1), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
