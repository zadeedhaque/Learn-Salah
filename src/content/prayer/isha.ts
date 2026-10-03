import type { PrayerDefinition } from '../types';

export const isha: PrayerDefinition = {
  id: 'isha',
  name: { en: 'Isha', bn: 'এশা', ar: 'العشاء' },
  arabicName: 'العِشَاء',
  time: {
    en: 'From the end of Maghrib time; praying it before the middle of the night is preferred.',
    bn: 'মাগরিবের সময় শেষ হওয়ার পর থেকে; মধ্যরাতের আগে পড়া উত্তম।',
    ar: 'من انتهاء وقت المغرب، والأفضل أداؤها قبل منتصف الليل.',
  },
  fardRakahs: 4,
  aloud: [true, true, false, false],
  sunnah: [
    {
      en: 'Two rak’ahs after Isha are emphasised.',
      bn: 'এশার পর দুই রাকাত সুন্নত গুরুত্বপূর্ণ।',
      ar: 'ركعتان بعد العشاء مؤكدتان.',
    },
  ],
  witr: {
    en: 'Witr is prayed after Isha and before Fajr. Hanafi: wajib, three rak’ahs. Shafi’i, Maliki and Hanbali: an emphasised sunnah, from one rak’ah upwards.',
    bn: 'বিতর এশার পর ও ফজরের আগে পড়া হয়। হানাফি: ওয়াজিব, তিন রাকাত। শাফেয়ি, মালেকি ও হাম্বলি: সুন্নতে মুয়াক্কাদা, এক রাকাত বা তার বেশি।',
    ar: 'يُصلى الوتر بعد العشاء وقبل الفجر. الحنفية: واجب ثلاث ركعات. الشافعية والمالكية والحنابلة: سنة مؤكدة من ركعة فأكثر.',
  },
  summary: {
    en: 'Four rak’ahs. The imam recites aloud in the first two; a first sitting follows the second rak’ah.',
    bn: 'চার রাকাত। প্রথম দুই রাকাতে ইমাম উচ্চস্বরে পড়েন; দ্বিতীয় রাকাতের পর প্রথম বৈঠক।',
    ar: 'أربع ركعات، يجهر الإمام في الأوليين، مع تشهد أول بعد الثانية.',
  },
  notes: [],
  sources: ['bukhari-350', 'muslim-612', 'muslim-728'],
};
