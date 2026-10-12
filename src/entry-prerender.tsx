import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import AppProviders from "./AppProviders";

/// Renders one route to HTML at build time, waiting for lazy routes to resolve, so the
/// page's text is in the HTML before any JavaScript runs. The browser hydrates it.
export async function renderPage(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <AppProviders>
        <App />
      </AppProviders>
    </StaticRouter>
  );
  return new Response(prelude).text();
}
