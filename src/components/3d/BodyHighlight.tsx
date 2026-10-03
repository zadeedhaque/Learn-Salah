import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Vector3 } from 'three';
import type { Sprite } from 'three';
import { BODY_ANCHORS } from '@/three/model/anchors';
import type { BodyPart } from '@/three/model/anchors';
import { createGlowTexture, createRingTexture } from '@/three/textures';
import { usePrayerStore } from '@/store/prayerStore';
import { sceneRefs } from './sceneContext';

const NONE: BodyPart[] = [];
const _v = new Vector3();

/**
 * Elegant, low-intensity glows on the body parts that matter for the current
 * step (e.g. back, hands, knees during ruku). Drawn on top of the figure so they
 * read like a soft outline rather than neon.
 */
export function BodyHighlight() {
  const parts = usePrayerStore((s) => (s.highlightsOn && s.layout !== 'hero' ? s.scene.highlights : NONE));
  const reduced = usePrayerStore((s) => s.a11y.reducedMotion);
  const glow = useMemo(() => createGlowTexture(), []);
  const ring = useMemo(() => createRingTexture(), []);
  useEffect(
    () => () => {
      glow.dispose();
      ring.dispose();
    },
    [glow, ring],
  );

  const anchors = useMemo(
    () => parts.flatMap((p, pi) => BODY_ANCHORS[p].map((a, ai) => ({ ...a, key: `${p}-${ai}`, order: pi }))),
    [parts],
  );
  const glowRefs = useRef<(Sprite | null)[]>([]);
  const ringRefs = useRef<(Sprite | null)[]>([]);
  const born = useRef(0);

  useEffect(() => {
    born.current = performance.now();
  }, [anchors]);

  useFrame((state) => {
    const rig = sceneRefs.rig;
    if (!rig) return;
    const t = state.clock.elapsedTime;
    const age = (performance.now() - born.current) / 1000;
    anchors.forEach((a, i) => {
      // Stagger appearance so attention moves from one part to the next.
      const fade = Math.min(Math.max((age - 0.6 - a.order * 0.35) / 0.6, 0), 1);
      rig.bones[a.bone].localToWorld(_v.set(...a.offset));
      const pulse = reduced ? 1 : 1 + Math.sin(t * 2 + i) * 0.07;
      const g = glowRefs.current[i];
      if (g) {
        g.position.copy(_v);
        g.scale.setScalar(0.17 * pulse);
        g.material.opacity = 0.42 * fade;
      }
      const r = ringRefs.current[i];
      if (r) {
        r.position.copy(_v);
        r.scale.setScalar(0.085 * (reduced ? 1 : 1 + ((t * 0.6 + i * 0.3) % 1) * 0.5));
        r.material.opacity = 0.5 * fade * (reduced ? 1 : 1 - ((t * 0.6 + i * 0.3) % 1));
      }
    });
  });

  return (
    <group>
      {anchors.map((a, i) => (
        <group key={a.key}>
          <sprite ref={(el) => void (glowRefs.current[i] = el)} renderOrder={20}>
            <spriteMaterial map={glow} color="#86d6b2" transparent opacity={0} depthTest={false} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
          </sprite>
          <sprite ref={(el) => void (ringRefs.current[i] = el)} renderOrder={21}>
            <spriteMaterial map={ring} color="#e6cf9a" transparent opacity={0} depthTest={false} depthWrite={false} toneMapped={false} />
          </sprite>
        </group>
      ))}
    </group>
  );
}
