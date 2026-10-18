import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { moduleById } from "../../../modules/registry";

type GuideFigureProps = {
  title: string;
  /// Registry id of the lab the figure is a slice of; adds an "Open in …" link.
  labId?: string;
  children: ReactNode;
};

/// Interactive figure embedded in lesson text: a titled panel with an optional lab link.
export default function GuideFigure({ title, labId, children }: GuideFigureProps) {
  const { t } = useI18n();
  const lab = labId ? moduleById(labId) : undefined;

  return (
    <figure className="guide-figure">
      <figcaption className="guide-figure-head">
        <span className="guide-figure-title">{title}</span>
        {lab && (
          <Link className="guide-figure-lab" to={lab.path}>
            {t("guideFigureOpenLab", { lab: t(lab.navKey) })} →
          </Link>
        )}
      </figcaption>
      <div className="guide-figure-body">{children}</div>
    </figure>
  );
}
