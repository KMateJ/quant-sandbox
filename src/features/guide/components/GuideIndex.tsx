import { PageHeader } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { guideTracks } from "../guide.meta";
import GuideTrackSection from "./GuideTrackSection";

/// Guides landing page: every track with its ordered lessons and reading progress.
export default function GuideIndex() {
  const { t } = useI18n();

  return (
    <div className="page-shell">
      <div className="page-content guide-page">
        <PageHeader title={t("navGuide")} description={t("guideIndexSubtitle")} />
        <div className="guide-tracks">
          {guideTracks.map((track) => (
            <GuideTrackSection key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
