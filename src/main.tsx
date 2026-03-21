import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App.tsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import { LanguageProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <Analytics />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);