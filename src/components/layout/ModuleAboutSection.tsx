import { useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { ModuleAbout } from "../../modules/moduleAbout";

type Props = { about: ModuleAbout; path: string };

/// Compact intro and FAQ below a module's workspace. Answers sit in <details>, so the text is
/// on the page for readers and search engines without crowding the tool. Hidden on sub-pages.
export default function ModuleAboutSection({ about, path }: Props) {
  const { t } = useI18n();
  const { pathname } = useLocation();
  if (pathname !== path) return null;

  return (
    <section className="module-about" aria-labelledby="module-about-heading">
      <h2 id="module-about-heading">{t("aboutHeading")}</h2>
      <p className="module-about-intro">{t(about.intro)}</p>
      <h3>{t("aboutFaqHeading")}</h3>
      <div className="module-about-faq">
        {about.faq.map(({ question, answer }) => (
          <details key={question}>
            <summary>{t(question)}</summary>
            <p>{t(answer)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
