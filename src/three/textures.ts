import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  return { c, ctx };
}

function finish(c: HTMLCanvasElement, repeat = false) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/** Deterministic pseudo-random for repeatable textures. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function star8(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  for (const rot of [0, Math.PI / 4]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
}

/**
 * Prayer rug. The canvas bottom maps to +Z (the qiblah / head end), so the mihrab
 * arch is drawn pointing towards the bottom edge.
 */
export function createRugTexture() {
  const W = 512;
  const H = 880;
  const { c, ctx } = makeCanvas(W, H);
  const rand = rng(7);
  ctx.fillStyle = '#0d372a';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(${rand() > 0.5 ? '255,240,210' : '0,0,0'},${0.02 + rand() * 0.03})`;
    ctx.fillRect(rand() * W, rand() * H, 1 + rand() * 2, 1 + rand() * 2);
  }
  const gold = '#b79858';
  // Border band.
  ctx.fillStyle = '#0a2c22';
  ctx.fillRect(14, 14, W - 28, 44);
  ctx.fillRect(14, H - 58, W - 28, 44);
  ctx.fillRect(14, 14, 44, H - 28);
  ctx.fillRect(W - 58, 14, 44, H - 28);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.strokeRect(58, 58, W - 116, H - 116);
  ctx.lineWidth = 1;
  ctx.strokeRect(66, 66, W - 132, H - 132);
  // Repeating motif in the border band.
  ctx.strokeStyle = 'rgba(199,168,104,0.75)';
  for (let x = 40; x < W - 30; x += 26) {
    star8(ctx, x, 36, 6);
    star8(ctx, x, H - 36, 6);
  }
  for (let y = 66; y < H - 60; y += 26) {
    star8(ctx, 36, y, 6);
    star8(ctx, W - 36, y, 6);
  }
  // Mihrab arch towards the head end.
  const left = 104;
  const right = W - 104;
  const top = 150;
  const spring = H - 300;
  const apex = H - 112;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, spring);
  ctx.bezierCurveTo(left, spring + 110, W / 2 - 60, apex - 30, W / 2, apex);
  ctx.bezierCurveTo(W / 2 + 60, apex - 30, right, spring + 110, right, spring);
  ctx.lineTo(right, top);
  ctx.closePath();
  ctx.fillStyle = '#124634';
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.save();
  ctx.clip();
  // Fine lattice inside the arch.
  ctx.strokeStyle = 'rgba(199,168,104,0.12)';
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 22) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.moveTo(i, H);
    ctx.lineTo(i + H, 0);
    ctx.stroke();
  }
  ctx.restore();
  // Central medallion.
  ctx.strokeStyle = 'rgba(205,176,112,0.85)';
  ctx.lineWidth = 2;
  star8(ctx, W / 2, H / 2 - 20, 54);
  ctx.lineWidth = 1;
  star8(ctx, W / 2, H / 2 - 20, 36);
  ctx.beginPath();
  ctx.arc(W / 2, H / 2 - 20, 12, 0, Math.PI * 2);
  ctx.stroke();
  // Hanging lamp motif near the arch apex.
  ctx.beginPath();
  ctx.moveTo(W / 2, spring - 40);
  ctx.lineTo(W / 2, spring + 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(W / 2, spring + 48, 16, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Row of small stars at the foot end.
  for (let x = 120; x <= W - 120; x += 46) star8(ctx, x, 110, 7);
  // Fringe.
  ctx.strokeStyle = 'rgba(232,224,204,0.8)';
  for (let x = 18; x < W - 14; x += 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 12);
    ctx.moveTo(x, H - 12);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  return finish(c);
}

/** Dusk sky seen through the arches, with a soft distant skyline. */
export function createSkyTexture() {
  const W = 512;
  const H = 1024;
  const { c, ctx } = makeCanvas(W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0b1626');
  g.addColorStop(0.45, '#1d2b42');
  g.addColorStop(0.72, '#5a4a52');
  g.addColorStop(0.83, '#b4814f');
  g.addColorStop(1, '#3a2a1c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const rand = rng(3);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.15 + rand() * 0.45})`;
    ctx.fillRect(rand() * W, rand() * H * 0.5, 1.2, 1.2);
  }
  ctx.fillStyle = 'rgba(16, 18, 26, 0.72)';
  const base = H * 0.86;
  // Central dome on a drum.
  ctx.fillRect(150, base - 60, 212, 120);
  ctx.beginPath();
  ctx.ellipse(256, base - 60, 92, 98, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(252, base - 190, 8, 40);
  // Side domes.
  for (const x of [118, 394]) {
    ctx.fillRect(x - 46, base - 20, 92, 80);
    ctx.beginPath();
    ctx.ellipse(x, base - 20, 46, 50, 0, Math.PI, 0);
    ctx.fill();
  }
  // Minarets.
  for (const x of [40, 472, 196, 316]) {
    const tall = x === 40 || x === 472 ? 330 : 220;
    ctx.fillRect(x - 8, base - tall, 16, tall + 60);
    ctx.fillRect(x - 13, base - tall * 0.7, 26, 8);
    ctx.beginPath();
    ctx.moveTo(x - 9, base - tall);
    ctx.lineTo(x, base - tall - 34);
    ctx.lineTo(x + 9, base - tall);
    ctx.fill();
  }
  ctx.fillRect(0, base + 30, W, H - base);
  // Warm lit windows.
  ctx.fillStyle = 'rgba(255,196,120,0.85)';
  for (let x = 166; x < 350; x += 22) ctx.fillRect(x, base - 20, 5, 12);
  for (const x of [40, 472, 196, 316]) ctx.fillRect(x - 2, base - 120, 4, 7);
  return finish(c);
}

/** Polished stone floor tiles with a faint star inlay (repeats). */
export function createFloorTexture() {
  const S = 1024;
  const { c, ctx } = makeCanvas(S, S);
  const rand = rng(11);
  const n = 4;
  const t = S / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = 22 + rand() * 7;
      ctx.fillStyle = `rgb(${v + 4},${v + 1},${v - 3})`;
      ctx.fillRect(i * t, j * t, t, t);
      for (let k = 0; k < 500; k++) {
        ctx.fillStyle = `rgba(255,240,220,${rand() * 0.025})`;
        ctx.fillRect(i * t + rand() * t, j * t + rand() * t, 2 + rand() * 6, 1);
      }
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i <= n; i++) {
    ctx.beginPath();
    ctx.moveTo(i * t, 0);
    ctx.lineTo(i * t, S);
    ctx.moveTo(0, i * t);
    ctx.lineTo(S, i * t);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(190,160,110,0.16)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) star8(ctx, i * t, j * t, 26);
  return finish(c, true);
}

/** Soft radial glow for body highlights. */
export function createGlowTexture() {
  const S = 128;
  const { c, ctx } = makeCanvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return finish(c);
}

/** Thin ring used to mark a highlighted contact point. */
export function createRingTexture() {
  const S = 128;
  const { c, ctx } = makeCanvas(S, S);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2);
  ctx.stroke();
  return finish(c);
}
