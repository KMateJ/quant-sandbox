import { useState, type ReactNode } from "react";
import { useI18n } from "../../../../i18n";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import { MISSIONS } from "../../engine/missions.data";
import {
  GUIDE_KEYS, GUIDE_MISTAKES, GUIDE_SECTIONS, GUIDE_TERMS, type GuideSection,
} from "../../help/guide.data";
import {
  keyKey, mistakeBodyKey, mistakeTitleKey, termDefKey, termKey,
} from "../../help/guideCopy";
import { missionTitleKey } from "../../missionCopy";
import GuideList from "./GuideList";
import GuidePanels, { type GuideHelp } from "./GuidePanels";
import GuidePlaybook from "./GuidePlaybook";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Guide tab: playbook of the current mission, panel guide, keys, mistakes, glossary, other missions.
export default function GuideTab({ desk, help }: { desk: HedgingDeskModel; help: GuideHelp }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<GuideSection | null>("mission");
  const id = desk.mission.id;

  const heads: Record<GuideSection, string> = {
    mission: t("hdGuideThisMission", { id }),
    panels: t("hdGuidePanels"),
    keys: t("hdGuideKeys"),
    mistakes: t("hdGuideMistakes"),
    terms: t("hdGuideTerms"),
    others: t("hdGuideOtherMissions"),
  };
  const bodies: Record<GuideSection, ReactNode> = {
    mission: <GuidePlaybook missionId={id} desk={desk} />,
    panels: <GuidePanels help={help} />,
    keys: <GuideList items={GUIDE_KEYS.map((c) => ({ term: c, text: t(keyKey(c)) }))} />,
    mistakes: (
      <GuideList items={range(GUIDE_MISTAKES).map((n) => ({ term: t(mistakeTitleKey(n)), text: t(mistakeBodyKey(n)) }))} />
    ),
    terms: <GuideList items={GUIDE_TERMS.map((x) => ({ term: t(termKey(x)), text: t(termDefKey(x)) }))} />,
    others: (
      <>
        {MISSIONS.filter((m) => m.id !== id).map((m) => (
          <section key={m.id}>
            <h4 className="hdesk-guide-sub">{t("hdGuideOtherTitle", { id: m.id, title: t(missionTitleKey(m.id)) })}</h4>
            <GuidePlaybook missionId={m.id} />
          </section>
        ))}
      </>
    ),
  };

  return (
    <div className="hdesk-guide">
      {GUIDE_SECTIONS.map((s) => (
        <details
          key={s}
          className="hdesk-help-section"
          open={open === s}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            if (isOpen) setOpen(s);
            else setOpen((cur) => (cur === s ? null : cur));
          }}
        >
          <summary className="hdesk-help-h">{heads[s]}</summary>
          {bodies[s]}
        </details>
      ))}
    </div>
  );
}
