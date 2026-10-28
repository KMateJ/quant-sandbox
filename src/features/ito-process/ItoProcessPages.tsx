import { Navigate, useParams } from "react-router-dom";
import ItoProcessView from "./ItoProcessView";
import ItoIntegralPage from "./pages/ItoIntegralPage";
import ItosLemmaPage from "./pages/ItosLemmaPage";
import MartingalesPage from "./pages/MartingalesPage";
import GirsanovPage from "./pages/GirsanovPage";

/// Sub-pages of the Itô lab: the process lab at the module root, then the integral, lemma, martingales and Girsanov pages.
export default function ItoProcessPages() {
  const { "*": page } = useParams();
  if (!page) return <ItoProcessView />;
  if (page === "ito-integral") return <ItoIntegralPage />;
  if (page === "itos-lemma") return <ItosLemmaPage />;
  if (page === "martingales") return <MartingalesPage />;
  if (page === "girsanov") return <GirsanovPage />;
  return <Navigate to="/ito-process" replace />;
}
