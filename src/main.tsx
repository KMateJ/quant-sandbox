import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/inter";
import App from "./App.tsx";
import AppProviders from "./AppProviders";
import "./styles/main.scss";
import "katex/dist/katex.min.css";

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

// Production pages arrive pre-rendered (see seo.plugin.ts): hydrate them; the dev server's empty root mounts fresh.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
