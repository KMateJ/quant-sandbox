import { useEffect } from "react";
import type { PlotFrame } from "../../../components/charts";

/// Reports a chart's plot geometry after each render (the `layer` callback is the only place it is exposed).
export default function FrameSpy({ frame, onFrame }: { frame: PlotFrame; onFrame: (f: PlotFrame) => void }) {
  useEffect(() => onFrame(frame), [frame, onFrame]);
  return null;
}
