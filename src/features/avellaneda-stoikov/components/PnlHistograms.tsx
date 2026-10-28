import { Histogram, SERIES_PALETTE } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { binValues } from "../../../lib/stats/histogram";
import type { PolicyStats } from "../avellanedaStoikov.types";

/// One small histogram of terminal P&L per contestant, on a shared axis so widths compare at a glance.
export default function PnlHistograms({ stats, names }: { stats: PolicyStats[]; names: string[] }) {
  const { t } = useI18n();
  const all = stats.flatMap((s) => s.pnl);
  const domain: [number, number] = [Math.floor(Math.min(...all)), Math.ceil(Math.max(...all))];
  return (
    <div className="avs-hists">
      {stats.map((s, i) => (
        <figure key={i} className="avs-hist">
          <figcaption>{names[i]}</figcaption>
          <Histogram
            bins={binValues(s.pnl, domain, 30).bins}
            height={110}
            color={SERIES_PALETTE[i]}
            markers={[{ value: s.mean, label: t("avsMeanShort") }]}
            xFormat={(v) => `$${v.toFixed(0)}`}
            ariaLabel={t("avsHistAria", { name: names[i] })}
          />
        </figure>
      ))}
    </div>
  );
}
