import type { PrayerDefinition } from '../types';

export const fajr: PrayerDefinition = {
  id: 'fajr',
  name: { en: 'Fajr', bn: 'ফজর', ar: 'الفجر' },
  arabicName: 'الفَجْر',
  time: {
    en: 'From true dawn until sunrise.',
    bn: 'সুবহে সাদিক থেকে সূর্যোদয় পর্যন্ত।',
    ar: 'من طلوع الفجر الصادق إلى طلوع الشمس.',
  },
  fardRakahs: 2,
  aloud: [true, true],
  sunnah: [
    {
      en: 'Two rak’ahs before the fard are strongly emphasised in all four schools.',
      bn: 'ফরজের আগে দুই রাকাত সুন্নত চার মাযহাবেই অত্যন্ত গুরুত্বপূর্ণ।',
      ar: 'ركعتان قبل الفرض مؤكدتان في المذاهب الأربعة.',
    },
  ],
  summary: {
    en: 'Two rak’ahs. The imam recites aloud in both.',
    bn: 'দুই রাকাত। উভয় রাকাতে ইমাম উচ্চস্বরে পড়েন।',
    ar: 'ركعتان يجهر الإمام فيهما بالقراءة.',
  },
  notes: [
    {
      en: "Shafi'i: a qunut supplication after rising from the ruku’ of the second rak’ah is sunnah. Maliki: a quiet qunut before the ruku’ of the second rak’ah is recommended. Hanafi and Hanbali: no regular qunut in Fajr.",
      bn: 'শাফেয়ি: দ্বিতীয় রাকাতের রুকু থেকে ওঠার পর কুনুত পড়া সুন্নত। মালেকি: দ্বিতীয় রাকাতের রুকুর আগে নিঃশব্দে কুনুত মুস্তাহাব। হানাফি ও হাম্বলি: ফজরে নিয়মিত কুনুত নেই।',
    },
  ],
  sources: ['bukhari-350', 'muslim-612', 'muslim-725'],
};
