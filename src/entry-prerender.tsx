import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import i18n from "i18next";
import AppProviders from "./AppProviders";
import { loadDeskCopy, loadLanguage } from "./languageLoader";
import { languageFromPath, languagePrefix } from "./languageRoutes";

/// Renders one route to HTML at build time, waiting for lazy routes to resolve, so the
/// page's text is in the HTML before any JavaScript runs. The browser hydrates it.
/// Rejects if any component threw, even one React recovered from with a client-render fallback.
/// The language comes from the URL; i18next is shared, so render pages one at a time.
export async function renderPage(url: string): Promise<string> {
  const language = languageFromPath(url);
  // Lazy routes resolve once per build, so the per-route desk-copy load would only fire for the first language.
  await Promise.all([loadLanguage(language), loadDeskCopy(language)]);
  await i18n.changeLanguage(language);
  const errors: unknown[] = [];
  const { prelude } = await prerender(
    <StaticRouter basename={languagePrefix(language) || undefined} location={url}>
      <AppProviders language={language}>
        <App />
      </AppProviders>
    </StaticRouter>,
    { onError: (error) => void errors.push(error) }
  );
  if (errors.length) throw errors[0];
  return new Response(prelude).text();
}
