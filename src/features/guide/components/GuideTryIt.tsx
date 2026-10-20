import type { ReactNode } from "react";
import { useI18n } from "../../../i18n";
import GuideLink from "./GuideLink";

type GuideTryItProps = {
  to: string;
  /// Defaults to the localised "Try it".
  label?: string;
  children: ReactNode;
};

/// Inline panel pointing the reader to the lab where the idea can be tried out.
export default function GuideTryIt({ to, label, children }: GuideTryItProps) {
  const { t } = useI18n();
  return (
    <aside className="guide-tryit">
      <span className="guide-tryit-label">{label ?? t("guideTryIt")}</span>
      <GuideLink to={to} className="guide-tryit-link">
        {children}
      </GuideLink>
    </aside>
  );
}
