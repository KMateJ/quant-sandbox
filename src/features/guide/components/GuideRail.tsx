import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { moduleById, type ModuleDef } from "../../../modules/registry";
import type { GuideHeading, GuideId } from "../guide.types";
import GuideRailLinks from "./GuideRailLinks";
import LessonGraph from "./graph/LessonGraph";

type GuideRailProps = {
  lessonId: GuideId;
  headings: GuideHeading[];
  activeId: string | null;
  labs: string[];
};

/// Right rail of a lesson: section contents (with the current one marked), the lessons it builds on and leads to, and related labs.
export default function GuideRail({ lessonId, headings, activeId, labs }: GuideRailProps) {
  const { t } = useI18n();
  const labModules = labs.map(moduleById).filter((m): m is ModuleDef => Boolean(m));

  return (
    <aside className="guide-rail">
      {headings.length > 0 && (
        <nav className="guide-toc" aria-label={t("guideOnThisPage")}>
          <div className="guide-rail-label">{t("guideOnThisPage")}</div>
          {headings.map((h, i) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={h.id === activeId ? "guide-toc-link active" : "guide-toc-link"}
              aria-current={h.id === activeId ? "location" : undefined}
            >
              <span className="guide-toc-num">§{i + 1}</span>
              <span>{h.label}</span>
            </a>
          ))}
        </nav>
      )}
      <LessonGraph lessonId={lessonId} />
      <GuideRailLinks lessonId={lessonId} />
      {labModules.length > 0 && (
        <div className="guide-rail-section">
          <div className="guide-rail-label">{t("guideLabsTitle")}</div>
          {labModules.map((m) => (
            <Link key={m.id} className="guide-lab-link" to={m.path}>
              {t(m.navKey)}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
