import { useEffect, useMemo } from 'react';
import { ExtrudeGeometry, Shape } from 'three';
import { Environment as DreiEnvironment, Lightformer, MeshReflectorMaterial } from '@react-three/drei';
import { createFloorTexture, createRugTexture, createSkyTexture } from '@/three/textures';
import { RUG_HEIGHT } from './sceneContext';

export type Quality = 'high' | 'low';

const ARCH_COUNT = 10;
const ARCH_RADIUS = 5.4;

function useArchGeometry() {
  return useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.45, 0);
    s.lineTo(1.45, 0);
    s.lineTo(1.45, 5.4);
    s.lineTo(-1.45, 5.4);
    s.closePath();
    const hole = new Shape();
    hole.moveTo(-0.88, 0.32);
    hole.lineTo(-0.88, 2.75);
    hole.bezierCurveTo(-0.88, 3.45, -0.36, 3.9, 0, 4.12);
    hole.bezierCurveTo(0.36, 3.9, 0.88, 3.45, 0.88, 2.75);
    hole.lineTo(0.88, 0.32);
    hole.closePath();
    s.holes.push(hole);
    return new ExtrudeGeometry(s, { depth: 0.42, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2, curveSegments: 24 });
  }, []);
}

/** Calm prayer-hall surroundings: polished floor, prayer rug, arcade of arches with a dusk sky. */
export function SceneEnvironment({ quality }: { quality: Quality }) {
  const rug = useMemo(() => createRugTexture(), []);
  const sky = useMemo(() => createSkyTexture(), []);
  const floor = useMemo(() => {
    const t = createFloorTexture();
    t.repeat.set(6, 6);
    return t;
  }, []);
  const arch = useArchGeometry();

  useEffect(
    () => () => {
      rug.dispose();
      sky.dispose();
      floor.dispose();
      arch.dispose();
    },
    [rug, sky, floor, arch],
  );

  const arches = Array.from({ length: ARCH_COUNT }, (_, i) => {
    const a = (i / ARCH_COUNT) * Math.PI * 2 + Math.PI / ARCH_COUNT;
    return { a, x: Math.sin(a) * ARCH_RADIUS, z: Math.cos(a) * ARCH_RADIUS };
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[18, 64]} />
        {quality === 'high' ? (
          <MeshReflectorMaterial
            map={floor}
            color="#4a453c"
            roughness={0.82}
            metalness={0.25}
            blur={[260, 80]}
            resolution={256}
            mixBlur={1}
            mixStrength={1.4}
            mixContrast={1}
            depthScale={0.6}
            minDepthThreshold={0.5}
            maxDepthThreshold={1.2}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial map={floor} color="#4a453c" roughness={0.6} metalness={0.15} />
        )}
      </mesh>

      {/* Prayer rug */}
      <group position={[0, 0, 0.42]}>
        <mesh position-y={RUG_HEIGHT / 2} receiveShadow>
          <boxGeometry args={[0.8, RUG_HEIGHT, 1.36]} />
          <meshStandardMaterial color="#0b2a20" roughness={0.95} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={RUG_HEIGHT + 0.0005} receiveShadow>
          <planeGeometry args={[0.8, 1.36]} />
          <meshStandardMaterial map={rug} roughness={0.92} metalness={0.02} />
        </mesh>
      </group>

      {/* Arcade */}
      {arches.map(({ a, x, z }, i) => (
        <group key={i} position={[x, 0, z]} rotation-y={a + Math.PI}>
          <mesh geometry={arch} position-z={-0.21} castShadow={false} receiveShadow>
            <meshStandardMaterial color="#2a241c" roughness={0.85} metalness={0.05} />
          </mesh>
          <mesh position={[0, 2.25, 0.35]}>
            <planeGeometry args={[1.9, 4.0]} />
            <meshBasicMaterial map={sky} color="#7d7a76" fog={false} />
          </mesh>
        </group>
      ))}
      {arches.map(({ a }, i) => {
        const b = a + Math.PI / ARCH_COUNT;
        return (
          <group key={`c${i}`} position={[Math.sin(b) * (ARCH_RADIUS - 0.05), 0, Math.cos(b) * (ARCH_RADIUS - 0.05)]}>
            <mesh position-y={2.7}>
              <cylinderGeometry args={[0.17, 0.2, 5.4, 20]} />
              <meshStandardMaterial color="#332b21" roughness={0.75} />
            </mesh>
          </group>
        );
      })}

      {/* Lanterns */}
      {[
        [3.4, 2.3, -2.4],
        [-3.3, 2.1, -2.0],
        [3.0, 2.0, 2.6],
      ].map((p, i) => (
        <group key={`l${i}`} position={p as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.085, 0.24, 8]} />
            <meshStandardMaterial color="#3a2a14" emissive="#ffb35c" emissiveIntensity={1.3} roughness={0.5} />
          </mesh>
          <mesh position-y={0.9}>
            <cylinderGeometry args={[0.004, 0.004, 1.6, 4]} />
            <meshStandardMaterial color="#1a140c" />
          </mesh>
          {i < 2 && <pointLight color="#ffb061" intensity={3.2} distance={5} decay={2} />}
        </group>
      ))}

      {/* Image-based lighting from soft light panels (no HDR download). */}
      <DreiEnvironment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#ffe6c4" position={[-3, 3, 3]} scale={[4, 3, 1]} target={[0, 1, 0]} />
        <Lightformer form="rect" intensity={0.9} color="#9fbfe0" position={[3, 2.5, -3]} scale={[4, 2, 1]} target={[0, 1, 0]} />
        <Lightformer form="ring" intensity={0.6} color="#ffcf9a" position={[0, 5, 0]} scale={2.5} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.25} color="#ffffff" position={[0, 1, 5]} scale={[6, 2, 1]} target={[0, 1, 0]} />
      </DreiEnvironment>
    </group>
  );
}
