import { StrictMode } from "react";
import i18n from "i18next";
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
import { loadLanguage } from "./languageLoader";
import { languageFromPath, languagePrefix } from "./languageRoutes";

const root = document.getElementById("root")!;
// The URL is the source of truth for the language; its table must be in before hydration.
const language = languageFromPath(location.pathname);
await loadLanguage(language);
await i18n.changeLanguage(language);
const app = (
  <StrictMode>
    <BrowserRouter basename={languagePrefix(language) || undefined}>
      <AppProviders language={language}>
        <App />
        <Analytics />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);

// Production pages arrive pre-rendered in the URL's language (seo.plugin.ts), so the markup matches. The one
// exception is 404.html (English) served for an unknown `/hu/...` URL: render that fresh instead of hydrating.
if (root.hasChildNodes() && document.documentElement.lang === language) hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
