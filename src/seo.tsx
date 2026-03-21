import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

const SITE_NAME = "Quant Sandbox";
const BASE_URL = "https://quantsandbox.dev";

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string
) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      el!.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}

function upsertLink(
  selector: string,
  attributes: Record<string, string>,
  href: string
) {
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!el) {
    el = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => {
      el!.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }

  el.setAttribute("href", href);
}

export function Seo({ title, description, path = "/" }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = new URL(path, BASE_URL).toString();

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description" }, description);

    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      description
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);

    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      description
    );

    upsertLink('link[rel="canonical"]', { rel: "canonical" }, canonicalUrl);
  }, [title, description, path]);

  return null;
}