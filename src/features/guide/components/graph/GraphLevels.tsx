import type { CSSProperties } from "react";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { GraphNode } from "../../guide.graph";
import type { PathLevel } from "../../guide.ui";
import { nodeColor } from "./useGuideGraph";

type Props = {
  levels: PathLevel[];
  nodes: ReadonlyMap<string, GraphNode>;
  label: (n: GraphNode) => string;
  code: (n: GraphNode) => string;
  isRead: (n: GraphNode) => boolean;
  onSelect: (id: string) => void;
};

const LEVEL_KEYS: TranslationKey[] = ["ggDirectlyBefore", "ggTwoBack", "ggFoundations"];

/// Prerequisites grouped by distance: each group is indented one step further from the selected lesson.
export default function GraphLevels({ levels, nodes, label, code, isRead, onSelect }: Props) {
  const { t } = useI18n();
  return (
    <div className="gg-levels">
      {levels.map((level) => (
        <section key={level.depth} className={`gg-level gg-level--${level.depth}`}>
          <h4>{t(LEVEL_KEYS[Math.min(level.depth, LEVEL_KEYS.length) - 1])}</h4>
          <ul>
            {level.ids.map((id) => nodes.get(id)).filter((n): n is GraphNode => Boolean(n)).map((n) => (
              <li key={n.id} className={isRead(n) ? "is-read" : undefined}>
                <span className="gg-dot" style={{ "--dot": nodeColor(n) } as CSSProperties} aria-hidden="true" />
                <button type="button" onClick={() => onSelect(n.id)}>
                  <span className="gg-code">{code(n)}</span> {label(n)}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

