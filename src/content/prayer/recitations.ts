import type { Recitation, RecitationId } from '../types';

/**
 * Recitations used in the prayer. Arabic is fully vowelled; transliteration is a
 * reading aid only. Translations are this project's own wording.
 *
 * Audio: set `audio` to a file name in /public/audio and list it in
 * /public/audio/manifest.json once a verified recording exists. Until then the UI
 * shows "Audio coming soon" rather than placeholder audio.
 */
const list: Recitation[] = [
  {
    id: 'takbir',
    title: { en: 'Takbir', bn: 'তাকবির', ar: 'التكبير' },
    lines: [
      {
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allāhu Akbar',
        translation: { en: 'Allah is the Greatest.', bn: 'আল্লাহ সবচেয়ে মহান।' },
      },
    ],
    when: {
      en: 'To open the prayer, and when moving between positions.',
      bn: 'নামাজ শুরু করার সময় এবং এক অবস্থান থেকে অন্য অবস্থানে যাওয়ার সময়।',
      ar: 'عند افتتاح الصلاة وعند الانتقال بين الأركان.',
    },
    audio: 'takbir.mp3',
    stepId: 'takbir',
    sources: ['abudawud-61', 'bukhari-789'],
    review: 'draft',
  },
  {
    id: 'opening',
    title: { en: 'Opening supplication (Thana)', bn: 'সানা', ar: 'دعاء الاستفتاح' },
    lines: [
      {
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ',
        transliteration: 'Subḥānaka-llāhumma wa biḥamdika, wa tabāraka-smuka, wa taʿālā jadduka, wa lā ilāha ghayruk.',
        translation: {
          en: 'Glory be to You, O Allah, and all praise is Yours. Blessed is Your Name, exalted is Your majesty, and there is no god but You.',
          bn: 'হে আল্লাহ, আপনি পবিত্র, সকল প্রশংসা আপনার। আপনার নাম বরকতময়, আপনার মর্যাদা সমুন্নত, আর আপনি ছাড়া কোনো উপাস্য নেই।',
        },
      },
    ],
    when: {
      en: 'Quietly, after the opening takbir and before al-Fatihah.',
      bn: 'তাকবিরে তাহরিমার পর, সূরা ফাতিহার আগে, নিঃশব্দে।',
      ar: 'سرًّا بعد تكبيرة الإحرام وقبل الفاتحة.',
    },
    note: {
      en: 'One of several authentic opening supplications. In the Maliki school, obligatory prayers begin directly with al-Fatihah.',
      bn: 'বিশুদ্ধভাবে বর্ণিত কয়েকটি সানার একটি। মালেকি মাযহাবে ফরজ নামাজ সরাসরি সূরা ফাতিহা দিয়ে শুরু হয়।',
    },
    audio: 'opening.mp3',
    stepId: 'qiyam',
    sources: ['abudawud-775'],
    review: 'draft',
  },
  {
    id: 'taawwudh',
    title: { en: "Seeking refuge (Ta'awwudh)", bn: 'আউযুবিল্লাহ', ar: 'الاستعاذة' },
    lines: [
      {
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'Aʿūdhu billāhi mina-sh-shayṭāni-r-rajīm.',
        translation: { en: 'I seek refuge in Allah from Satan, the accursed.', bn: 'বিতাড়িত শয়তান থেকে আমি আল্লাহর আশ্রয় চাই।' },
      },
    ],
    when: { en: 'Quietly, before reciting al-Fatihah.', bn: 'সূরা ফাতিহা পড়ার আগে, নিঃশব্দে।', ar: 'سرًّا قبل قراءة الفاتحة.' },
    audio: 'taawwudh.mp3',
    stepId: 'qiyam',
    sources: ['quran-16-98'],
    review: 'draft',
  },
  {
    id: 'fatiha',
    title: { en: 'Al-Fatihah', bn: 'সূরা ফাতিহা', ar: 'سورة الفاتحة' },
    lines: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismi-llāhi-r-raḥmāni-r-raḥīm',
        translation: { en: 'In the name of Allah, the Most Compassionate, the Most Merciful.', bn: 'পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।' },
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-ḥamdu lillāhi rabbi-l-ʿālamīn',
        translation: { en: 'All praise is for Allah, Lord of all the worlds,', bn: 'সকল প্রশংসা আল্লাহর, যিনি সকল জগতের প্রতিপালক,' },
      },
      {
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-raḥmāni-r-raḥīm',
        translation: { en: 'the Most Compassionate, the Most Merciful,', bn: 'পরম করুণাময়, অসীম দয়ালু,' },
      },
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Māliki yawmi-d-dīn',
        translation: { en: 'Master of the Day of Judgement.', bn: 'বিচার দিনের মালিক।' },
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyāka naʿbudu wa iyyāka nastaʿīn',
        translation: { en: 'You alone we worship, and You alone we ask for help.', bn: 'আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য চাই।' },
      },
      {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdina-ṣ-ṣirāṭa-l-mustaqīm',
        translation: { en: 'Guide us to the straight path,', bn: 'আমাদের সরল পথ দেখান,' },
      },
      {
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Ṣirāṭa-lladhīna anʿamta ʿalayhim, ghayri-l-maghḍūbi ʿalayhim wa la-ḍ-ḍāllīn',
        translation: {
          en: 'the path of those You have blessed — not of those who have earned anger, nor of those who have gone astray.',
          bn: 'তাদের পথ, যাদের আপনি অনুগ্রহ করেছেন; তাদের পথ নয় যারা ক্রোধের শিকার হয়েছে, আর যারা পথভ্রষ্ট।',
        },
      },
      {
        arabic: 'آمِين',
        transliteration: 'Āmīn',
        translation: { en: 'O Allah, answer (our prayer).', bn: 'হে আল্লাহ, কবুল করুন।' },
      },
    ],
    when: {
      en: 'Standing, in every rak’ah. “Amin” is said after it (it is not part of the surah).',
      bn: 'দাঁড়িয়ে, প্রতি রাকাতে। এরপর “আমিন” বলা হয় (এটি সূরার অংশ নয়)।',
      ar: 'قائمًا في كل ركعة، ويُقال بعدها «آمين» وليست من السورة.',
    },
    note: {
      en: 'Whether the basmalah is counted as the first verse and recited aloud differs between the schools.',
      bn: 'বিসমিল্লাহ প্রথম আয়াত হিসেবে গণ্য কিনা এবং উচ্চস্বরে পড়া হবে কিনা — এ নিয়ে মাযহাবগুলোর মধ্যে মতভেদ আছে।',
    },
    audio: 'fatiha.mp3',
    stepId: 'fatiha',
    sources: ['quran-1', 'bukhari-756', 'bukhari-780'],
    review: 'draft',
  },
  {
    id: 'ikhlas',
    title: { en: 'Surah al-Ikhlas', bn: 'সূরা ইখলাস', ar: 'سورة الإخلاص' },
    lines: [
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwa-llāhu aḥad',
        translation: { en: 'Say: He is Allah, the One.', bn: 'বলুন, তিনি আল্লাহ, এক ও অদ্বিতীয়।' },
      },
      {
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allāhu-ṣ-ṣamad',
        translation: { en: 'Allah, the Self-Sufficient, on whom all depend.', bn: 'আল্লাহ অমুখাপেক্ষী, সকলেই তাঁর মুখাপেক্ষী।' },
      },
      {
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yūlad',
        translation: { en: 'He has not begotten, nor was He begotten,', bn: 'তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি,' },
      },
      {
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakun lahū kufuwan aḥad',
        translation: { en: 'and there is none comparable to Him.', bn: 'এবং তাঁর সমতুল্য কেউ নেই।' },
      },
    ],
    when: {
      en: 'After al-Fatihah in the first two rak’ahs (any passage of the Qur’an may be recited).',
      bn: 'প্রথম দুই রাকাতে সূরা ফাতিহার পর (কুরআনের যেকোনো অংশ পড়া যায়)।',
      ar: 'بعد الفاتحة في الركعتين الأوليين (ويجوز أي موضع من القرآن).',
    },
    audio: 'ikhlas.mp3',
    stepId: 'surah',
    sources: ['quran-112', 'bukhari-776'],
    review: 'draft',
  },
  {
    id: 'ruku',
    title: { en: 'In ruku’', bn: 'রুকুর তাসবিহ', ar: 'تسبيح الركوع' },
    lines: [
      {
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subḥāna rabbiya-l-ʿaẓīm',
        translation: { en: 'Glory be to my Lord, the Most Great.', bn: 'আমার মহান প্রতিপালকের পবিত্রতা ঘোষণা করছি।' },
      },
    ],
    when: { en: 'While bowing.', bn: 'রুকু অবস্থায়।', ar: 'في الركوع.' },
    repeat: { en: 'Three times is the commonly taught minimum.', bn: 'সাধারণত অন্তত তিনবার পড়তে শেখানো হয়।', ar: 'ثلاثًا في أدنى ما يُعلَّم عادةً.' },
    audio: 'ruku.mp3',
    stepId: 'ruku',
    sources: ['muslim-772'],
    review: 'draft',
  },
  {
    id: 'rising',
    title: { en: 'Rising from ruku’', bn: 'রুকু থেকে ওঠা', ar: 'الرفع من الركوع' },
    lines: [
      {
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transliteration: 'Samiʿa-llāhu liman ḥamidah',
        translation: { en: 'Allah hears the one who praises Him.', bn: 'যে আল্লাহর প্রশংসা করে, আল্লাহ তার কথা শোনেন।' },
      },
      {
        arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ',
        transliteration: 'Rabbanā wa laka-l-ḥamd',
        translation: { en: 'Our Lord, and to You belongs all praise.', bn: 'হে আমাদের প্রতিপালক, সকল প্রশংসা আপনারই।' },
      },
    ],
    when: {
      en: 'The first while rising from bowing; the second once standing upright.',
      bn: 'প্রথমটি রুকু থেকে ওঠার সময়; দ্বিতীয়টি সোজা হয়ে দাঁড়ানোর পর।',
      ar: 'الأول عند الرفع من الركوع، والثاني بعد الاعتدال قائمًا.',
    },
    note: {
      en: 'Schools differ on what a follower behind an imam says.',
      bn: 'ইমামের পেছনে মুক্তাদি কী বলবেন — এ নিয়ে মাযহাবগুলোর মধ্যে পার্থক্য আছে।',
    },
    audio: 'rising.mp3',
    stepId: 'itidal',
    sources: ['bukhari-789'],
    review: 'draft',
  },
  {
    id: 'sujood',
    title: { en: 'In sujood', bn: 'সিজদার তাসবিহ', ar: 'تسبيح السجود' },
    lines: [
      {
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
        transliteration: 'Subḥāna rabbiya-l-aʿlā',
        translation: { en: 'Glory be to my Lord, the Most High.', bn: 'আমার সর্বোচ্চ প্রতিপালকের পবিত্রতা ঘোষণা করছি।' },
      },
    ],
    when: { en: 'While prostrating.', bn: 'সিজদা অবস্থায়।', ar: 'في السجود.' },
    repeat: { en: 'Three times is the commonly taught minimum.', bn: 'সাধারণত অন্তত তিনবার পড়তে শেখানো হয়।', ar: 'ثلاثًا في أدنى ما يُعلَّم عادةً.' },
    audio: 'sujood.mp3',
    stepId: 'sujood',
    sources: ['muslim-772'],
    review: 'draft',
  },
  {
    id: 'betweenSujood',
    title: { en: 'Between the two sujoods', bn: 'দুই সিজদার মাঝে', ar: 'بين السجدتين' },
    lines: [
      {
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbi-ghfir lī',
        translation: { en: 'My Lord, forgive me.', bn: 'হে আমার প্রতিপালক, আমাকে ক্ষমা করুন।' },
      },
    ],
    when: { en: 'While sitting between the two prostrations.', bn: 'দুই সিজদার মাঝে বসা অবস্থায়।', ar: 'في الجلسة بين السجدتين.' },
    repeat: { en: 'Commonly said twice.', bn: 'সাধারণত দুইবার বলা হয়।', ar: 'تُقال مرتين عادةً.' },
    audio: 'between-sujood.mp3',
    stepId: 'jalsa',
    sources: ['abudawud-874'],
    review: 'draft',
  },
  {
    id: 'tashahhud',
    title: { en: 'Tashahhud', bn: 'তাশাহহুদ', ar: 'التشهد' },
    lines: [
      {
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
        transliteration: 'At-taḥiyyātu lillāhi wa-ṣ-ṣalawātu wa-ṭ-ṭayyibāt',
        translation: { en: 'All greetings, prayers and good things belong to Allah.', bn: 'সকল সম্ভাষণ, সকল নামাজ ও সকল পবিত্র বিষয় আল্লাহর জন্য।' },
      },
      {
        arabic: 'السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        transliteration: 'As-salāmu ʿalayka ayyuha-n-nabiyyu wa raḥmatu-llāhi wa barakātuh',
        translation: { en: 'Peace be upon you, O Prophet, and the mercy of Allah and His blessings.', bn: 'হে নবী, আপনার উপর শান্তি, আল্লাহর রহমত ও তাঁর বরকত বর্ষিত হোক।' },
      },
      {
        arabic: 'السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ',
        transliteration: 'As-salāmu ʿalaynā wa ʿalā ʿibādi-llāhi-ṣ-ṣāliḥīn',
        translation: { en: 'Peace be upon us and upon the righteous servants of Allah.', bn: 'আমাদের উপর এবং আল্লাহর নেক বান্দাদের উপর শান্তি বর্ষিত হোক।' },
      },
      {
        arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ashhadu an lā ilāha illa-llāh, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh',
        translation: {
          en: 'I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and Messenger.',
          bn: 'আমি সাক্ষ্য দিচ্ছি যে আল্লাহ ছাড়া কোনো উপাস্য নেই, এবং আমি সাক্ষ্য দিচ্ছি যে মুহাম্মাদ তাঁর বান্দা ও রাসূল।',
        },
      },
    ],
    when: {
      en: 'Sitting, after the second rak’ah and in the final sitting.',
      bn: 'বসে, দ্বিতীয় রাকাতের পর এবং শেষ বৈঠকে।',
      ar: 'جالسًا بعد الركعة الثانية وفي الجلوس الأخير.',
    },
    note: {
      en: 'This is the wording narrated by Ibn Mas’ud. Other authentic wordings exist and are preferred in some schools.',
      bn: 'এটি ইবনে মাসউদ (রা.) বর্ণিত শব্দাবলি। আরও বিশুদ্ধ শব্দাবলি রয়েছে, যা কিছু মাযহাবে অগ্রাধিকার পায়।',
    },
    audio: 'tashahhud.mp3',
    stepId: 'tashahhud',
    sources: ['bukhari-831'],
    review: 'draft',
  },
  {
    id: 'salawat',
    title: { en: 'Salawat Ibrahimiyyah', bn: 'দরুদে ইবরাহিম', ar: 'الصلاة الإبراهيمية' },
    lines: [
      {
        arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd',
        translation: {
          en: 'O Allah, send Your grace upon Muhammad and the family of Muhammad, as You sent Your grace upon Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious.',
          bn: 'হে আল্লাহ, মুহাম্মাদ ও মুহাম্মাদের পরিবারবর্গের উপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহিম ও ইবরাহিমের পরিবারবর্গের উপর রহমত বর্ষণ করেছেন; নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত।',
        },
      },
      {
        arabic: 'اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd',
        translation: {
          en: 'O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious.',
          bn: 'হে আল্লাহ, মুহাম্মাদ ও মুহাম্মাদের পরিবারবর্গের উপর বরকত দান করুন, যেমন আপনি ইবরাহিম ও ইবরাহিমের পরিবারবর্গের উপর বরকত দান করেছেন; নিশ্চয়ই আপনি প্রশংসিত, মহিমান্বিত।',
        },
      },
    ],
    when: { en: 'In the final sitting, after the tashahhud.', bn: 'শেষ বৈঠকে, তাশাহহুদের পর।', ar: 'في الجلوس الأخير بعد التشهد.' },
    audio: 'salawat.mp3',
    stepId: 'salawat',
    sources: ['bukhari-3370'],
    review: 'draft',
  },
  {
    id: 'dua',
    title: { en: 'Supplication before salam', bn: 'সালামের আগের দোয়া', ar: 'الدعاء قبل السلام' },
    lines: [
      {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbanā ātinā fi-d-dunyā ḥasanatan wa fi-l-ākhirati ḥasanatan wa qinā ʿadhāba-n-nār',
        translation: {
          en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
          bn: 'হে আমাদের প্রতিপালক, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন, এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।',
        },
      },
    ],
    when: { en: 'After the salawat, before the salam.', bn: 'দরুদের পর, সালামের আগে।', ar: 'بعد الصلاة الإبراهيمية وقبل السلام.' },
    note: {
      en: 'One commonly taught example from the Qur’an; many other authentic supplications may be said.',
      bn: 'কুরআন থেকে বহুল প্রচলিত একটি উদাহরণ; আরও অনেক বিশুদ্ধ দোয়া পড়া যায়।',
    },
    audio: 'dua.mp3',
    stepId: 'dua',
    sources: ['quran-2-201'],
    review: 'draft',
  },
  {
    id: 'salam',
    title: { en: 'Salam', bn: 'সালাম', ar: 'التسليم' },
    lines: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'As-salāmu ʿalaykum wa raḥmatu-llāh',
        translation: { en: 'Peace be upon you and the mercy of Allah.', bn: 'আপনাদের উপর শান্তি ও আল্লাহর রহমত বর্ষিত হোক।' },
      },
    ],
    when: { en: 'Turning the head to the right, then to the left, to end the prayer.', bn: 'নামাজ শেষ করতে প্রথমে ডানে, পরে বামে মাথা ফিরিয়ে।', ar: 'بالالتفات يمينًا ثم يسارًا لختم الصلاة.' },
    audio: 'salam.mp3',
    stepId: 'salam-right',
    sources: ['muslim-582', 'abudawud-996'],
    review: 'draft',
  },
];

export const RECITATIONS: Record<RecitationId, Recitation> = Object.fromEntries(list.map((r) => [r.id, r])) as Record<
  RecitationId,
  Recitation
>;

/** Display order for the recitation library. */
export const RECITATION_ORDER: RecitationId[] = [
  'takbir',
  'opening',
  'taawwudh',
  'fatiha',
  'ikhlas',
  'ruku',
  'rising',
  'sujood',
  'betweenSujood',
  'tashahhud',
  'salawat',
  'dua',
  'salam',
];
