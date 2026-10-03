import type { BodyPart } from '@/three/model/anchors';
import type { CameraView } from '@/three/camera';

/**
 * Content schema.
 *
 * All religious content (instructions, Arabic, transliteration, translations,
 * madhhab differences, rulings and sources) lives in /src/content as plain data so
 * it can be reviewed and corrected by a qualified scholar without touching the UI.
 */

export type Lang = 'en' | 'bn' | 'ar';
export const LANGS: Lang[] = ['en', 'bn', 'ar'];

/** Localised text. English is required; other languages fall back to English. */
export interface L10n {
  en: string;
  bn?: string;
  ar?: string;
}

export type MadhhabId = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';
export const MADHHAB_IDS: MadhhabId[] = ['hanafi', 'shafii', 'maliki', 'hanbali'];

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYER_IDS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type LessonId = 'basics' | 'beginner' | PrayerId;

/** Ruling categories. `condition` = a precondition (shart) of the prayer's validity. */
export type RulingLevel = 'fard' | 'wajib' | 'sunnah' | 'recommended' | 'optional' | 'condition' | 'notPracticed';

export type ReviewStatus = 'draft' | 'reviewed';

/** Abstract positions; resolved to concrete poses per madhhab (see resolve.ts). */
export type AbstractPose =
  | 'stand'
  | 'qiyam'
  | 'takbir'
  | 'ruku'
  | 'itidal'
  | 'sujood'
  | 'jalsa'
  | 'firstSitting'
  | 'finalSitting'
  | 'salamRight'
  | 'salamLeft';

export interface Source {
  id: string;
  kind: 'quran' | 'hadith' | 'scholarly';
  /** Collection or work, e.g. "Sahih al-Bukhari". */
  work: string;
  /** Precise reference, e.g. "757" or "2:144". */
  reference: string;
  url?: string;
  /** What this source is cited for. */
  summary: L10n;
}

export type RecitationId =
  | 'takbir'
  | 'opening'
  | 'taawwudh'
  | 'fatiha'
  | 'ikhlas'
  | 'ruku'
  | 'rising'
  | 'sujood'
  | 'betweenSujood'
  | 'tashahhud'
  | 'salawat'
  | 'dua'
  | 'salam';

export interface RecitationLine {
  arabic: string;
  transliteration: string;
  translation: L10n;
}

export interface Recitation {
  id: RecitationId;
  title: L10n;
  lines: RecitationLine[];
  /** When it is said in the prayer. */
  when: L10n;
  /** Commonly taught number of repetitions, if any. */
  repeat?: L10n;
  /** File name inside /public/audio. Only played if listed in /public/audio/manifest.json. */
  audio?: string;
  /** The lesson step this recitation belongs to (moves the 3D figure there). */
  stepId: StepId;
  note?: L10n;
  sources: string[];
  review: ReviewStatus;
}

export type DifferenceTopic =
  | 'handPlacement'
  | 'takbirHands'
  | 'raisingHands'
  | 'openingDua'
  | 'basmalah'
  | 'ameen'
  | 'descent'
  | 'restSitting'
  | 'sittingPosture'
  | 'fingerPointing'
  | 'tashahhudWording'
  | 'salam'
  | 'witr'
  | 'tasbihRuling';

export interface Difference {
  text: L10n;
  sources?: string[];
}

export type RulingSet = { common?: RulingLevel } & Partial<Record<MadhhabId, RulingLevel>>;

export interface StepRuling {
  /** What the ruling refers to, e.g. "Bowing (ruku')". */
  subject: L10n;
  levels: RulingSet;
  note?: L10n;
}

export type StepId =
  | 'intro'
  | 'what-is-salah'
  | 'why-pray'
  | 'prayer-times'
  | 'wudu'
  | 'qiblah'
  | 'preparation'
  | 'niyyah'
  | 'takbir'
  | 'qiyam'
  | 'fatiha'
  | 'surah'
  | 'ruku'
  | 'itidal'
  | 'sujood'
  | 'jalsa'
  | 'sujood-second'
  | 'rise'
  | 'tashahhud'
  | 'salawat'
  | 'dua'
  | 'salam-right'
  | 'salam-left'
  | 'complete';

export interface Highlight {
  part: BodyPart;
  label: L10n;
}

export interface StepContent {
  id: StepId;
  group: 'foundations' | 'movement' | 'recitation' | 'closing';
  title: L10n;
  arabicTitle?: string;
  subtitle: L10n;
  /** WHAT to do — one or two sentences. */
  instruction: L10n;
  /** HOW — concrete positioning points. */
  how: L10n[];
  /** Optional background explanation. */
  explanation?: L10n;
  pose: AbstractPose;
  /** Most informative camera angle for this step. */
  camera: CameraView;
  highlights: Highlight[];
  /** WHAT TO SAY. */
  recitations: RecitationId[];
  rulings: StepRuling[];
  differences: DifferenceTopic[];
  sources: string[];
  review: ReviewStatus;
}

export interface MadhhabPractice {
  handPlacement: 'navel' | 'chest' | 'sides';
  takbirHands: 'ears' | 'shoulders';
  descent: 'knees' | 'hands';
  restBeforeRising: boolean;
  /** Posture when sitting between the two prostrations. */
  jalsaPosture: 'iftirash' | 'tawarruk';
  /** Posture in the first (middle) sitting of 3–4 rak'ah prayers. */
  firstSitting: 'iftirash' | 'tawarruk';
  /** Posture in the final sitting of prayers with two sittings. */
  finalSitting: 'iftirash' | 'tawarruk';
  /** Posture in the only sitting of a two-rak'ah prayer. */
  singleSitting: 'iftirash' | 'tawarruk';
}

export interface Madhhab {
  id: MadhhabId;
  name: L10n;
  arabicName: string;
  founder: L10n;
  description: L10n;
  practice: MadhhabPractice;
  differences: Record<DifferenceTopic, Difference>;
}

export interface PrayerDefinition {
  id: PrayerId;
  name: L10n;
  arabicName: string;
  time: L10n;
  fardRakahs: 2 | 3 | 4;
  /** Whether the imam recites aloud in each rak'ah. */
  aloud: boolean[];
  sunnah: L10n[];
  witr?: L10n;
  summary: L10n;
  notes: L10n[];
  sources: string[];
}

export interface LessonStep {
  /** Unique within the lesson. */
  key: string;
  stepId: StepId;
  rakah?: number;
  totalRakahs?: number;
  /** For sittings: first (middle) sitting or final sitting. */
  sitting?: 'first' | 'final' | 'only';
  aloud?: boolean;
  /** Extra context shown above the step, e.g. "Rak'ah 3 of 4". */
  context?: L10n;
}
