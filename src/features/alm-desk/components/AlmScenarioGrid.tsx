import { ScenarioGrid, signed } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { GRID_PARALLELS, GRID_TWISTS, type AlmDeskModel } from "../useAlmDesk";

const compact = (x: number) => `${signed(x / 1000, 1)}k`;

/// Instant surplus change for parallel moves (columns) and twists (rows).
export default function AlmScenarioGrid({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const bp = (x: number) => t("almdBp", { bp: signed(x) });
  return (
    <ScenarioGrid
      id="almd-grid"
      title={t("almdGridTitle")}
      caption={t("almdGridCaption")}
      corner={t("almdGridCorner")}
      cols={GRID_PARALLELS.map(bp)}
      rows={GRID_TWISTS.map((tw, i) => ({ label: bp(tw), cells: desk.grid.map((row) => ({ value: row[i], display: compact(row[i]) })) }))}
    />
  );
}
