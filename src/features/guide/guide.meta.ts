import type { GuideId, GuideLessonLocation, GuideLessonMeta, GuideTrackMeta } from "./guide.types";

/// Route of the guides; each lesson lives at `${GUIDE_PATH}/<lesson id>`.
export const GUIDE_PATH = "/guide";

export const guidePath = (id: GuideId) => `${GUIDE_PATH}/${id}`;

/// Ordered lessons. Each belongs to a track and builds on the previous one.
export const guideLessons: GuideLessonMeta[] = [
  {
    id: "instruments",
    track: "derivatives",
    titleKey: "guideInstrumentsTitle",
    descKey: "guideInstrumentsDesc",
    labs: ["payoff"],
  },
  {
    id: "no-arbitrage",
    track: "derivatives",
    titleKey: "guideNoArbitrageTitle",
    descKey: "guideNoArbitrageDesc",
    labs: ["payoff"],
  },
  {
    id: "risk-neutral",
    track: "derivatives",
    titleKey: "guideRiskNeutralTitle",
    descKey: "guideRiskNeutralDesc",
    labs: ["binomial", "payoff"],
  },
  {
    id: "delta-hedging",
    track: "derivatives",
    titleKey: "guideDeltaHedgingTitle",
    descKey: "guideDeltaHedgingDesc",
    labs: ["delta-hedging", "binomial"],
  },
  {
    id: "toward-black-scholes",
    track: "derivatives",
    titleKey: "guideTowardBlackScholesTitle",
    descKey: "guideTowardBlackScholesDesc",
    labs: ["black-scholes", "gbm"],
  },
];

/// Tracks group lessons into a coherent, ground-up sequence.
export const guideTracks: GuideTrackMeta[] = [
  {
    id: "derivatives",
    titleKey: "guideTrackDerivativesTitle",
    descKey: "guideTrackDerivativesDesc",
    lessons: ["instruments", "no-arbitrage", "risk-neutral", "delta-hedging", "toward-black-scholes"],
  },
];

export function isGuideId(value: string | null | undefined): value is GuideId {
  return guideLessons.some((lesson) => lesson.id === value);
}

/// Lessons of a track, in reading order.
export function trackLessons(track: GuideTrackMeta): GuideLessonMeta[] {
  return track.lessons
    .map((id) => guideLessons.find((l) => l.id === id))
    .filter((l): l is GuideLessonMeta => Boolean(l));
}

/// Locates a lesson within its track, or `undefined` for an unknown id.
export function findGuideLesson(id: string | undefined): GuideLessonLocation | undefined {
  const lesson = guideLessons.find((l) => l.id === id);
  const track = lesson && guideTracks.find((t) => t.id === lesson.track);
  if (!lesson || !track) return undefined;
  const ordered = trackLessons(track);
  const index = ordered.indexOf(lesson);
  return { lesson, track, index, previous: ordered[index - 1], next: ordered[index + 1] };
}

/// Sidebar sub-navigation (and pre-rendered SEO pages) for the guide module.
export const guideNavItems = () =>
  guideTracks.flatMap(trackLessons).map((lesson, i) => ({
    id: lesson.id,
    labelKey: lesson.titleKey,
    descKey: lesson.descKey,
    prefix: String(i + 1).padStart(2, "0"),
    to: guidePath(lesson.id),
  }));
