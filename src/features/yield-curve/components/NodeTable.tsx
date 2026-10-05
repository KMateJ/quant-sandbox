import type { CurveNode } from "../yieldCurve.types";
import { useI18n } from "../../../i18n";

type Props = {
  nodes: CurveNode[];
  selected: number;
  onSelect: (index: number) => void;
  onRate: (index: number, rate: number) => void;
};

/// Compact editable maturity/rate table. Editing stays in sync with the chart nodes.
export default function NodeTable({ nodes, selected, onSelect, onRate }: Props) {
  const { t } = useI18n();
  return (
    <div className="data-table-scroll yc-node-table">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("ycColMaturity")}</th>
            <th className="num">{t("ycColRate")}</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, i) => (
            <tr
              key={node.label}
              className={i === selected ? "is-selected" : undefined}
              onClick={() => onSelect(i)}
            >
              <td>{node.label}</td>
              <td className="num">
                <span className="yc-rate-input">
                  <input
                    type="number"
                    step={0.05}
                    value={Number((node.rate * 100).toFixed(4))}
                    onFocus={() => onSelect(i)}
                    onChange={(e) => {
                      const raw = Number(e.target.value);
                      if (!Number.isNaN(raw)) onRate(i, raw / 100);
                    }}
                  />
                  <span>%</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
