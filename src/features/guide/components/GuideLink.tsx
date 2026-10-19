import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type GuideLinkProps = {
  to: string;
  children: ReactNode;
  newTab?: boolean;
  className?: string;
};

// Always a router <Link>, even in a new tab, so the href carries the language prefix (router basename).
export default function GuideLink({
  to,
  children,
  newTab = true,
  className,
}: GuideLinkProps) {
  return (
    <Link
      to={to}
      className={className}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
