/// True when the event target is a text-entry element, so global shortcuts should stay out of the way.
export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
