import { useI18n } from "../../../../i18n";

type Props = { onZoomIn: () => void; onZoomOut: () => void; onFit: () => void };

const ICON = { strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", stroke: "currentColor" } as const;

/// Zoom in / out / fit buttons floating over the graph canvas.
export default function GraphZoom({ onZoomIn, onZoomOut, onFit }: Props) {
  const { t } = useI18n();
  const buttons = [
    { label: t("ggZoomIn"), onClick: onZoomIn, path: "M12 6v12M6 12h12" },
    { label: t("ggZoomOut"), onClick: onZoomOut, path: "M6 12h12" },
    { label: t("ggFit"), onClick: onFit, path: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" },
  ];
  return (
    <div className="gg-zoom" role="group" aria-label={t("ggZoomGroup")}>
      {buttons.map((b) => (
        <button key={b.label} type="button" className="gg-zoom-btn" aria-label={b.label} title={b.label} onClick={b.onClick}>
          <svg viewBox="0 0 24 24" aria-hidden="true" {...ICON}>
            <path d={b.path} />
          </svg>
        </button>
      ))}
    </div>
  );
}
