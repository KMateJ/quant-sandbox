import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import { withDeskCopy } from "../../languageLoader";
import ImmunizationView from "./ImmunizationView";

const AlmDeskView = lazy(withDeskCopy(() => import("../alm-desk/AlmDeskView")));

/// Sub-pages of the Immunization module: the lab at the module root, the ALM desk at `/desk`.
export default function ImmunizationPages() {
  const { "*": page } = useParams();
  if (!page) return <ImmunizationView />;
  if (page === "desk") return <AlmDeskView />;
  return <Navigate to="/immunization" replace />;
}
