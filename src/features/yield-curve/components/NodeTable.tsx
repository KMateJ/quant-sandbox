import type { CSSProperties } from "react";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";

export default function NodeTable({ model }: { model: YieldCurveModel }) {
  const { t } = useI18n();
  return (
    <div className="yc-quote-list">
      <div className="yc-quote-heading"><span>{t("ycColMaturity")}</span><span>{t("ycParRate")} %</span></div>
      {model.nodes.map((node, i) => (
        <div key={node.label} className={`yc-quote-row${i === model.selected ? " is-selected" : ""}`}>
          <button type="button" aria-pressed={i === model.selected} onClick={() => model.setSelected(i)}>{node.label}</button>
          <input type="range" min={0} max={12} step={0.01} value={node.rate * 100}
            style={{ "--quote-fill": `${node.rate / 0.12 * 100}%` } as CSSProperties}
            aria-label={`${node.label} ${t("ycParRate")}`}
            onFocus={() => model.setSelected(i)}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); model.beginEdit(i); }}
            onPointerUp={model.endEdit} onPointerCancel={model.endEdit} onLostPointerCapture={model.endEdit}
            onKeyDown={() => model.beginEdit(i)} onKeyUp={model.endEdit} onBlur={model.endEdit}
            onChange={(e) => model.setRate(i, Number(e.target.value) / 100)} />
          <span className="yc-quote-value"><input type="number" min={0} max={12} step={0.01} value={Number((node.rate * 100).toFixed(4))}
            aria-label={`${node.label} ${t("ycMarketQuote")}`}
            onFocus={() => model.beginEdit(i)} onBlur={model.endEdit}
            onChange={(e) => {
              if (e.target.value !== "") model.setRate(i, e.target.valueAsNumber / 100);
            }} /><span aria-hidden="true">%</span></span>
        </div>
      ))}
    </div>
  );
}
