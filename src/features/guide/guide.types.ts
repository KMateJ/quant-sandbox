export type GuideId = "instruments" | "risk-neutral" | "delta-hedging";

export type GuideMeta = {
  id: GuideId;
  title: {
    hu: string;
    en: string;
  };
  description: {
    hu: string;
    en: string;
  };
};