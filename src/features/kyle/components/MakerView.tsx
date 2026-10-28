import { useI18n } from "../../../i18n";
import type { KyleLab } from "../useKyleLab";
import { fmtShares } from "./kyleFormat";

/// What the maker sees: only the total order flow per auction (one colour, no split), and a caption.
export default function MakerView({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const flows = lab.shown.map((r) => r.flow);
  const max = Math.max(1, ...flows.map(Math.abs));
  const last = lab.shown[lab.shown.length - 1];
  return (
    <div className="kyl-maker">
      <p className="kyl-caption">
        {last ? t("kylMakerCaption", { flow: fmtShares(last.flow), x: fmtShares(last.x) }) : t("kylMakerEmpty")}
      </p>
      <div className="kyl-flow-bars" role="list" aria-label={t("kylFlowLabel")}>
        {flows.map((f, i) => (
          <div key={i} className="kyl-flow-row" role="listitem">
            <span className="kyl-flow-n">{i + 1}</span>
            <span className="kyl-flow-track">
              <span className="kyl-flow-fill" style={{ width: `${(Math.abs(f) / max) * 50}%`, [f >= 0 ? "left" : "right"]: "50%" }} />
            </span>
            <span className="kyl-flow-value">{fmtShares(f)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
