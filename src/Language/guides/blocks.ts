import type { GuideBlock, GuideFigureId } from "../../features/guide/guide.content.types";

// Terse constructors so lesson files read like text.

export const p = (text: string): GuideBlock => ({ kind: "p", text });
export const h = (text: string): GuideBlock => ({ kind: "h", text });
export const eq = (tex: string): GuideBlock => ({ kind: "math", tex });
export const list = (...items: string[]): GuideBlock => ({ kind: "list", items });
export const steps = (...items: string[]): GuideBlock => ({ kind: "list", items, ordered: true });
export const note = (text: string): GuideBlock => ({ kind: "note", text });
export const figure = (id: GuideFigureId): GuideBlock => ({ kind: "figure", id });
export const lab = (to: string, text: string): GuideBlock => ({ kind: "lab", to, text });
