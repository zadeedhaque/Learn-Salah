import {
  Color,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  MeshPhysicalMaterial,
  RepeatWrapping,
  RGBAFormat,
  Vector2,
} from 'three';

/** Fine woven-cotton normal map generated on the fly (no texture download). */
function createWeaveNormalMap(size = 128): DataTexture {
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const warp = Math.sin((x / size) * Math.PI * 2 * 24) * 0.5 + 0.5;
      const weft = Math.sin((y / size) * Math.PI * 2 * 24) * 0.5 + 0.5;
      const over = (Math.floor((x / size) * 24) + Math.floor((y / size) * 24)) % 2 === 0;
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      h[y * size + x] = (over ? warp : weft) * 0.8 + (n - Math.floor(n)) * 0.2;
    }
  }
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = h[y * size + ((x - 1 + size) % size)];
      const r = h[y * size + ((x + 1) % size)];
      const d = h[((y - 1 + size) % size) * size + x];
      const u = h[((y + 1) % size) * size + x];
      const nx = (l - r) * 1.5;
      const ny = (d - u) * 1.5;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new DataTexture(data, size, size, RGBAFormat);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export interface HumanMaterials {
  cloth: MeshPhysicalMaterial;
  skin: MeshPhysicalMaterial;
  dispose(): void;
}

export function createHumanMaterials(): HumanMaterials {
  const weave = createWeaveNormalMap();
  const cloth = new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    vertexColors: true,
    roughness: 0.86,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.55,
    sheenColor: new Color('#fff3df'),
    normalMap: weave,
    normalScale: new Vector2(0.07, 0.07),
  });
  const skin = new MeshPhysicalMaterial({
    color: new Color('#b48d70'),
    roughness: 0.64,
    metalness: 0,
    sheen: 0.25,
    sheenRoughness: 0.5,
    sheenColor: new Color('#e9b9a0'),
    clearcoat: 0.04,
    clearcoatRoughness: 0.6,
  });
  return {
    cloth,
    skin,
    dispose() {
      weave.dispose();
      cloth.dispose();
      skin.dispose();
    },
  };
}
