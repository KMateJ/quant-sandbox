import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App.tsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/binomial.css";
import "./styles/payoff.css";
import "./styles/guide.css";
import { LanguageProvider } from "./i18n";
import { ThemeProvider } from "./theme";
import "katex/dist/katex.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <App />
          <Analytics />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);