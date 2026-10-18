import { useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../../i18n";
import { conditionOnDie, type DieVariable, type InfoId } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";

const INFOS: InfoId[] = ["none", "parity", "lowHigh", "pairs", "full"];
const INFO_KEY: Record<InfoId, TranslationKey> = { none: "gsInfoNone", parity: "gsInfoParity", lowHigh: "gsInfoLowHigh", pairs: "gsInfoPairs", full: "gsInfoFull" };
const VARS: DieVariable[] = ["face", "square", "high"];
const VAR_LABEL: Record<DieVariable, string> = { face: "X = ω", square: "X = ω²", high: "X = 1{ω ≥ 5}" };

/// A die's six outcomes grouped into the atoms of 𝒢: E[X | 𝒢] is constant on each atom and equals the block average.
export default function SigmaPartitionFigure() {
  const { t } = useI18n();
  const [info, setInfo] = useState<InfoId>("parity");
  const [variable, setVariable] = useState<DieVariable>("square");
  const r = conditionOnDie(info, variable);

  return (
    <GuideFigure title={t("gsSigmaTitle")} labId="stochastic-models">
      <div className="gf-toolbar">
        <SegmentedControl<InfoId> ariaLabel={t("gsInfoLabel")} value={info} onChange={setInfo} options={INFOS.map((v) => ({ value: v, label: t(INFO_KEY[v]) }))} />
        <SegmentedControl<DieVariable> ariaLabel={t("gsVariableLabel")} value={variable} onChange={setVariable} options={VARS.map((v) => ({ value: v, label: VAR_LABEL[v] }))} />
      </div>
      <ol className="gs-tiles" aria-label={t("gsSigmaAria")}>
        {r.tiles.map((tile) => (
          <li key={tile.w} className={`gs-tile gs-block-${tile.block}`}>
            <span className="gs-tile-omega">ω = {tile.w}</span>
            <span>X = {fmt(tile.x, 0)}</span>
            <span className="gs-tile-cond">E[X | 𝒢] = {fmt(tile.cond, 2)}</span>
          </li>
        ))}
      </ol>
      <FigureReadout
        items={[
          { label: t("gsEvents"), value: String(r.events) },
          { label: "E[X]", value: fmt(r.ex, 3) },
          { label: "Var X", value: fmt(r.varX, 3) },
          { label: "Var E[X | 𝒢]", value: fmt(r.varCond, 3), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
