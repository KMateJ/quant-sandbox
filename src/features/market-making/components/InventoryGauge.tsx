import { useI18n } from "../../../i18n";
import { INVENTORY_LIMIT } from "../marketMaking.types";

const SPAN = INVENTORY_LIMIT * 2;

/// Horizontal inventory gauge: centre is flat, ticks at ±limit, colour plus a long/short word.
export default function InventoryGauge({ inventory }: { inventory: number }) {
  const { t } = useI18n();
  const pos = Math.max(-SPAN, Math.min(SPAN, inventory));
  const pct = (v: number) => `${50 + (v / SPAN) * 50}%`;
  const word = inventory > 0 ? t("mkmLong") : inventory < 0 ? t("mkmShort") : t("mkmFlat");
  const tone = inventory > 0 ? "long" : inventory < 0 ? "short" : "flat";
  const over = Math.abs(inventory) > INVENTORY_LIMIT;
  return (
    <div className="mkm-gauge">
      <div className="mkm-gauge-head">
        <span>{t("mkmInventory")}</span>
        <strong className={`mkm-tone--${tone}`}>
          {inventory > 0 ? "+" : ""}{inventory.toLocaleString()} · {word}
        </strong>
      </div>
      <div className={over ? "mkm-gauge-track is-over" : "mkm-gauge-track"} role="meter" aria-valuemin={-SPAN} aria-valuemax={SPAN} aria-valuenow={inventory} aria-label={t("mkmInventory")}>
        <span className="mkm-gauge-tick" style={{ left: pct(-INVENTORY_LIMIT) }} />
        <span className="mkm-gauge-tick mkm-gauge-tick--zero" style={{ left: "50%" }} />
        <span className="mkm-gauge-tick" style={{ left: pct(INVENTORY_LIMIT) }} />
        <span className={`mkm-gauge-fill mkm-gauge-fill--${tone}`} style={{ left: pct(Math.min(0, pos)), width: `${(Math.abs(pos) / SPAN) * 50}%` }} />
      </div>
    </div>
  );
}
