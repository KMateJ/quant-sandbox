import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { guidePath, relatedLessons } from "../../features/guide/guide.meta";

type Props = { moduleId: string; ids?: string[] };

/// "Learn the theory": the lessons behind a lab, as plain links with their one-line descriptions.
export default function ModuleRelatedLessons({ moduleId, ids }: Props) {
  const { t } = useI18n();
  const lessons = relatedLessons(moduleId, ids);
  if (lessons.length === 0) return null;

  return (
    <>
      <h3>{t("aboutRelatedHeading")}</h3>
      <ul className="module-about-related">
        {lessons.map((l) => (
          <li key={l.id}>
            <Link to={guidePath(l.id)}>{t(l.titleKey)}</Link> — <span>{t(l.descKey)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
