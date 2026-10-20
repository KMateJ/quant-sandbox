import { Link } from "react-router-dom";
import { useI18n, type TranslationKey } from "../../i18n";
import type { ModuleStatus } from "../../modules/registry";
import type { ModuleViz } from "./home.types";
import MiniViz from "./MiniViz";

const STATUS_KEY: Partial<Record<ModuleStatus, TranslationKey>> = { beta: "statusBeta", planned: "statusPlanned" };

type Props = {
  code: string;
  to: string;
  name: string;
  desc: string;
  viz: ModuleViz;
  status?: ModuleStatus;
  featured?: boolean;
};

/// One cell of the labs bento: code, status, mini drawing, name and one-line description.
export default function HomeLabTile({ code, to, name, desc, viz, status, featured = false }: Props) {
  const { t } = useI18n();
  const statusKey = status ? STATUS_KEY[status] : undefined;

  return (
    <Link to={to} className={featured ? "home-tile home-tile--featured" : "home-tile"}>
      <span className="home-tile-meta">
        <span>{code}</span>
        {statusKey && <span className="home-tile-status">{t(statusKey)}</span>}
      </span>
      <MiniViz viz={viz} detailed={featured} />
      <span className="home-tile-name">{name}</span>
      <span className="home-tile-desc">{desc}</span>
    </Link>
  );
}
