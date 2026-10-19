import type { ReactNode } from "react";
import { LanguageProvider, type Language } from "./i18n";
import { ThemeProvider } from "./theme";

/// App-wide providers shared by the browser entry and the build-time pre-renderer.
export default function AppProviders({ language, children }: { language: Language; children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider language={language}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
