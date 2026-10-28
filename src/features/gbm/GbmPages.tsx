import { lazy } from "react";
import { Navigate, useParams } from "react-router-dom";
import GbmView from "./GbmView";

const DefinitionPage = lazy(() => import("./definition/DefinitionPage"));
const EulerPage = lazy(() => import("./sde/EulerPage"));
const MeanReversionPage = lazy(() => import("./sde/MeanReversionPage"));
const JumpsPage = lazy(() => import("./sde/JumpsPage"));
const CorrelatedPage = lazy(() => import("./sde/CorrelatedPage"));

const PAGES = {
  definition: DefinitionPage,
  "euler-maruyama": EulerPage,
  "mean-reversion": MeanReversionPage,
  jumps: JumpsPage,
  correlated: CorrelatedPage,
} as const;

/// Sub-pages of the GBM lab: the lab at the module root, the ABM-vs-GBM definition at `/definition`, SDE pages at `/euler-maruyama`, `/mean-reversion`, `/jumps`, `/correlated`.
export default function GbmPages() {
  const { "*": page } = useParams();
  if (!page) return <GbmView />;
  const Page = PAGES[page as keyof typeof PAGES];
  return Page ? <Page /> : <Navigate to="/gbm" replace />;
}
