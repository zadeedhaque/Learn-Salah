import {
  BufferAttribute,
  CapsuleGeometry,
  Color,
  Group,
  Matrix4,
  Mesh,
  Quaternion,
  Skeleton,
  SkinnedMesh,
  SphereGeometry,
  Vector3,
} from 'three';
import type { BufferGeometry, Material } from 'three';
import { BONE_NAMES, FINGERS, FINGER_SEGMENT_LENGTHS, SIDES, THUMB_DIRECTION, createRig } from '../rig/skeleton.ts';
import type { BoneName, Rig, Side } from '../rig/skeleton.ts';
import { curve, lerp, loft, smoothstep, spow } from './loft.ts';
import type { Influence } from './loft.ts';
import { createHumanMaterials } from './materials.ts';

/**
 * Procedurally generated, faceless prayer figure.
 *
 * Built entirely from code so the project runs without binary assets. The body is
 * made of lofted surfaces with hand-authored skin weights (robe, sleeves, neck,
 * lower legs) plus rigid parts parented to bones (head, cap, hands, fingers, feet).
 * The rig is the same one the pose system bakes against, so a real .glb using the
 * same bone names can replace it (see GltfPrayerModel.tsx).
 */

export interface ProceduralHuman {
  group: Group;
  rig: Rig;
  dispose(): void;
}

const TAU = Math.PI * 2;

const IVORY = new Color('#ebe4d5');
const IVORY_SHADE = new Color('#ddd4c1');
const SOCK = new Color('#f1efe9');
const CAP = new Color('#f3eee2');
const CAP_STITCH = new Color('#d8ccb2');
const BUTTON = new Color('#cfc1a4');

const rgb = (c: Color, k = 1): [number, number, number] => [c.r * k, c.g * k, c.b * k];

/** Robe cross-section by height: [y, rx, rzFront, rzBack, zCenter, superellipse n]. */
const ROBE = curve([
  [0.085, 0.262, 0.222, 0.212, 0.0, 2.0],
  [0.11, 0.258, 0.217, 0.207, 0.0, 2.0],
  [0.3, 0.238, 0.192, 0.182, 0.0, 2.0],
  [0.5, 0.22, 0.172, 0.166, 0.0, 2.05],
  [0.7, 0.206, 0.156, 0.16, 0.0, 2.1],
  [0.85, 0.199, 0.149, 0.163, -0.004, 2.2],
  [0.95, 0.19, 0.14, 0.15, -0.004, 2.3],
  [1.05, 0.175, 0.13, 0.127, 0.0, 2.35],
  [1.15, 0.176, 0.137, 0.123, 0.004, 2.4],
  [1.25, 0.184, 0.143, 0.121, 0.006, 2.45],
  [1.33, 0.192, 0.136, 0.117, 0.004, 2.5],
  [1.39, 0.2, 0.121, 0.11, 0.0, 2.6],
  [1.418, 0.188, 0.106, 0.1, -0.002, 2.5],
  [1.443, 0.15, 0.088, 0.083, -0.005, 2.3],
  [1.465, 0.1, 0.07, 0.066, -0.006, 2.1],
  [1.485, 0.066, 0.06, 0.058, -0.006, 2.0],
]);

/** Head cross-section in head space: [y, rx, rzFront, rzBack, zCenter]. */
const HEAD = curve([
  [-0.034, 0.0, 0.0, 0.0, 0.038],
  [-0.03, 0.026, 0.022, 0.022, 0.038],
  [-0.016, 0.046, 0.036, 0.042, 0.034],
  [0.01, 0.06, 0.052, 0.07, 0.018],
  [0.045, 0.069, 0.068, 0.088, 0.008],
  [0.09, 0.077, 0.087, 0.1, 0.0],
  [0.13, 0.079, 0.088, 0.101, -0.005],
  [0.16, 0.072, 0.076, 0.091, -0.01],
  [0.18, 0.056, 0.057, 0.067, -0.012],
  [0.193, 0.03, 0.03, 0.035, -0.012],
  [0.198, 0.0, 0.0, 0.0, -0.012],
]);

