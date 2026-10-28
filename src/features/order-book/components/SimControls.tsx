import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { OrderBookSim } from "../useOrderBookSim";

/// Play / pause, one-second step and 1× / 4× speed for the crowd.
export default function SimControls({ sim, frozen }: { sim: OrderBookSim; frozen: boolean }) {
  const { t } = useI18n();
  return (
    <div className="obk-sim">
      <button type="button" className="preset-btn" disabled={frozen} aria-pressed={sim.running} onClick={sim.toggle}>{t(sim.running ? "pbPause" : "pbPlay")}</button>
      <button type="button" className="preset-btn" disabled={frozen || sim.running} onClick={sim.step}>{t("obkStep")}</button>
      <SegmentedControl<1 | 4> ariaLabel={t("pbSpeed")} value={sim.speed} onChange={sim.setSpeed} options={[{ value: 1, label: "1×" }, { value: 4, label: "4×" }]} />
      <span className="obk-clock">{t("obkClock", { t: sim.t })}</span>
    </div>
  );
}
