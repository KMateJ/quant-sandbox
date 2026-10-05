export type LocalizedText = {
  hu: string;
  en: string;
};

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
  title: LocalizedText;
  description: LocalizedText;
};

/// A learning track: an ordered sequence of lessons that build on each other.
export type GuideTrackMeta = {
  id: GuideTrackId;
  title: LocalizedText;
  description: LocalizedText;
  lessons: GuideId[];
};

/// Backwards-compatible alias used by sidebar/nav lookups.
export type GuideMeta = GuideLessonMeta;