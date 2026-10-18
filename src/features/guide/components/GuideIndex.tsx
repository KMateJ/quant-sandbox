import { PageHeader } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { GuideTrackMeta } from "../guide.types";
import GuideTrackChecks from "./GuideTrackChecks";
import GuideTrackSection from "./GuideTrackSection";

/// Landing page of one guide track: its ordered lessons, reading progress, and the track's "Check yourself" questions.
export default function GuideIndex({ track }: { track: GuideTrackMeta }) {
  const { t } = useI18n();

  return (
    <div className="page-shell">
      <div className="page-content guide-page">
        <PageHeader title={t("navGuide")} description={t("guideIndexSubtitle")} />
        <div className="guide-tracks">
          <GuideTrackSection track={track} />
        </div>
        <GuideTrackChecks track={track} />
      </div>
    </div>
  );
}
