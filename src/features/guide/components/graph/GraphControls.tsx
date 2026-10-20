import type { CSSProperties } from "react";
import { useI18n } from "../../../../i18n";
import { Tabs } from "../../../../components/ui";
import { CATEGORY_LABEL_KEYS } from "../../../../modules/registry";
import { guideTracks } from "../../guide.meta";
import type { GuideTrackId } from "../../guide.types";
import { trackColor } from "../../guide.ui";

export type GraphView = "graph" | "list";

type Props = {
  tracks: ReadonlySet<GuideTrackId>;
  onToggleTrack: (id: GuideTrackId) => void;
  showLabs: boolean;
  onShowLabs: (value: boolean) => void;
  query: string;
  onQuery: (value: string) => void;
  view: GraphView;
  onView: (view: GraphView) => void;
};

/// Filters for the knowledge graph: tracks, labs on/off, search and graph/list view.
export default function GraphControls({ tracks, onToggleTrack, showLabs, onShowLabs, query, onQuery, view, onView }: Props) {
  const { t } = useI18n();
  return (
    <div className="gg-controls">
      <div className="gg-filter" role="group" aria-label={t("ggTracks")}>
        {guideTracks.map((tr) => (
          <button
            key={tr.id}
            type="button"
            className={tracks.has(tr.id) ? "gg-toggle on" : "gg-toggle"}
            aria-pressed={tracks.has(tr.id)}
            onClick={() => onToggleTrack(tr.id)}
          >
            <span className="gg-dot" style={{ "--dot": trackColor(tr.id) } as CSSProperties} aria-hidden="true" />
            {t(CATEGORY_LABEL_KEYS[tr.id])}
          </button>
        ))}
        <button type="button" className={showLabs ? "gg-toggle on" : "gg-toggle"} aria-pressed={showLabs} onClick={() => onShowLabs(!showLabs)}>
          <span className="gg-dot gg-dot--lab" aria-hidden="true" />
          {t("ggShowLabs")}
        </button>
      </div>
      <input
        className="gg-search"
        type="search"
        value={query}
        placeholder={t("ggSearch")}
        aria-label={t("ggSearch")}
        onChange={(e) => onQuery(e.target.value)}
      />
      <Tabs<GraphView>
        segmented
        items={[{ id: "graph", label: t("ggViewGraph") }, { id: "list", label: t("ggViewList") }]}
        value={view}
        onChange={onView}
        ariaLabel={t("ggView")}
      />
    </div>
  );
}
