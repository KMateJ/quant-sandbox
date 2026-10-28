import { ScatterChart, SERIES_PALETTE, SERIES_ROLE } from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import type { TournamentResult } from "../avellanedaStoikov.types";

/// Mean vs sd of terminal P&L: the AS frontier across γ, and the three contestants as labelled dots.
export default function FrontierChart({ result, names }: { result: TournamentResult; names: string[] }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const f = [...result.frontier].sort((a, b) => a.sd - b.sd);
  return (
    <ScatterChart
      series={[
        { key: "frontier", label: t("avsFrontier"), color: SERIES_ROLE.reference, line: true, dash: "4 3", points: f.map((p) => ({ x: p.sd, y: p.mean })) },
        ...result.stats.map((s, i) => ({
          key: `p${i}`,
          label: names[i],
          color: SERIES_PALETTE[i],
          radius: 6,
          hollow: i === 2,
          points: [{ x: s.sd, y: s.mean, label: names[i] }],
        })),
      ]}
      annotations={f.map((p) => ({ x: p.sd, y: p.mean, text: `γ ${p.gamma}`, dy: -8, fontSize: 10 }))}
      avoidLabelCollisions
      isMobile={isMobile}
      legend
      xLabel={t("avsAxisSd")}
      yLabel={t("avsAxisMean")}
      xFormat={(v) => `$${v.toFixed(0)}`}
      yFormat={(v) => `$${v.toFixed(0)}`}
    />
  );
}
