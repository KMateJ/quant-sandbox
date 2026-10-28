import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import MarketMakingView from "./MarketMakingView";

const MarketMakingDeskView = lazy(withDeskCopy(() => import("../market-making-desk/MarketMakingDeskView")));

/// Sub-pages of the Market Making module: the lab at the module root, the desk at `/desk`.
export default function MarketMakingPages() {
  const { "*": page } = useParams();
  if (!page) return <MarketMakingView />;
  if (page === "desk") return <MarketMakingDeskView />;
  return <Navigate to="/market-making" replace />;
}
