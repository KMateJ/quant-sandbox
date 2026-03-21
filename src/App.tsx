import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import BlackScholesView from "./features/black-scholes/BlackScholesView";
import DiffusionView from "./features/diffusion/DiffusionView";
import BinomialView from "./features/binomial/BinomialView";
import PayoffView from "./features/payoff-lab/PayofView";
import { HomeView } from "./features/home/HomeView";

import { Seo } from "./seo";
import HestonView from "./features/heston/HestonView";

/* =======================
   SEO WRAPPED PAGES
======================= */

function HomePage() {
  return (
    <>
      <Seo
        title="Home"
        description="Interactive study aid for ELTE and Corvinus Insurance and Financial Mathematics students."
        path="/"
      />
      <HomeView />
    </>
  );
}

function PayoffPage() {
  return (
    <>
      <Seo
        title="Payoff Lab"
        description="Interactive payoff and profit diagrams for options, forwards, stock and synthetic strategies."
        path="/payoff"
      />
      <PayoffView />
    </>
  );
}

function BinomialPage() {
  return (
    <>
      <Seo
        title="Binomial Tree Model"
        description="Interactive binomial pricing tree for option pricing, risk-neutral probability and replicating portfolios."
        path="/binomial"
      />
      <BinomialView />
    </>
  );
}

function DiffusionPage() {
  return (
    <>
      <Seo
        title="Diffusion Equation"
        description="Interactive visualization of the diffusion equation with parameter controls and time evolution."
        path="/diffusion"
      />
      <DiffusionView />
    </>
  );
}

function BlackScholesPage() {
  return (
    <>
      <Seo
        title="Black–Scholes Model"
        description="Interactive Black–Scholes option pricing and Greeks visualization across stock prices and maturities."
        path="/black-scholes"
      />
      <BlackScholesView />
    </>
  );
}

function HestonPage() {
  return (
    <>
      <Seo
        title="Heston Model"
        description="Interactive Heston stochastic volatility model with simulated paths and parameter intuition."
        path="/heston"
      />
      <HestonView />
    </>
  );
}

/* =======================
   APP
======================= */

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
          <Route path="/" element={<HomePage />} />
          <Route path="/payoff" element={<PayoffPage />} />
          <Route path="/binomial" element={<BinomialPage />} />
          <Route path="/diffusion" element={<DiffusionPage />} />
          <Route path="/black-scholes" element={<BlackScholesPage />} />
          <Route path="/heston" element={<HestonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}