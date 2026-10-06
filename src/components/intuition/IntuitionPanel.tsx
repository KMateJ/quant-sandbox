import { useEffect, useRef } from "react";
import { BlockMath } from "react-katex";
import HelpDrawer from "../ui/HelpDrawer";
import { useI18n } from "../../i18n";
import { useIntuition } from "./IntuitionContext";

export default function IntuitionPanel() {
  const ctx = useIntuition();
  const { t } = useI18n();
  const body = useRef<HTMLDivElement>(null);
  const sections = useRef(new Map<string, HTMLElement>());
  const previousOpen = useRef(false);

  useEffect(() => {
    if (!ctx?.open) {
      previousOpen.current = false;
      return;
    }
    const container = body.current;
    const target = ctx.sectionId ? sections.current.get(ctx.sectionId) : undefined;
    const smooth = previousOpen.current && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    previousOpen.current = true;
    container?.scrollTo({
      top: target && container ? target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 16 : 0,
      behavior: smooth ? "smooth" : "instant",
    });
    const focus = target?.querySelector<HTMLElement>("h3") ?? container?.closest("aside")?.querySelector<HTMLElement>("button");
    focus?.focus({ preventScroll: true });
    sections.current.forEach((section) => section.getAnimations().forEach((animation) => animation.cancel()));
    target?.animate([
      { backgroundColor: "var(--intuition-highlight)", borderLeftColor: "var(--primary)" },
      { backgroundColor: "transparent", borderLeftColor: "transparent" },
    ], { duration: smooth || !matchMedia("(prefers-reduced-motion: reduce)").matches ? 2200 : 0, easing: "ease-out" });
  }, [ctx?.open, ctx?.sectionId, ctx?.request]);

  if (!ctx) return null;
  const active = ctx.document.sections.find((s) => s.id === ctx.sectionId);
  return (
    <HelpDrawer
      open={ctx.open}
      onClose={ctx.close}
      title={t("intuitionTitle")}
      context={t(active?.titleKey ?? ctx.document.titleKey)}
      closeLabel={t("intuitionClose")}
      id={ctx.panelId}
      bodyRef={body}
      returnFocusRef={ctx.returnFocusRef}
    >
      {ctx.document.sections.map((section) => (
        <section
          key={section.id}
          id={`${ctx.panelId}-${section.id}`}
          data-intuition-section={section.id}
          className="intuition-section"
          ref={(element) => {
            if (element) sections.current.set(section.id, element);
            else sections.current.delete(section.id);
          }}
        >
          <h3 tabIndex={-1}>{t(section.titleKey)}</h3>
          {section.summaryKey && <p className="intuition-summary">{t(section.summaryKey)}</p>}
          {section.bodyKey && <p>{t(section.bodyKey)}</p>}
          {section.formula && <BlockMath math={section.formula} />}
          {section.exampleKey && <p className="intuition-example">{t(section.exampleKey)}</p>}
          {section.content}
        </section>
      ))}
    </HelpDrawer>
  );
}
