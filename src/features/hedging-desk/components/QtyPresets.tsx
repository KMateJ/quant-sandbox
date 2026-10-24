import { useI18n } from "../../../i18n";

const STOCK_PRESETS = [100, 250, 500, 1000];
const OPTION_PRESETS = [1, 5, 10, 20];

/// Quick quantity buttons; the set depends on whether the ticket is for stock or options.
export default function QtyPresets({ stock, qty, onPick }: { stock: boolean; qty: string; onPick: (q: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="hdesk-presets" role="group" aria-label={t("hdSidePresetsAria")}>
      {(stock ? STOCK_PRESETS : OPTION_PRESETS).map((n) => (
        <button
          key={n}
          type="button"
          className="gdesk-btn"
          aria-pressed={qty === String(n)}
          onClick={() => onPick(String(n))}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
