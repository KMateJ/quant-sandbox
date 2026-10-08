/// Pure helpers that turn a sampled scalar field into Three.js buffer arrays.
/// Framework-free so the rendering component stays small and declarative.

export interface SurfaceData {
  /// Column coordinates (x axis), ascending.
  xs: number[];
  /// Row coordinates (z axis), ascending.
  zs: number[];
  /// Row-major samples indexed as `values[zIndex][xIndex]`.
  values: number[][];
  min: number;
  max: number;
}

export interface SurfaceBuffers {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
}

/// Footprint half-extent on the x/z plane and the vertical value height.
const HALF = 1;
const HEIGHT = 1.1;

type Stop = [number, [number, number, number]];

// Approximate viridis stops (0 → low value, 1 → high value).
const VIRIDIS: Stop[] = [
  [0.0, [0.267, 0.005, 0.329]],
  [0.25, [0.229, 0.322, 0.545]],
  [0.5, [0.127, 0.567, 0.551]],
  [0.75, [0.369, 0.789, 0.383]],
  [1.0, [0.993, 0.906, 0.144]],
];

/// Maps a normalised value in [0,1] to an RGB triplet along the viridis ramp.
export function viridis(tRaw: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, tRaw));
  for (let i = 1; i < VIRIDIS.length; i++) {
    const [p1, c1] = VIRIDIS[i];
    if (t <= p1) {
      const [p0, c0] = VIRIDIS[i - 1];
      const f = p1 === p0 ? 0 : (t - p0) / (p1 - p0);
      return [
        c0[0] + (c1[0] - c0[0]) * f,
        c0[1] + (c1[1] - c0[1]) * f,
        c0[2] + (c1[2] - c0[2]) * f,
      ];
    }
  }
  return VIRIDIS[VIRIDIS.length - 1][1];
}

function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0.5;
  return (value - min) / (max - min);
}

function mapAxis(index: number, count: number): number {
  if (count <= 1) return 0;
  return -HALF + (index / (count - 1)) * (2 * HALF);
}

/// Builds interleaved position/color/index arrays for a vertex-coloured mesh.
export function buildSurfaceBuffers(data: SurfaceData): SurfaceBuffers {
  const nx = data.xs.length;
  const nz = data.zs.length;
  const vertexCount = nx * nz;

  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);

  for (let zi = 0; zi < nz; zi++) {
    const z = mapAxis(zi, nz);
    for (let xi = 0; xi < nx; xi++) {
      const i = (zi * nx + xi) * 3;
      const v = data.values[zi][xi];
      const tn = normalize(v, data.min, data.max);

      positions[i] = mapAxis(xi, nx);
      positions[i + 1] = tn * HEIGHT;
      positions[i + 2] = z;

      const [r, g, b] = viridis(tn);
      colors[i] = r;
      colors[i + 1] = g;
      colors[i + 2] = b;
    }
  }

  const quadCount = (nx - 1) * (nz - 1);
  const indices = new Uint32Array(quadCount * 6);
  let o = 0;
  for (let zi = 0; zi < nz - 1; zi++) {
    for (let xi = 0; xi < nx - 1; xi++) {
      const a = zi * nx + xi;
      const b = a + 1;
      const c = a + nx;
      const d = c + 1;
      indices[o++] = a;
      indices[o++] = c;
      indices[o++] = b;
      indices[o++] = b;
      indices[o++] = c;
      indices[o++] = d;
    }
  }

  return { positions, colors, indices };
}

export const SURFACE_HALF = HALF;
export const SURFACE_HEIGHT = HEIGHT;
