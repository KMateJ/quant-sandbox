type Props = { zoomIn: string; zoomOut: string; fit: string; group: string; onZoomIn: () => void; onZoomOut: () => void; onFit: () => void };

const ICON = { strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", stroke: "currentColor" } as const;

/// Zoom in / out / fit buttons floating over the network.
export default function NetworkZoom({ zoomIn, zoomOut, fit, group, onZoomIn, onZoomOut, onFit }: Props) {
  const buttons = [
    { label: zoomIn, onClick: onZoomIn, path: "M12 6v12M6 12h12" },
    { label: zoomOut, onClick: onZoomOut, path: "M6 12h12" },
    { label: fit, onClick: onFit, path: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" },
  ];
  return (
    <div className="net-zoom" role="group" aria-label={group}>
      {buttons.map((b) => (
        <button key={b.label} type="button" className="net-zoom-btn" aria-label={b.label} title={b.label} onClick={b.onClick}>
          <svg viewBox="0 0 24 24" aria-hidden="true" {...ICON}><path d={b.path} /></svg>
        </button>
      ))}
    </div>
  );
}
