// Import-free so the build plugin (tsconfig.node) can share it without pulling in the app.

export type SeoLink = { path: string; title: string };

export type SeoPage = {
  /// Language of the page's text; `path` already carries its URL prefix (`/hu/...`).
  language: string;
  path: string;
  title: string;
  description: string;
  /// The module page a sub-page (lesson) belongs to, for breadcrumbs.
  parent?: SeoLink;
  /// A course page's lessons, for structured data.
  lessons?: SeoLink[];
  /// The FAQ shown on the module page (not on its lessons), for FAQPage markup.
  faq?: { question: string; answer: string }[];
  /// The module's top-nav category; `path` is where its tab links (the first module in it).
  category?: { key: string; title: string; path: string };
};

/// A Markdown twin of an HTML page, written to `<path>.md`.
export type MarkdownPage = { path: string; markdown: string };

/// Text of one preview image; `path` is the page (empty for the site-wide fallback).
export type OgText = { path: string; title: string; kind: string; section?: string };
