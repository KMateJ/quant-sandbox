import type { ReactNode } from "react";
import GuideLink from "./GuideLink";

type GuideTryItProps = {
  to: string;
  label: string;
  children: ReactNode;
};

/// A single low-key pointer to a related interactive tool at the end of a lesson.
export default function GuideTryIt({ to, label, children }: GuideTryItProps) {
  return (
    <aside className="guide-tryit">
      <span className="guide-tryit-label">{label}</span>
      <GuideLink to={to}>{children}</GuideLink>
    </aside>
  );
}
