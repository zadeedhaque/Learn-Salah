import type { Madhhab } from '../types';

export const shafii: Madhhab = {
  id: 'shafii',
  name: { en: "Shafi'i", bn: 'শাফেয়ি', ar: 'الشافعي' },
  arabicName: 'الشَّافِعِيّ',
  founder: { en: "Imam al-Shafi'i (d. 204 AH)", bn: 'ইমাম শাফেয়ি (মৃ. ২০৪ হি.)', ar: 'الإمام الشافعي (ت ٢٠٤هـ)' },
  description: {
    en: 'Widely followed in Southeast Asia, East Africa, Yemen, Egypt and parts of the Levant.',
    bn: 'দক্ষিণ-পূর্ব এশিয়া, পূর্ব আফ্রিকা, ইয়েমেন, মিশর ও শামের কিছু অংশে ব্যাপকভাবে অনুসৃত।',
    ar: 'منتشر في جنوب شرق آسيا وشرق أفريقيا واليمن ومصر وأجزاء من الشام.',
  },
  practice: {
    handPlacement: 'chest',
    takbirHands: 'ears',
    descent: 'knees',
    restBeforeRising: true,
    jalsaPosture: 'iftirash',
    firstSitting: 'iftirash',
    finalSitting: 'tawarruk',
    singleSitting: 'tawarruk',
  },
  differences: {
    handPlacement: {
      text: {
        en: 'The right hand is placed over the left, below the chest and above the navel.',
        bn: 'ডান হাত বাম হাতের উপর, বুকের নিচে ও নাভির উপরে রাখা হয়।',
        ar: 'توضع اليد اليمنى على اليسرى تحت الصدر وفوق السرة.',
      },
      sources: ['fiqh-shafii', 'muslim-401'],
    },
    takbirHands: {
      text: {
        en: 'The palms are raised level with the shoulders, the thumbs near the earlobes and the fingertips near the tops of the ears.',
        bn: 'হাতের তালু কাঁধ বরাবর, বৃদ্ধাঙ্গুল কানের লতির কাছে এবং আঙুলের মাথা কানের উপরিভাগের কাছে তোলা হয়।',
        ar: 'تُرفع الكفان حذو المنكبين، والإبهامان عند شحمتي الأذنين، وأطراف الأصابع عند أعلى الأذنين.',
      },
      sources: ['fiqh-shafii'],
    },
    raisingHands: {
      text: {
        en: 'The hands are also raised when going into ruku’, when rising from it, and when standing up after the first tashahhud.',
        bn: 'রুকুতে যাওয়ার সময়, রুকু থেকে ওঠার সময় এবং প্রথম তাশাহহুদের পর দাঁড়ানোর সময়ও হাত তোলা হয়।',
        ar: 'تُرفع اليدان أيضًا عند الركوع والرفع منه والقيام من التشهد الأول.',
      },
      sources: ['bukhari-735', 'bukhari-739', 'fiqh-shafii'],
    },
    openingDua: {
      text: {
        en: 'An opening supplication is sunnah; the school commonly teaches “Wajjahtu wajhiya…”, and other authentic ones may be used.',
        bn: 'সানা পড়া সুন্নত; এই মাযহাবে সাধারণত “ওয়াজ্জাহতু ওয়াজহিয়া…” শেখানো হয়, অন্য বিশুদ্ধ দোয়াও পড়া যায়।',
        ar: 'يُسن دعاء الاستفتاح، والمشهور في المذهب «وجّهت وجهي…»، ويجوز غيره مما صح.',
      },
      sources: ['fiqh-shafii'],
    },
    basmalah: {
      text: {
        en: 'The basmalah is counted as a verse of al-Fatihah and is recited aloud in audible prayers.',
        bn: 'বিসমিল্লাহকে সূরা ফাতিহার একটি আয়াত গণ্য করা হয় এবং উচ্চস্বরের নামাজে জোরে পড়া হয়।',
        ar: 'البسملة آية من الفاتحة، ويُجهر بها في الصلاة الجهرية.',
      },
      sources: ['fiqh-shafii'],
    },
    ameen: {
      text: { en: '“Amin” is said aloud in audible prayers.', bn: 'উচ্চস্বরের নামাজে “আমিন” জোরে বলা হয়।', ar: 'يُجهر بـ«آمين» في الصلاة الجهرية.' },
      sources: ['bukhari-780', 'fiqh-shafii'],
    },
    descent: {
      text: {
        en: 'Going down to prostrate, the knees are placed first, then the hands, then the forehead and nose.',
        bn: 'সিজদায় যাওয়ার সময় প্রথমে হাঁটু, তারপর হাত, তারপর কপাল ও নাক রাখা হয়।',
        ar: 'تُوضع الركبتان أولًا ثم اليدان ثم الجبهة والأنف.',
      },
      sources: ['fiqh-shafii'],
    },
    restSitting: {
      text: {
        en: 'A brief resting sit (jalsat al-istirahah) is sunnah before rising to the second and fourth rak’ahs.',
        bn: 'দ্বিতীয় ও চতুর্থ রাকাতে ওঠার আগে সামান্য বসা (জলসায়ে ইস্তিরাহা) সুন্নত।',
        ar: 'تُسن جلسة الاستراحة قبل القيام إلى الركعة الثانية والرابعة.',
      },
      sources: ['bukhari-823', 'fiqh-shafii'],
    },
    sittingPosture: {
      text: {
        en: 'Iftirash between the prostrations and in the first sitting; tawarruk — sitting on the left hip with the left foot beneath the right shin — in the final sitting.',
        bn: 'দুই সিজদার মাঝে ও প্রথম বৈঠকে ইফতিরাশ; শেষ বৈঠকে তাওয়াররুক — বাম নিতম্বের উপর বসে বাম পা ডান পায়ের নিচ দিয়ে বের করে।',
        ar: 'الافتراش بين السجدتين وفي التشهد الأول، والتورك — الجلوس على الورك الأيسر مع إخراج القدم اليسرى تحت الساق اليمنى — في التشهد الأخير.',
      },
      sources: ['bukhari-828', 'fiqh-shafii'],
    },
    fingerPointing: {
      text: {
        en: 'The right hand forms a loose fist and the index finger is raised at “illallah”, without moving it.',
        bn: 'ডান হাত হালকা মুঠো করে “ইল্লাল্লাহ” বলার সময় শাহাদাত আঙুল তোলা হয়, নাড়ানো হয় না।',
        ar: 'تُقبض اليمنى وتُرفع السبابة عند «إلا الله» دون تحريك.',
      },
      sources: ['muslim-580', 'fiqh-shafii'],
    },
    tashahhudWording: {
      text: {
        en: 'The school prefers the tashahhud narrated by Ibn ’Abbas; the wording of Ibn Mas’ud shown here is also authentic.',
        bn: 'এই মাযহাবে ইবনে আব্বাস (রা.) বর্ণিত তাশাহহুদ অগ্রাধিকার পায়; এখানে দেখানো ইবনে মাসউদের শব্দাবলিও বিশুদ্ধ।',
        ar: 'المختار في المذهب تشهد ابن عباس، وتشهد ابن مسعود المعروض هنا صحيح أيضًا.',
      },
      sources: ['fiqh-shafii'],
    },
    salam: {
      text: {
        en: 'The first salam is fard; the second is sunnah.',
        bn: 'প্রথম সালাম ফরজ; দ্বিতীয়টি সুন্নত।',
        ar: 'التسليمة الأولى فرض والثانية سنة.',
      },
      sources: ['fiqh-shafii'],
    },
    witr: {
      text: {
        en: 'Witr is an emphasised sunnah; its minimum is one rak’ah, and qunut is said in it during the second half of Ramadan.',
        bn: 'বিতর সুন্নতে মুয়াক্কাদা; সর্বনিম্ন এক রাকাত, এবং রমজানের দ্বিতীয়ার্ধে এতে কুনুত পড়া হয়।',
        ar: 'الوتر سنة مؤكدة، وأقله ركعة، ويُقنت فيه في النصف الثاني من رمضان.',
      },
      sources: ['fiqh-shafii'],
    },
    tasbihRuling: {
      text: {
        en: 'The tasbih in ruku’ and sujood is sunnah.',
        bn: 'রুকু ও সিজদার তাসবিহ সুন্নত।',
        ar: 'التسبيح في الركوع والسجود سنة.',
      },
      sources: ['fiqh-shafii'],
    },
  },
};
