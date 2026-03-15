import { useEffect, useState } from "react";
import Navbar, { type PageKey } from "./components/Navbar";
import BlackScholesView from "./features/black-scholes/BlackScholesView";
import DiffusionView from "./features/diffusion/DiffusionView";
import SectionCard from "./components/SectionCard";
import BinomialView from "./features/binomial/BinomialView";

export default function App() {
  const [page, setPage] = useState<PageKey>("black-scholes");
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
  
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 640;
      const currentScrollY = window.scrollY;
  
      if (!isMobile) {
        setHideNav(false);
        lastScrollY = currentScrollY;
        return;
      }
  
      if (Math.abs(currentScrollY - lastScrollY) < 6) return;
  
      if (currentScrollY <= 10) {
        setHideNav(false);
      } else if (currentScrollY > lastScrollY) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
  
      lastScrollY = currentScrollY;
    };
  
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setHideNav(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar current={page} onNavigate={setPage} hidden={hideNav} />

      <main className="page-container">
        {page === "home" && (
            <SectionCard title="Mi ez az oldal?" subtitle="Rövid leírás">
              <div className="text-block">
                <p>
                  Ez az oldal segédanyag az <b>ELTE + Corvinus Biztosítási és pénzügyi matematika</b>
                  szak hallgatóinak. 
                </p>

                <p>
                  A projekt karbantartása erősen
                  <i> „van hozzá kedvem / nincs hozzá kedvem”</i> alapon működik.
                  Ha szeretnéd, hogy több tartalom kerüljön bele, akkor
                  keress meg vele.
                </p>
              </div>
            </SectionCard>
        )}

        {page === "diffusion" && <DiffusionView />}

        {page === "black-scholes" && <BlackScholesView />}

        {page === "binomial" && <BinomialView />}
      </main>
    </div>
  );
}