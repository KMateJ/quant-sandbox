import { LineChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { CtdShiftState } from "../useCtdSwitch";
import type { DeliverableBond } from "../treasuryFutures.math";
import { bondColor } from "./bondColors";
import { formatBp, formatShiftTick } from "../ctdSwitch.math";
import CtdSwitchLayer from "./CtdSwitchLayer";

/// Net basis of every bond against a parallel yield shift; drag Δy to move the CTD highlight everywhere.
export default function CtdExplorer({ sw, bonds, ctdId, notionalCoupon }: {
  sw: CtdShiftState;
  bonds: DeliverableBond[];
  ctdId: string | undefined;
  notionalCoupon: number;
}) {
  const { t } = useI18n();
  const { curve, switches, shiftBp } = sw;
  if (!curve) return null;
  const data = curve.map((p) => ({ shiftBp: p.shiftBp, ...p.basis }));
  const top = Math.max(...curve.flatMap((p) => Object.values(p.basis)), 0.01);
  const series = bonds.map((bond, i) => ({
    key: bond.id, label: t("tfBondId", { id: bond.id }), color: bondColor(i), strokeWidth: bond.id === ctdId ? 3 : 1.8,
  }));
  const why = shiftBp > 0 ? "tfSwitchWhyUp" : shiftBp < 0 ? "tfSwitchWhyDown" : "tfSwitchWhyFlat";
  const bondName = (id: string) => t("tfBondId", { id });
  return <div className="tf-switch">
    <div className="tf-switch-chart">
      <LineChart data={data} xKey="shiftBp" series={series} xDomain={[-200, 200]} yDomain={[0, top * 1.05]} curve="linear"
        xFormat={formatShiftTick} yFormat={(y) => y.toFixed(2)} valueFormat={(v) => v.toFixed(4)} tooltipLabel={formatBp}
        layer={(frame) => <CtdSwitchLayer frame={frame} switches={switches} shiftBp={shiftBp} label={t("tfSwitchHandle")} onShift={sw.setShiftBp} />} />
    </div>
    <p className="tf-explanation"><strong>{t("tfSwitchReading", { bp: formatBp(shiftBp), bond: ctdId ? bondName(ctdId) : "—" })}</strong>{" "}
      {t(why, { coupon: `${(notionalCoupon * 100).toFixed(1)}%` })}</p>
    <ul className="tf-switch-list">
      {switches.length === 0 && <li>{t("tfSwitchNone")}</li>}
      {switches.map((s, i) => <li key={i}>{t("tfSwitchAt", { from: bondName(s.from), to: bondName(s.to), bp: formatBp(s.shiftBp) })}</li>)}
    </ul>
    <div className="tf-switch-actions">
      <button type="button" className="lp-btn" disabled={shiftBp === 0} onClick={() => sw.setShiftBp(0)}>{t("tfSwitchReset")}</button>
      <span className="tf-drag-hint">{t("tfSwitchHint")}</span>
    </div>
  </div>;
}
