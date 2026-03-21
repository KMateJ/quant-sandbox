import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlackScholesView from "./features/black-scholes/BlackScholesView";
import DiffusionView from "./features/diffusion/DiffusionView";
import BinomialView from "./features/binomial/BinomialView";
import PayoffView from "./features/payoff-lab/PayofView";
import { HomeView } from "./features/home/HomeView";

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