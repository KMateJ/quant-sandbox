import type { NetStatus } from "./network.types";

const ORDER: NetStatus[] = ["ok", "stressed", "critical", "failed"];

/// One small glyph per status, drawn like the node itself so the legend explains shapes, not colours.
function Glyph({ status }: { status: NetStatus }) {
  return (
    <svg className={`net-glyph net-node is-${status}`} viewBox="-12 -12 24 24" width="18" height="18" aria-hidden="true">
      {(status === "stressed" || status === "critical") && <circle className="net-ring" r="10" />}
      <circle className="net-disc" r="6" />
      {status === "failed" && <path className="net-cross" d="M-3 -3L3 3M3 -3L-3 3" />}
    </svg>
  );
}

/// Status key under the graph; lists the statuses currently on screen, and only when one is not "ok".
export default function NetworkLegend({ present, words }: { present: ReadonlySet<NetStatus>; words: Record<NetStatus, string> }) {
  const shown = ORDER.filter((s) => present.has(s));
  if (shown.every((s) => s === "ok")) return null;
  return (
    <ul className="net-legend">
      {shown.map((s) => (
        <li key={s}><Glyph status={s} />{words[s]}</li>
      ))}
    </ul>
  );
}
