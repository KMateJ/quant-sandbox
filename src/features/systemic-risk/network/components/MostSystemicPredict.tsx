import { useMemo, useState } from "react";
import NetworkGraph from "../../../../components/charts/network/NetworkGraph";
import { layoutFor } from "../../../../components/charts/network/network.logic";
import { Panel } from "../../../../components/layout";
import { ChallengeRecord } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { recordChallenge } from "../../../../lib/game/challengeScores";
import type { InstKind } from "../../engine/systemic.types";
import { KIND_ORDER, TYPE_ORDER } from "../network.types";
import { predictNetwork, predictTruth, toNetEdges, toNetNodes } from "../networkView.math";
import { useNetLabels } from "../useNetLabels";

const CHALLENGE = "syr-most-systemic";
const ALL_KINDS = new Set<InstKind>(KIND_ORDER);
const ALL_TYPES = new Set(TYPE_ORDER);
const SHOWN = 8;

/// Pick round: click the institution whose failure would do the most damage, then see the DebtRank ranking.
export default function MostSystemicPredict() {
  const { t } = useI18n();
  const labels = useNetLabels();
  const [round, setRound] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const net = useMemo(() => predictNetwork(round), [round]);
  const truth = useMemo(() => predictTruth(net), [net]);
  const nodes = useMemo(
    () => toNetNodes(net, { sizeBy: "assets", colorBy: "kind", kinds: ALL_KINDS, label: (k) => t(`syrKindShort_${k}`) }),
    [net, t],
  );
  const edges = useMemo(() => toNetEdges(net, ALL_TYPES), [net]);
  const positions = useMemo(() => layoutFor(nodes, edges, 900, 520, round + 1), [nodes, edges, round]);
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  const choose = (id: string | null) => {
    if (!id || pick) return;
    setPick(id);
    recordChallenge(CHALLENGE, id === truth.mostSystemic, Date.now());
  };
  const top = truth.ranking.slice(0, SHOWN);
  const max = top[0]?.debtRank || 1;

  return (
    <Panel title={t("syrPredictTitle")} actions={<button type="button" className="preset-btn" onClick={() => { setRound(round + 1); setPick(null); }}>{t("syrPredictNext")}</button>}>
      <p>{t("syrPredictPrompt")}</p>
      <div className="syr-graph">
        <NetworkGraph nodes={nodes} edges={edges} height={400} positions={positions} layoutKey={`p${round}`} selectedId={pick} onSelect={choose} ariaLabel={t("syrPredictAria")} labels={labels} />
      </div>
      {pick && (
        <div className="syr-reveal" role="status">
          <p>
            <strong>{t(pick === truth.mostSystemic ? "syrPredictRight" : "syrPredictWrong")}</strong>{" "}
            {t("syrPredictAnswer", { name: name(truth.mostSystemic), largest: name(truth.largest) })}
          </p>
          <ol className="syr-rank" aria-label={t("syrPredictRanking")}>
            {top.map((r) => (
              <li key={r.id}>
                <span className="syr-rank-name">{name(r.id)}</span>
                <span className="syr-rank-bar"><span style={{ width: `${(100 * r.debtRank) / max}%` }} /></span>
                <span className="syr-num">{r.debtRank.toFixed(3)}</span>
                <span className="syr-rank-tags">
                  {r.id === pick && <em>{t("syrPredictYours")}</em>}
                  {r.id === truth.largest && <em>{t("syrPredictLargest")}</em>}
                </span>
              </li>
            ))}
          </ol>
          {truth.mostSystemic !== truth.largest && <p className="control-hint">{t("syrPredictSurprise")}</p>}
        </div>
      )}
      <ChallengeRecord id={CHALLENGE} />
    </Panel>
  );
}
