import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlackScholesView from "./features/black-scholes/BlackScholesView";
import DiffusionView from "./features/diffusion/DiffusionView";
import SectionCard from "./components/SectionCard";
import BinomialView from "./features/binomial/BinomialView";
import PayoffView from "./features/payoff-lab/PayofView";

function HomeView() {
  return (
    <SectionCard title="Mi ez az oldal?">
      <div className="text-block">
        <p>
          Ez az oldal segédanyag az <b>ELTE + Corvinus Biztosítási és pénzügyi matematika</b>
          szak hallgatóinak.
        </p>

        <p>
          A projekt karbantartása erősen
          <i> „van hozzá kedvem / nincs hozzá kedvem”</i> alapon működik.
          Ha szeretnéd, hogy több tartalom kerüljön bele, vagy esetleg hibát találsz, akkor
          keress meg vele nyugodtan.
        </p>
      </div>
    </SectionCard>
  );
}

export default function App() {
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
      <Navbar hidden={hideNav} />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/payoff" element={<PayoffView />} />
          <Route path="/binomial" element={<BinomialView />} />
          <Route path="/diffusion" element={<DiffusionView />} />
          <Route path="/black-scholes" element={<BlackScholesView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
