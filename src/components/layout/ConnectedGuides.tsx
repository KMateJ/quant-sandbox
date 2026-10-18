import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { guideLessons, guidePath } from "../../features/guide/guide.meta";
import type { GuideLessonMeta } from "../../features/guide/guide.types";
import ModuleIcon from "./ModuleIcon";

/// Secondary sidebar section: guides relevant to the active module.
export default function ConnectedGuides({ ids }: { ids: string[] }) {
  const { t } = useI18n();
  const guides = ids
    .map((id) => guideLessons.find((g) => g.id === id))
    .filter((g): g is GuideLessonMeta => Boolean(g));

  if (guides.length === 0) return null;

  return (
    <div className="connected-guides">
      <div className="side-section-label">{t("connectedGuides")}</div>
      <ul className="cg-list">
        {guides.map((g) => {
          const title = t(g.titleKey);
          return (
            <li key={g.id}>
              <Link className="cg-link" to={guidePath(g.id)} title={title}>
                <span className="side-icon" aria-hidden="true">
                  <ModuleIcon id="guide" />
                </span>
                <span className="side-label">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
