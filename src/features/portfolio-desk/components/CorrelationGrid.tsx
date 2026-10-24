import { ScenarioGrid } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { corrChange } from "../engine/risk.math";
import { ASSET_CODES } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

/// Today's EWMA correlations as text, tinted by how far each moved from the calm regime.
export default function CorrelationGrid({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { S, mission } = desk;
  const change = corrChange(S, mission);
  const rows = ASSET_CODES.map((code, i) => ({
    label: code,
    cells: ASSET_CODES.map((_, j) => ({ display: (mission.calm.corr[i][j] + change[i][j]).toFixed(2), value: i === j ? 0 : change[i][j] })),
  }));
  return <ScenarioGrid id="pmgr-corr" title={t("pmgrCorrTitle")} caption={t("pmgrCorrCaption")} corner="ρ" cols={[...ASSET_CODES]} rows={rows} />;
}
