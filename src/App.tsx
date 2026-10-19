import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/layout/NotFound";
import AppShell from "./components/layout/AppShell";
import { RouteSeo } from "./seo";
import { modules, redirects } from "./modules/registry";
import { PortfolioUniverseProvider } from "./features/portfolio-lab/PortfolioUniverseContext";
import { IntuitionProvider } from "./components/intuition";
import ModuleAboutSection from "./components/layout/ModuleAboutSection";

/* =======================
   APP
======================= */

export default function App() {
  return (
    <PortfolioUniverseProvider>
      <AppShell>
        <RouteSeo />
        <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
          <Routes>
            {modules.map((m) => (
              <Route
                key={m.id}
                path={m.subNav ? `${m.path}/*` : m.path}
                element={
                  <IntuitionProvider key={m.id} document={m.intuition}>
                    <m.Component />
                    {m.about && <ModuleAboutSection about={m.about} path={m.path} moduleId={m.id} relatedGuides={m.relatedGuides} />}
                  </IntuitionProvider>
                }
              />
            ))}
            {redirects.map((r) => (
              <Route key={r.from} path={r.from} element={<Navigate to={r.to} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppShell>
    </PortfolioUniverseProvider>
  );
}