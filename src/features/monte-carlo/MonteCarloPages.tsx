import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import MonteCarloView from "./MonteCarloView";

const McVarianceReductionView = lazy(() => import("./McVarianceReductionView"));
const McFeynmanKacView = lazy(() => import("./McFeynmanKacView"));

/// Sub-pages of the Monte Carlo module: the lab at the module root, then variance reduction and Feynman–Kac.
export default function MonteCarloPages() {
  const { "*": page } = useParams();
  if (!page) return <MonteCarloView />;
  if (page === "variance-reduction") return <McVarianceReductionView />;
  if (page === "feynman-kac") return <McFeynmanKacView />;
  return <Navigate to="/monte-carlo" replace />;
}
