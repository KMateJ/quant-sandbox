import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "./TopNavigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import SiteFooter from "./SiteFooter";
import { useActiveModule } from "./useActiveModule";
import { useStickyFit } from "./useStickyFit";

export default function AppShell({ children }: { children: ReactNode }) {
  const { activeCategory } = useActiveModule();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  useStickyFit();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="app-shell">
      <TopNavigation navOpen={navOpen} onToggleNav={() => setNavOpen((o) => !o)} />
      <div className="shell-body">
        {activeCategory && <Sidebar category={activeCategory} />}
        <main className="workspace-main">{children}</main>
      </div>
      <SiteFooter />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
}
