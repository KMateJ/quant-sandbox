import i18n from "i18next";
import type { TranslationKey } from "./i18n";
import { LANGUAGES, languagePrefix, localizedPath, type Language } from "./languageRoutes";
import { CATEGORY_LABEL_KEYS, CATEGORY_ORDER, modules } from "./modules/registry";
import { findGuideLesson, guideLessons, guidePath, guideTracks, relatedLessons, trackLessons } from "./features/guide/guide.meta";
import { lessonToMarkdown, type MarkdownLabels, type MarkdownLink } from "./features/guide/guide.markdown";
import { guideContent } from "./Language/guides";
import { BASE_URL, SITE_NAME, seoPagesFor, type SeoPage } from "./seo.routes";
import type { MarkdownPage } from "./seo.types";

type Translate = (key: TranslationKey) => string;


const absolute = (path: string) => new URL(path, BASE_URL).toString();

const labels = (t: Translate): MarkdownLabels => ({
  practice: t("seoMdPractice"),
  answer: t("seoMdAnswer"),
  figure: t("seoMdFigure"),
  workedExample: t("seoMdWorked"),
  labs: t("seoMdLabs"),
  source: t("seoMdSource"),
  previous: t("seoMdPrevious"),
  next: t("seoMdNext"),
});

function lessonPages(t: Translate, language: Language, byPath: Map<string, SeoPage>): MarkdownPage[] {
  const at = (path: string) => localizedPath(path, language);
  const linkTo = (path: string): MarkdownLink | undefined => {
    const page = byPath.get(path);
    return page && { title: page.title, url: absolute(path) };
  };
  return guideLessons.flatMap((lesson) => {
    const path = at(guidePath(lesson.id));
    const page = byPath.get(path);
    const location = findGuideLesson(lesson.id);
    if (!page || !location) return [];
    const labs = lesson.labs.flatMap((id) => {
      const module = modules.find((m) => m.id === id);
      return module ? [{ title: t(module.seo.titleKey), url: absolute(at(module.path)) }] : [];
    });
    const markdown = lessonToMarkdown({
      title: page.title,
      description: page.description,
      url: absolute(path),
      pathPrefix: languagePrefix(language),
      blocks: guideContent[lesson.id][language],
      labs,
      previous: location.previous && linkTo(at(guidePath(location.previous.id))),
      next: location.next && linkTo(at(guidePath(location.next.id))),
      labels: labels(t),
    });
    return [{ path, markdown }];
  });
}

function toolPages(t: Translate, language: Language, byPath: Map<string, SeoPage>): MarkdownPage[] {
  const at = (path: string) => localizedPath(path, language);
  return modules.flatMap((m) => {
    const page = byPath.get(at(m.path));
    // Course (track) pages are indexes of lessons that have their own twins.
    if (!m.about || !page || m.category === "guides") return [];
    const related = relatedLessons(m.id, m.relatedGuides).map((l) => `- [${t(l.titleKey)}](${absolute(at(guidePath(l.id)))}): ${t(l.descKey)}`);
    const sections = [
      `# ${page.title}`,
      page.description,
      `## ${t("aboutHeading")}`,
      t(m.about.intro),
      `## ${t("aboutFaqHeading")}`,
      ...m.about.faq.map((f) => `### ${t(f.question)}\n\n${t(f.answer)}`),
      ...(related.length ? [`## ${t("aboutRelatedHeading")}`, related.join("\n")] : []),
      `${t("seoMdOpenTool")}: ${absolute(at(m.path))}`,
    ];
    return [{ path: at(m.path), markdown: `${sections.join("\n\n")}\n` }];
  });
}

/// Markdown twins of every guide lesson and every tool with an "About" section, in `language`.
/// Their paths carry the language prefix, like the pages in `pages`.
export function markdownPages(t: Translate, language: Language, pages: SeoPage[]): MarkdownPage[] {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  return [...lessonPages(t, language, byPath), ...toolPages(t, language, byPath)];
}

/// `llms.txt` (llmstxt.org): what the site holds, lessons by track and tools by category, linking
/// each page's Markdown twin where `mdPaths` has one; everything else goes under "Optional".
export function llmsTxt(t: Translate, pages: SeoPage[], mdPaths: Set<string>): string {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const entry = (p: SeoPage) => `- [${p.title}](${absolute(mdPaths.has(p.path) ? `${p.path}.md` : p.path)}): ${p.description}`;
  const listed = new Set<string>();
  const section = (heading: string, paths: string[]) => {
    const items = paths.flatMap((path) => (byPath.has(path) && !listed.has(path) ? [byPath.get(path)!] : []));
    items.forEach((p) => listed.add(p.path));
    return items.length ? [`## ${heading}`, items.map(entry).join("\n")] : [];
  };
  const lessons = guideTracks.flatMap((track) =>
    section(`${t("seoLlmsLessons")} — ${t(track.titleKey)}`, trackLessons(track).map((l) => guidePath(l.id)).filter((p) => mdPaths.has(p)))
  );
  const tools = CATEGORY_ORDER.flatMap((category) =>
    section(`${t("seoLlmsLabs")} — ${t(CATEGORY_LABEL_KEYS[category])}`, modules.filter((m) => m.category === category && mdPaths.has(m.path)).map((m) => m.path))
  );
  const optional = section("Optional", pages.map((p) => p.path).filter((p) => p !== "/"));
  return `${[`# ${SITE_NAME}`, `> ${t("seoLlmsSummary")}`, t("seoLlmsIntro"), ...lessons, ...tools, ...optional].join("\n\n")}\n`;
}

/// Every lesson's Markdown in track order, for agents that want the whole curriculum in one file.
export function llmsFullTxt(pages: MarkdownPage[]): string {
  const order = guideTracks.flatMap((track) => trackLessons(track).map((l) => guidePath(l.id)));
  const byPath = new Map(pages.map((p) => [p.path, p.markdown]));
  return `${order.flatMap((path) => (byPath.has(path) ? [byPath.get(path)!.trim()] : [])).join("\n\n---\n\n")}\n`;
}

/// Closing `llms.txt` section that points at the lessons of a non-default language.
function otherLanguageSection(heading: string, pages: SeoPage[], twins: MarkdownPage[]): string {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const items = twins.flatMap((m) => (byPath.has(m.path) ? [byPath.get(m.path)!] : []));
  return items.length ? `\n## ${heading}\n\n${items.map((p) => `- [${p.title}](${absolute(`${p.path}.md`)}): ${p.description}`).join("\n")}\n` : "";
}

/// Every language's Markdown twins; `llms.txt` and `llms-full.txt` stay English, and `llms.txt`
/// ends with a "Magyar" section listing the Hungarian lessons.
export async function allMarkdown() {
  const perLanguage = await Promise.all(
    LANGUAGES.map(async (language) => {
      const pages = await seoPagesFor(language);
      const t = i18n.getFixedT(language) as Translate;
      return { language, t, pages, twins: markdownPages(t, language, pages) };
    })
  );
  const [english] = perLanguage;
  const mdPaths = new Set(english.twins.map((p) => p.path));
  const hungarian = perLanguage.find((l) => l.language === "hu");
  const magyar = hungarian ? otherLanguageSection("Magyar", hungarian.pages, hungarian.twins.filter((m) => m.path.includes("/guide/"))) : "";
  return {
    pages: perLanguage.flatMap((l) => l.twins),
    llms: llmsTxt(english.t, english.pages, mdPaths) + magyar,
    llmsFull: llmsFullTxt(english.twins),
  };
}
