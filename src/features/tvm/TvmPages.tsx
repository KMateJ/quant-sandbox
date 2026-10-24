import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import TvmView from "./TvmView";

const RetirementDeskView = lazy(withDeskCopy(() => import("../retirement-desk/RetirementDeskView")));

/// Sub-pages of the TVM module: the lab at the module root, the retirement desk at `/desk`.
export default function TvmPages() {
  const { "*": page } = useParams();
  if (!page) return <TvmView />;
  if (page === "desk") return <RetirementDeskView />;
  return <Navigate to="/tvm" replace />;
}
