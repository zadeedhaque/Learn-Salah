# Recitation audio

No audio is shipped until verified recordings are available — the player shows "Audio coming soon".

To add a recording:

1. Put the file here, e.g. `fatiha.mp3` (file names are set per recitation in `src/content/prayer/recitations.ts`).
2. List it in `manifest.json`:

   ```json
   { "available": ["fatiha.mp3"] }
   ```

Files are only fetched when the learner presses play.
