import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BodyPart } from '@/three/model/anchors';
import type { CameraView } from '@/three/camera';
import type { PoseId } from '@/three/rig/poses';
import type { Lang, LessonId, MadhhabId } from '@/content/types';
import { safeJSONStorage } from './safeStorage';

export type StageLayout = 'hero' | 'learn' | 'practice' | 'hidden';
export type ExperienceLevel = 'new' | 'basics' | 'improve' | 'quick';

export interface SceneState {
  pose: PoseId;
  highlights: BodyPart[];
  /** Camera angle preferred by the current step (used when auto camera is on). */
  view: CameraView;
}

interface A11ySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

interface PrayerState {
  lang: Lang;
  madhhab: MadhhabId;
  lessonId: LessonId;
  stepIndex: number;
  scene: SceneState;
  autoCamera: boolean;
  manualView: CameraView;
  animationsOn: boolean;
  highlightsOn: boolean;
  /** Guided playback (Space): auto-advances steps and plays audio when available. */
  playing: boolean;
  audioRate: number;
  layout: StageLayout;
  a11y: A11ySettings;
  onboardingDone: boolean;
  level: ExperienceLevel | null;
  /** Incremented to ask the camera to re-frame (e.g. after a layout change). */
  cameraNonce: number;
  /** Camera angle chosen on the hero screen (independent of the lesson camera). */
  heroView: CameraView | null;
  /** Show 2D illustrations alongside / instead of the 3D figure. */
  illustrated: boolean;

  setLang(lang: Lang): void;
  setMadhhab(m: MadhhabId): void;
  setLesson(id: LessonId, stepIndex?: number): void;
  setStepIndex(i: number): void;
  setScene(s: Partial<SceneState>): void;
  setAutoCamera(on: boolean): void;
  setManualView(v: CameraView): void;
  setAnimationsOn(on: boolean): void;
  setHighlightsOn(on: boolean): void;
  setPlaying(on: boolean): void;
  setAudioRate(r: number): void;
  setLayout(l: StageLayout): void;
  setA11y(p: Partial<A11ySettings>): void;
  completeOnboarding(level: ExperienceLevel | null): void;
  reframe(): void;
  setHeroView(v: CameraView | null): void;
  setIllustrated(on: boolean): void;
}

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set) => ({
      lang: 'en',
      madhhab: 'hanafi',
      lessonId: 'basics',
      stepIndex: 0,
      scene: { pose: 'qiyam_navel', highlights: [], view: 'threeQuarter' },
      autoCamera: true,
      manualView: 'threeQuarter',
      animationsOn: true,
      highlightsOn: true,
      playing: false,
      audioRate: 1,
      layout: 'hero',
      a11y: { reducedMotion: prefersReducedMotion(), highContrast: false, largeText: false },
      onboardingDone: false,
      level: null,
      cameraNonce: 0,
      heroView: null,
      illustrated: false,

      setLang: (lang) => set({ lang }),
      setMadhhab: (madhhab) => set({ madhhab }),
      setLesson: (lessonId, stepIndex = 0) => set({ lessonId, stepIndex }),
      setStepIndex: (stepIndex) => set({ stepIndex }),
      setScene: (s) => set((st) => ({ scene: { ...st.scene, ...s } })),
      setAutoCamera: (autoCamera) => set((st) => ({ autoCamera, cameraNonce: st.cameraNonce + 1 })),
      setManualView: (manualView) => set((st) => ({ manualView, autoCamera: false, cameraNonce: st.cameraNonce + 1 })),
      setAnimationsOn: (animationsOn) => set({ animationsOn }),
      setHighlightsOn: (highlightsOn) => set({ highlightsOn }),
      setPlaying: (playing) => set({ playing }),
      setAudioRate: (audioRate) => set({ audioRate }),
      setLayout: (layout) => set((st) => (st.layout === layout ? st : { layout, cameraNonce: st.cameraNonce + 1 })),
      setA11y: (p) => set((st) => ({ a11y: { ...st.a11y, ...p } })),
      completeOnboarding: (level) => set({ onboardingDone: true, level }),
      reframe: () => set((st) => ({ cameraNonce: st.cameraNonce + 1 })),
      setHeroView: (heroView) => set({ heroView }),
      setIllustrated: (illustrated) => set({ illustrated }),
    }),
    {
      name: 'learn-salah-settings',
      version: 1,
      storage: safeJSONStorage,
      partialize: (s) => ({
        lang: s.lang,
        madhhab: s.madhhab,
        lessonId: s.lessonId,
        stepIndex: s.stepIndex,
        autoCamera: s.autoCamera,
        manualView: s.manualView,
        animationsOn: s.animationsOn,
        highlightsOn: s.highlightsOn,
        audioRate: s.audioRate,
        a11y: s.a11y,
        onboardingDone: s.onboardingDone,
        level: s.level,
      }),
    },
  ),
);
