import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { Seo } from "./seo";
import { modules } from "./modules/registry";
import { PortfolioUniverseProvider } from "./features/portfolio-lab/PortfolioUniverseContext";
import { IntuitionProvider } from "./components/intuition";

/* =======================
   APP
======================= */

export default function App() {
  return (
    <PortfolioUniverseProvider>
      <AppShell>
        <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
          <Routes>
            {modules.map((m) => (
              <Route
                key={m.id}
                path={m.path}
                element={
                  <IntuitionProvider key={m.id} document={m.intuition}>
                    <Seo
                      title={m.seo.title}
                      description={m.seo.description}
                      path={m.path}
                    />
                    <m.Component />
                  </IntuitionProvider>
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
    </PortfolioUniverseProvider>
  );
}