import type { SeoPage } from "./seo.types";

export type SiteInfo = { BASE_URL: string; SITE_NAME: string };
/// Build-time facts that don't live in the registry (e.g. the git date of a page).
export type SchemaExtras = { dateModified?: string };

type Crumb = { name: string; path: string };

/// Public source repository, linked from the Organization as `sameAs`.
export const GITHUB_URL = "https://github.com/KMateJ/quant-sandbox";

const CONTEXT = "https://schema.org";
/// Fallback content language for a page that doesn't name one.
const LANGUAGE = "en";
const FREE_OFFER = { "@type": "Offer", price: "0", priceCurrency: "USD" };

/// `@id` of the site's Organization node, referenced by every other page.
export const ORG_ID = (site: SiteInfo) => `${site.BASE_URL}/#organization`;
/// `@id` of the WebSite node on the home page.
export const WEBSITE_ID = (site: SiteInfo) => `${site.BASE_URL}/#website`;

const absolute = (site: SiteInfo, path: string) => new URL(path, site.BASE_URL).toString();
const orgRef = (site: SiteInfo) => ({ "@id": ORG_ID(site) });
const modified = (extras: SchemaExtras) => (extras.dateModified ? { dateModified: extras.dateModified } : {});

function organization(site: SiteInfo) {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": ORG_ID(site),
    name: site.SITE_NAME,
    url: absolute(site, "/"),
    logo: absolute(site, "/android-chrome-512x512.png"),
    sameAs: [GITHUB_URL],
  };
}

function website(page: SeoPage, site: SiteInfo) {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": WEBSITE_ID(site),
    name: site.SITE_NAME,
    url: absolute(site, "/"),
    description: page.description,
    inLanguage: page.language || LANGUAGE,
    publisher: orgRef(site),
  };
}

function breadcrumbs(site: SiteInfo, crumbs: Crumb[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: [{ name: site.SITE_NAME, path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(site, c.path),
    })),
  };
}

function faqPage(faq: NonNullable<SeoPage["faq"]>) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function course(page: SeoPage, site: SiteInfo, lessons: NonNullable<SeoPage["lessons"]>) {
  return {
    "@context": CONTEXT,
    "@type": "Course",
    name: page.title,
    description: page.description,
    url: absolute(site, page.path),
    inLanguage: page.language || LANGUAGE,
    isAccessibleForFree: true,
    offers: { ...FREE_OFFER, category: "Free" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online" },
    provider: orgRef(site),
    hasPart: lessons.map((l) => ({ "@type": "LearningResource", name: l.title, url: absolute(site, l.path) })),
  };
}

function lesson(page: SeoPage, site: SiteInfo, parent: NonNullable<SeoPage["parent"]>, extras: SchemaExtras) {
  return {
    "@context": CONTEXT,
    "@type": "LearningResource",
    name: page.title,
    description: page.description,
    url: absolute(site, page.path),
    learningResourceType: "Interactive lesson",
    inLanguage: page.language || LANGUAGE,
    isAccessibleForFree: true,
    provider: orgRef(site),
    publisher: orgRef(site),
    ...modified(extras),
    isPartOf: { "@type": "Course", name: parent.title, url: absolute(site, parent.path) },
  };
}

function webApp(page: SeoPage, site: SiteInfo, extras: SchemaExtras) {
  return {
    "@context": CONTEXT,
    "@type": "WebApplication",
    name: page.title,
    description: page.description,
    url: absolute(site, page.path),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    inLanguage: page.language || LANGUAGE,
    isAccessibleForFree: true,
    offers: FREE_OFFER,
    publisher: orgRef(site),
    ...modified(extras),
  };
}

/// Category crumb for a tool, left out when the category link is the tool itself.
function categoryCrumbs(page: SeoPage): Crumb[] {
  const c = page.category;
  return c && c.path !== page.path ? [{ name: c.title, path: c.path }] : [];
}

/// schema.org JSON-LD objects for one page: WebSite + Organization on the home page, a Course for
/// modules with lessons, a LearningResource for lessons and a WebApplication for tools, each with
/// breadcrumbs, plus an FAQPage when the page shows an FAQ. Absent fields are omitted.
export function structuredData(page: SeoPage, site: SiteInfo, extras: SchemaExtras = {}): object[] {
  const self = { name: page.title, path: page.path };
  const faq = page.faq?.length ? [faqPage(page.faq)] : [];
  if (page.path === "/") return [website(page, site), organization(site), ...faq];
  if (page.lessons) return [course(page, site, page.lessons), breadcrumbs(site, [self]), ...faq];
  if (page.parent) {
    const parent = { name: page.parent.title, path: page.parent.path };
    return [lesson(page, site, page.parent, extras), breadcrumbs(site, [parent, self])];
  }
  return [webApp(page, site, extras), breadcrumbs(site, [...categoryCrumbs(page), self]), ...faq];
}
