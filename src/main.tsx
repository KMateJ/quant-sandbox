import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/source-serif-4/opsz-italic.css";
import App from "./App.tsx";
import AppProviders from "./AppProviders";
import "./styles/main.scss";
import "katex/dist/katex.min.css";
import { PRERENDER_LANGUAGE, savedLanguage } from "./languageStorage";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
        <Analytics />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);

// Production pages arrive pre-rendered in English (see seo.plugin.ts): hydrate them when the reader also reads English.
// In another language the markup can't match (lazy modules hydrate after any switch), so render fresh instead of
// letting React discard it with error #418; crawlers and the first paint still get the pre-rendered HTML.
const language = savedLanguage() ?? PRERENDER_LANGUAGE;
if (root.hasChildNodes() && language === PRERENDER_LANGUAGE) hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
