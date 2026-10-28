import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { markoutHistogram } from "../debrief.math";
import { makerFills } from "../help/advice.math";
import type { MmDeskModel } from "../useMarketMakingDesk";

const label = (b: number) => (b <= -3 ? "≤−3" : b >= 3 ? "≥+3" : b > 0 ? `+${b}` : b < 0 ? `−${-b}` : "0");

/// The reveal: how many of your fills came from informed customers, and where your fills' markouts landed.
export default function MmInformedReveal({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { mission, state } = desk;
  const fills = makerFills(state).length;
  const bars = markoutHistogram(mission, state);
  const max = Math.max(1, ...bars.map((b) => b.n));
  return (
    <Panel title={t("mmdDbRevealTitle")} className="gdesk-panel" id="mmd-debrief-reveal">
      <p className="mmd-reveal-line">{t("mmdDbRevealLine", { n: state.informedFills, m: fills })}</p>
      <p className="gdesk-label">{t("mmdDbRevealChart", { s: mission.markout })}</p>
      <ul className="mmd-reveal-bars" aria-label={t("mmdDbRevealChart", { s: mission.markout })}>
        {bars.map((b) => (
          <li key={b.bucket} className={b.bucket < 0 ? "is-down" : b.bucket > 0 ? "is-up" : undefined}>
            <span className="mmd-reveal-bar" style={{ height: `${(b.n / max) * 100}%` }} />
            <span className="mmd-reveal-n">{b.n}</span>
            <span className="mmd-reveal-x">{label(b.bucket)}</span>
          </li>
        ))}
      </ul>
      <p className="gdesk-help-p">{t("mmdDbRevealNote")}</p>
    </Panel>
  );
}
