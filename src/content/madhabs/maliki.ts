import type { Madhhab } from '../types';

export const maliki: Madhhab = {
  id: 'maliki',
  name: { en: 'Maliki', bn: 'মালেকি', ar: 'المالكي' },
  arabicName: 'المَالِكِيّ',
  founder: { en: 'Imam Malik ibn Anas (d. 179 AH)', bn: 'ইমাম মালিক ইবনে আনাস (মৃ. ১৭৯ হি.)', ar: 'الإمام مالك بن أنس (ت ١٧٩هـ)' },
  description: {
    en: 'Widely followed in North and West Africa.',
    bn: 'উত্তর ও পশ্চিম আফ্রিকায় ব্যাপকভাবে অনুসৃত।',
    ar: 'منتشر في شمال أفريقيا وغربها.',
  },
  practice: {
    handPlacement: 'sides',
    takbirHands: 'shoulders',
    descent: 'hands',
    restBeforeRising: false,
    jalsaPosture: 'tawarruk',
    firstSitting: 'tawarruk',
    finalSitting: 'tawarruk',
    singleSitting: 'tawarruk',
  },
  differences: {
    handPlacement: {
      text: {
        en: 'In the well-known position of the school (sadl), the arms rest at the sides in obligatory prayers; placing the hands is reported as permissible in voluntary prayers.',
        bn: 'মাযহাবের প্রসিদ্ধ মতে (সাদল) ফরজ নামাজে হাত দুই পাশে ছেড়ে রাখা হয়; নফল নামাজে হাত বাঁধা জায়েজ বলে বর্ণিত।',
        ar: 'المشهور في المذهب (السدل) إرسال اليدين في الفريضة، ويُذكر جواز القبض في النافلة.',
      },
      sources: ['fiqh-maliki'],
    },
    takbirHands: {
      text: {
        en: 'The hands are raised to the shoulders with the opening takbir.',
        bn: 'তাকবিরে তাহরিমার সময় কাঁধ পর্যন্ত হাত তোলা হয়।',
        ar: 'تُرفع اليدان حذو المنكبين في تكبيرة الإحرام.',
      },
      sources: ['fiqh-maliki'],
    },
    raisingHands: {
      text: {
        en: 'In the well-known position, the hands are raised only with the opening takbir.',
        bn: 'প্রসিদ্ধ মতে শুধু তাকবিরে তাহরিমার সময় হাত তোলা হয়।',
        ar: 'المشهور أن اليدين لا تُرفعان إلا في تكبيرة الإحرام.',
      },
      sources: ['fiqh-maliki'],
    },
    openingDua: {
      text: {
        en: 'In obligatory prayers, one begins directly with al-Fatihah, without an opening supplication.',
        bn: 'ফরজ নামাজে সানা ছাড়াই সরাসরি সূরা ফাতিহা দিয়ে শুরু করা হয়।',
        ar: 'في الفريضة يُبدأ بالفاتحة مباشرة دون دعاء استفتاح.',
      },
      sources: ['fiqh-maliki'],
    },
    basmalah: {
      text: {
        en: 'The basmalah is not recited before al-Fatihah in obligatory prayers.',
        bn: 'ফরজ নামাজে সূরা ফাতিহার আগে বিসমিল্লাহ পড়া হয় না।',
        ar: 'لا تُقرأ البسملة قبل الفاتحة في الفريضة.',
      },
      sources: ['fiqh-maliki'],
    },
    ameen: {
      text: { en: '“Amin” is said quietly.', bn: '“আমিন” নিঃশব্দে বলা হয়।', ar: 'يُقال «آمين» سرًّا.' },
      sources: ['fiqh-maliki'],
    },
    descent: {
      text: {
        en: 'Going down to prostrate, the hands are placed on the ground before the knees.',
        bn: 'সিজদায় যাওয়ার সময় হাঁটুর আগে হাত মাটিতে রাখা হয়।',
        ar: 'تُوضع اليدان قبل الركبتين عند الهوي للسجود.',
      },
      sources: ['fiqh-maliki'],
    },
    restSitting: {
      text: {
        en: 'One rises directly from the second prostration, without a resting sit.',
        bn: 'দ্বিতীয় সিজদা থেকে না বসে সরাসরি দাঁড়ানো হয়।',
        ar: 'ينهض من السجدة الثانية دون جلسة استراحة.',
      },
      sources: ['fiqh-maliki'],
    },
    sittingPosture: {
      text: {
        en: 'Tawarruk is used in every sitting: sitting on the left hip, with the left foot brought out beneath the right shin and the right foot upright.',
        bn: 'প্রতিটি বৈঠকে তাওয়াররুক: বাম নিতম্বের উপর বসা, বাম পা ডান পায়ের নিচ দিয়ে বের করা এবং ডান পা খাড়া রাখা।',
        ar: 'التورك في جميع الجلسات: الجلوس على الورك الأيسر وإخراج القدم اليسرى تحت الساق اليمنى مع نصب اليمنى.',
      },
      sources: ['fiqh-maliki'],
    },
    fingerPointing: {
      text: {
        en: 'The right index finger is extended and moved gently from side to side throughout the tashahhud.',
        bn: 'পুরো তাশাহহুদে ডান হাতের শাহাদাত আঙুল প্রসারিত রেখে আলতোভাবে ডানে-বামে নাড়ানো হয়।',
        ar: 'تُمد السبابة اليمنى وتُحرَّك يمينًا وشمالًا طوال التشهد.',
      },
      sources: ['fiqh-maliki'],
    },
    tashahhudWording: {
      text: {
        en: 'The school prefers the tashahhud taught by ’Umar ibn al-Khattab; the wording shown here is also authentic.',
        bn: 'এই মাযহাবে উমর ইবনুল খাত্তাব (রা.) শেখানো তাশাহহুদ অগ্রাধিকার পায়; এখানে দেখানো শব্দাবলিও বিশুদ্ধ।',
        ar: 'المختار في المذهب تشهد عمر بن الخطاب، والمعروض هنا صحيح أيضًا.',
      },
      sources: ['fiqh-maliki'],
    },
    salam: {
      text: {
        en: 'A single salam, said facing forward and turning slightly to the right, ends the prayer; a follower adds further salams in response to the imam.',
        bn: 'সামনের দিকে মুখ করে সামান্য ডানে ফিরে একটি সালামের মাধ্যমে নামাজ শেষ হয়; মুক্তাদি ইমামের জবাবে অতিরিক্ত সালাম দেন।',
        ar: 'تسليمة واحدة تلقاء الوجه مع التيامن قليلًا يُختم بها، ويزيد المأموم تسليمة الرد على الإمام.',
      },
      sources: ['fiqh-maliki'],
    },
    witr: {
      text: {
        en: 'Witr is an emphasised sunnah, prayed as a single rak’ah after an even-numbered prayer (shaf’).',
        bn: 'বিতর সুন্নতে মুয়াক্কাদা; জোড় রাকাত (শাফ\') আদায়ের পর এক রাকাত হিসেবে পড়া হয়।',
        ar: 'الوتر سنة مؤكدة، ركعة واحدة بعد شفع.',
      },
      sources: ['fiqh-maliki'],
    },
    tasbihRuling: {
      text: {
        en: 'Glorification in ruku’ and sujood is recommended, without a fixed wording or number.',
        bn: 'রুকু ও সিজদায় তাসবিহ মুস্তাহাব; নির্দিষ্ট শব্দ বা সংখ্যার বাধ্যবাধকতা নেই।',
        ar: 'التسبيح في الركوع والسجود مندوب دون لفظ أو عدد محدد.',
      },
      sources: ['fiqh-maliki'],
    },
  },
};
