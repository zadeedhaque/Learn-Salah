import type { PrayerDefinition } from '../types';

export const maghrib: PrayerDefinition = {
  id: 'maghrib',
  name: { en: 'Maghrib', bn: 'মাগরিব', ar: 'المغرب' },
  arabicName: 'المَغْرِب',
  time: {
    en: 'From sunset until the twilight disappears.',
    bn: 'সূর্যাস্ত থেকে পশ্চিম আকাশের লালিমা মিলিয়ে যাওয়া পর্যন্ত।',
    ar: 'من غروب الشمس إلى مغيب الشفق.',
  },
  fardRakahs: 3,
  aloud: [true, true, false],
  sunnah: [
    {
      en: 'Two rak’ahs after Maghrib are emphasised.',
      bn: 'মাগরিবের পর দুই রাকাত সুন্নত গুরুত্বপূর্ণ।',
      ar: 'ركعتان بعد المغرب مؤكدتان.',
    },
  ],
  summary: {
    en: 'Three rak’ahs. The imam recites aloud in the first two; a first sitting follows the second rak’ah.',
    bn: 'তিন রাকাত। প্রথম দুই রাকাতে ইমাম উচ্চস্বরে পড়েন; দ্বিতীয় রাকাতের পর প্রথম বৈঠক।',
    ar: 'ثلاث ركعات، يجهر الإمام في الأوليين، مع تشهد أول بعد الثانية.',
  },
  notes: [
    {
      en: 'The schools differ on which twilight (red or white) marks the end of Maghrib time.',
      bn: 'মাগরিবের সময় কোন আভা (লাল নাকি সাদা) মিলিয়ে গেলে শেষ হয় — তা নিয়ে মাযহাবভেদ আছে।',
    },
  ],
  sources: ['bukhari-350', 'muslim-612', 'muslim-728'],
};
