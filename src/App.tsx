import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlackScholesView from "./features/black-scholes/BlackScholesView";
import DiffusionView from "./features/diffusion/DiffusionView";
import SectionCard from "./components/SectionCard";
import BinomialView from "./features/binomial/BinomialView";
import PayoffView from "./features/payoff-lab/PayofView";
import { useI18n } from "./i18n";

function HomeView() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="view-main">
      <SectionCard title={t("homeTitle")}>
        <div className="text-block">
          <p>{t("homeIntro")}</p>
          <p>{t("homeBody")}</p>
        </div>
      </SectionCard>

      <SectionCard
        title={t("settingsTitle")}
        subtitle={t("settingsSubtitle")}
      >
        <div className="text-block">
          <div className="metric-switch" style={{ marginTop: 8 }}>
            <span style={{ alignSelf: "center", marginRight: 12 }}>
              {t("languageLabel")}
            </span>

            <button
              type="button"
              className={language === "hu" ? "metric-button active" : "metric-button"}
              onClick={() => setLanguage("hu")}
            >
              {t("languageHu")}
            </button>

            <button
              type="button"
              className={language === "en" ? "metric-button active" : "metric-button"}
              onClick={() => setLanguage("en")}
            >
              {t("languageEn")}
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
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