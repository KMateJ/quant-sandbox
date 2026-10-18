import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { modules } from "../../../modules/registry";
import type { GuideHeading } from "../guide.types";

type GuideRailProps = {
  headings: GuideHeading[];
  activeId: string | null;
  labs: string[];
};

/// Right rail of a lesson: section contents (with the current one marked) and related labs.
export default function GuideRail({ headings, activeId, labs }: GuideRailProps) {
  const { t } = useI18n();
  const labModules = labs
    .map((id) => modules.find((m) => m.id === id))
    .filter((m): m is (typeof modules)[number] => Boolean(m));

  return (
    <aside className="guide-rail">
      {headings.length > 0 && (
        <nav className="guide-toc" aria-label={t("guideOnThisPage")}>
          <div className="guide-rail-label">{t("guideOnThisPage")}</div>
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={h.id === activeId ? "guide-toc-link active" : "guide-toc-link"}
              aria-current={h.id === activeId ? "location" : undefined}
            >
              {h.label}
            </a>
          ))}
        </nav>
      )}
      {labModules.length > 0 && (
        <div className="guide-labs">
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
