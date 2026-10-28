import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { PNL_SEED, runSession, sessionMarkouts, sessionParts } from "../../../guide.micro.marketMakingPnl.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import PnlAttributionCharts from "./PnlAttributionCharts";

/// A 5-minute seeded session of a maker on the crowd flow, split into spread capture, adverse selection, inventory and fees.
export default function PnlAttributionFigure() {
  const { t } = useI18n();
  const [informed, setInformed] = useState(0.15);
  const [offset, setOffset] = useState(0.5);
  const [horizon, setHorizon] = useState(10);
  const [seed, setSeed] = useState(PNL_SEED);
  const session = useMemo(() => runSession({ informed, offset, seed }), [informed, offset, seed]);
  const parts = useMemo(() => sessionParts(session, horizon), [session, horizon]);
  const markouts = useMemo(() => sessionMarkouts(session), [session]);
  const usd = (v: number) => fmt(v, 2);

  return (
    <GuideFigure title={t("gfMsPnlAttributionTitle")} labId="market-making">
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>{t("gfMsPnlNewSession")}</button>
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfMsPnlInformed")} min={0} max={0.4} step={0.01} value={informed} onChange={setInformed} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfMsPnlOffset")} min={0.5} max={3} step={0.5} value={offset} onChange={setOffset} formatValue={(v) => v.toFixed(1)} />
        <SliderField label={t("gfMsPnlHorizon")} min={1} max={30} step={1} value={horizon} onChange={setHorizon} formatValue={(v) => `${v} s`} />
      </div>
      <p className="gf-hint">{t("gfMsPnlUnits", { fills: session.ledger.fills.length, inventory: session.ledger.inventory })}</p>
      <PnlAttributionCharts parts={parts} markouts={markouts} horizon={horizon} />
      <FigureReadout
        items={[
          { label: t("gfMsPnlSpread"), value: usd(parts.spread) },
          { label: t("gfMsPnlAdverse"), value: usd(parts.adverse) },
          { label: t("gfMsPnlInventory"), value: usd(parts.inventory) },
          { label: t("gfMsPnlFees"), value: usd(parts.fees) },
          { label: t("gfMsPnlTotal"), value: usd(parts.total), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
