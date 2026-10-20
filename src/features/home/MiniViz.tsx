import type { ModuleViz } from "./home.types";
import { areaPath } from "./home.viz";

const GRID_Y = [16, 32, 48];

/// A lab's mini drawing; the last line and the `key` dot take the accent, the rest stay neutral.
export default function MiniViz({ viz, detailed = false }: { viz: ModuleViz; detailed?: boolean }) {
  const last = viz.lines.length - 1;

  return (
    <svg className="home-viz" viewBox="0 0 120 64" aria-hidden="true">
      {detailed && (
        <>
          {GRID_Y.map((y) => (
            <line key={y} x1={6} x2={114} y1={y} y2={y} className="home-viz-grid" vectorEffect="non-scaling-stroke" />
          ))}
          <path d="M6 4 V60 H114" className="home-viz-axis" fill="none" vectorEffect="non-scaling-stroke" />
        </>
      )}
      {viz.lines.map((line, i) => (
        <g key={i}>
          {line.area && <path d={areaPath(line.d)} className="home-viz-area" />}
          <path
            d={line.d}
            pathLength={1}
            fill="none"
            strokeWidth={line.w}
            strokeOpacity={line.o}
            vectorEffect="non-scaling-stroke"
            className={i === last ? "home-viz-line home-viz-key" : "home-viz-line"}
          />
        </g>
      ))}
      {viz.dots?.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={(d.key ? 2.6 : 2) * (detailed ? 0.45 : 1)} className={d.key ? "home-viz-dot home-viz-dot--key" : "home-viz-dot"} />
      ))}
    </svg>
  );
}
