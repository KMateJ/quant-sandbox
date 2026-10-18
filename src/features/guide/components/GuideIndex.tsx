import { PageHeader } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { GuideTrackMeta } from "../guide.types";
import GuideTrackSection from "./GuideTrackSection";

/// Landing page of one guide track: its ordered lessons and reading progress.
export default function GuideIndex({ track }: { track: GuideTrackMeta }) {
  const { t } = useI18n();

  return (
    <div className="page-shell">
      <div className="page-content guide-page">
        <PageHeader title={t("navGuide")} description={t("guideIndexSubtitle")} />
        <div className="guide-tracks">
          <GuideTrackSection track={track} />
        </div>
      </div>
    </div>
  );
}
