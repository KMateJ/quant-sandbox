import InfoTooltip from "../ui/InfoTooltip";
import { useI18n } from "../../i18n";
import { useIntuition } from "./IntuitionContext";

type Props = { sectionId?: string; tooltip?: string; variant?: "icon" | "button" };

/// Omit sectionId to open the document at the top.
export default function IntuitionTrigger({ sectionId, tooltip, variant = "icon" }: Props) {
  const ctx = useIntuition();
  const { t } = useI18n();
  if (!ctx) throw new Error("IntuitionTrigger must be inside a document's IntuitionProvider.");
  const section = sectionId ? ctx.document.sections.find((s) => s.id === sectionId) : undefined;
  if (sectionId && !section) throw new Error(`Unknown intuition section: ${sectionId}`);
  const title = t(section?.titleKey ?? ctx.document.titleKey);
  const label = `${t("intuitionTitle")}: ${title}`;
  const common = {
    "aria-label": label,
    "aria-controls": ctx.panelId,
    "aria-expanded": ctx.open,
    "aria-haspopup": "dialog" as const,
    onClick: () => ctx.show(sectionId),
  };
  if (variant === "button") {
    return <button type="button" className="intuition-button" {...common}>{t("intuitionTitle")}</button>;
  }
  const summary = tooltip ?? (section?.summaryKey ? t(section.summaryKey) : title);
  return <InfoTooltip content={`${summary} ${t("intuitionClick")}`} label={label} {...common} />;
}
