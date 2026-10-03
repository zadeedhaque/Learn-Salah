import { BufferAttribute, BufferGeometry, Vector3 } from 'three';

/** Smooth interpolation through keyed rows: rows are [key, ...values], keys ascending. */
export function curve(rows: number[][]): (t: number) => number[] {
  const n = rows.length;
  const width = rows[0].length - 1;
  return (t: number) => {
    if (t <= rows[0][0]) return rows[0].slice(1);
    if (t >= rows[n - 1][0]) return rows[n - 1].slice(1);
    let i = 0;
    while (i < n - 2 && t > rows[i + 1][0]) i++;
    const p0 = rows[Math.max(i - 1, 0)];
    const p1 = rows[i];
    const p2 = rows[i + 1];
    const p3 = rows[Math.min(i + 2, n - 1)];
    const s = (t - p1[0]) / (p2[0] - p1[0]);
    const s2 = s * s;
    const s3 = s2 * s;
    const out: number[] = new Array(width);
    for (let k = 1; k <= width; k++) {
      // Catmull-Rom with tangents scaled for non-uniform key spacing.
      const d1 = p2[0] - p1[0];
      const m1 = p1 === p0 ? p2[k] - p1[k] : ((p2[k] - p0[k]) / (p2[0] - p0[0])) * d1;
      const m2 = p3 === p2 ? p2[k] - p1[k] : ((p3[k] - p1[k]) / (p3[0] - p1[0])) * d1;
      out[k - 1] =
        (2 * s3 - 3 * s2 + 1) * p1[k] + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * p2[k] + (s3 - s2) * m2;
    }
    return out;
  };
}

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Signed power used for superellipse cross-sections. */
export const spow = (x: number, p: number) => Math.sign(x) * Math.pow(Math.abs(x), p);

export type Influence = [boneIndex: number, weight: number];

export interface LoftOptions {
  rings: number;
  segments: number;
  /** Surface position for u ∈ [0,1] along the loft and v ∈ [0,1] around it. */
  point: (u: number, v: number, out: Vector3) => void;
  /** Optional per-vertex colour (linear RGB). */
  color?: (u: number, v: number, p: Vector3) => [number, number, number];
  /** Optional per-vertex skin influences. */
  weights?: (u: number, v: number, p: Vector3) => Influence[];
  /** Flip triangle winding if the surface ends up inside-out. */
  flip?: boolean;
  uvScale?: [number, number];
}

/**
 * Build a tube-like surface from a parametric function. The seam column is
 * duplicated for UVs and its normals are welded so shading stays continuous;
 * collapsed end rings (poles) get a single averaged normal.
 */
export function loft(opts: LoftOptions): BufferGeometry {
  const { rings, segments } = opts;
  const cols = segments + 1;
  const count = (rings + 1) * cols;
  const pos = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const col = opts.color ? new Float32Array(count * 3) : null;
  const skinIndex = opts.weights ? new Uint16Array(count * 4) : null;
  const skinWeight = opts.weights ? new Float32Array(count * 4) : null;
  const p = new Vector3();
  const [us, vs] = opts.uvScale ?? [1, 1];

  for (let i = 0; i <= rings; i++) {
    const u = i / rings;
    for (let j = 0; j <= segments; j++) {
      const v = (j % segments) / segments;
      const k = i * cols + j;
      opts.point(u, v, p);
      pos.set([p.x, p.y, p.z], k * 3);
      uv.set([(j / segments) * vs, u * us], k * 2);
      if (col && opts.color) col.set(opts.color(u, v, p), k * 3);
      if (skinIndex && skinWeight && opts.weights) {
        const inf = opts
          .weights(u, v, p)
          .filter((w) => w[1] > 1e-4)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
        const sum = inf.reduce((s, w) => s + w[1], 0) || 1;
        inf.forEach(([bi, w], n) => {
          skinIndex[k * 4 + n] = bi;
          skinWeight[k * 4 + n] = w / sum;
        });
      }
    }
  }

  const index: number[] = [];
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * cols + j;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      if (opts.flip) index.push(a, b, c, b, d, c);
      else index.push(a, c, b, b, c, d);
    }
  }

  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('uv', new BufferAttribute(uv, 2));
  if (col) g.setAttribute('color', new BufferAttribute(col, 3));
  if (skinIndex && skinWeight) {
    g.setAttribute('skinIndex', new BufferAttribute(skinIndex, 4));
    g.setAttribute('skinWeight', new BufferAttribute(skinWeight, 4));
  }
  g.setIndex(index);
  g.computeVertexNormals();
  weldNormals(g, rings, cols);
  return g;
}

function weldNormals(g: BufferGeometry, rings: number, cols: number) {
  const n = g.getAttribute('normal') as BufferAttribute;
  const p = g.getAttribute('position') as BufferAttribute;
  const a = new Vector3();
  const b = new Vector3();
  // Seam: first and last column share a position.
  for (let i = 0; i <= rings; i++) {
    const k0 = i * cols;
    const k1 = k0 + cols - 1;
    a.fromBufferAttribute(n, k0).add(b.fromBufferAttribute(n, k1)).normalize();
    n.setXYZ(k0, a.x, a.y, a.z);
    n.setXYZ(k1, a.x, a.y, a.z);
  }
  // Poles: end rings collapsed to a point.
  for (const i of [0, rings]) {
    const k0 = i * cols;
    let spread = 0;
    a.fromBufferAttribute(p, k0);
    for (let j = 1; j < cols; j++) spread = Math.max(spread, a.distanceTo(b.fromBufferAttribute(p, k0 + j)));
    if (spread > 1e-5) continue;
    a.set(0, 0, 0);
    for (let j = 0; j < cols; j++) a.add(b.fromBufferAttribute(n, k0 + j));
    a.normalize();
    for (let j = 0; j < cols; j++) n.setXYZ(k0 + j, a.x, a.y, a.z);
  }
  n.needsUpdate = true;
}
