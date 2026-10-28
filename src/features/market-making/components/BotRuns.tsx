import { Histogram } from "../../../components/charts";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import { binValues } from "../../../lib/stats/histogram";
import { mean } from "../../../lib/stats/moments";
import { theoryPnlPerMin } from "../theory.math";
import type { MarketMakingLab } from "../useMarketMakingLab";
import { cents, usd } from "./mkmFormat";

/// "Auto": 40 bot rounds at a chosen half-spread, and the spread of their P&L against theory.
export default function BotRuns({ lab }: { lab: MarketMakingLab }) {
  const { t } = useI18n();
  const { bots, botDelta, setBotDelta, params } = lab;
  const ys = bots?.runs.map((r) => r.pnlPerMin) ?? [];
  const lo = Math.min(0, ...ys);
  const hi = Math.max(1, ...ys);
  return (
    <div className="mkm-bots">
      <div className="mkm-bots-row">
        <SliderField label={t("mkmBotDelta")} min={0} max={8} step={0.5} value={botDelta} onChange={setBotDelta} formatValue={cents} />
        <button type="button" className="lp-btn" onClick={lab.runBots}>{t("mkmRunBots")}</button>
        {bots && <button type="button" className="lp-btn" onClick={lab.clearBots}>{t("mkmClearBots")}</button>}
      </div>
      {bots && (
        <>
          <p className="mkm-caption">
            {t("mkmBotResult", { delta: cents(bots.delta), mean: usd(mean(ys)), theory: usd(theoryPnlPerMin(bots.delta, params)) })}
          </p>
          <Histogram
            bins={binValues(ys, [lo, hi], 16).bins}
            height={160}
            xFormat={usd}
            ariaLabel={t("mkmBotHistAria")}
            markers={[{ value: theoryPnlPerMin(bots.delta, params), label: t("mkmTheoryShort") }]}
          />
        </>
      )}
    </div>
  );
}
