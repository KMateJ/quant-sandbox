import Panel from "../../../../components/layout/Panel";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { signedMoney, toneClass } from "../../deskFormat";
import type { Attribution } from "../../engine/debrief.math";
import type { DebriefModel } from "../../useDebrief";

const ROWS: [keyof Attribution, TranslationKey][] = [
  ["premium", "hdDebriefPremium"],
  ["optionSettlement", "hdDebriefOptionSettlement"],
  ["stockPnl", "hdDebriefStockPnl"],
  ["financing", "hdDebriefFinancing"],
  ["costs", "hdDebriefCosts"],
  ["net", "hdDebriefNet"],
];

/// Horizontal bars centred on zero, one per P&L component, with the net last.
export default function PnlAttribution({ debrief }: { debrief: DebriefModel }) {
  const { t } = useI18n();
  const { parts } = debrief;
  const scale = Math.max(1, ...ROWS.map(([k]) => Math.abs(parts[k])));
  return (
    <Panel id="hd-debrief-attribution" title={t("hdDebriefAttributionTitle")} className="hdesk-panel">
      <ul className="hdesk-attr">
        {ROWS.map(([k, label]) => {
          const v = parts[k];
          const w = (Math.abs(v) / scale) * 50;
          return (
            <li key={k} className={k === "net" ? "is-net" : undefined}>
              <span className="hdesk-attr-label">{t(label)}</span>
              <span className="hdesk-attr-track" aria-hidden="true">
                <span
                  className={`hdesk-attr-bar ${v < 0 ? "is-down" : "is-up"}`}
                  style={{ width: `${w}%`, left: v < 0 ? `${50 - w}%` : "50%" }}
                />
              </span>
              <span className={`hdesk-num ${toneClass(v)}`}>{signedMoney(v)}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
