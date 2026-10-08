import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SurfaceMesh from "./SurfaceMesh";
import SurfaceAxes from "./SurfaceAxes";
import type { SurfaceData } from "./surface3d.geometry";

export interface Surface3DProps {
  data: SurfaceData;
  xLabel: string;
  zLabel: string;
  valueLabel: string;
  formatX?: (value: number) => string;
  formatZ?: (value: number) => string;
  formatValue?: (value: number) => string;
}

const defaultFormat = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

/// Rotatable, zoomable 3D surface of a scalar field over a two-parameter grid.
export default function Surface3D({
  data,
  xLabel,
  zLabel,
  valueLabel,
  formatX = defaultFormat,
  formatZ = defaultFormat,
  formatValue = defaultFormat,
}: Surface3DProps) {
  // r3f's own ResizeObserver can miss the initial size when the canvas mounts
  // in a freshly-revealed container (tab panel / lazy Suspense), leaving it at
  // the 300×150 default. We observe the container ourselves and, once it has a
  // real size, nudge r3f with a resize event so it measures correctly.
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setReady(el.clientWidth > 0 && el.clientHeight > 0);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Once the Canvas has mounted into a sized container, nudge r3f to re-measure.
  // Its own observer can miss the initial size on a freshly-revealed tab panel;
  // the delayed dispatches land after r3f has attached its resize listener.
  useEffect(() => {
    if (!ready) return;
    const timers = [0, 60, 200, 400].map((d) =>
      window.setTimeout(() => window.dispatchEvent(new Event("resize")), d)
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [ready]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {ready && (
        <SurfaceCanvas
          data={data}
          xLabel={xLabel}
          zLabel={zLabel}
          valueLabel={valueLabel}
          formatX={formatX}
          formatZ={formatZ}
          formatValue={formatValue}
        />
      )}
    </div>
  );
}

function SurfaceCanvas({
  data,
  xLabel,
  zLabel,
  valueLabel,
  formatX,
  formatZ,
  formatValue,
}: Required<Omit<Surface3DProps, "data">> & { data: SurfaceData }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ position: [2.4, 2.1, 2.6], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#0b1120"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />

      <group position={[0, -0.45, 0]} scale={1.18}>
        <SurfaceMesh data={data} />
        <SurfaceAxes
          xLabel={xLabel}
          zLabel={zLabel}
          valueLabel={valueLabel}
          xMin={data.xs[0]}
          xMax={data.xs[data.xs.length - 1]}
          zMin={data.zs[0]}
          zMax={data.zs[data.zs.length - 1]}
          valueMin={data.min}
          valueMax={data.max}
          formatX={formatX}
          formatZ={formatZ}
          formatValue={formatValue}
        />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={7}
        target={[0, 0.1, 0]}
      />
    </Canvas>
  );
}
