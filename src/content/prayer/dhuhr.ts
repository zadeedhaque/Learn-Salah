import type { PrayerDefinition } from '../types';

export const dhuhr: PrayerDefinition = {
  id: 'dhuhr',
  name: { en: 'Dhuhr', bn: 'যোহর', ar: 'الظهر' },
  arabicName: 'الظُّهْر',
  time: {
    en: 'From just after midday, when the sun passes its zenith, until the time of Asr.',
    bn: 'দুপুরে সূর্য পশ্চিমে ঢলে পড়ার পর থেকে আসরের সময় পর্যন্ত।',
    ar: 'من زوال الشمس إلى دخول وقت العصر.',
  },
  fardRakahs: 4,
  aloud: [false, false, false, false],
  sunnah: [
    {
      en: 'Voluntary prayers before and after Dhuhr are emphasised; the number taught (for example four before and two after) differs between the schools.',
      bn: 'যোহরের আগে ও পরে নফল/সুন্নত নামাজের গুরুত্ব আছে; কত রাকাত (যেমন আগে চার ও পরে দুই) — তা মাযহাবভেদে ভিন্ন।',
      ar: 'تتأكد النوافل قبل الظهر وبعدها، ويختلف العدد المعلَّم (كأربع قبلها وركعتين بعدها) بين المذاهب.',
    },
  ],
  summary: {
    en: 'Four rak’ahs, recited silently, with a first sitting after the second rak’ah.',
    bn: 'চার রাকাত, নিঃশব্দে পড়া হয়; দ্বিতীয় রাকাতের পর প্রথম বৈঠক।',
    ar: 'أربع ركعات سرية، مع تشهد أول بعد الركعة الثانية.',
  },
  notes: [
    {
      en: 'On Friday, the congregational Jumu’ah prayer of two rak’ahs replaces Dhuhr for those required to attend it.',
      bn: 'শুক্রবার যাদের উপর জুমআ আবশ্যক, তাদের জন্য দুই রাকাতের জুমআর নামাজ যোহরের স্থলাভিষিক্ত হয়।',
    },
  ],
  sources: ['bukhari-350', 'muslim-612', 'muslim-728', 'bukhari-776'],
};
