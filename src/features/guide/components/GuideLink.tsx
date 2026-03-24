import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type GuideLinkProps = {
  to: string;
  children: ReactNode;
  newTab?: boolean;
  className?: string;
};

export default function GuideLink({
  to,
  children,
  newTab = true,
  className,
}: GuideLinkProps) {
  if (newTab) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}