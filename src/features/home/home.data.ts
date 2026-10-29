import { CATEGORY_ORDER, modules, modulesInCategory, type ModuleCategory } from "../../modules/registry";
import { guideLessons, guidePath, guideTrackById, trackLessons } from "../guide/guide.meta";

export type LabCategory = Exclude<ModuleCategory, "guides">;

/// Areas shown as lab sections, in registry order (guides have their own section).
export const LAB_CATEGORIES = CATEGORY_ORDER.filter((c): c is LabCategory => c !== "guides");

export const LAB_COUNT = LAB_CATEGORIES.reduce((n, c) => n + modulesInCategory(c).length, 0);
export const LESSON_COUNT = guideLessons.length;
/// Modules with a trading-desk sub-page.
export const DESK_COUNT = modules.filter((m) => m.subNav?.some((s) => s.id === "desk")).length;

const firstLesson = trackLessons(guideTrackById("derivatives"))[0];

/// Where a first-time reader begins: the first lesson of the derivatives track.
export const START_LESSON = { path: guidePath(firstLesson.id), titleKey: firstLesson.titleKey };

/// The most recently released modules, newest first (ties keep registry order).
export const NEW_MODULES = modules
  .filter((m) => m.added)
  .sort((a, b) => b.added!.localeCompare(a.added!))
  .slice(0, 6);
