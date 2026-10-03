import type { DifferenceTopic, Madhhab, MadhhabId } from '../types';
import { hanafi } from './hanafi';
import { shafii } from './shafii';
import { maliki } from './maliki';
import { hanbali } from './hanbali';

export const MADHHABS: Record<MadhhabId, Madhhab> = { hanafi, shafii, maliki, hanbali };

/** Titles for difference topics, shown above the per-school notes. */
export const DIFFERENCE_TITLES: Record<DifferenceTopic, { en: string; bn: string; ar: string }> = {
  handPlacement: { en: 'Hand position', bn: 'হাত রাখার স্থান', ar: 'موضع اليدين' },
  takbirHands: { en: 'Raising the hands for takbir', bn: 'তাকবিরে হাত তোলা', ar: 'رفع اليدين للتكبير' },
  raisingHands: { en: 'Raising the hands at other points', bn: 'অন্যান্য সময়ে হাত তোলা', ar: 'رفع اليدين في غير التحريمة' },
  openingDua: { en: 'Opening supplication', bn: 'সানা', ar: 'دعاء الاستفتاح' },
  basmalah: { en: 'The basmalah', bn: 'বিসমিল্লাহ', ar: 'البسملة' },
  ameen: { en: 'Saying “Amin”', bn: '“আমিন” বলা', ar: 'التأمين' },
  descent: { en: 'Going down to prostrate', bn: 'সিজদায় যাওয়ার পদ্ধতি', ar: 'الهوي إلى السجود' },
  restSitting: { en: 'Resting sit before rising', bn: 'দাঁড়ানোর আগে বসা', ar: 'جلسة الاستراحة' },
  sittingPosture: { en: 'Sitting posture', bn: 'বসার পদ্ধতি', ar: 'هيئة الجلوس' },
  fingerPointing: { en: 'Pointing with the index finger', bn: 'শাহাদাত আঙুলের ইশারা', ar: 'الإشارة بالسبابة' },
  tashahhudWording: { en: 'Wording of the tashahhud', bn: 'তাশাহহুদের শব্দাবলি', ar: 'صيغة التشهد' },
  salam: { en: 'The salam', bn: 'সালাম', ar: 'التسليم' },
  witr: { en: 'Witr', bn: 'বিতর', ar: 'الوتر' },
  tasbihRuling: { en: 'Glorification in ruku’ and sujood', bn: 'রুকু ও সিজদার তাসবিহ', ar: 'التسبيح في الركوع والسجود' },
};
