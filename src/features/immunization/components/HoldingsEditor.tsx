import { DraggableBars } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { DEFAULT_CONFIG, money, TENORS } from "../immunization.math";
import type { ImmunizationModel } from "../useImmunizationGame";

const pct = (v: number) => `${Math.round(v * 100)}%`;

/// The portfolio mix as draggable bars (the shares always sum to 100%), with the cost of moving to it.
export default function HoldingsEditor({ model }: { model: ImmunizationModel }) {
  const { t } = useI18n();
  const names = [...TENORS.map((y) => t("imBond", { y })), t("imCash")];
  const labels = [...TENORS.map((y) => t("imBondShort", { y })), t("imCash")];
  const moved = model.tradeCost > 0;

  return (
    <div className="im-holdings">
      <p className="im-hint">{t("imDragHint")}</p>
      <div className="im-bars">
        <DraggableBars
          values={model.target}
          onChange={model.edit}
          min={0}
          max={1}
          step={0.01}
          xLabels={labels}
          barAriaLabel={(i) => t("imBarAria", { name: names[i] })}
          valueFormat={pct}
          yFormat={(v) => String(Math.round(v * 100))}
          ariaLabel={t("imWeights")}
        />
      </div>
      <p className="im-cost">
        {moved ? t("imCost", { cost: money(model.tradeCost), bp: DEFAULT_CONFIG.costBp }) : t("imCostNone")}
      </p>
      <div className="im-actions">
        <button type="button" className="preset-btn" onClick={model.match} disabled={model.done}>{t("imMatchButton")}</button>
        <button type="button" className="preset-btn preset-btn--active" onClick={model.rebalance} disabled={model.done || !moved}>{t("imRebalance")}</button>
      </div>
    </div>
  );
}
