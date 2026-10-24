import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import PortfolioLabView from "./PortfolioLabView";

const PortfolioDeskView = lazy(withDeskCopy(() => import("../portfolio-desk/PortfolioDeskView")));

/// Sub-pages of the Portfolio Lab module: the lab at the module root, the portfolio manager desk at `/desk`.
export default function PortfolioLabPages() {
  const { "*": page } = useParams();
  if (!page) return <PortfolioLabView />;
  if (page === "desk") return <PortfolioDeskView />;
  return <Navigate to="/portfolio-lab" replace />;
}
