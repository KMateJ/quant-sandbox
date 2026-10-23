import { useI18n } from "../../../../i18n";
import { GUIDE_PANELS, type GuideAnchor } from "../../help/guide.data";
import { panelKey } from "../../help/guideCopy";

/// Minimal slice of the help controller the guide needs.
export type GuideHelp = { point: (anchor: GuideAnchor) => void };

/// One row per panel with a "Show me" button that outlines it on the desk.
export default function GuidePanels({ help }: { help: GuideHelp }) {
  const { t } = useI18n();
  return (
    <ul className="hdesk-guide-panels">
      {GUIDE_PANELS.map((anchor) => (
        <li key={anchor}>
          <p className="hdesk-help-p">{t(panelKey(anchor))}</p>
          <button type="button" className="hdesk-btn" onClick={() => help.point(anchor)}>
            {t("hdGuideShowMe")}
          </button>
        </li>
      ))}
    </ul>
  );
}
