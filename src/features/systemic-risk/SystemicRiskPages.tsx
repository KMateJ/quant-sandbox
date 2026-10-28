import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";

const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const ShocksPage = lazy(() => import("./pages/ShocksPage"));
const EpisodesPage = lazy(() => import("./pages/EpisodesPage"));

/// Sub-pages of the Systemic Risk module: the network explorer at the module root, shocks and episodes beneath it.
export default function SystemicRiskPages() {
  const { "*": page } = useParams();
  if (!page) return <NetworkPage />;
  if (page === "shocks") return <ShocksPage />;
  if (page === "episodes") return <EpisodesPage />;
  return <Navigate to="/systemic-risk" replace />;
}
