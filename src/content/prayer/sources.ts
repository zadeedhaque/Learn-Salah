import type { Source } from '../types';

/**
 * Reference list. Hadith numbers follow sunnah.com numbering; Qur'an references are
 * surah:ayah. Every entry states what it is cited for so a reviewer can verify it.
 * Fiqh works are listed as the standard references for each school's positions;
 * page-level citations are to be added during scholarly review.
 */
const q = (ref: string, en: string, bn?: string): Source => {
  const [s, a] = ref.split(':');
  return {
    id: `quran-${s}${a ? `-${a}` : ''}`,
    kind: 'quran',
    work: "Qur'an",
    reference: ref,
    url: `https://quran.com/${s}${a ? `/${a}` : ''}`,
    summary: { en, bn },
  };
};

const h = (collection: 'bukhari' | 'muslim' | 'abudawud', n: number, en: string, bn?: string): Source => ({
  id: `${collection}-${n}`,
  kind: 'hadith',
  work: { bukhari: 'Sahih al-Bukhari', muslim: 'Sahih Muslim', abudawud: 'Sunan Abi Dawud' }[collection],
  reference: String(n),
  url: `https://sunnah.com/${collection}:${n}`,
  summary: { en, bn },
});

const list: Source[] = [
  q('1', 'Surah al-Fatihah, recited in every rak’ah.', 'সূরা ফাতিহা, প্রতি রাকাতে পড়া হয়।'),
  q('2:43', 'The command to establish prayer.', 'নামাজ কায়েমের নির্দেশ।'),
  q('2:144', 'Facing the Sacred Mosque (the qiblah) in prayer.', 'নামাজে মসজিদুল হারামের (কিবলার) দিকে মুখ করা।'),
  q('2:201', 'The supplication “Our Lord, give us good in this world…”.', '“হে আমাদের প্রতিপালক, আমাদের দুনিয়াতে কল্যাণ দিন…” দোয়া।'),
  q('2:238', 'Guarding the prayers and standing before Allah devoutly.', 'নামাজের হেফাজত ও বিনয়ের সাথে দাঁড়ানো।'),
  q('4:103', 'Prayer is prescribed at fixed times.', 'নামাজ নির্ধারিত সময়ে ফরজ।'),
  q('5:6', 'The washing that makes up wudu.', 'অজুর অঙ্গসমূহ ধোয়ার বিবরণ।'),
  q('7:31', 'Taking one’s adornment (proper dress) at every place of prayer.', 'প্রত্যেক নামাজের সময় সুন্দর পোশাক পরিধান।'),
  q('16:98', 'Seeking refuge in Allah from Satan before reciting the Qur’an.', 'কুরআন পাঠের আগে শয়তান থেকে আল্লাহর আশ্রয় চাওয়া।'),
  q('20:14', '“Establish prayer for My remembrance.”', '“আমার স্মরণের জন্য নামাজ কায়েম করো।”'),
  q('29:45', 'Prayer restrains from indecency and wrongdoing.', 'নামাজ অশ্লীলতা ও অন্যায় থেকে বিরত রাখে।'),
  q('112', 'Surah al-Ikhlas, a short surah commonly recited after al-Fatihah.', 'সূরা ইখলাস, ফাতিহার পর বহুল পঠিত ছোট সূরা।'),

  h('bukhari', 1, 'Actions are judged by intentions.', 'সকল কাজ নিয়তের উপর নির্ভরশীল।'),
  h('bukhari', 8, 'Islam is built upon five pillars, including prayer.', 'ইসলাম পাঁচটি স্তম্ভের উপর প্রতিষ্ঠিত, যার একটি নামাজ।'),
  h('bukhari', 350, 'How the number of rak’ahs in the prayers was prescribed.', 'নামাজের রাকাত সংখ্যা যেভাবে নির্ধারিত হয়েছে।'),
  h('bukhari', 528, 'The five prayers compared to bathing in a river five times a day.', 'পাঁচ ওয়াক্ত নামাজকে দিনে পাঁচবার নদীতে গোসলের সাথে তুলনা।'),
  h('bukhari', 631, '“Pray as you have seen me praying.”', '“তোমরা আমাকে যেভাবে নামাজ পড়তে দেখেছ, সেভাবে নামাজ পড়ো।”'),
  h('bukhari', 735, 'Raising the hands at the opening takbir, when bowing and when rising from bowing.', 'তাকবিরে তাহরিমা, রুকুতে যাওয়া ও রুকু থেকে ওঠার সময় হাত তোলা।'),
  h('bukhari', 739, 'Raising the hands when standing up after two rak’ahs.', 'দুই রাকাতের পর দাঁড়ানোর সময় হাত তোলা।'),
  h('bukhari', 740, 'Placing the right hand on the left forearm in prayer.', 'নামাজে ডান হাত বাম হাতের বাহুর উপর রাখা।'),
  h('bukhari', 756, 'There is no prayer for one who does not recite al-Fatihah.', 'যে সূরা ফাতিহা পড়ে না তার নামাজ হয় না।'),
  h('bukhari', 757, 'The Prophet ﷺ teaching a man to pray with calm in each position.', 'নবী ﷺ একজন ব্যক্তিকে প্রতিটি অবস্থানে ধীরস্থিরভাবে নামাজ শেখান।'),
  h('bukhari', 776, 'Al-Fatihah and a surah in the first two rak’ahs; al-Fatihah alone in the last two.', 'প্রথম দুই রাকাতে ফাতিহা ও সূরা; শেষ দুই রাকাতে শুধু ফাতিহা।'),
  h('bukhari', 780, 'Saying “Amin” after al-Fatihah.', 'সূরা ফাতিহার পর “আমিন” বলা।'),
  h('bukhari', 789, 'Takbir at each movement; “Sami’allahu liman hamidah” and “Rabbana wa lakal-hamd”.', 'প্রতিটি পরিবর্তনে তাকবির; “সামিআল্লাহু লিমান হামিদাহ” ও “রব্বানা ওয়া লাকাল হামদ”।'),
  h('bukhari', 812, 'Prostrating on seven parts of the body.', 'শরীরের সাতটি অঙ্গের উপর সিজদা করা।'),
  h('bukhari', 823, 'Sitting briefly before rising in an odd-numbered rak’ah.', 'বিজোড় রাকাত থেকে ওঠার আগে সামান্য বসা।'),
  h('bukhari', 828, 'Abu Humayd’s description: hands on knees, level back, and the sitting postures.', 'আবু হুমাইদের বর্ণনা: হাঁটুতে হাত, সোজা পিঠ ও বসার পদ্ধতি।'),
  h('bukhari', 831, 'The tashahhud as taught by Ibn Mas’ud.', 'ইবনে মাসউদ (রা.) বর্ণিত তাশাহহুদ।'),
  h('bukhari', 3370, 'The wording of the Salawat Ibrahimiyyah.', 'দরুদে ইবরাহিমের শব্দাবলি।'),
  h('muslim', 401, 'Placing the right hand over the left in prayer.', 'নামাজে ডান হাত বাম হাতের উপর রাখা।'),
  h('muslim', 498, '‘A’ishah’s description of the Prophet’s prayer.', 'আয়েশা (রা.) বর্ণিত নবী ﷺ-এর নামাজের বিবরণ।'),
  h('muslim', 580, 'Pointing with the right index finger in the tashahhud.', 'তাশাহহুদে ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করা।'),
  h('muslim', 582, 'Giving salam to the right and to the left.', 'ডানে ও বামে সালাম ফেরানো।'),
  h('muslim', 612, 'The beginning and end of each prayer’s time.', 'প্রতিটি নামাজের সময়ের শুরু ও শেষ।'),
  h('muslim', 725, 'The virtue of the two rak’ahs before Fajr.', 'ফজরের আগের দুই রাকাতের ফজিলত।'),
  h('muslim', 728, 'The twelve voluntary rak’ahs prayed each day.', 'প্রতিদিনের বারো রাকাত নফল/সুন্নত নামাজ।'),
  h('muslim', 772, 'Glorifying Allah in ruku’ and sujood.', 'রুকু ও সিজদায় আল্লাহর পবিত্রতা ঘোষণা।'),
  h('abudawud', 61, 'Prayer begins with the takbir and ends with the salam.', 'নামাজ তাকবির দিয়ে শুরু ও সালাম দিয়ে শেষ হয়।'),
  h('abudawud', 775, 'The opening supplication “Subhanaka Allahumma…”.', 'সানা: “সুবহানাকা আল্লাহুম্মা…”।'),
  h('abudawud', 874, '“Rabbighfir li” between the two prostrations.', 'দুই সিজদার মাঝে “রব্বিগফিরলি”।'),
  h('abudawud', 996, 'The wording of the salam to the right and left.', 'ডানে ও বামে সালামের শব্দ।'),

  {
    id: 'fiqh-hanafi',
    kind: 'scholarly',
    work: 'al-Hidayah (al-Marghinani)',
    reference: 'Kitab al-Salah',
    summary: { en: 'Standard reference for Hanafi positions in this guide.', bn: 'এই নির্দেশিকায় হানাফি মতের প্রামাণ্য গ্রন্থ।' },
  },
  {
    id: 'fiqh-shafii',
    kind: 'scholarly',
    work: 'Minhaj al-Talibin (al-Nawawi)',
    reference: 'Kitab al-Salah',
    summary: { en: "Standard reference for Shafi'i positions in this guide.", bn: 'এই নির্দেশিকায় শাফেয়ি মতের প্রামাণ্য গ্রন্থ।' },
  },
  {
    id: 'fiqh-maliki',
    kind: 'scholarly',
    work: 'Mukhtasar Khalil',
    reference: 'Bab al-Salah',
    summary: { en: 'Standard reference for Maliki positions in this guide.', bn: 'এই নির্দেশিকায় মালেকি মতের প্রামাণ্য গ্রন্থ।' },
  },
  {
    id: 'fiqh-hanbali',
    kind: 'scholarly',
    work: "Zad al-Mustaqni' (al-Hajjawi)",
    reference: 'Kitab al-Salah',
    summary: { en: 'Standard reference for Hanbali positions in this guide.', bn: 'এই নির্দেশিকায় হাম্বলি মতের প্রামাণ্য গ্রন্থ।' },
  },
  {
    id: 'scholar-review',
    kind: 'scholarly',
    work: 'Scholar-reviewed guidance',
    reference: 'Pending',
    summary: {
      en: 'Placeholder for the qualified scholar who reviews and approves this content before publication.',
      bn: 'প্রকাশের আগে এই বিষয়বস্তু পর্যালোচনা ও অনুমোদনকারী যোগ্য আলেমের জন্য সংরক্ষিত স্থান।',
    },
  },
];

export const SOURCES: Record<string, Source> = Object.fromEntries(list.map((s) => [s.id, s]));
export const SOURCE_LIST = list;
