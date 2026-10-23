import { useEffect, useState } from "react";
import type { HeroPick } from "./home.types";
import HomeCallsFigure from "./HomeCallsFigure";
import HomeFanFigure from "./HomeFanFigure";
import { HERO_FAN } from "./home.fan.math";

const SSR_PICK: HeroPick = { variant: "fan", seed: HERO_FAN.seed };

/// Picks a hero figure and seed per visit; the first render stays fixed so prerendered HTML hydrates cleanly.
export default function HomeHeroFigure() {
  const [pick, setPick] = useState(SSR_PICK);
  useEffect(() => {
    setPick({ variant: Math.random() < 0.65 ? "fan" : "calls", seed: (Math.random() * 2 ** 32) >>> 0 });
  }, []);

  return pick.variant === "fan" ? (
    <HomeFanFigure key={pick.seed} seed={pick.seed} />
  ) : (
    <HomeCallsFigure key={pick.seed} sigma={0.2 + (pick.seed % 21) / 100} />
  );
}
