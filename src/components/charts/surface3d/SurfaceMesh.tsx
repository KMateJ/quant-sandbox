import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { buildSurfaceBuffers, type SurfaceData } from "./surface3d.geometry";

/// Vertex-coloured surface mesh with a faint wireframe overlay for readability.
export default function SurfaceMesh({ data }: { data: SurfaceData }) {
  const geometry = useMemo(() => {
    const { positions, colors, indices } = buildSurfaceBuffers(data);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();
    return geo;
  }, [data]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.55}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#0f172a"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}
