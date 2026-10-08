import { Html } from "@react-three/drei";
import { SURFACE_HALF, SURFACE_HEIGHT } from "./surface3d.geometry";

export interface SurfaceAxesProps {
  xLabel: string;
  zLabel: string;
  valueLabel: string;
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
  valueMin: number;
  valueMax: number;
  formatX: (value: number) => string;
  formatZ: (value: number) => string;
  formatValue: (value: number) => string;
}

const H = SURFACE_HALF;
const Y = SURFACE_HEIGHT;

function Label({
  position,
  text,
  variant = "tick",
}: {
  position: [number, number, number];
  text: string;
  variant?: "tick" | "name";
}) {
  return (
    <Html position={position} center distanceFactor={3.5} zIndexRange={[10, 0]}>
      <span className={`surface3d-label surface3d-label--${variant}`}>{text}</span>
    </Html>
  );
}

/// Floor grid plus axis names and min/max ticks so the rotatable surface stays
/// readable from any angle.
export default function SurfaceAxes(props: SurfaceAxesProps) {
  const { xLabel, zLabel, valueLabel, formatX, formatZ, formatValue } = props;
  return (
    <group>
      <gridHelper args={[2 * H, 12, "#64748b", "#334155"]} position={[0, 0, 0]} />

      <Label position={[0, -0.18, H + 0.35]} text={xLabel} variant="name" />
      <Label position={[-H, -0.16, H + 0.12]} text={formatX(props.xMin)} />
      <Label position={[H, -0.16, H + 0.12]} text={formatX(props.xMax)} />

      <Label position={[H + 0.45, -0.18, 0]} text={zLabel} variant="name" />
      <Label position={[H + 0.12, -0.16, -H]} text={formatZ(props.zMin)} />
      <Label position={[H + 0.12, -0.16, H]} text={formatZ(props.zMax)} />

      <Label position={[-H - 0.3, Y / 2, -H]} text={valueLabel} variant="name" />
      <Label position={[-H - 0.18, 0, -H]} text={formatValue(props.valueMin)} />
      <Label position={[-H - 0.18, Y, -H]} text={formatValue(props.valueMax)} />
    </group>
  );
}
