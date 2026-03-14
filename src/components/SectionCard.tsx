import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  headerLeft?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  subtitle,
  headerLeft,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`card ${className}`}>
      <div className="section-header">
        <div className="section-header-left">{headerLeft}</div>
        <div className="section-header-center">
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>
        <div className="section-header-right" />
      </div>

      {children}
    </section>
  );
}