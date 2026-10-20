import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { useLastLab } from "../../components/layout/useLastLab";
import { moduleById } from "../../modules/registry";
import { START_LESSON } from "./home.data";

/// Stats-row cell: resume the last lab, or point a new reader to the first lesson.
export default function HomeContinue() {
  const { t } = useI18n();
  const last = useLastLab();
  const lab = last ? moduleById(last.id) : undefined;
  const resume = last && lab ? { name: t(lab.navKey), to: last.href } : null;

  return (
    <div className="home-continue">
      <p className="home-eyebrow">{t(resume ? "homeContinue" : "homeStartHere")}</p>
      <p className="home-continue-name">{resume ? resume.name : t(START_LESSON.titleKey)}</p>
      <Link to={resume ? resume.to : START_LESSON.path} className="home-link">
        {t(resume ? "homeResume" : "homeBegin")}
      </Link>
    </div>
  );
}
