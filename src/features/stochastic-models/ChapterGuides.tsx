import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { guideLessons, guidePath } from "../guide/guide.meta";
import type { GuideId } from "../guide/guide.types";

/// Links from a studio chapter to the guide lessons that hold its theory.
export default function ChapterGuides({ ids }: { ids: GuideId[] }) {
  const { t } = useI18n();
  const lessons = ids.flatMap((id) => guideLessons.find((l) => l.id === id) ?? []);

  return (
    <div className="stoch-chapter-guides">
      <h4>{t("stochTheoryHeading")}</h4>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link className="stoch-standalone-link" to={guidePath(lesson.id)}>
              {t(lesson.titleKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
