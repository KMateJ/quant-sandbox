import type { TermPoint } from "../yieldCurve.types";
import { useI18n } from "../../../i18n";
import { pct2, df4, YC_COLORS } from "../curveChartUtils";

type Props = {
  term: TermPoint[];
  selected: number;
  onSelect: (index: number) => void;
};

/// Compact linked readout for the selected maturity: par, zero, discount factor and the
/// forward into that node — all derived from the same term structure.
export default function SelectedReadout({ term, selected, onSelect }: Props) {
  const { t } = useI18n();
  const p = term[selected];
  if (!p) return null;

  const fwdLabel = `${term[selected - 1]?.label ?? "0"}→${p.label}`;
  const rows: { label: string; value: string; color: string }[] = [
    { label: t("ycParRate"), value: pct2(p.par), color: YC_COLORS.par },
    { label: t("ycZeroRate"), value: pct2(p.zero), color: YC_COLORS.zero },
    { label: t("ycDiscountFactor"), value: df4(p.df), color: YC_COLORS.df },
    { label: `${t("ycForward")} (${fwdLabel})`, value: pct2(p.fwd), color: YC_COLORS.forward },
  ];

  return (
    <div className="yc-readout">
      <div className="yc-readout-head">
        <span className="yc-readout-label">{t("ycSelectedMaturity")}</span>
        <div className="yc-maturity-pick" role="group" aria-label={t("ycSelectedMaturity")}>
          {term.map((n, i) => (
            <button
              key={n.label}
              type="button"
              className={i === selected ? "is-active" : undefined}
              onClick={() => onSelect(i)}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
      <dl className="yc-readout-grid">
        {rows.map((r) => (
          <div key={r.label} className="yc-readout-row">
            <dt>
              <i style={{ background: r.color }} />
              {r.label}
            </dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
