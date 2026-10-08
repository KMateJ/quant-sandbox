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
