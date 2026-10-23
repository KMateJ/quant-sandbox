import { useI18n } from "../../../../i18n";
import { pct, signedMoney, toneClass } from "../../deskFormat";
import type { DebriefModel } from "../../useDebrief";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Verdict line: pass/fail word, final P&L, realized and implied vol.
export default function DebriefBanner({ desk, debrief }: { desk: HedgingDeskModel; debrief: DebriefModel }) {
  const { t } = useI18n();
  const { passed, rvFull } = debrief;
  const stats = [
    { label: t("hdDebriefFinalPnl"), value: signedMoney(desk.pnl), tone: toneClass(desk.pnl) },
    { label: t("hdDebriefRealizedVol"), value: rvFull === null ? "—" : pct(rvFull, 2), tone: "" },
    { label: t("hdDebriefImpliedVol"), value: pct(desk.mission.market.impliedVol, 2), tone: "" },
  ];
  return (
    <div id="hd-debrief-banner" className={`hdesk-verdict ${passed ? "is-pass" : "is-fail"}`} role="status">
      <strong className="hdesk-verdict-word">{t(passed ? "hdDebriefPassed" : "hdDebriefFailed")}</strong>
      <dl className="hdesk-verdict-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="hdesk-label">{s.label}</dt>
            <dd className={`hdesk-num ${s.tone}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
