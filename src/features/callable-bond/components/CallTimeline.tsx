import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { years } from "../callableFormat";
import type { CallableModel } from "../useCallable";

/// Axis tick step (years) that keeps at most about eight labels.
const tickStep = (maturity: number) => [1, 2, 5, 10].find((s) => maturity / s <= 8) ?? 10;

/// One cell per call date after protection: filled where the issuer would call at the current yield, outlined where it keeps the bond.
export default function CallTimeline({ lab }: { lab: CallableModel }) {
  const { t } = useI18n();
  const { spec, now } = lab;
  const pos = (v: number) => `${(v / spec.maturity) * 100}%`;
  const ticks = Array.from({ length: Math.floor(spec.maturity / tickStep(spec.maturity)) + 1 }, (_, i) => i * tickStep(spec.maturity));
  const summary = now.redemption === null ? t("cbRunsToMaturity", { m: years(spec.maturity) }) : t("cbCalledAt", { t: years(now.redemption) });
  return (
    <ChartContainer title={t("cbTimelineTitle")}>
      <div className="cb-timeline" role="img" aria-label={`${t("cbTimelineAria")} ${summary}`}>
        <div className="cb-track">
          {spec.protection > 0 && <span className="cb-protected" title={t("cbProtected")} style={{ left: 0, width: pos(spec.protection) }} />}
          {now.schedule.map((d) => (
            <span key={d.t} title={`${years(d.t)}: ${t(d.call ? "cbCall" : "cbKeep")}`}
              className={`cb-date${d.call ? " is-call" : ""}${d.t === now.redemption ? " is-first" : ""}`}
              style={{ left: pos(d.t), width: pos(1 / spec.freq) }} />
          ))}
        </div>
        <div className="cb-axis" aria-hidden="true">
          {ticks.map((tick) => <span key={tick} style={{ left: pos(tick) }}>{tick}</span>)}
        </div>
      </div>
      <ul className="cb-legend">
        <li><span className="cb-key cb-key--call" />{t("cbCall")}</li>
        <li><span className="cb-key cb-key--keep" />{t("cbKeep")}</li>
        <li><span className="cb-key cb-key--protected" />{t("cbProtected")}</li>
      </ul>
      <p className="cb-summary" role="status">{summary}</p>
    </ChartContainer>
  );
}