/** Kufi cap cross-section: follows the skull, slightly larger, softly flattened on top. */
const CAP_PROFILE = curve([
  [0.118, 0.0825, 0.0905, 0.1035, -0.006],
  [0.14, 0.0826, 0.0905, 0.1035, -0.007],
  [0.165, 0.0765, 0.08, 0.095, -0.01],
  [0.188, 0.06, 0.062, 0.072, -0.012],
  [0.201, 0.038, 0.04, 0.046, -0.012],
  [0.2065, 0.0, 0.0, 0.0, -0.012],
]);

const SLEEVE = curve([
  [0.0, 0.054],
  [0.03, 0.059],
  [0.12, 0.0575],
  [0.24, 0.0555],
  [0.3, 0.0525],
  [0.4, 0.0505],
  [0.5, 0.0495],
  [0.528, 0.0505],
  [0.538, 0.047],
  [0.546, 0.037],
]);

const LOWER_LEG = curve([
  [0, 0.05],
  [0.1, 0.054],
  [0.2, 0.049],
  [0.3, 0.04],
  [0.37, 0.034],
  [0.4, 0.033],
  [0.43, 0.034],
  [0.452, 0.0],
]);

/** Palm cross-section along the hand: [y, halfWidth, dorsal, palmar, zCenter]. */
const PALM = curve([
  [-0.11, 0.0, 0.0, 0.0, -0.001],
  [-0.108, 0.021, 0.005, 0.005, -0.001],
  [-0.102, 0.04, 0.009, 0.0095, -0.001],
  [-0.09, 0.0445, 0.012, 0.013, -0.001],
  [-0.07, 0.0435, 0.0135, 0.016, -0.001],
  [-0.04, 0.039, 0.0155, 0.018, 0.0],
  [-0.01, 0.03, 0.016, 0.017, 0.002],
  [0.012, 0.025, 0.016, 0.015, 0.0],
  [0.014, 0.0, 0.0, 0.0, 0.0],
]);

/** Foot (sock) along +Z: [z, halfWidth, top, bottom, xCenter]. */
const FOOT = curve([
  [-0.07, 0.0, -0.046, -0.046, 0.0],
  [-0.064, 0.02, -0.02, -0.066, 0.0],
  [-0.05, 0.028, 0.006, -0.069, 0.0],
  [-0.02, 0.032, 0.03, -0.07, 0.0],
  [0.02, 0.035, 0.026, -0.07, 0.002],
  [0.06, 0.04, 0.008, -0.07, 0.003],
  [0.1, 0.045, -0.012, -0.07, 0.002],
  [0.14, 0.048, -0.028, -0.07, 0.0],
  [0.165, 0.046, -0.034, -0.069, 0.0],
  [0.176, 0.03, -0.042, -0.064, 0.0],
  [0.18, 0.0, -0.05, -0.05, 0.0],
]);

const TOES = curve([
  [-0.028, 0.0, 0.004, 0.004],
  [-0.024, 0.044, 0.02, -0.015],
  [0.0, 0.0465, 0.021, -0.016],
  [0.04, 0.041, 0.015, -0.015],
  [0.064, 0.033, 0.01, -0.013],
  [0.077, 0.021, 0.005, -0.009],
  [0.082, 0.0, -0.002, -0.002],
]);

const FINGER_RADII: Record<string, [number, number, number]> = {
  thumb: [0.0112, 0.0101, 0.0091],
  index: [0.0089, 0.0081, 0.0072],
  middle: [0.0092, 0.0084, 0.0074],
  ring: [0.0087, 0.0079, 0.007],
  pinky: [0.0076, 0.0069, 0.0062],
};

