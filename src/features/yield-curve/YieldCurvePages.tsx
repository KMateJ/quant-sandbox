import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import YieldCurveView from "./YieldCurveView";

const RatesDeskView = lazy(withDeskCopy(() => import("../rates-desk/RatesDeskView")));

/// Sub-pages of the Yield curve module: the lab at the module root, the rates desk at `/desk`.
export default function YieldCurvePages() {
  const { "*": page } = useParams();
  if (!page) return <YieldCurveView />;
  if (page === "desk") return <RatesDeskView />;
  return <Navigate to="/yield-curve" replace />;
}
