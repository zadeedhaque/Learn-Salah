import type { Madhhab } from '../types';

export const hanbali: Madhhab = {
  id: 'hanbali',
  name: { en: 'Hanbali', bn: 'হাম্বলি', ar: 'الحنبلي' },
  arabicName: 'الحَنْبَلِيّ',
  founder: { en: 'Imam Ahmad ibn Hanbal (d. 241 AH)', bn: 'ইমাম আহমাদ ইবনে হাম্বল (মৃ. ২৪১ হি.)', ar: 'الإمام أحمد بن حنبل (ت ٢٤١هـ)' },
  description: {
    en: 'Widely followed in the Arabian Peninsula.',
    bn: 'আরব উপদ্বীপে ব্যাপকভাবে অনুসৃত।',
    ar: 'منتشر في الجزيرة العربية.',
  },
  practice: {
    handPlacement: 'navel',
    takbirHands: 'shoulders',
    descent: 'knees',
    restBeforeRising: false,
    jalsaPosture: 'iftirash',
    firstSitting: 'iftirash',
    finalSitting: 'tawarruk',
    singleSitting: 'iftirash',
  },
  differences: {
    handPlacement: {
      text: {
        en: 'The right hand is placed over the left, below the navel.',
        bn: 'ডান হাত বাম হাতের উপর, নাভির নিচে রাখা হয়।',
        ar: 'توضع اليد اليمنى على اليسرى تحت السرة.',
      },
      sources: ['fiqh-hanbali'],
    },
    takbirHands: {
      text: {
        en: 'The hands are raised to the shoulders or to the ears; both are reported.',
        bn: 'কাঁধ বা কান পর্যন্ত হাত তোলা হয়; উভয়ই বর্ণিত।',
        ar: 'تُرفع اليدان حذو المنكبين أو إلى الأذنين، وكلاهما وارد.',
      },
      sources: ['fiqh-hanbali'],
    },
    raisingHands: {
      text: {
        en: 'The hands are also raised when going into ruku’ and when rising from it.',
        bn: 'রুকুতে যাওয়ার সময় ও রুকু থেকে ওঠার সময়ও হাত তোলা হয়।',
        ar: 'تُرفع اليدان أيضًا عند الركوع وعند الرفع منه.',
      },
      sources: ['bukhari-735', 'fiqh-hanbali'],
    },
    openingDua: {
      text: {
        en: 'The opening supplication “Subhanaka Allahumma…” is sunnah, followed quietly by the ta’awwudh and basmalah.',
        bn: 'সানা “সুবহানাকা আল্লাহুম্মা…” পড়া সুন্নত; এরপর নিঃশব্দে আউযুবিল্লাহ ও বিসমিল্লাহ।',
        ar: 'يُسن الاستفتاح بـ«سبحانك اللهم…» ثم التعوذ والبسملة سرًّا.',
      },
      sources: ['abudawud-775', 'fiqh-hanbali'],
    },
    basmalah: {
      text: {
        en: 'The basmalah is recited quietly, even in audible prayers.',
        bn: 'উচ্চস্বরের নামাজেও বিসমিল্লাহ নিঃশব্দে পড়া হয়।',
        ar: 'تُقرأ البسملة سرًّا ولو في الجهرية.',
      },
      sources: ['fiqh-hanbali'],
    },
    ameen: {
      text: { en: '“Amin” is said aloud in audible prayers.', bn: 'উচ্চস্বরের নামাজে “আমিন” জোরে বলা হয়।', ar: 'يُجهر بـ«آمين» في الجهرية.' },
      sources: ['bukhari-780', 'fiqh-hanbali'],
    },
    descent: {
      text: {
        en: 'Going down to prostrate, the knees are placed first, then the hands, then the forehead and nose.',
        bn: 'সিজদায় যাওয়ার সময় প্রথমে হাঁটু, তারপর হাত, তারপর কপাল ও নাক রাখা হয়।',
        ar: 'تُوضع الركبتان ثم اليدان ثم الجبهة والأنف.',
      },
      sources: ['fiqh-hanbali'],
    },
    restSitting: {
      text: {
        en: 'In the relied-upon position, one rises without a resting sit.',
        bn: 'নির্ভরযোগ্য মতে না বসেই দাঁড়িয়ে যাওয়া হয়।',
        ar: 'المعتمد أنه ينهض دون جلسة استراحة.',
      },
      sources: ['fiqh-hanbali'],
    },
    sittingPosture: {
      text: {
        en: 'Iftirash between the prostrations, in the first sitting and in the sitting of a two-rak’ah prayer; tawarruk in the final sitting of prayers with two sittings.',
        bn: 'দুই সিজদার মাঝে, প্রথম বৈঠকে এবং দুই রাকাতের নামাজের বৈঠকে ইফতিরাশ; দুই বৈঠকবিশিষ্ট নামাজের শেষ বৈঠকে তাওয়াররুক।',
        ar: 'الافتراش بين السجدتين وفي التشهد الأول وفي تشهد الثنائية، والتورك في التشهد الأخير من الصلاة ذات التشهدين.',
      },
      sources: ['bukhari-828', 'fiqh-hanbali'],
    },
    fingerPointing: {
      text: {
        en: 'The right index finger is raised and pointed whenever Allah is mentioned, without continuous movement.',
        bn: 'আল্লাহর নাম উচ্চারণের সময় ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করা হয়, অবিরাম নাড়ানো হয় না।',
        ar: 'يُشار بالسبابة كلما ذُكر الله دون تحريك مستمر.',
      },
      sources: ['fiqh-hanbali'],
    },
    tashahhudWording: {
      text: {
        en: 'The tashahhud of Ibn Mas’ud, shown here, is used.',
        bn: 'এখানে দেখানো ইবনে মাসউদ (রা.)-এর তাশাহহুদ পড়া হয়।',
        ar: 'يُعمل بتشهد ابن مسعود المعروض هنا.',
      },
      sources: ['bukhari-831', 'fiqh-hanbali'],
    },
    salam: {
      text: {
        en: 'Both salams are obligatory in the relied-upon position.',
        bn: 'নির্ভরযোগ্য মতে দুটি সালামই ফরজ।',
        ar: 'التسليمتان ركن على المعتمد.',
      },
      sources: ['fiqh-hanbali'],
    },
    witr: {
      text: {
        en: 'Witr is an emphasised sunnah of one to eleven rak’ahs, commonly three, with qunut after the ruku’ of the last rak’ah.',
        bn: 'বিতর সুন্নতে মুয়াক্কাদা, এক থেকে এগারো রাকাত, সাধারণত তিন রাকাত; শেষ রাকাতের রুকুর পর কুনুত।',
        ar: 'الوتر سنة مؤكدة من ركعة إلى إحدى عشرة، وغالبًا ثلاث، ويُقنت بعد الركوع في الأخيرة.',
      },
      sources: ['fiqh-hanbali'],
    },
    tasbihRuling: {
      text: {
        en: 'Saying the tasbih once in ruku’ and sujood is wajib; three times is the recommended minimum of perfection.',
        bn: 'রুকু ও সিজদায় একবার তাসবিহ পড়া ওয়াজিব; পূর্ণতার জন্য অন্তত তিনবার মুস্তাহাব।',
        ar: 'التسبيح مرة في الركوع والسجود واجب، وأدنى الكمال ثلاث.',
      },
      sources: ['fiqh-hanbali'],
    },
  },
};
