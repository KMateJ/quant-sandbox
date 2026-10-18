import { useEffect, useState, type RefObject } from "react";
import type { GuideHeading } from "./guide.types";
import { activeHeadingIndex, headingId, readingMinutes, tocLabel } from "./guide.toc";

/// Heading text as displayed: KaTeX also renders hidden MathML and the TeX source, which must not reach the label.
function visibleText(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".katex-mathml").forEach((n) => n.remove());
  return clone.textContent ?? "";
}

/// Distance below the viewport top (past the sticky top nav) at which a section counts as current.
const ACTIVE_OFFSET = 120;

type GuideToc = { headings: GuideHeading[]; activeId: string | null; minutes: number };

/// Reads the lesson's section headings from the rendered body, gives them anchor ids,
/// estimates reading time and tracks which section is in view. Re-runs when `contentKey` changes.
export function useGuideToc(bodyRef: RefObject<HTMLElement | null>, contentKey: string): GuideToc {
  const [toc, setToc] = useState<GuideToc>({ headings: [], activeId: null, minutes: 1 });

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const els = Array.from(body.querySelectorAll<HTMLHeadingElement>("h2"));
    const headings = els.map((el, i) => {
      el.id = headingId(i);
      return { id: el.id, label: tocLabel(visibleText(el)) };
    });
    const minutes = readingMinutes(body.textContent);

    let frame = 0;
    const update = () => {
      frame = 0;
      const i = activeHeadingIndex(els.map((el) => el.getBoundingClientRect().top), ACTIVE_OFFSET);
      setToc({ headings, minutes, activeId: headings[i]?.id ?? null });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Deep links (#s-3) need a scroll once the ids exist.
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [bodyRef, contentKey]);

  return toc;
}
