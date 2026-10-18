import type { TranslationKey } from "../../i18n";

export type GuideTrackId = "derivatives";

export type GuideId =
  | "instruments"
  | "no-arbitrage"
  | "risk-neutral"
  | "delta-hedging"
  | "toward-black-scholes";

/// A single ordered lesson inside a track.
export type GuideLessonMeta = {
  id: GuideId;
  track: GuideTrackId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  /// Registry module ids of the labs the lesson practises.
  labs: string[];
};

/// A learning track: an ordered sequence of lessons that build on each other.
export type GuideTrackMeta = {
  id: GuideTrackId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  lessons: GuideId[];
};

/// Where a lesson sits in its track, with its neighbours.
export type GuideLessonLocation = {
  lesson: GuideLessonMeta;
  track: GuideTrackMeta;
  index: number;
  previous?: GuideLessonMeta;
  next?: GuideLessonMeta;
};

/// One entry of a lesson's table of contents.
export type GuideHeading = {
  id: string;
  label: string;
};