function robeFold(y: number, theta: number): number {
  const skirt = smoothstep(1.02, 0.2, y);
  const amp = 0.0078 * skirt + 0.0012;
  let f =
    amp *
    (0.55 * Math.sin(8 * theta + 0.9 + y * 1.6) +
      0.3 * Math.sin(13 * theta + 2.3 - y * 2.2) +
      0.17 * Math.sin(21 * theta + 0.4 + y * 4.3));
  // Soft diagonal drape across the torso.
  f += 0.0019 * Math.sin(6 * theta + y * 9) * smoothstep(1.42, 1.22, y) * smoothstep(0.95, 1.1, y);
  return f;
}

function solidColor(g: BufferGeometry, c: Color) {
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set(rgb(c), i * 3);
  g.setAttribute('color', new BufferAttribute(col, 3));
  return g;
}

export function buildProceduralHuman(): ProceduralHuman {
  const rig = createRig();
  const { bones } = rig;
  const mats = createHumanMaterials();
  const group = new Group();
  group.name = 'ProceduralPrayerFigure';
  group.add(rig.root);

  const index = Object.fromEntries(BONE_NAMES.map((n, i) => [n, i])) as Record<BoneName, number>;
  const rest = (name: BoneName) => bones[name].getWorldPosition(new Vector3());
  const skinned: SkinnedMesh[] = [];

  const addSkinned = (geometry: BufferGeometry, material: Material, name: string) => {
    const mesh = new SkinnedMesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    group.add(mesh);
    skinned.push(mesh);
  };

  const addRigid = (geometry: BufferGeometry, material: Material, bone: BoneName, name: string) => {
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bones[bone].add(mesh);
    return mesh;
  };

  // ── Robe (thobe) ────────────────────────────────────────────────────────────
  const robe = loft({
    rings: 150,
    segments: 112,
    uvScale: [26, 34],
    point(u, v, out) {
      const y = lerp(0.085, 1.485, u);
      const [rx, rzF, rzB, zc, n] = ROBE(y);
      const t = v * TAU;
      const s = Math.sin(t);
      const rz = s >= 0 ? rzF : rzB;
      const x = rx * spow(Math.cos(t), 2 / n);
      const z = rz * spow(s, 2 / n);
      const nx = x / rx;
      const nz = z / rz;
      const len = Math.hypot(nx, nz) || 1;
      const f = robeFold(y, t);
      out.set(x + (nx / len) * f, y, zc + z + (nz / len) * f);
    },
    color(_u, _v, p) {
      let k = 1;
      if (p.z > 0 && Math.abs(p.x) < 0.0115 && p.y > 1.2 && p.y < 1.47) k = 0.92; // placket
      if (p.y < 0.118) k *= 0.97; // hem band
      return rgb(p.y < 0.118 ? IVORY_SHADE : IVORY, k);
    },
    weights(_u, _v, p) {
      const { x, y } = p;
      const ax = Math.abs(x);
      const side: Side = x >= 0 ? 'L' : 'R';
      const legW = smoothstep(0.99, 0.78, y);
      const shinW = smoothstep(0.58, 0.4, y);
      const wl = smoothstep(-0.075, 0.075, x);
      const upper = 1 - legW;
      const toSpine = smoothstep(1.0, 1.12, y);
      const toChest = smoothstep(1.15, 1.3, y);
      const toNeck = smoothstep(1.462, 1.49, y);
      const hips = upper * (1 - toSpine);
      const spine = upper * toSpine * (1 - toChest);
      let chest = upper * toSpine * toChest * (1 - toNeck);
      const neck = upper * toNeck;
      const shoulderW = chest * smoothstep(0.1, 0.19, ax) * smoothstep(1.27, 1.39, y) * 0.55;
      const armW = chest * smoothstep(0.155, 0.2, ax) * smoothstep(1.24, 1.38, y) * 0.3;
      chest -= shoulderW + armW;
      const out: Influence[] = [
        [index.hips, hips],
        [index.spine, spine],
        [index.chest, chest],
        [index.neck, neck],
        [index[`shoulder${side}`], shoulderW],
        [index[`upperArm${side}`], armW],
        [index.thighL, legW * (1 - shinW) * wl],
        [index.thighR, legW * (1 - shinW) * (1 - wl)],
        [index.shinL, legW * shinW * wl],
        [index.shinR, legW * shinW * (1 - wl)],
      ];
      return out;
    },
  });
  addSkinned(robe, mats.cloth, 'robe');

  // ── Collar band ─────────────────────────────────────────────────────────────
  const collarPath = curve([
    [0, 1.45, 0.071],
    [0.6, 1.5, 0.0665],
    [0.8, 1.508, 0.062],
    [1, 1.506, 0.056],
  ]);
  const collar = loft({
    rings: 12,
    segments: 64,
    point(u, v, out) {
      const [y, r] = collarPath(u);
      const t = v * TAU;
      out.set(Math.cos(t) * r, y, -0.008 + Math.sin(t) * r * 0.96);
    },
    color: () => rgb(IVORY_SHADE),
    weights: () => [
      [index.chest, 0.65],
      [index.neck, 0.35],
    ],
  });
  addSkinned(collar, mats.cloth, 'collar');

  // ── Sleeves and lower legs ──────────────────────────────────────────────────
  for (const side of SIDES) {
    const j = rest(`upperArm${side}`);
    const sleeve = loft({
      rings: 80,
      segments: 44,
      uvScale: [12, 6],
      flip: true,
      point(u, v, out) {
        const sPos = lerp(-0.034, 0.546, u);
        let r: number;
        if (sPos < 0) {
          const k = sPos / -0.034;
          r = 0.054 * Math.sqrt(Math.max(1 - k * k, 0));
        } else {
          r = SLEEVE(sPos)[0];
        }
        const t = v * TAU;
        const elbow = Math.exp(-(((sPos - 0.29) / 0.06) ** 2));
        r +=
          0.0034 * Math.sin((sPos - 0.29) * 110) * elbow +
          0.0017 * Math.sin(5 * t + sPos * 12) * smoothstep(0.0, 0.1, sPos) +
          0.0014 * Math.sin(16 * t) * smoothstep(0.47, 0.53, sPos) * smoothstep(0.546, 0.53, sPos);
        // Tuck the top of the sleeve slightly towards the body so it blends into the shoulder.
        const tuck = -0.012 * smoothstep(0.08, -0.034, sPos) * (j.x > 0 ? 1 : -1);
        out.set(j.x + tuck + Math.cos(t) * r, j.y - sPos, j.z + Math.sin(t) * r * 1.05);
      },
      color: (_u, _v, p) => rgb(IVORY, j.y - p.y > 0.53 ? 0.95 : 1),
      weights(u) {
        const sPos = lerp(-0.034, 0.546, u);
        const toFore = smoothstep(0.22, 0.36, sPos);
        const toHand = smoothstep(0.5, 0.546, sPos) * 0.35;
        return [
          [index[`upperArm${side}`], 1 - toFore],
          [index[`forearm${side}`], toFore * (1 - toHand)],
          [index[`hand${side}`], toFore * toHand],
        ];
      },
    });
    addSkinned(sleeve, mats.cloth, `sleeve${side}`);

    const k = rest(`shin${side}`);
    const leg = loft({
      rings: 40,
      flip: true,
      segments: 32,
      point(u, v, out) {
        const sPos = u * 0.452;
        const r = LOWER_LEG(sPos)[0];
        const t = v * TAU;
        out.set(k.x + Math.cos(t) * r, k.y - sPos, k.z + 0.004 + Math.sin(t) * r * 1.08);
      },
      color: (u) => rgb(u * 0.452 > 0.33 ? SOCK : IVORY),
      weights(u) {
        const sPos = u * 0.452;
        const toShin = smoothstep(-0.02, 0.06, sPos);
        const toFoot = smoothstep(0.37, 0.43, sPos);
        return [
          [index[`thigh${side}`], 1 - toShin],
          [index[`shin${side}`], toShin * (1 - toFoot)],
          [index[`foot${side}`], toShin * toFoot],
        ];
      },
    });
    addSkinned(leg, mats.cloth, `lowerLeg${side}`);
  }

  // ── Neck ────────────────────────────────────────────────────────────────────
  const neck = loft({
    rings: 24,
    segments: 40,
    point(u, v, out) {
      const y = lerp(1.43, 1.645, u);
      const r = lerp(0.054, 0.049, u);
      const t = v * TAU;
      out.set(Math.cos(t) * r, y, -0.008 + u * 0.01 + Math.sin(t) * r * 1.08);
    },
    weights(u) {
      const y = lerp(1.43, 1.645, u);
      const toNeck = smoothstep(1.46, 1.51, y);
      const toHead = smoothstep(1.565, 1.61, y);
      return [
        [index.chest, 1 - toNeck],
        [index.neck, toNeck * (1 - toHead)],
        [index.head, toNeck * toHead],
      ];
    },
  });
  addSkinned(neck, mats.skin, 'neck');

  // ── Skin binding (rig is still in its rest pose here) ───────────────────────
  rig.root.updateMatrixWorld(true);
  const skeleton = new Skeleton(BONE_NAMES.map((n) => bones[n]));
  for (const mesh of skinned) mesh.bind(skeleton, new Matrix4());

  // ── Head (faceless) and cap ─────────────────────────────────────────────────
  const head = loft({
    rings: 44,
    segments: 56,
    point(u, v, out) {
      const y = lerp(-0.034, 0.198, u);
      const [rx, rzF, rzB, zc] = HEAD(y);
      const t = v * TAU;
      const s = Math.sin(t);
      out.set(rx * spow(Math.cos(t), 2 / 2.15), y, zc + (s >= 0 ? rzF : rzB) * spow(s, 2 / 2.15));
    },
  });
  addRigid(head, mats.skin, 'head', 'head');

  const cap = loft({
    rings: 22,
    segments: 72,
    point(u, v, out) {
      const y = lerp(0.118, 0.2065, u);
      const [rx, rzF, rzB, zc] = CAP_PROFILE(y);
      const t = v * TAU;
      const s = Math.sin(t);
      out.set(rx * spow(Math.cos(t), 2 / 2.1), y, zc + (s >= 0 ? rzF : rzB) * spow(s, 2 / 2.1));
    },
    color(u, v) {
      if (u < 0.09) return rgb(CAP_STITCH, 1.03);
      // Subtle embroidered lattice.
      const a = Math.sin(v * TAU * 24) * Math.sin(u * 46);
      return rgb(a > 0.85 ? CAP_STITCH : CAP);
    },
  });
  addRigid(cap, mats.cloth, 'head', 'kufi');

  for (const side of SIDES) {
    const m = side === 'L' ? 1 : -1;
    const ear = addRigid(new SphereGeometry(1, 16, 12), mats.skin, 'head', `ear${side}`);
    ear.position.set(0.077 * m, 0.082, -0.01);
    ear.scale.set(0.011, 0.027, 0.018);
    ear.rotation.set(0.12, 0.25 * m, 0);
  }

  // Buttons on the placket.
  const chestRest = rest('chest');
  for (const y of [1.432, 1.378, 1.324, 1.27]) {
    const [, rzF, , zc] = ROBE(y);
    const b = addRigid(solidColor(new SphereGeometry(0.0052, 12, 8), BUTTON), mats.cloth, 'chest', 'button');
    b.position.set(0, y - chestRest.y, zc + rzF + 0.0015 - chestRest.z);
    b.scale.set(1, 1, 0.55);
  }

  // ── Hands ───────────────────────────────────────────────────────────────────
  const down = new Vector3(0, -1, 0);
  for (const side of SIDES) {
    const m = side === 'L' ? 1 : -1;
    const palm = loft({
      rings: 28,
      segments: 32,
      point(u, v, out) {
        const y = lerp(-0.11, 0.014, u);
        const [hw, dorsal, palmar, zc] = PALM(y);
        const t = v * TAU;
        const c = Math.cos(t);
        const x = (c >= 0 ? dorsal : palmar) * spow(c, 2 / 2.25);
        out.set(x * m, y, zc + hw * 0.93 * spow(Math.sin(t), 2 / 2.4));
      },
      flip: side === 'R',
    });
    addRigid(palm, mats.skin, `hand${side}`, `palm${side}`);

    const thenar = addRigid(new SphereGeometry(1, 16, 12), mats.skin, `hand${side}`, `thenar${side}`);
    thenar.position.set(-0.009 * m, -0.043, 0.02);
    thenar.scale.set(0.012, 0.027, 0.016);
    thenar.rotation.set(-0.35, 0, 0);

    const wrist = addRigid(new CapsuleGeometry(0.022, 0.022, 6, 16), mats.skin, `hand${side}`, `wrist${side}`);
    wrist.position.set(0, 0.012, 0);
    wrist.scale.set(0.82, 1, 1.18);

    for (const f of FINGERS) {
      const segs = FINGER_SEGMENT_LENGTHS[f];
      const radii = FINGER_RADII[f];
      const dir =
        f === 'thumb'
          ? new Vector3(THUMB_DIRECTION[0] * m, THUMB_DIRECTION[1], THUMB_DIRECTION[2]).normalize()
          : down;
      const q = new Quaternion().setFromUnitVectors(down, dir);
      segs.forEach((len, i) => {
        const r = radii[i];
        const g = new CapsuleGeometry(r, Math.max(len - r * 0.6, 0.002), 5, 12);
        const mesh = addRigid(g, mats.skin, `${f}${(i + 1) as 1 | 2 | 3}${side}`, `${f}${i + 1}${side}`);
        mesh.position.copy(dir).multiplyScalar(len / 2);
        mesh.quaternion.copy(q);
        mesh.scale.set(f === 'thumb' ? 0.9 : 0.84, 1, 0.96);
      });
    }
  }

  // ── Feet (socks) ────────────────────────────────────────────────────────────
  for (const side of SIDES) {
    const m = side === 'L' ? 1 : -1;
    const foot = loft({
      rings: 36,
      segments: 32,
      point(u, v, out) {
        const z = lerp(-0.07, 0.18, u);
        const [hw, top, bottom, xc] = FOOT(z);
        const t = v * TAU;
        const mid = (top + bottom) / 2;
        const half = (top - bottom) / 2;
        out.set((xc + hw * spow(Math.cos(t), 2 / 3)) * m, mid + half * spow(Math.sin(t), 2 / 2.6), z);
      },
      color: () => rgb(SOCK),
      flip: side === 'L',
    });
    addRigid(foot, mats.cloth, `foot${side}`, `foot${side}`);

    const toes = loft({
      rings: 20,
      segments: 32,
      point(u, v, out) {
        const z = lerp(-0.028, 0.082, u);
        const [hw, top, bottom] = TOES(z);
        const t = v * TAU;
        const mid = (top + bottom) / 2;
        const half = (top - bottom) / 2;
        out.set((hw * spow(Math.cos(t), 2 / 3) - 0.004) * m, mid + half * spow(Math.sin(t), 2 / 2.4), z);
      },
      color: () => rgb(SOCK),
      flip: side === 'L',
    });
    addRigid(toes, mats.cloth, `toes${side}`, `toes${side}`);
  }

  return {
    group,
    rig,
    dispose() {
      group.traverse((o) => {
        if ((o as Mesh).isMesh) (o as Mesh).geometry.dispose();
      });
      skeleton.dispose();
      mats.dispose();
    },
  };
}
