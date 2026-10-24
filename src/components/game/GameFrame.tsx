import type { ReactNode, Ref } from "react";
import { useI18n } from "../../i18n";

type FrameProps = { deskClass: string; expanded: boolean; demo: boolean; rootRef: Ref<HTMLDivElement>; children: ReactNode };

/// Root of every desk: the `.gdesk` terminal theme plus the desk's own class and view modifiers.
export function GameFrame({ deskClass, expanded, demo, rootRef, children }: FrameProps) {
  const cls = ["gdesk", deskClass, expanded && "gdesk--expanded", demo && "gdesk--demo"].filter(Boolean).join(" ");
  return <div className={cls} ref={rootRef}>{children}</div>;
}

type CommandBarProps = { ticker: string; code: string; title: string; clock: string; demo: boolean; actions?: ReactNode };

/// Amber command bar: fictional ticker and function code, page title, simulation clock, view actions.
export function CommandBar({ ticker, code, title, clock, demo, actions }: CommandBarProps) {
  const { t } = useI18n();
  return (
    <div className="gdesk-cmd">
      <span className="gdesk-cmd-ticker">{ticker}</span>
      <span className="gdesk-cmd-code">{code}</span>
      <h1 className="gdesk-cmd-title">{title}</h1>
      <span className="gdesk-cmd-clock">{clock}</span>
      {demo && <span className="gdesk-cmd-badge">{t("gkDemoBadge")}</span>}
      {actions}
    </div>
  );
}

export type QuoteCell = { label: string; value: string; tone?: "up" | "down" };

/// Row of labelled live numbers under the command bar.
export function QuoteStrip({ id, cells }: { id: string; cells: QuoteCell[] }) {
  return (
    <dl className="gdesk-quotes" id={id}>
      {cells.map((cell) => (
        <div key={cell.label} className="gdesk-quote">
          <dt className="gdesk-label">{cell.label}</dt>
          <dd className={["gdesk-num", cell.tone && `gdesk-${cell.tone}`].filter(Boolean).join(" ")}>{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/// Three-column panel grid (left / centre / right) that restacks on narrow screens.
export function DeskGrid({ left, centre, right }: { left: ReactNode; centre: ReactNode; right: ReactNode }) {
  return (
    <div className="gdesk-grid">
      <div className="gdesk-col gdesk-col--left">{left}</div>
      <div className="gdesk-col gdesk-col--centre">{centre}</div>
      <div className="gdesk-col gdesk-col--right">{right}</div>
    </div>
  );
}

/// Two panels side by side once the centre column is wide enough.
export function DeskPair({ children }: { children: ReactNode }) {
  return <div className="gdesk-pair">{children}</div>;
}
