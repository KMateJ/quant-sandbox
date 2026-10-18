import { useI18n } from "../../../../i18n";

/// Legend with real samples of each edge style and of the "read" ring, drawn like the canvas draws them.
export default function GraphLegend({ showLabs }: { showLabs: boolean }) {
  const { t } = useI18n();
  const line = (kind: string, arrow = false) => (
    <svg className="gg-legend-sample" viewBox="0 0 28 10" aria-hidden="true">
      <path className={`gg-edge gg-edge--${kind}`} d="M2 5H24" markerEnd={arrow ? "url(#gg-arrow)" : undefined} />
    </svg>
  );
  return (
    <ul className="gg-legend">
      <li>{line("citation", true)}{t("ggLegendCitation")}</li>
      <li>{line("sequence")}{t("ggLegendSequence")}</li>
      {showLabs && <li>{line("practice")}{t("ggLegendPractice")}</li>}
      <li>
        <svg className="gg-legend-sample gg-legend-sample--node" viewBox="0 0 16 16" aria-hidden="true">
          <circle className="gg-read-ring" cx="8" cy="8" r="6.5" />
          <circle cx="8" cy="8" r="4" fill="var(--muted)" />
        </svg>
        {t("ggLegendRead")}
      </li>
    </ul>
  );
}
