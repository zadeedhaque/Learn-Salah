import type { PrayerDefinition } from '../types';

export const asr: PrayerDefinition = {
  id: 'asr',
  name: { en: 'Asr', bn: 'আসর', ar: 'العصر' },
  arabicName: 'العَصْر',
  time: {
    en: 'From the end of Dhuhr time until sunset; it should not be delayed until the sun yellows.',
    bn: 'যোহরের সময় শেষ হওয়া থেকে সূর্যাস্ত পর্যন্ত; সূর্য হলুদ হয়ে যাওয়া পর্যন্ত বিলম্ব করা উচিত নয়।',
    ar: 'من انتهاء وقت الظهر إلى غروب الشمس، ولا ينبغي تأخيرها إلى اصفرار الشمس.',
  },
  fardRakahs: 4,
  aloud: [false, false, false, false],
  sunnah: [
    {
      en: 'Voluntary prayer before Asr is reported as recommended; no voluntary prayer is offered after Asr until sunset.',
      bn: 'আসরের আগে নফল নামাজ মুস্তাহাব বলে বর্ণিত; আসরের পর সূর্যাস্ত পর্যন্ত নফল নামাজ পড়া হয় না।',
      ar: 'يُستحب التطوع قبل العصر، ولا يُتطوع بعدها حتى الغروب.',
    },
  ],
  summary: {
    en: 'Four rak’ahs, recited silently, with a first sitting after the second rak’ah.',
    bn: 'চার রাকাত, নিঃশব্দে পড়া হয়; দ্বিতীয় রাকাতের পর প্রথম বৈঠক।',
    ar: 'أربع ركعات سرية، مع تشهد أول بعد الركعة الثانية.',
  },
  notes: [
    {
      en: 'Hanafi: Asr begins when an object’s shadow is twice its length (beyond its midday shadow); the other schools: when it equals its length.',
      bn: 'হানাফি: কোনো বস্তুর ছায়া (দুপুরের ছায়া বাদে) তার দ্বিগুণ হলে আসর শুরু হয়; অন্যান্য মাযহাব: সমান হলে।',
    },
  ],
  sources: ['bukhari-350', 'muslim-612'],
};
