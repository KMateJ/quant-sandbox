import type { ReactNode } from "react";
import GuideLink from "./GuideLink";

type GuideTryItProps = {
  to: string;
  label: string;
  children: ReactNode;
};

/// Inline panel pointing the reader to the lab where the idea can be tried out.
export default function GuideTryIt({ to, label, children }: GuideTryItProps) {
  return (
    <aside className="guide-tryit">
      <span className="guide-tryit-label">{label}</span>
      <GuideLink to={to} className="guide-tryit-link">
        {children}
        <span aria-hidden="true"> →</span>
      </GuideLink>
    </aside>
  );
}
