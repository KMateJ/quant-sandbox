import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import DeltaHedgingView from "./DeltaHedgingView";

const HedgingDeskView = lazy(withDeskCopy(() => import("../hedging-desk/HedgingDeskView")));

/// Sub-pages of the Delta hedging module: the lab at the module root, the trading desk at `/desk`.
export default function DeltaHedgingPages() {
  const { "*": page } = useParams();
  if (!page) return <DeltaHedgingView />;
  if (page === "desk") return <HedgingDeskView />;
  return <Navigate to="/delta-hedging" replace />;
}
