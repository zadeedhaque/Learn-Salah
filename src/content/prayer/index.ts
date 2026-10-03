import type { PrayerDefinition, PrayerId } from '../types';
import { fajr } from './fajr';
import { dhuhr } from './dhuhr';
import { asr } from './asr';
import { maghrib } from './maghrib';
import { isha } from './isha';

export const PRAYERS: Record<PrayerId, PrayerDefinition> = { fajr, dhuhr, asr, maghrib, isha };
export { STEPS, PROGRESS_GROUPS } from './movements';
export { RECITATIONS, RECITATION_ORDER } from './recitations';
export { SOURCES, SOURCE_LIST } from './sources';
