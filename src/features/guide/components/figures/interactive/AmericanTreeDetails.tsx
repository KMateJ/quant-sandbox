import { useI18n } from "../../../../../i18n";
import type { AmericanTree, ExerciseStyle, TreeNode } from "../../../guide.interactive.americanTree.math";
import { fmt } from "../figureFormat";

type Props = { tree: AmericanTree; node: TreeNode; style: ExerciseStyle };

/// Backward-induction step of the selected node, written out with its numbers.
export default function AmericanTreeDetails({ tree, node, style }: Props) {
  const { t } = useI18n();
  const terminal = node.decision === "terminal";
  const up = terminal ? undefined : tree.nodes[node.i + 1][node.j + 1];
  const down = terminal ? undefined : tree.nodes[node.i + 1][node.j];
  const valueRule = terminal
    ? `max(K − S, 0) = ${fmt(node.value)}`
    : style === "american"
      ? `max(${fmt(node.intrinsic)}, ${fmt(node.continuation)}) = ${fmt(node.value)}`
      : `${fmt(node.continuation)}`;

  return (
    <div className="ixat-details" aria-live="polite">
      <div className="ixat-details-title">{t("ixAtDetails", { step: node.i })}</div>
      <dl className="ixat-details-grid">
        <dt>{t("ixAtPrice")}</dt>
        <dd>{fmt(node.s)}</dd>
        <dt>{t("ixAtIntrinsic")}</dt>
        <dd>{fmt(node.intrinsic)}</dd>
        {up && down && (
          <>
            <dt>{t("ixAtContinuation")}</dt>
            <dd>
              e<sup>−rΔt</sup>(q·V<sub>up</sub> + (1−q)·V<sub>down</sub>) = {tree.disc.toFixed(4)} × ({tree.q.toFixed(4)} ×{" "}
              {fmt(up.value)} + {(1 - tree.q).toFixed(4)} × {fmt(down.value)}) = {fmt(node.continuation)}
            </dd>
          </>
        )}
        <dt>{t("ixAtNodeValue")}</dt>
        <dd className={node.decision === "exercise" ? "is-exercise" : undefined}>{valueRule}</dd>
      </dl>
      {terminal && <p className="ixat-details-note">{t("ixAtTerminalNote")}</p>}
      {!terminal && style === "european" && <p className="ixat-details-note">{t("ixAtEuropeanNote")}</p>}
    </div>
  );
}
