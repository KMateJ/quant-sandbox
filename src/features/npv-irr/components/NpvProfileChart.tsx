import { ParentSize } from "@visx/responsive";
import NpvProfileInner from "./NpvProfileInner";
import type { NpvPoint } from "../npvIrr.types";

export type ProfileOverlay = { name: string; color: string; profile: NpvPoint[] };

export type NpvProfileChartProps = {
  profile: NpvPoint[];
  rate: number;
  onRateChange: (rate: number) => void;
  irr: number;
  npvAtRate: number;
  rateMax: number;
  overlays?: ProfileOverlay[];
  showIrr: boolean;
  showPiRegion: boolean;
  isMobile?: boolean;
  valueFormat: (v: number) => string;
  rateFormat: (v: number) => string;
  /// Predict-the-IRR mode: clicks and drags place the guess instead of moving the rate.
  predict?: { guess: number | null; onGuess: (rate: number) => void; label: string };
};

/// Responsive interactive NPV-vs-discount-rate chart with a draggable rate marker.
export default function NpvProfileChart(props: NpvProfileChartProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <NpvProfileInner {...props} width={width} height={height} />
          ) : null
        }
      </ParentSize>
    </div>
  );
}
