import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { guideTrackPath, guideTracks } from "../../features/guide/guide.meta";
import NotFoundArt from "./NotFoundArt";

/// Catch-all page for unknown routes; also pre-rendered as `404.html`.
export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="not-found">
      <NotFoundArt />
      <h1 className="not-found-title">{t("notFoundTitle")}</h1>
      <p className="not-found-body">{t("notFoundBody")}</p>
      <div className="not-found-actions">
        <Link className="not-found-primary" to="/">{t("notFoundHome")}</Link>
        <Link className="preset-btn" to={guideTrackPath(guideTracks[0].id)}>{t("notFoundLessons")}</Link>
      </div>
    </section>
  );
}
