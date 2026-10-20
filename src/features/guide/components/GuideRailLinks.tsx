import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useI18n, type TranslationKey } from "../../../i18n";
import { lessonNodeId } from "../guide.graph";
import { guideLessons, guidePath } from "../guide.meta";
import type { GuideId } from "../guide.types";
import { lessonCode, lessonLinks } from "../guide.ui";
import { GUIDE_GRAPH, NODE_BY_ID } from "./graph/useGuideGraph";

const toLessons = (nodeIds: string[]) =>
  nodeIds.flatMap((nid) => {
    const node = NODE_BY_ID.get(nid);
    const meta = node?.kind === "lesson" ? guideLessons.find((l) => l.id === node.lessonId) : undefined;
    return meta ? [meta] : [];
  });

function LinkList({ label, ids }: { label: TranslationKey; ids: ReturnType<typeof toLessons> }) {
  const { t } = useI18n();
  if (!ids.length) return null;
  return (
    <div className="guide-rail-section">
      <div className="guide-rail-label">{t(label)}</div>
      {ids.map((l) => (
        <Link key={l.id} className="guide-rail-lesson" to={guidePath(l.id)}>
          <span className="guide-rail-code">{lessonCode(l.id)}</span>
          <span>{t(l.titleKey)}</span>
        </Link>
      ))}
    </div>
  );
}

/// Rail lists of the lessons this one builds on and leads to, plus a link into the knowledge graph.
export default function GuideRailLinks({ lessonId }: { lessonId: GuideId }) {
  const { t } = useI18n();
  const links = useMemo(() => {
    const { buildsOn, leadsTo } = lessonLinks(GUIDE_GRAPH.edges, lessonNodeId(lessonId));
    return { buildsOn: toLessons(buildsOn), leadsTo: toLessons(leadsTo) };
  }, [lessonId]);

  return (
    <>
      <LinkList label="guideBuildsOn" ids={links.buildsOn} />
      <LinkList label="guideLeadsTo" ids={links.leadsTo} />
      <Link className="guide-rail-graph" to={`/guide/graph?focus=${lessonId}`}>{t("guideSeeInGraph")}</Link>
    </>
  );
}
