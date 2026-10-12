import type { ReactNode } from "react";
import { LanguageProvider } from "./i18n";
import { ThemeProvider } from "./theme";

/// App-wide providers shared by the browser entry and the build-time pre-renderer.
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
