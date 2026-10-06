import SectionCard from "../../../components/SectionCard";
import { IntuitionTrigger } from "../../../components/intuition";
import { useMediaQuery } from "../../../components/useMediaQuery";
import SwitchRow from "../../../components/SwitchRow";
import type { BinomialTreeResult, OptionKind, TreeMode } from "../binomial.types";
import { useI18n } from "../../../i18n";
import BinomialLattice from "./BinomialLattice";

type Props = {
  tree: BinomialTreeResult;
  optionKind: OptionKind;
  showPrimaryMetric: boolean;
  showSecondaryMetric: boolean;
  primaryToggleLabel: string;
  secondaryToggleLabel: string;
  onModeChange: (value: TreeMode) => void;
  onOptionKindChange: (value: OptionKind) => void;
  onTogglePrimaryMetric: () => void;
  onToggleSecondaryMetric: () => void;
};

export default function BinomialTreeChart({
  tree, optionKind, showPrimaryMetric, showSecondaryMetric, primaryToggleLabel,
  secondaryToggleLabel, onModeChange, onOptionKindChange, onTogglePrimaryMetric, onToggleSecondaryMetric,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { t } = useI18n();
  const isRates = tree.mode === "rates";
  const title = t(isRates ? "binomialRateTreeTitle" : "binomialTreeTitle");
  return (
    <SectionCard
      className="chart-card"
      title={title}
      headerRight={<IntuitionTrigger sectionId={isRates ? "short-rate-tree" : "stock-tree"} />}
    >
      {isMobile && (
        <SwitchRow groups={[
          {
            key: "mode",
            sectionId: isRates ? "short-rate-tree" : "stock-tree",
            options: [
              { label: t("binomialModeEquity"), active: !isRates, onSelect: () => onModeChange("equity") },
              { label: t("binomialModeRates"), active: isRates, onSelect: () => onModeChange("rates") },
            ],
          },
          ...(!isRates ? [{
            key: "type",
            sectionId: "spot-strike",
            options: [
              { label: t("binomialOptionCall"), active: optionKind === "call", onSelect: () => onOptionKindChange("call") },
              { label: t("binomialOptionPut"), active: optionKind === "put", onSelect: () => onOptionKindChange("put") },
            ],
          }] : []),
          {
            key: "display",
            sectionId: isRates ? "short-rate-tree" : "replication",
            options: [
              { label: primaryToggleLabel, active: showPrimaryMetric, onSelect: onTogglePrimaryMetric },
              { label: secondaryToggleLabel, active: showSecondaryMetric, onSelect: onToggleSecondaryMetric },
            ],
          },
        ]} />
      )}
      <BinomialLattice
        tree={tree}
        vertical={isMobile}
        showPrimaryMetric={showPrimaryMetric}
        showSecondaryMetric={showSecondaryMetric}
        label={title}
      />
    </SectionCard>
  );
}
