import { useI18n } from "../../i18n";
import type { DepositPlan } from "./tvm.math";
import { PLAN_LABELS } from "./tvm.url";

type Row = { plan: DepositPlan; balance: number; paid: number; interest: number };
type Props = { rows: Row[]; peak: number; leader: number; money: (v: number) => string };

/// One horizontal bar per plan, split into paid in and interest, scaled to the largest final balance.
export default function TvmRaceBars({ rows, peak, leader, money }: Props) {
  const { t } = useI18n();
  return (
    <div className="tvm-race-bars" role="group" aria-label={t("tvmRaceAria")}>
      {rows.map((r, i) => {
        const paidW = (Math.min(r.paid, r.balance) / peak) * 100;
        const interestW = (Math.max(0, r.interest) / peak) * 100;
        const started = r.balance > 0;
        return (
          <div key={i} className={i === leader ? "tvm-race-row is-leader" : "tvm-race-row"}>
            <div className="tvm-race-label">
              <span>{t(PLAN_LABELS[i])}</span>
              {i === leader && <span className="tvm-race-badge">{t("tvmRaceLeader")}</span>}
            </div>
            <div className="tvm-race-track">
              <div className="tvm-race-paid" style={{ width: `${paidW}%` }} />
              <div className="tvm-race-interest" style={{ width: `${interestW}%` }} />
            </div>
            <dl className="tvm-race-stats">
              <div><dt>{t("tvmRaceBalance")}</dt><dd>{started ? money(r.balance) : t("tvmRaceNotStarted")}</dd></div>
              <div><dt>{t("tvmRacePaidIn")}</dt><dd>{money(r.paid)}</dd></div>
              <div><dt>{t("tvmRaceInterest")}</dt><dd>{money(Math.max(0, r.interest))}</dd></div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
