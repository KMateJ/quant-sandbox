import { useI18n } from "../../../i18n";
import { num, pct, price, years } from "../callableFormat";
import type { CallableModel } from "../useCallable";

/// Prices, the three yields and the effective risk measures at the handle.
export default function CallableReadout({ lab }: { lab: CallableModel }) {
  const { t } = useI18n();
  const n = lab.now;
  const items: { label: string; value: string; tone?: string }[] = [
    { label: t("cbYield"), value: pct(lab.y) },
    { label: t("cbStraight"), value: price(n.straight) },
    { label: t("cbCallable"), value: price(n.callable), tone: "strong" },
    { label: t("cbCallValue"), value: price(n.call), tone: "accent" },
    { label: t("cbYtm"), value: pct(n.ytm) },
    { label: t("cbYtc"), value: pct(n.ytc) },
    { label: t("cbYtw"), value: `${pct(n.ytw)} · ${years(n.worstDate)}` },
    { label: t("cbDuration"), value: num(n.dEff, 2) },
    { label: t("cbConvexity"), value: num(n.cEff, 1), tone: n.cEff < 0 ? "negative" : undefined },
  ];
  return (
    <dl className="cb-readout">
      {items.map((i) => (
        <div key={i.label} className={i.tone ? `is-${i.tone}` : undefined}>
          <dt>{i.label}</dt>
          <dd>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
