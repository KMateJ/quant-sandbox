import { useMemo, useState } from "react";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { buildBinomialTree } from "../../../binomial/binomial.math";
import GuideFigure from "../GuideFigure";
import OneStepTreeSvg from "./OneStepTreeSvg";

const S0 = 100;
const fmt = (v: number | undefined, digits = 2) => (v === undefined || !Number.isFinite(v) ? "–" : v.toFixed(digits));

/// Risk-neutral lesson figure: change u, d, r and K and watch q, the replicating
/// portfolio and today's call price follow from the one-step tree.
export default function OneStepTreeFigure() {
  const { t } = useI18n();
  const [u, setU] = useState(1.2);
  const [d, setD] = useState(0.9);
  const [r, setR] = useState(0.02);
  const [K, setK] = useState(100);

  const tree = useMemo(
    () => buildBinomialTree({ S0, K, u, d, r, steps: 1, optionKind: "call" }),
    [u, d, r, K],
  );
  const up = tree.nodes.find((n) => n.step === 1 && n.upMoves === 1);
  const down = tree.nodes.find((n) => n.step === 1 && n.downMoves === 1);
  const view = {
    s0: fmt(S0, 0),
    su: fmt(up?.stockPrice, 1),
    sd: fmt(down?.stockPrice, 1),
    cu: fmt(up?.optionValue),
    cd: fmt(down?.optionValue),
    q: tree.isValid ? fmt(tree.q) : "–",
    price: tree.isValid ? fmt(tree.price) : "–",
  };

  return (
    <GuideFigure title={t("guideFigureTreeTitle")} labId="binomial">
      <div className="gf-split">
        <div className="gf-visual">
          <OneStepTreeSvg label={t("guideFigureTreeAria", view)} {...view} />
          <dl className="gf-readout">
            <dt>{t("guideReadQ")}</dt>
            <dd className="gf-accent">{view.q}</dd>
            <dt>{t("guideReadDelta")}</dt>
            <dd>{fmt(tree.replicatingPortfolio?.delta, 3)}</dd>
            <dt>{t("guideReadBond")}</dt>
            <dd>{fmt(tree.replicatingPortfolio?.bond)}</dd>
            <dt>{t("guideReadCall")}</dt>
            <dd className="gf-strong">{view.price}</dd>
          </dl>
          {!tree.isValid && <p className="gf-warning" role="status">{t("guideFigureTreeInvalid")}</p>}
        </div>
        <div className="gf-controls">
          <SliderField label={t("guideFieldUp")} min={1} max={1.6} step={0.01} value={u} onChange={setU} formatValue={(v) => v.toFixed(2)} />
          <SliderField label={t("guideFieldDown")} min={0.5} max={1} step={0.01} value={d} onChange={setD} formatValue={(v) => v.toFixed(2)} />
          <SliderField label={t("guideFieldRate")} min={-0.05} max={0.2} step={0.005} value={r} onChange={setR} formatValue={(v) => `${(v * 100).toFixed(1)}%`} />
          <SliderField label={t("guideFieldStrike")} min={60} max={140} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        </div>
      </div>
    </GuideFigure>
  );
}
