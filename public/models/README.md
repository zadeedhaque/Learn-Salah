# Replacing the 3D figure

By default the site renders a **procedurally generated faceless figure** (no assets needed).

To use your own rigged model instead:

1. Export a faceless, modestly dressed humanoid as `prayer-person.glb` (Draco compression is supported) and place it in this folder.
2. Create `.env.local` in the project root:

   ```
   VITE_PRAYER_MODEL=gltf
   # If the skeleton uses Mixamo bone names:
   VITE_PRAYER_MODEL_BONES=mixamo
   ```

3. Restart `npm run dev`.

Requirements: the model faces **+Z**, is roughly T/A-posed, ~1.75 m tall, and its bones use either the
internal names (`hips, spine, chest, neck, head, upperArmL, forearmL, handL, thighL, shinL, footL, toesL, …`)
or Mixamo names. Every pose is retargeted automatically (`src/three/animation/retarget.ts`). If the file fails
to load, the site falls back to the built-in figure.
