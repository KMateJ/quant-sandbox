type AnchorRect = { left: number; right: number; top: number; bottom: number };
type Size = { width: number; height: number };

/// Place above the anchor when possible, then flip and clamp to the viewport.
export function positionTooltip(anchor: AnchorRect, bubble: Size, viewport: Size) {
  const inset = 8;
  const gap = 6;
  const maxLeft = Math.max(inset, viewport.width - bubble.width - inset);
  const maxTop = Math.max(inset, viewport.height - bubble.height - inset);
  const above = anchor.top - bubble.height - gap;
  const top = above >= inset ? above : anchor.bottom + gap;
  return {
    left: Math.max(inset, Math.min((anchor.left + anchor.right - bubble.width) / 2, maxLeft)),
    top: Math.max(inset, Math.min(top, maxTop)),
  };
}
