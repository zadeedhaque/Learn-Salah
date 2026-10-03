# Learn Salah

An interactive 3D guide to the movements, recitations and structure of Salah.
**Don't just read how to pray. See it. Learn it. Practice it.**

Live: https://zadeedhaque.github.io/Learn-Salah/

## Run locally

```bash
npm install
npm run dev
```

`npm run build` produces a static site in `dist/` (relative paths, hash routing — host it anywhere).
Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Stack

React 19 · TypeScript · Vite · Three.js / React Three Fiber / Drei · Tailwind CSS 4 · Motion · Zustand

## How it fits together

| Area | Where |
| --- | --- |
| Faceless figure (procedural, skinned) | `src/three/model/proceduralHuman.ts` |
| Skeleton, IK, pose library | `src/three/rig/` (`node scripts/pose-check.ts` prints contact points) |
| Central animation system (`transitionToPose`, waypoints, madhhab-aware paths) | `src/three/animation/` |
| Public 3D API (`playAnimation`, `transitionToPose`, `setCameraView`) | `src/three/engine.ts` |
| Camera presets (front / 3/4 / side, auto camera) | `src/three/camera.ts`, `src/components/3d/CameraController.tsx` |
| Religious content (steps, recitations, sources, prayers) | `src/content/prayer/` |
| Madhhab practices & differences | `src/content/madhabs/` |
| UI strings (English, বাংলা, العربية) | `src/locales/*.json` |
| Swap in a real `.glb` | `public/models/README.md` |
| Add verified audio | `public/audio/README.md` |

## Content review

All instructional content is **data**, separate from the UI, so a qualified scholar can review it.
Every step lists its sources (Qur'an, hadith with sunnah.com numbering, and the standard fiqh reference for each school)
and is marked *draft* until reviewed. Rulings are shown per school (fard, wajib, sunnah, recommended, …), and
differences between the four schools are presented side by side without ranking them.

This website is an educational resource. For religious rulings and individual circumstances, consult a qualified scholar.
