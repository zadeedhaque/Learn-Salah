import type { Madhhab } from '../types';

export const hanafi: Madhhab = {
  id: 'hanafi',
  name: { en: 'Hanafi', bn: 'হানাফি', ar: 'الحنفي' },
  arabicName: 'الحَنَفِيّ',
  founder: { en: 'Imam Abu Hanifah (d. 150 AH)', bn: 'ইমাম আবু হানিফা (মৃ. ১৫০ হি.)', ar: 'الإمام أبو حنيفة (ت ١٥٠هـ)' },
  description: {
    en: 'Widely followed in South Asia, Turkey, Central Asia and the Balkans.',
    bn: 'দক্ষিণ এশিয়া, তুরস্ক, মধ্য এশিয়া ও বলকান অঞ্চলে ব্যাপকভাবে অনুসৃত।',
    ar: 'منتشر في جنوب آسيا وتركيا وآسيا الوسطى والبلقان.',
  },
  practice: {
    handPlacement: 'navel',
    takbirHands: 'ears',
    descent: 'knees',
    restBeforeRising: false,
    jalsaPosture: 'iftirash',
    firstSitting: 'iftirash',
    finalSitting: 'iftirash',
    singleSitting: 'iftirash',
  },
  differences: {
    handPlacement: {
      text: {
        en: 'Men place the right hand over the left below the navel. Women are taught to place the hands on the chest.',
        bn: 'পুরুষেরা নাভির নিচে ডান হাত বাম হাতের উপর রাখেন। নারীদের বুকের উপর হাত রাখতে শেখানো হয়।',
        ar: 'يضع الرجل يده اليمنى على اليسرى تحت السرة، وتضع المرأة يديها على صدرها.',
      },
      sources: ['fiqh-hanafi'],
    },
    takbirHands: {
      text: {
        en: 'Men raise the hands until the thumbs are level with the earlobes; women raise them to the shoulders.',
        bn: 'পুরুষেরা বৃদ্ধাঙ্গুল কানের লতি বরাবর পর্যন্ত হাত তোলেন; নারীরা কাঁধ পর্যন্ত।',
        ar: 'يرفع الرجل يديه حتى يحاذي بإبهاميه شحمتي أذنيه، والمرأة إلى منكبيها.',
      },
      sources: ['fiqh-hanafi'],
    },
    raisingHands: {
      text: {
        en: 'The hands are raised only with the opening takbir, not when bowing or rising from ruku’.',
        bn: 'শুধু তাকবিরে তাহরিমার সময় হাত তোলা হয়; রুকুতে যাওয়া বা রুকু থেকে ওঠার সময় নয়।',
        ar: 'لا تُرفع اليدان إلا في تكبيرة الإحرام، لا عند الركوع ولا عند الرفع منه.',
      },
      sources: ['fiqh-hanafi'],
    },
    openingDua: {
      text: {
        en: 'The opening supplication “Subhanaka Allahumma…” (thana) is sunnah, followed quietly by the ta’awwudh and basmalah.',
        bn: 'সানা “সুবহানাকা আল্লাহুম্মা…” পড়া সুন্নত; এরপর নিঃশব্দে আউযুবিল্লাহ ও বিসমিল্লাহ।',
        ar: 'يُسن دعاء الاستفتاح «سبحانك اللهم…» ثم التعوذ والبسملة سرًّا.',
      },
      sources: ['abudawud-775', 'fiqh-hanafi'],
    },
    basmalah: {
      text: {
        en: 'The basmalah is recited quietly before al-Fatihah, even in audible prayers.',
        bn: 'উচ্চস্বরের নামাজেও সূরা ফাতিহার আগে বিসমিল্লাহ নিঃশব্দে পড়া হয়।',
        ar: 'تُقرأ البسملة سرًّا قبل الفاتحة ولو في الصلاة الجهرية.',
      },
      sources: ['fiqh-hanafi'],
    },
    ameen: {
      text: { en: '“Amin” is said quietly.', bn: '“আমিন” নিঃশব্দে বলা হয়।', ar: 'يُقال «آمين» سرًّا.' },
      sources: ['fiqh-hanafi'],
    },
    descent: {
      text: {
        en: 'Going down to prostrate, the knees are placed first, then the hands, then the nose and forehead.',
        bn: 'সিজদায় যাওয়ার সময় প্রথমে হাঁটু, তারপর হাত, তারপর নাক ও কপাল রাখা হয়।',
        ar: 'عند الهوي للسجود تُوضع الركبتان أولًا ثم اليدان ثم الأنف والجبهة.',
      },
      sources: ['fiqh-hanafi'],
    },
    restSitting: {
      text: {
        en: 'One rises directly from the second prostration to standing, without a resting sit.',
        bn: 'দ্বিতীয় সিজদা থেকে না বসে সরাসরি দাঁড়িয়ে যাওয়া হয়।',
        ar: 'ينهض من السجدة الثانية قائمًا دون جلسة استراحة.',
      },
      sources: ['fiqh-hanafi'],
    },
    sittingPosture: {
      text: {
        en: 'Men sit in iftirash — on the left foot laid flat, with the right foot upright — in every sitting, including the final one. Women sit differently according to the school.',
        bn: 'পুরুষেরা প্রতিটি বৈঠকে — শেষ বৈঠকসহ — ইফতিরাশ পদ্ধতিতে বসেন: বাম পা বিছিয়ে তার উপর, ডান পা খাড়া রেখে। নারীদের বসার পদ্ধতি মাযহাবে ভিন্নভাবে বর্ণিত।',
        ar: 'يجلس الرجل مفترشًا — على قدمه اليسرى ناصبًا اليمنى — في كل جلسة حتى الأخيرة، وللمرأة هيئة أخرى في المذهب.',
      },
      sources: ['fiqh-hanafi'],
    },
    fingerPointing: {
      text: {
        en: 'The right index finger is raised at “la ilaha” in the testimony and lowered at “illallah”.',
        bn: 'সাক্ষ্যের “লা ইলাহা” বলার সময় ডান হাতের শাহাদাত আঙুল তোলা হয় এবং “ইল্লাল্লাহ” বলার সময় নামানো হয়।',
        ar: 'تُرفع السبابة اليمنى عند «لا إله» وتُوضع عند «إلا الله».',
      },
      sources: ['fiqh-hanafi'],
    },
    tashahhudWording: {
      text: {
        en: 'The tashahhud of Ibn Mas’ud, shown here, is used.',
        bn: 'এখানে দেখানো ইবনে মাসউদ (রা.)-এর তাশাহহুদ পড়া হয়।',
        ar: 'يُعمل بتشهد ابن مسعود المعروض هنا.',
      },
      sources: ['bukhari-831', 'fiqh-hanafi'],
    },
    salam: {
      text: {
        en: 'Two salams, to the right then to the left; concluding with the salam is wajib.',
        bn: 'দুটি সালাম, প্রথমে ডানে পরে বামে; সালামের মাধ্যমে নামাজ শেষ করা ওয়াজিব।',
        ar: 'تسليمتان يمينًا ثم يسارًا، والخروج بلفظ السلام واجب.',
      },
      sources: ['fiqh-hanafi'],
    },
    witr: {
      text: {
        en: 'Witr is wajib: three rak’ahs with one salam, with the qunut supplication before the ruku’ of the third rak’ah.',
        bn: 'বিতর ওয়াজিব: এক সালামে তিন রাকাত, তৃতীয় রাকাতের রুকুর আগে দোয়া কুনুত।',
        ar: 'الوتر واجب: ثلاث ركعات بسلام واحد، مع القنوت قبل ركوع الثالثة.',
      },
      sources: ['fiqh-hanafi'],
    },
    tasbihRuling: {
      text: {
        en: 'Saying the tasbih in ruku’ and sujood is sunnah; three times is the commonly taught minimum.',
        bn: 'রুকু ও সিজদায় তাসবিহ পড়া সুন্নত; সাধারণত অন্তত তিনবার শেখানো হয়।',
        ar: 'التسبيح في الركوع والسجود سنة، وأدناه ثلاثًا.',
      },
      sources: ['fiqh-hanafi'],
    },
  },
};
