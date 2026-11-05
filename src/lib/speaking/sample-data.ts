export interface UsefulChunk {
  phrase: string;
  meaning: string;
}

export interface SpeakingTopicItem {
  id: string;
  part: 1 | 2 | 3 | "full_mock";
  title: string;
  topicTag: string; // e.g. "technology", "study_work", "daily_life", "art_culture", "travel", "environment"
  topicLabel: string;
  questionCount: number;
  durationMinutes: number;
  tags?: string[];
  status?: string;
  isUserCreated?: boolean;
  prompt?: string;
  bulletPoints?: string[];
  questionsOrCueCard: {
    leadIn?: string;
    points?: string[];
    followUpQuestions?: string[];
    usefulChunks?: UsefulChunk[];
  };
}

export const PART_1_SPEAKING_TOPICS: SpeakingTopicItem[] = [
  {
    "id": "spk-p1-work-study",
    "part": 1,
    "title": "Work and Study: Careers, Academic Life & Ambitions",
    "topicTag": "study_work",
    "topicLabel": "Study & Work",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about your studies or career:",
      "followUpQuestions": [
        "Do you currently work or are you a student?",
        "What do you like most about your studies or your job?",
        "Why did you choose this field of study or career path?",
        "Do you prefer to study or work alone, or as part of a team?",
        "What are your future career plans or educational goals?",
        "Is there anything you would like to change about your study or work routine?"
      ],
      "usefulChunks": [
        {
          "phrase": "major in",
          "meaning": "Muayyan mutaxassislik bo'yicha oliygohda tahsil olmoq"
        },
        {
          "phrase": "pursue a career in",
          "meaning": "Ma'lum bir kasbiy sohada faoliyat yuritishga intilmoq"
        },
        {
          "phrase": "climb the corporate ladder",
          "meaning": "Kompaniyada martaba pog'onalaridan yuqoriga ko'tarilmoq"
        },
        {
          "phrase": "fast-paced environment",
          "meaning": "Shiddatli, tez sur'atlarda o'zgaruvchan ish muhiti"
        },
        {
          "phrase": "hands-on experience",
          "meaning": "Amaliy, bevosita tajriba orttirmoq"
        },
        {
          "phrase": "collaborative mindset",
          "meaning": "Jamoa bilan hamjihatlikda ishlash tafakkuri"
        },
        {
          "phrase": "juggle work and study",
          "meaning": "Bir paytning o'zida ham o'qish, ham ishni eplab olib bormoq"
        },
        {
          "phrase": "broaden my horizon",
          "meaning": "Dunyoqarash va bilim doirasini kengaytirmoq"
        },
        {
          "phrase": "steep learning curve",
          "meaning": "Qisqa vaqtda ko'p yangi narsalarni o'rganish talab etiladigan jarayon"
        },
        {
          "phrase": "job satisfaction",
          "meaning": "O'z kasbi va bajargan mehnatidan qoniqish hissi"
        },
        {
          "phrase": "heavy workload",
          "meaning": "Haddan tashqari ko'p ish yoki topshiriqlar yuki"
        },
        {
          "phrase": "lucrative career path",
          "meaning": "Katta daromad keltiruvchi, istiqbolli kasb yo'li"
        },
        {
          "phrase": "strike a healthy balance",
          "meaning": "Ish va dam olish o'rtasida sog'lom muvozanat o'rnatmoq"
        },
        {
          "phrase": "keep up with industry trends",
          "meaning": "O'z sohasidagi eng so'nggi yangilik va o'zgarishlardan xabardor bo'lib bormoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-area-you-live-in",
    "part": 1,
    "title": "The Area You Live In: Neighborhood & Local Environment",
    "topicTag": "travel",
    "topicLabel": "Neighborhood & Community",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about the neighborhood where you currently reside:",
      "followUpQuestions": [
        "Where do you currently live?",
        "What do you like most about the area you live in?",
        "What kinds of facilities or shops are available in your neighborhood?",
        "Is public transport convenient in your residential area?",
        "Has your neighborhood changed much since you first moved there?",
        "Would you recommend your area to families looking for a place to live?"
      ],
      "usefulChunks": [
        {
          "phrase": "residential neighborhood",
          "meaning": "Tinch, faqat aholi yashashiga mo'ljallangan dahasi"
        },
        {
          "phrase": "within walking distance",
          "meaning": "Piyoda bir necha daqiqada yetib borish mumkin bo'lgan yaqinlikda"
        },
        {
          "phrase": "vibrant and lively",
          "meaning": "Hayot qaynagan, gavjum va jo'shqin muhit"
        },
        {
          "phrase": "peaceful and quiet",
          "meaning": "Shovqinsiz, osuda va xotirjam maskan"
        },
        {
          "phrase": "local amenities",
          "meaning": "Mahalladagi do'kon, dorixona, bog'cha kabi qulayliklar"
        },
        {
          "phrase": "well-connected transport links",
          "meaning": "Jamoat transporti qatnovi juda qulay yo'lga qo'yilgan"
        },
        {
          "phrase": "close-knit community",
          "meaning": "Bir-biri bilan ahil, mehr-oqibatli mahalla ahilligi"
        },
        {
          "phrase": "green spaces and tree-lined streets",
          "meaning": "Daraxtzor ko'chalar va yashil hiyobonlar"
        },
        {
          "phrase": "undergo rapid development",
          "meaning": "Tez sur'atlar bilan obodonlashib, rivojlanib bormoq"
        },
        {
          "phrase": "hustle and bustle",
          "meaning": "Shahar markazidagi to'polon va shovqin-suron"
        },
        {
          "phrase": "safe and secure atmosphere",
          "meaning": "Xavfsiz va xotirjam muhit"
        },
        {
          "phrase": "convenient access to",
          "meaning": "... ga oson va qulay yetib borish imkoniyati"
        },
        {
          "phrase": "lively cafe culture",
          "meaning": "Ko'plab shinam qahvaxonalar mavjud bo'lgan zamonaviy muhit"
        }
      ]
    }
  },
  {
    "id": "spk-p1-family-friends",
    "part": 1,
    "title": "Family & Friends: Relationships & Social Connections",
    "topicTag": "daily_life",
    "topicLabel": "Family & Relationships",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about family bonds, friendships, and spending time together:",
      "followUpQuestions": [
        "Do you spend more time with your family or your friends?",
        "What activities do you usually enjoy doing with your family members?",
        "How do you usually keep in touch with friends you don't see often?",
        "Do you prefer to have a large group of friends or a few close confidants?",
        "Who in your family are you most similar to in personality?",
        "What qualities do you value most in a true friend?"
      ],
      "usefulChunks": [
        {
          "phrase": "close-knit family",
          "meaning": "Juda inoq, bir-birini doim qo'llab-quvvatlaydigan oila"
        },
        {
          "phrase": "keep in touch with",
          "meaning": "Doimiy ravishda aloqada bo'lib turmoq"
        },
        {
          "phrase": "drift apart over time",
          "meaning": "Vaqt o'tishi bilan munosabatlar sovuqlashib, uzoqlashib ketmoq"
        },
        {
          "phrase": "count on someone",
          "meaning": "Qiyin vaziyatda birovga to'liq suyanmoq va ishonmoq"
        },
        {
          "phrase": "have a lot in common",
          "meaning": "Umumiy qiziqishlar va o'xshash qarashlarga ega bo'lmoq"
        },
        {
          "phrase": "see eye to eye with",
          "meaning": "Fikr va qarashlarda bir joydan chiqmoq, to'liq hamfikr bo'lmoq"
        },
        {
          "phrase": "catch up over coffee",
          "meaning": "Qahva ustida ko'rishib, yangiliklar va dildan suhbat qurmoq"
        },
        {
          "phrase": "take after someone",
          "meaning": "Fe'l-atvori yoki ko'rinishi bilan ota-onaga tortmoq, o'xshamoq"
        },
        {
          "phrase": "through thick and thin",
          "meaning": "Har qanday qiyinchilik va shodlik kunlarida birga bo'lmoq"
        },
        {
          "phrase": "confide in someone",
          "meaning": "Yurakdagi eng ichki sirlarni ishonib ochmoq"
        },
        {
          "phrase": "unconditional support",
          "meaning": "Hech qanday shartsiz, beg'araz madad va qo'llov"
        },
        {
          "phrase": "strengthen family ties",
          "meaning": "Oila a'zolari o'rtasidagi mehr va rishtalarni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-home",
    "part": 1,
    "title": "Home: Accommodation, Comfort & Interior Spaces",
    "topicTag": "daily_life",
    "topicLabel": "Home & Living Space",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about your home and living accommodation:",
      "followUpQuestions": [
        "Do you live in a house or an apartment?",
        "Which room in your home do you spend the most time in?",
        "How long have you lived in your current accommodation?",
        "What would you like to improve or renovate in your home?",
        "Do you plan to move to a different home in the near future?",
        "What features make a home feel cozy, warm, and welcoming to you?"
      ],
      "usefulChunks": [
        {
          "phrase": "multi-storey apartment building",
          "meaning": "Ko'p qavatli zamonaviy turar-joy binosi"
        },
        {
          "phrase": "spacious and well-lit",
          "meaning": "Keng, shinam va tabiiy yorug'likka to'la"
        },
        {
          "phrase": "home decor",
          "meaning": "Uyning ichki bezagi va dizayn jilozi"
        },
        {
          "phrase": "create a cozy atmosphere",
          "meaning": "Issiq, iliq va qulay xonadon muhitini yaratmoq"
        },
        {
          "phrase": "cluttered with unnecessary items",
          "meaning": "Ortiqcha, keraksiz buyumlar bilan to'lib-toshib ketgan"
        },
        {
          "phrase": "minimalist interior",
          "meaning": "Ortiqcha bezaklarsiz, sodda va zamonaviy interyer"
        },
        {
          "phrase": "renovate the kitchen",
          "meaning": "Oshxonani qayta ta'mirlamoq va yangilamoq"
        },
        {
          "phrase": "feel right at home",
          "meaning": "O'zini juda erkin, qulay va xuddi o'z uyidagidek his qilmoq"
        },
        {
          "phrase": "peaceful sanctuary",
          "meaning": "Tashqi dunyo shovqinidan holi, sokin panohgoh"
        },
        {
          "phrase": "plenty of natural sunlight",
          "meaning": "Xonaga mo'l-ko'l tushib turuvchi tabiiy quyosh nuri"
        },
        {
          "phrase": "modern household appliances",
          "meaning": "Zamonaviy maishiy ro'zg'or texnikalari"
        }
      ]
    }
  },
  {
    "id": "spk-p1-morning-time",
    "part": 1,
    "title": "Morning Time: Morning Routines & Starting the Day",
    "topicTag": "daily_life",
    "topicLabel": "Daily Habits & Morning Time",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss how you usually spend your mornings:",
      "followUpQuestions": [
        "What is your typical morning routine?",
        "Do you consider yourself an early riser or a night owl?",
        "Do you usually eat a substantial breakfast in the morning?",
        "What is the very first thing you do right after waking up?",
        "Did you have the same morning routine when you were a school student?",
        "How does waking up early impact your energy and mood during the day?"
      ],
      "usefulChunks": [
        {
          "phrase": "early bird / early riser",
          "meaning": "Erta tongda barvaqt uyg'onishga odatlangan odam"
        },
        {
          "phrase": "night owl",
          "meaning": "Kechqurun uzoq vaqt bedor o'tirib, kech uxlaydigan inson"
        },
        {
          "phrase": "hit the snooze button",
          "meaning": "Budilnik jiringlaganda 'yana 5 daqiqa' deb qayta o'chirib qo'ymoq"
        },
        {
          "phrase": "jump out of bed",
          "meaning": "O'rindan chaqqon va sergak turib ketmoq"
        },
        {
          "phrase": "kick-start my day",
          "meaning": "Kunga ko'tarinki ruh va kuchli energiya bilan kirishmoq"
        },
        {
          "phrase": "grab a quick bite",
          "meaning": "Shoshilinchda tezda yengil tamaddi qilib olmoq"
        },
        {
          "phrase": "wholesome breakfast",
          "meaning": "Foydali, to'yimli va tabiiy ertalabki nonushta"
        },
        {
          "phrase": "mentally prepare for the day ahead",
          "meaning": "Kutilayotgan kundalik vazifalarga ruhan shaylanmoq"
        },
        {
          "phrase": "rush out the door",
          "meaning": "Vaqt tig'izligidan uydan shoshib-pishib chiqib ketmoq"
        },
        {
          "phrase": "feel refreshed and energized",
          "meaning": "O'zini tetik, kuch-quvvatga to'la va orom olgan his qilmoq"
        },
        {
          "phrase": "drag myself out of bed",
          "meaning": "Zo'rg'a, charchoq va uyqusirash bilan o'rindan turmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-hometown",
    "part": 1,
    "title": "Hometown: Origins, Culture & Urban Transformation",
    "topicTag": "travel",
    "topicLabel": "Hometown & Heritage",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about the city or town where you grew up:",
      "followUpQuestions": [
        "Where is your hometown located?",
        "What do you like most about your hometown?",
        "Is your hometown a good place for young people to build a future?",
        "Has your hometown undergone significant changes over recent years?",
        "What is the most well-known landmark or attraction in your hometown?",
        "Do you think you will continue living in your hometown for years to come?"
      ],
      "usefulChunks": [
        {
          "phrase": "born and bred",
          "meaning": "Tug'ilib, o'sib voyaga yetgan"
        },
        {
          "phrase": "picturesque scenery",
          "meaning": "Tasviriy san'at asaridek go'zal, ko'rkam manzara"
        },
        {
          "phrase": "rich cultural heritage",
          "meaning": "Boy tarixiy va madaniy meros"
        },
        {
          "phrase": "undergo drastic transformation",
          "meaning": "Keskin va keng ko'lamli ijobiy o'zgarishlarga yuz tutmoq"
        },
        {
          "phrase": "historical landmarks",
          "meaning": "Tarixiy obidalar va qadimiy me'moriy yodgorliklar"
        },
        {
          "phrase": "job opportunities for youth",
          "meaning": "Yoshlar uchun yangi ish o'rinlari va istiqbollar"
        },
        {
          "phrase": "hospitality of local people",
          "meaning": "Mahalliy aholining samimiy mehmondo'stligi va ochiqko'ngilligi"
        },
        {
          "phrase": "thriving commercial hub",
          "meaning": "Rivojlanib borayotgan yirik savdo-sanoat markazi"
        },
        {
          "phrase": "peaceful rural vibe",
          "meaning": "Qishloq joylariga xos osoyishta va sokin ruhiyat"
        },
        {
          "phrase": "special place in my heart",
          "meaning": "Qalbim to'ridan chuqur va aziz o'rin egallagan"
        }
      ]
    }
  },
  {
    "id": "spk-p1-old-buildings",
    "part": 1,
    "title": "Old Buildings: Historic Architecture & Heritage",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & History",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about old and historical buildings:",
      "followUpQuestions": [
        "Are there many historic or old buildings in your city or hometown?",
        "Do you enjoy visiting and exploring historical buildings?",
        "What do you think about preserving old buildings rather than replacing them?",
        "Have you ever lived in an older building or apartment block?",
        "Do ancient and historical buildings attract international tourists to your country?",
        "Should municipal governments allocate funds to restore heritage structures?"
      ],
      "usefulChunks": [
        {
          "phrase": "architectural marvel",
          "meaning": "Me'morchilik san'atining tengsiz mo'jizasi"
        },
        {
          "phrase": "preserve cultural heritage",
          "meaning": "Madaniy va tarixiy merosni asrab-avaylamoq"
        },
        {
          "phrase": "stand the test of time",
          "meaning": "Asrlar sinovidan omon va mustahkam o'tmoq"
        },
        {
          "phrase": "intricate carvings and mosaics",
          "meaning": "Nafis naqshlar, o'ymakorlik va rang-barang mozaikalar"
        },
        {
          "phrase": "demolish old structures",
          "meaning": "Qadimiy binolarni buzib tashlamoq"
        },
        {
          "phrase": "modern high-rise buildings",
          "meaning": "Ko'kka bo'y cho'zgan zamonaviy osmono'par binolar"
        },
        {
          "phrase": "a sense of nostalgia",
          "meaning": "O'tmish xotiralarini eslatuvchi sog'inch tuyg'usi"
        },
        {
          "phrase": "historical significance",
          "meaning": "Tarixiy ulkan ahamiyat va qimmat"
        },
        {
          "phrase": "renovate and restore",
          "meaning": "Asl qiyofasini tiklagan holda ta'mirlamoq"
        },
        {
          "phrase": "tourist hotspot",
          "meaning": "Sayyohlar eng ko'p oqib keladigan mashhur manzil"
        }
      ]
    }
  },
  {
    "id": "spk-p1-collecting-things",
    "part": 1,
    "title": "Collecting Things: Hobbies, Souvenirs & Antiques",
    "topicTag": "daily_life",
    "topicLabel": "Hobbies & Pastimes",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about collecting items as a hobby:",
      "followUpQuestions": [
        "Have you ever collected anything as a personal hobby?",
        "What kinds of items do people commonly collect in your culture?",
        "Why do you think some people enjoy collecting unique items?",
        "Did you collect coins, stamps, or stickers when you were a child?",
        "Would you like to collect expensive items like rare art or vintage cars in the future?",
        "Do you think collecting can ever get out of hand and become an obsession?"
      ],
      "usefulChunks": [
        {
          "phrase": "sentimental value",
          "meaning": "Moddiy bahosidan qat'i nazar, yuksak ma'naviy xotira qiymati"
        },
        {
          "phrase": "rare and vintage items",
          "meaning": "Kamdan-kam uchraydigan noyob va antiqa buyumlar"
        },
        {
          "phrase": "passionate collector",
          "meaning": "O'z kolleksiyasiga butun mehrini bergan ishqiboz"
        },
        {
          "phrase": "hunt for bargains",
          "meaning": "Bozorlarda arzon va noyob narsalarni izlab topmoq"
        },
        {
          "phrase": "pride of my collection",
          "meaning": "Kolleksiyamning eng sara va faxrli durdonasi"
        },
        {
          "phrase": "preserve memories",
          "meaning": "O'tmishdagi qadrli damlar va lahzalarni esda saqlamoq"
        },
        {
          "phrase": "turn into an obsession",
          "meaning": "Oddiy qiziqishdan me'yordan oshiq xira vasvasaga aylanmoq"
        },
        {
          "phrase": "clutter up the house",
          "meaning": "Uyni ortiqcha narsalar bilan to'ldirib, toraytirib yubormoq"
        },
        {
          "phrase": "valuable investment",
          "meaning": "Kelajakda qimmati oshadigan foydali sarmoya"
        },
        {
          "phrase": "sense of accomplishment",
          "meaning": "Katta qiyinchilik bilan narsani topgandagi yutuq hissi"
        }
      ]
    }
  },
  {
    "id": "spk-p1-advertisements",
    "part": 1,
    "title": "Advertisements & Commercials: Marketing & Consumer Influence",
    "topicTag": "daily_life",
    "topicLabel": "Media & Advertising",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss commercials, online ads, and marketing campaigns:",
      "followUpQuestions": [
        "What kinds of advertisements do you see most frequently?",
        "Do you pay attention to commercials when watching videos or TV shows?",
        "Have you ever bought a product solely because of an advertisement?",
        "Where do you encounter ads more often: on social media or on outdoor billboards?",
        "What factors make a commercial entertaining, memorable, or persuasive?",
        "Do you think there are too many intrusive advertisements on the internet today?"
      ],
      "usefulChunks": [
        {
          "phrase": "catch someone's attention",
          "meaning": "Kishining e'tiborini bir qarashda jalb qilmoq"
        },
        {
          "phrase": "intrusive pop-up ads",
          "meaning": "Ekranda ruxsatsiz chiqib, g'ashga tegadigan reklamalar"
        },
        {
          "phrase": "celebrity endorsement",
          "meaning": "Taniqli yulduz yoki blogerlar orqali mahsulotni targ'ib qilish"
        },
        {
          "phrase": "misleading advertisement",
          "meaning": "Xaridorni chalg'ituvchi, haqiqatga to'g'ri kelmaydigan reklama"
        },
        {
          "phrase": "targeted marketing",
          "meaning": "Foydalanuvchi qiziqishiga qarab moslashtirilgan maqsadli reklama"
        },
        {
          "phrase": "impulse buying",
          "meaning": "O'ylab o'tirmasdan, reklama ta'sirida birdaniga sotib olish"
        },
        {
          "phrase": "catchy slogan / jingle",
          "meaning": "Yodda tez qoladigan, quloqqa yoquvchi shior yoki kuy"
        },
        {
          "phrase": "manipulate consumer behavior",
          "meaning": "Iste'molchilar xatti-harakati va qarorlarini o'ziga moslash"
        },
        {
          "phrase": "skip ads",
          "meaning": "Video oldidagi reklamalarni o'tkazib yubormoq"
        },
        {
          "phrase": "word-of-mouth recommendation",
          "meaning": "Reklamadan ko'ra tanishlarning og'zaki tavsiyasiga ishonish"
        }
      ]
    }
  },
  {
    "id": "spk-p1-tiredness-boredom",
    "part": 1,
    "title": "Tiredness and Boredom: Fatigue, Leisure & Recharging",
    "topicTag": "daily_life",
    "topicLabel": "Wellbeing & Lifestyle",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about dealing with tiredness and feelings of boredom:",
      "followUpQuestions": [
        "What kinds of activities usually make you feel mentally or physically tired?",
        "What do you like to do to recharge your batteries when you feel exhausted?",
        "Do you ever find yourself feeling bored during the day?",
        "What do you typically do when boredom strikes?",
        "Did you feel bored more often when you were a child compared to nowadays?",
        "Do you agree that experiencing boredom can actually spark creative thinking?"
      ],
      "usefulChunks": [
        {
          "phrase": "burn the candle at both ends",
          "meaning": "Tunu kun tinimsiz ishlab, sog'likni xavf ostiga qo'ymoq"
        },
        {
          "phrase": "recharge my batteries",
          "meaning": "Dam olib, yo'qotilgan kuch-quvvatni qayta tiklamoq"
        },
        {
          "phrase": "mentally drained",
          "meaning": "Aqliy jihatdan butunlay toliqqan, tinkasi qurigan"
        },
        {
          "phrase": "bored to death / tears",
          "meaning": "Haddan tashqari zerikib, bekorchilikdan sillasi qurimoq"
        },
        {
          "phrase": "unwind with a book",
          "meaning": "Kitob mutolaa qilib orom olmoq, asablarni tinchlantirmoq"
        },
        {
          "phrase": "take a power nap",
          "meaning": "Kun o'rtasida 15-20 daqiqalik qisqa uyqu bilan tetiklashmoq"
        },
        {
          "phrase": "combat fatigue",
          "meaning": "Surunkali charchoq va holsizlikka qarshi kurashmoq"
        },
        {
          "phrase": "monotonous routine",
          "meaning": "Bir xil, takroriy va zerikarli kundalik tartib"
        },
        {
          "phrase": "spark imagination",
          "meaning": "Tasavvur va ijodiy fikrlashni uyg'otmoq"
        },
        {
          "phrase": "mindless scrolling",
          "meaning": "Maqsadsiz telefon ekranini pastga aylantirib vaqt o'tkazmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-daily-routine",
    "part": 1,
    "title": "Daily Routine: Schedules, Productivity & Habits",
    "topicTag": "daily_life",
    "topicLabel": "Habits & Routine",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about daily schedules, habits, and time management:",
      "followUpQuestions": [
        "What does your typical daily routine look like on weekdays?",
        "Which part of the day do you find yourself to be most productive?",
        "Do you usually plan out your schedule in advance or take things as they come?",
        "Has your daily routine changed noticeably over the past year?",
        "What is one thing you would love to improve about your daily habits?",
        "How do you handle your day when unforeseen events disrupt your schedule?"
      ],
      "usefulChunks": [
        {
          "phrase": "stick to a tight schedule",
          "meaning": "Aniq va qat'iy rejalashtirilgan jadvalga qat'iy rioya qilmoq"
        },
        {
          "phrase": "peak productivity hours",
          "meaning": "Kun davomida insonning eng sermahsul va tetik soatlari"
        },
        {
          "phrase": "procrastinate on tasks",
          "meaning": "Muhim vazifalarni orqaga surib, paysalga solmoq"
        },
        {
          "phrase": "prioritize important duties",
          "meaning": "Eng muhim vazifalarni birinchi o'ringa qo'ymoq"
        },
        {
          "phrase": "disrupt my daily flow",
          "meaning": "Kunlik tartib va ishlar oqimini izdan chiqarmoq"
        },
        {
          "phrase": "adapt on the fly",
          "meaning": "Vaziyatga qarab tezda yo'l topib, moslashmoq"
        },
        {
          "phrase": "strike a balance",
          "meaning": "Ish va dam olish o'rtasida mutanosiblik o'rnatmoq"
        },
        {
          "phrase": "set daily milestones",
          "meaning": "Har kuni erishilishi kerak bo'lgan aniq marralarni belgilamoq"
        },
        {
          "phrase": "ingrained habit",
          "meaning": "Inson tabiatiga chuqur singib ketgan mustahkam odat"
        },
        {
          "phrase": "wind down in the evening",
          "meaning": "Kechki payt tinchlanib, uyquga hozirlik ko'rmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-litter-rubbish",
    "part": 1,
    "title": "Litter & Rubbish: Waste Management & Clean Streets",
    "topicTag": "environment",
    "topicLabel": "Environment & Ecology",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about litter, recycling, and keeping public areas clean:",
      "followUpQuestions": [
        "Is littering a common issue in the city or neighborhood where you live?",
        "What do you do if you have garbage but cannot spot a trash bin nearby?",
        "Do households in your country actively sort and recycle their waste?",
        "What measures should municipal authorities take to prevent littering in public places?",
        "Did you learn about recycling and environmental cleanliness at school?",
        "Have you ever participated in a local neighborhood clean-up campaign?"
      ],
      "usefulChunks": [
        {
          "phrase": "litter the streets",
          "meaning": "Ko'chalarga chiqindi va axlat tashlab ifloslantirmoq"
        },
        {
          "phrase": "dispose of household waste",
          "meaning": "Uy-ro'zg'or chiqindilarini to'g'ri utilizatsiya qilmoq"
        },
        {
          "phrase": "separate recyclable materials",
          "meaning": "Qayta ishlanadigan qog'oz va plastikni alohida saralamoq"
        },
        {
          "phrase": "impose hefty fines",
          "meaning": "Ko'chaga chiqindi tashlaganlarga katta jarimalar qo'llamoq"
        },
        {
          "phrase": "raise civic awareness",
          "meaning": "Aholining ekologik ongi va fuqarolik mas'uliyatini oshirmoq"
        },
        {
          "phrase": "single-use plastic items",
          "meaning": "Bir martalik ishlatib tashlanadigan plastik buyumlar"
        },
        {
          "phrase": "keep the environment pristine",
          "meaning": "Atrof-muhitni toza, musaffo va ozoda saqlamoq"
        },
        {
          "phrase": "community clean-up drive",
          "meaning": "Mahalla va jamoat hashari, ko'chalarni tozalash aksiyasi"
        },
        {
          "phrase": "spoil the urban landscape",
          "meaning": "Shahar ko'rki va go'zalligiga putur yetkazmoq"
        },
        {
          "phrase": "biodegradable packaging",
          "meaning": "Tabiatda tez va zararsiz parchalanuvchi qadoqlar"
        }
      ]
    }
  },
  {
    "id": "spk-p1-politeness",
    "part": 1,
    "title": "Politeness: Etiquette, Manners & Respect",
    "topicTag": "daily_life",
    "topicLabel": "Manners & Social Etiquette",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about good manners, courtesy, and treating others politely:",
      "followUpQuestions": [
        "Who taught you manners and to be polite when you were growing up?",
        "What behaviors are considered polite and courteous in your culture?",
        "Do you think people nowadays are as polite as older generations were?",
        "How do you react when somebody behaves rudely or discourteously toward you?",
        "Is it always necessary to maintain politeness, even during heated disagreements?",
        "How do younger people in your country traditionally show respect to elders?"
      ],
      "usefulChunks": [
        {
          "phrase": "mind your manners",
          "meaning": "O'zini odobli va andishali tutmoq"
        },
        {
          "phrase": "treat someone with utmost respect",
          "meaning": "Birovga cheksiz ehtirom va izzat ko'rsatmoq"
        },
        {
          "phrase": "instill good values",
          "meaning": "Bolalikdan yoshlar ongiga go'zal fazilat va axloqni singdirmoq"
        },
        {
          "phrase": "lose your temper",
          "meaning": "Jahlni jilovlay olmay, o'zini yo'qotib qo'ymoq"
        },
        {
          "phrase": "take the high road",
          "meaning": "Birovning qo'polligiga qo'pollik bilan emas, vazminlik bilan javob bermoq"
        },
        {
          "phrase": "common courtesy",
          "meaning": "Har bir insondan kutiladigan oddiy xushmuomalalik"
        },
        {
          "phrase": "give up your seat for elders",
          "meaning": "Jamoat transportida yoshi kattalarga joy bo'shatmoq"
        },
        {
          "phrase": "diplomatic and tactful",
          "meaning": "Og'ir-bosiq, nozik andishali va muloyim muomalali"
        },
        {
          "phrase": "decline an invitation politely",
          "meaning": "Taklifni xushmuomalalik bilan rad etmoq"
        },
        {
          "phrase": "bridge social gaps",
          "meaning": "Samimiy tabassum va odob bilan munosabatlarni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-science",
    "part": 1,
    "title": "Science, Discoveries & School Experiments",
    "topicTag": "technology",
    "topicLabel": "Science & Innovation",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss science, school lab classes, and practical technology:",
      "followUpQuestions": [
        "Do you like science?",
        "Did you like science classes when you were young?",
        "Which science subject is most interesting for you?",
        "At what age did you start learning about science at school?",
        "On what occasions has scientific knowledge been useful to you in daily life?",
        "Do you think science and technology are crucial to our modern society?"
      ],
      "usefulChunks": [
        {
          "phrase": "hands-on experiments",
          "meaning": "Laboratoriyada o'z qo'li bilan amaliy tajribalar o'tkazmoq"
        },
        {
          "phrase": "breakthrough discovery",
          "meaning": "Ilm-fanda inqilobiy yangilik yoki kashfiyot"
        },
        {
          "phrase": "pique my curiosity",
          "meaning": "Mening qiziqishim va ishtiyoqimni uyg'otmoq"
        },
        {
          "phrase": "scientific breakthrough",
          "meaning": "Fan olamidagi ulkan ilmiy sakrash"
        },
        {
          "phrase": "evidence-based approach",
          "meaning": "Xomxayollarga emas, aniq fakt va dalillarga asoslangan yondashuv"
        },
        {
          "phrase": "unravel the mysteries of the universe",
          "meaning": "Koinot va tabiatning sir-asrorlarini ochmoq"
        },
        {
          "phrase": "apply theory into practice",
          "meaning": "Nazariy bilimlarni hayotiy amaliyotga tatbiq etmoq"
        },
        {
          "phrase": "drive human progress",
          "meaning": "Insoniyat taraqqiyotining asosiy harakatlantiruvchi kuchi bo'lmoq"
        },
        {
          "phrase": "technological advancements",
          "meaning": "Zamonaviy texnologik yutuqlar va yangiliklar"
        },
        {
          "phrase": "take things for granted",
          "meaning": "Ilm-fan tufayli paydo bo'lgan qulayliklarni tabiiy deb qabul qilmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-patience",
    "part": 1,
    "title": "Patience: Tolerance, Self-Control & Waiting",
    "topicTag": "daily_life",
    "topicLabel": "Personality & Patience",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about patience and dealing with delays:",
      "followUpQuestions": [
        "Would you consider yourself to be an inherently patient person?",
        "In what kinds of situations do you find yourself losing patience?",
        "How important is patience when working or studying toward long-term goals?",
        "Were you more patient as a child, or have you grown more patient over time?",
        "How do you stay calm and composed when stuck in heavy traffic or long lines?",
        "Do you believe instant gratification in digital technology has reduced our patience?"
      ],
      "usefulChunks": [
        {
          "phrase": "virtue of patience",
          "meaning": "Sabr-toqatli bo'lishdek yuksak insoniy fazilat"
        },
        {
          "phrase": "keep your composure",
          "meaning": "Har qanday asabiy holatda ham xotirjamlikni saqlab qolmoq"
        },
        {
          "phrase": "lose patience quickly",
          "meaning": "Juda tez sabri tugab, asabiylashib ketmoq"
        },
        {
          "phrase": "instant gratification",
          "meaning": "Hamma narsani darhol, bir zumda qo'lga kiritish istagi"
        },
        {
          "phrase": "short attention span",
          "meaning": "Diqqatni uzoq vaqt bir narsaga qaratib tura olmaslik"
        },
        {
          "phrase": "patience pays off",
          "meaning": "Qilingan mashaqqatli sabr oxir-oqibat o'z mevasini beradi"
        },
        {
          "phrase": "wait something out",
          "meaning": "Vaziyat o'tib ketguncha bosiqlik bilan kutib turmoq"
        },
        {
          "phrase": "test one's patience",
          "meaning": "Insonning chidami va asabini sinovdan o'tkazmoq"
        },
        {
          "phrase": "hasty decisions",
          "meaning": "Yetarlicha o'ylamasdan, shoshma-shosharlik bilan qabul qilingan qarorlar"
        },
        {
          "phrase": "calm under pressure",
          "meaning": "Bosim va tanglik ostida ham aql bilan ish tuta bilmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-websites",
    "part": 1,
    "title": "Websites, Online Tools & Digital Platforms",
    "topicTag": "technology",
    "topicLabel": "Technology & The Internet",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss internet browsing, favorite websites, and AI tools:",
      "followUpQuestions": [
        "What kinds of websites do you visit on a regular basis?",
        "What types of websites are currently most popular in your country?",
        "What is your absolute favorite website and why do you find it indispensable?",
        "Have you noticed any significant transformations in websites you frequently use?",
        "What design aspects make a website intuitive, enjoyable, and user-friendly?",
        "Do you regularly utilize websites powered by modern artificial intelligence?"
      ],
      "usefulChunks": [
        {
          "phrase": "browse the web",
          "meaning": "Internet sahifalarini ko'zdan kechirmoq"
        },
        {
          "phrase": "user-friendly interface",
          "meaning": "Foydalanish nihoyatda qulay va sodda bo'lgan sayt ko'rinishi"
        },
        {
          "phrase": "seamless navigation",
          "meaning": "Sahifalar bo'ylab qiyinchiliksiz va ravon harakatlanish"
        },
        {
          "phrase": "go-to website",
          "meaning": "Muntazam va eng birinchi navbatda kiradigan sevimli sayt"
        },
        {
          "phrase": "wealth of information",
          "meaning": "U yerda jamlangan tuganmas va boy ma'lumotlar xazinasi"
        },
        {
          "phrase": "AI-powered tools",
          "meaning": "Sun'iy intellekt texnologiyalari bilan jihozlangan aqlli vositalar"
        },
        {
          "phrase": "streamline workflows",
          "meaning": "Ish jarayonlarini sezilarli darajada yengillashtirmoq va tezlashtirmoq"
        },
        {
          "phrase": "cluttered with ads",
          "meaning": "Ortiqcha banner va reklamalar bilan tiqilib ketgan"
        },
        {
          "phrase": "reliable source of information",
          "meaning": "Haqiqiy va ishonchli ma'lumot manbai"
        },
        {
          "phrase": "integrate smart features",
          "meaning": "Saytga yangi va qulay funksiyalarni integratsiya qilmoq"
        }
      ]
    }
  }
];

export const PART_2_SPEAKING_TOPICS: SpeakingTopicItem[] = [
  {
    "id": "spk-p2-difficult-decision",
    "part": 2,
    "title": "Describe a difficult decision that you made and had a good result",
    "topicTag": "study_work",
    "topicLabel": "Life Choices & Decisions",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the decision was and when you had to make it",
        "What choices or alternative options you were weighing",
        "Why making that decision was so challenging for you",
        "And explain how you felt after making the decision and what positive outcome occurred."
      ],
      "usefulChunks": [
        {
          "phrase": "at a critical crossroads",
          "meaning": "Hayotdagi eng muhim chorrahada, qiyin tanlov qarshisida qolmoq"
        },
        {
          "phrase": "weigh the pros and cons",
          "meaning": "Har bir variantning foydali va zararli tomonlarini puxta tahlil qilmoq"
        },
        {
          "phrase": "take a leap of faith",
          "meaning": "Noma'lum xatarga qaramasdan qat'iy tavakkal qilib qadam tashlamoq"
        },
        {
          "phrase": "nerve-wracking experience",
          "meaning": "Inson asablarini taranglashtiradigan og'ir vaziyat"
        },
        {
          "phrase": "pay off in the long run",
          "meaning": "Kelajakda kutilganidan ham ziyoda ijobiy natija bermoq"
        },
        {
          "phrase": "turn out for the best",
          "meaning": "Kutilmaganda eng yaxshi va xayrli yakun topmoq"
        },
        {
          "phrase": "listen to my gut feeling",
          "meaning": "O'z ichki hissiyoti va qalbiga quloq solmoq"
        },
        {
          "phrase": "stepping stone to success",
          "meaning": "Katta yutuqlar sari muhim poydevor va tramplin bo'lmoq"
        },
        {
          "phrase": "sigh of relief",
          "meaning": "Yengil nafas tortmoq, dildagi xavotir tarqamoq"
        },
        {
          "phrase": "boost my self-confidence",
          "meaning": "O'z kuchiga bo'lgan ishonchni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-interesting-video-social-media",
    "part": 2,
    "title": "Describe an interesting video you watched in social media",
    "topicTag": "technology",
    "topicLabel": "Social Media & Media Content",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the video was about and which platform you saw it on",
        "Who created or was featured in the video",
        "Why you decided to click on and watch it",
        "And explain why you found this video so fascinating or inspiring."
      ],
      "usefulChunks": [
        {
          "phrase": "scroll through my social media feed",
          "meaning": "Ijtimoiy tarmoq lentasini bemaqsad ko'zdan kechirib o'tirmoq"
        },
        {
          "phrase": "instantly grab my attention",
          "meaning": "Darhol mening butun diqqat-e'tiborimni o'ziga tortmoq"
        },
        {
          "phrase": "viral video",
          "meaning": "Qisqa vaqt ichida millionlab odamlar ko'rgan mashhur video"
        },
        {
          "phrase": "thought-provoking concept",
          "meaning": "Insonni chuqur o'yga toldiradigan falsafiy g'oya"
        },
        {
          "phrase": "visually stunning production",
          "meaning": "Tasviriy jihatdan benuqson va yuqori darajada ishlangan montaj"
        },
        {
          "phrase": "food for thought",
          "meaning": "Aql va tafakkur uchun ozuqa beradigan fikrlar"
        },
        {
          "phrase": "leave a lasting impression",
          "meaning": "Xotirada uzoq vaqt unutilmas chuqur iz qoldirmoq"
        },
        {
          "phrase": "broaden my perspective",
          "meaning": "Dunyoqarash va fikrlash ufqini kengaytirmoq"
        },
        {
          "phrase": "resonate with the audience",
          "meaning": "Tomoshabinlar qalbidan chuqur joy olmoq"
        },
        {
          "phrase": "educational yet entertaining",
          "meaning": "Ham ibratli va foydali, ham ko'ngilochar xarakterdagi"
        }
      ]
    }
  },
  {
    "id": "spk-p2-home-visit-not-live",
    "part": 2,
    "title": "Describe a home that you like to visit but did not want to live in",
    "topicTag": "daily_life",
    "topicLabel": "Homes & Living Spaces",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Whose home it is and where it is situated",
        "What the interior and exterior of the home look like",
        "What you usually do when you visit there",
        "And explain why you enjoy visiting this home but would not want to reside there permanently."
      ],
      "usefulChunks": [
        {
          "phrase": "lavish and luxurious decor",
          "meaning": "Haddan ziyod dabdabali, qimmatbaho va hashamatli jihozlar"
        },
        {
          "phrase": "architectural masterpiece",
          "meaning": "Me'morchilik san'atining yuksak namunasi"
        },
        {
          "phrase": "remote and secluded location",
          "meaning": "Shahar shovqinidan juda uzoq, xilvat go'sha"
        },
        {
          "phrase": "cut off from modern amenities",
          "meaning": "Shahar qulayliklari va infratuzilmasidan uzilib qolgan"
        },
        {
          "phrase": "warm hospitality",
          "meaning": "Mezbonlarning samimiy va iliq mehmondo'stligi"
        },
        {
          "phrase": "feel like a museum",
          "meaning": "Uydan ko'ra ko'proq teginish taqiqlangan muzeyga o'xshamoq"
        },
        {
          "phrase": "high-maintenance property",
          "meaning": "Uni saranjom tutish uchun juda ko'p xarajat va mehnat talab etiladigan uy"
        },
        {
          "phrase": "long and exhausting commute",
          "meaning": "U yerga yetib borish uchun uzoq va toliqtiruvchi yo'l bosish"
        },
        {
          "phrase": "great for a short getaway",
          "meaning": "Qisqa muddat dam olib qaytish uchun ideal maskan"
        },
        {
          "phrase": "lack practical convenience",
          "meaning": "Kundalik doimiy yashash uchun zarur amaliy qulayliklarning yetishmasligi"
        }
      ]
    }
  },
  {
    "id": "spk-p2-time-wasting-activity",
    "part": 2,
    "title": "Describe an activity you usually do that wastes your time",
    "topicTag": "daily_life",
    "topicLabel": "Habits & Time Management",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the activity is",
        "When and how frequently you usually find yourself doing it",
        "Why you consider this activity to be unproductive and a waste of precious time",
        "And explain how you feel afterwards and why it is so difficult to stop doing it."
      ],
      "usefulChunks": [
        {
          "phrase": "guilty pleasure",
          "meaning": "Foydasizligini bilsa-da, insonga vaqtincha zavq beruvchi odat"
        },
        {
          "phrase": "fall down a rabbit hole",
          "meaning": "Internetda bir mavzudan boshqasiga o'tib, soatlab qolib ketmoq"
        },
        {
          "phrase": "procrastinate on crucial tasks",
          "meaning": "Eng muhim vazifalarni bajarishdan qochib, vaqtni bekorga o'tkazmoq"
        },
        {
          "phrase": "lose all sense of time",
          "meaning": "Vaqt qanday o'tib ketganini mutlaqo sezmay qolmoq"
        },
        {
          "phrase": "drain my mental energy",
          "meaning": "Insonning butun ruhiy va jismoniy quvvatini so'rib olmoq"
        },
        {
          "phrase": "a sense of regret",
          "meaning": "Bekor ketgan vaqt uchun ichki pushaymonlik va nadomat"
        },
        {
          "phrase": "vicious cycle",
          "meaning": "Tugamaydigan, bir-birini takrorlovchi yomon doira"
        },
        {
          "phrase": "short-lived dopamine hit",
          "meaning": "Ijtimoiy tarmoqlardagi layk va videolardan keladigan qisqa lazzat"
        },
        {
          "phrase": "break this bad habit",
          "meaning": "Ushbu salbiy va samarasiz odatni butunlay tashlamoq"
        },
        {
          "phrase": "regain control over my schedule",
          "meaning": "O'z vaqtini qaytadan to'liq o'z nazoratiga olmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-building-enjoyed-spending-time",
    "part": 2,
    "title": "Describe a building that you have enjoyed spending time in",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & Public Places",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Where this building is located and what its design looks like",
        "What facilities, atmosphere, and amenities it provides",
        "What you typically do whenever you visit this building",
        "And explain why spending time inside this building brings you genuine satisfaction."
      ],
      "usefulChunks": [
        {
          "phrase": "architectural splendour",
          "meaning": "Me'morchilik san'atining mahobati va ko'rki"
        },
        {
          "phrase": "serene and tranquil atmosphere",
          "meaning": "Osoyiishta, sokin va xotirjam ichki muhit"
        },
        {
          "phrase": "floor-to-ceiling glass windows",
          "meaning": "Poldan shiftgacha bo'lgan bahaybat shisha derazalar"
        },
        {
          "phrase": "spacious and well-ventilated",
          "meaning": "Havosini yaxshi aylantiradigan keng va yorug' zallar"
        },
        {
          "phrase": "peace of mind",
          "meaning": "Qalb xotirjamligi va ichki ruhiy sokinlik"
        },
        {
          "phrase": "immerse myself in study",
          "meaning": "O'zini butunlay kitob mutolaasi yoki darsga bag'ishlamoq"
        },
        {
          "phrase": "modern state-of-the-art facilities",
          "meaning": "Eng zamonaviy standartlar asosidagi qulayliklar"
        },
        {
          "phrase": "retreat from the bustling city",
          "meaning": "Shahar to'polonidan chekinib dam oladigan maskan"
        },
        {
          "phrase": "welcoming ambiance",
          "meaning": "Kishiga xush yoquvchi, iliq va mehmondo'st muhit"
        },
        {
          "phrase": "cherish every moment spent there",
          "meaning": "U yerda o'tgan har bir daqiqani qadrlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-health-article",
    "part": 2,
    "title": "Describe an article on health you read in a magazine",
    "topicTag": "daily_life",
    "topicLabel": "Health & Well-being",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What magazine or journal you read the article in",
        "What specific health topic or medical discovery it discussed",
        "What practical advice or preventative recommendations were outlined",
        "And explain why this article made an impression on you and how it influenced your lifestyle."
      ],
      "usefulChunks": [
        {
          "phrase": "wellness publication",
          "meaning": "Sog'lom turmush tarzi va salomatlikka bag'ishlangan jurnal"
        },
        {
          "phrase": "eye-opening revelation",
          "meaning": "Ko'zni ochadigan, insonni hayratga soluvchi yangilik"
        },
        {
          "phrase": "nutritional guidelines",
          "meaning": "To'g'ri va me'yorda ovqatlanish bo'yicha ilmiy qoidalar"
        },
        {
          "phrase": "boost the immune system",
          "meaning": "Inson immunitetini mustahkamlamoq va quvvatlantirmoq"
        },
        {
          "phrase": "counteract sedentary lifestyle",
          "meaning": "Kamharakat turmush tarzining zararli oqibatlarini bartaraf etmoq"
        },
        {
          "phrase": "incorporate into my daily routine",
          "meaning": "Tavsiyalarni o'z kundalik hayotiga tatbiq etmoq"
        },
        {
          "phrase": "backed by scientific evidence",
          "meaning": "Qat'iy ilmiy tajriba va dalillar bilan isbotlangan"
        },
        {
          "phrase": "prevent chronic illnesses",
          "meaning": "Surunkali kasalliklarning oldini olmoq"
        },
        {
          "phrase": "mental clarity and stamina",
          "meaning": "Zehn tiniqligi va jismoniy baquvvatlik"
        },
        {
          "phrase": "catalyst for positive change",
          "meaning": "Hayotni yaxshi tomonga burgan muhim turtki"
        }
      ]
    }
  },
  {
    "id": "spk-p2-admired-old-person",
    "part": 2,
    "title": "Describe an old person that you admired",
    "topicTag": "daily_life",
    "topicLabel": "Role Models & Wisdom",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Who this elderly individual is and how you first met them",
        "What kind of personality traits and life accomplishments they possess",
        "What profound wisdom or memorable advice they have shared with you",
        "And explain why you admire and hold this senior person in such high regard."
      ],
      "usefulChunks": [
        {
          "phrase": "fountain of wisdom",
          "meaning": "Tuganmas hayotiy hikmat va aql-idrok chashmasi"
        },
        {
          "phrase": "weather many storms in life",
          "meaning": "Hayotning barcha sinov va qiyinchiliklarini mardona yengib o'tmoq"
        },
        {
          "phrase": "exemplary character",
          "meaning": "Barchaga o'rnak va ibrat bo'la oladigan yuksak axloq"
        },
        {
          "phrase": "infectious optimism",
          "meaning": "Atrofdagilarga ham yuqadigan quvnoq va umidbaxsh qarash"
        },
        {
          "phrase": "humble and unassuming",
          "meaning": "Kamtargina, hech qachon manmanlik qilmaydigan olijanob inson"
        },
        {
          "phrase": "treasure their guidance",
          "meaning": "Ularning bergan dono maslahatlarini qadrlab asramoq"
        },
        {
          "phrase": "pillar of strength for the family",
          "meaning": "Oila a'zolari suyangan tog' va mustahkam tayanch"
        },
        {
          "phrase": "command great respect",
          "meaning": "Barcha insonlar orasida ulkan hurmat va ehtiromga sazovor bo'lmoq"
        },
        {
          "phrase": "leave a profound legacy",
          "meaning": "O'zidan keyin chuqur va unutilmas ma'naviy meros qoldirmoq"
        },
        {
          "phrase": "inspire me to be a better person",
          "meaning": "Meni yanada yaxshiroq va komilroq inson bo'lishga undamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-photograph-of-yourself",
    "part": 2,
    "title": "Describe a photograph of yourself that you like",
    "topicTag": "art_culture",
    "topicLabel": "Memories & Photography",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Where and when this photograph was captured",
        "Who took the photo",
        "What you were doing, wearing, or celebrating in the image",
        "And explain why you cherish this particular photo of yourself above others."
      ],
      "usefulChunks": [
        {
          "phrase": "capture a candid moment",
          "meaning": "Beparvo, hech qanday qoliplarsiz tabiiy lahzani suratga muhrlamoq"
        },
        {
          "phrase": "evoke fond memories",
          "meaning": "O'tmishdagi eng shirin va qadrli xotiralarni uyg'otmoq"
        },
        {
          "phrase": "genuine smile",
          "meaning": "Sun'iy emas, chin dildan chiqqan samimiy tabassum"
        },
        {
          "phrase": "breathtaking backdrop",
          "meaning": "Surat orqasidagi lol qoldiruvchi tabiiy manzara"
        },
        {
          "phrase": "framed on my bedside table",
          "meaning": "Yotoqxona javoniga ramkada qo'yilgan"
        },
        {
          "phrase": "freeze a fleeting moment",
          "meaning": "Tez o'tib ketuvchi lahzani abadiy qilib to'xtatib qo'ymoq"
        },
        {
          "phrase": "photogenic angle",
          "meaning": "Inson qiyofasini eng chiroyli ko'rsatadigan surat burchagi"
        },
        {
          "phrase": "sense of joy and contentment",
          "meaning": "Yuzdagi baxt, shodlik va mamnunlik ifodasi"
        },
        {
          "phrase": "sentimental value",
          "meaning": "Moddiy jihatdan bebaho ma'naviy xotira qiymati"
        },
        {
          "phrase": "bring a smile to my face",
          "meaning": "Har safar qaraganda insonning labiga quvonch tabassumi keltirmoq"
        }
      ]
    }
  }
];

export const PART_3_SPEAKING_TOPICS: SpeakingTopicItem[] = [
  {
    "id": "spk-p3-decision-making",
    "part": 3,
    "title": "Decision Making, Advice & Personal Autonomy",
    "topicTag": "study_work",
    "topicLabel": "Decision Making & Advice",
    "questionCount": 12,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on consumer behavior, advice, and autonomy:",
      "followUpQuestions": [
        "Do advertisements influence consumers' decisions?",
        "Who do young people like to ask for advice when making decisions?",
        "Do you think it's necessary for kids to make as many decisions by themselves as they can?",
        "Do you think some people can make decisions without asking for advice from others?",
        "Do you think young people are easily influenced by others when they make decisions? Why or why not?",
        "What kinds of decisions do young people have to make?",
        "Why do some people find it difficult to make important decisions?",
        "Do young people make decisions differently from older people?",
        "Who do people usually ask for advice when making important decisions?",
        "Do you think people should always think carefully before making decisions?",
        "Can difficult decisions help people grow as individuals? Why?",
        "Do you prefer making decisions alone or with other people's advice?"
      ],
      "usefulChunks": [
        {
          "phrase": "swayed by advertisements",
          "meaning": "Reklamalar ta'siriga tushib fikrini o'zgartirmoq"
        },
        {
          "phrase": "make independent choices",
          "meaning": "Hech kimga qaram bo'lmagan mustaqil qarorlar qabul qilmoq"
        },
        {
          "phrase": "seek trusted guidance",
          "meaning": "Ishonchli va tajribali insonlardan yo'l-yo'riq so'ramoq"
        },
        {
          "phrase": "peer pressure",
          "meaning": "Tengdoshlar yoki do'stlar davrasining ruhiy ta'siri va bosimi"
        },
        {
          "phrase": "weigh alternative options",
          "meaning": "Bir nechta boshqa yo'llar va variantlarni solishtirib ko'rmoq"
        },
        {
          "phrase": "fear of making mistakes",
          "meaning": "Xato qilishdan yoki pushaymon bo'lishdan hadiksirash"
        },
        {
          "phrase": "foster self-reliance in children",
          "meaning": "Bolalarda mustaqillik va o'ziga ishonch tuyg'usini tarbiyalamoq"
        },
        {
          "phrase": "deliberate thoughtfully",
          "meaning": "Bir qarorga kelishdan avval har tomonlama chuqur mulohaza qilmoq"
        },
        {
          "phrase": "act on impulse",
          "meaning": "Oqibatini o'ylamasdan hissiyotga berilib harakat qilmoq"
        },
        {
          "phrase": "build character through challenges",
          "meaning": "Murakkab qarorlar va qiyinchiliklar orqali shaxs sifatida kamol topmoq"
        },
        {
          "phrase": "crossroad in life",
          "meaning": "Hayotiy yo'nalishni butunlay o'zgartiruvchi hal qiluvchi palla"
        },
        {
          "phrase": "accountability for one's actions",
          "meaning": "O'zining harakatlari va xatolari uchun shaxsiy javobgarlikni bo'yniga olmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-social-media",
    "part": 3,
    "title": "Social Media, Video Content & Digital Influence",
    "topicTag": "technology",
    "topicLabel": "Social Media & Public Opinion",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on online habits, video consumption, and social impact:",
      "followUpQuestions": [
        "Why do people spend so much time watching videos online?",
        "What types of videos are popular nowadays?",
        "Do social media videos influence people's opinions?",
        "Are online videos educational? Why or why not?",
        "Do you think social media has more advantages than disadvantages?",
        "Should children's use of social media be controlled?"
      ],
      "usefulChunks": [
        {
          "phrase": "algorithm-driven feeds",
          "meaning": "Sun'iy intellekt algoritmlari asosida shakllanadigan tavsiyalar lentasi"
        },
        {
          "phrase": "binge-watch content",
          "meaning": "Ketma-ket to'xtovsiz soatlab video tomosha qilmoq"
        },
        {
          "phrase": "shape public opinion",
          "meaning": "Keng jamoatchilik fikri va qarashlarini shakllantirmoq"
        },
        {
          "phrase": "bite-sized educational videos",
          "meaning": "Murakkab mavzularni oson tushuntiruvchi qisqa ma'rifiy videolar"
        },
        {
          "phrase": "double-edged sword",
          "meaning": "Ham ijobiy, ham xavfli salbiy oqibatlarga ega ikki tomonlama qurol"
        },
        {
          "phrase": "parental supervision",
          "meaning": "Ota-onalarning farzandlari ustidan nazorati va e'tibori"
        },
        {
          "phrase": "digital addiction",
          "meaning": "Smartfon va ijtimoiy tarmoqlarga qaram bo'lib qolish xastaligi"
        },
        {
          "phrase": "spread misinformation",
          "meaning": "Yolg'on va tekshirilmagan xabarlarni tarqatmoq"
        },
        {
          "phrase": "foster creativity",
          "meaning": "Yoshlarda ijodkorlik va kreativlikni rivojlantirmoq"
        },
        {
          "phrase": "screen time boundaries",
          "meaning": "Ekran qarshisida o'tkaziladigan vaqtga qat'iy cheklovlar qo'ymoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-home-accommodation",
    "part": 3,
    "title": "Home and Accommodation: Housing & Urban vs Rural Living",
    "topicTag": "daily_life",
    "topicLabel": "Housing & Community Living",
    "questionCount": 13,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on comfortable housing, architecture, and lifestyle choices:",
      "followUpQuestions": [
        "What makes a home comfortable to live in?",
        "Do people's housing preferences change as they get older?",
        "Is it better to live in a house or an apartment? Why?",
        "What factors do people consider when choosing a home?",
        "Do modern homes differ from homes in the past?",
        "How important is location when choosing a home?",
        "In your country, when people visit other people in their homes, do they usually bring a gift?",
        "What kind of houses or apartments do people prefer to buy?",
        "What is the difference between living in the countryside and the city?",
        "Do you prefer to live in the city or in the countryside?",
        "What are the differences between houses or buildings in the city and in the countryside?",
        "What safety risks are there in residential buildings in cities?",
        "Is it expensive to decorate a house or an apartment in the place where you live?"
      ],
      "usefulChunks": [
        {
          "phrase": "prime location",
          "meaning": "Shahar markazidagi eng qulay va qimmat joylashuv"
        },
        {
          "phrase": "spacious layout",
          "meaning": "Keng va qulay xonalar tuzilishi"
        },
        {
          "phrase": "suburban living",
          "meaning": "Shahar chetidagi tinch hududda yashash tarzi"
        },
        {
          "phrase": "skyrocketing property prices",
          "meaning": "Ko'chmas mulk narxlarining haddan tashqari balandlab ketishi"
        },
        {
          "phrase": "modern conveniences",
          "meaning": "Zamonaviy turmush uchun barcha zaruriy maishiy sharoitlar"
        },
        {
          "phrase": "guest hospitality customs",
          "meaning": "Mehmonga borganda shirinlik yoki sovg'a olib borish milliy odobi"
        },
        {
          "phrase": "fire hazard and building safety",
          "meaning": "Ko'p qavatli binolardagi yong'in va seysmik xavfsizlik choralari"
        },
        {
          "phrase": "countryside tranquility",
          "meaning": "Qishloq hayotiga xos musaffo havo, sukunat va tinchlik"
        },
        {
          "phrase": "interior renovation expenses",
          "meaning": "Uyning ichki ta'miri va pardozlash xarajatlari"
        },
        {
          "phrase": "energy-efficient housing",
          "meaning": "Energiyani tejaydigan va issiqlikni saqlaydigan xonadonlar"
        },
        {
          "phrase": "proximity to essential amenities",
          "meaning": "Maktab, shifoxona va do'konlarga yaqin masofada bo'lish"
        }
      ]
    }
  },
  {
    "id": "spk-p3-time-management",
    "part": 3,
    "title": "Time Management, Work-Life Balance & Social Pressure",
    "topicTag": "study_work",
    "topicLabel": "Productivity & Life Balance",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on managing time, handling pressure, and daily discipline:",
      "followUpQuestions": [
        "How do you balance life and work?",
        "Will you continue doing something when you are aware that it's a waste of time?",
        "What kinds of things make people feel pressured?",
        "Why do some people refuse to abide by rules?",
        "Why do many professionals struggle with chronic procrastination?",
        "How can modern digital tools help people optimize their daily schedule?"
      ],
      "usefulChunks": [
        {
          "phrase": "maintain work-life equilibrium",
          "meaning": "Ish faoliyati va shaxsiy hayot o'rtasida muvozanatni saqlamoq"
        },
        {
          "phrase": "unrealistic deadlines",
          "meaning": "Bajarish uchun yetarli bo'lmagan qisqa va qattiq muddatlar"
        },
        {
          "phrase": "rebellion against authority",
          "meaning": "Mavjud qonun-qoidalarga bo'ysunmaslik, isyonkorlik"
        },
        {
          "phrase": "chronic procrastination",
          "meaning": "Barcha ishlarni surunkali ravishda oxirgi fursatga surib yurish"
        },
        {
          "phrase": "set realistic boundaries",
          "meaning": "Ish va dam olish vaqtlariga aniq chegara belgilamoq"
        },
        {
          "phrase": "burnout syndrome",
          "meaning": "Haddan tashqari zo'riqishdan kelib chiqadigan kasbiy toliqish"
        },
        {
          "phrase": "eliminate time wasters",
          "meaning": "Vaqtni behuda sarflaydigan keraksiz mashg'ulotlardan xalos bo'lmoq"
        },
        {
          "phrase": "focus on high-priority tasks",
          "meaning": "Eng muhim va natija beruvchi ishlarga diqqatni jamlamoq"
        },
        {
          "phrase": "peace of mind over hustle",
          "meaning": "Tinimsiz yugur-yugurdan ko'ra ruhiy xotirjamlikni ustun qo'ymoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-building-architecture",
    "part": 3,
    "title": "Building, Public Architecture & Urban Design",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & Urban Planning",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on public buildings, architectural trends, and urban design:",
      "followUpQuestions": [
        "What is the most important for a public building: design, location, or facilities?",
        "Do you think the appearance of a building is important?",
        "How have buildings changed in the past few years?",
        "Should governments protect historic buildings from being demolished?",
        "How do green and sustainable buildings benefit modern cities?",
        "Does the architecture of a workplace affect the productivity and mood of employees?"
      ],
      "usefulChunks": [
        {
          "phrase": "form follows function",
          "meaning": "Binoning tashqi ko'rinishi uning amaliy qulayligiga xizmat qilishi kerak"
        },
        {
          "phrase": "aesthetic appeal",
          "meaning": "Ko'zni quvontiruvchi go'zal tashqi ko'rinish va did"
        },
        {
          "phrase": "eco-friendly construction",
          "meaning": "Atrof-muhitga zarar yetkazmaydigan ekologik qurilish"
        },
        {
          "phrase": "architectural landmark",
          "meaning": "Shaharga shon-shuhrat keltiruvchi ramziy bino"
        },
        {
          "phrase": "harmonize with the surroundings",
          "meaning": "Atrofdagi tabiiy muhit bilan uyg'unlashib ketmoq"
        },
        {
          "phrase": "demolish heritage sites",
          "meaning": "Tarixiy obidalarni buzib tashlash xatosi"
        },
        {
          "phrase": "accessible for people with disabilities",
          "meaning": "Nogironligi bor insonlar uchun barcha qulayliklar bilan ta'minlangan"
        },
        {
          "phrase": "smart building technology",
          "meaning": "Harorat va yoritishni avtomatik boshqaruvchi aqlli binolar"
        },
        {
          "phrase": "boost civic pride",
          "meaning": "Shahar aholisining o'z shahri bilan faxrlanish tuyg'usini oshirmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-photography",
    "part": 3,
    "title": "Photography, Visual Memory & Digital Media",
    "topicTag": "art_culture",
    "topicLabel": "Photography & Visual Culture",
    "questionCount": 15,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on photo taking, visual documentation, and memory:",
      "followUpQuestions": [
        "What do most people in your country use to take photos?",
        "What kinds of devices do people like to use for taking photos these days?",
        "Is it easier to take pictures now than in the past?",
        "Why is taking photographs such an important part of people's lives?",
        "Why do some people like to keep photos?",
        "Why do some people not like to keep photos of themselves?",
        "Why do some people like to delete photos?",
        "Do you agree that people rely too much on photographs to remember people and places?",
        "How are photographs used to help people learn?",
        "How are photographs used in textbooks and advertisements?",
        "Why can one photograph of an important news event be so powerful?",
        "What photos do people often hang on the wall at home?",
        "How do people keep their photos?",
        "Is it difficult for people to learn how to take good photos?",
        "Why do people take photos?"
      ],
      "usefulChunks": [
        {
          "phrase": "ubiquitous smartphones",
          "meaning": "Har bir inson cho'ntagida bo'lgan keng tarqalgan smartfonlar"
        },
        {
          "phrase": "capture precious memories",
          "meaning": "Eng qadrli va baxtli lahzalarni suratga muhrlamoq"
        },
        {
          "phrase": "a picture is worth a thousand words",
          "meaning": "Bitta rasm mingta so'zdan ko'proq ma'no bera oladi (maqol)"
        },
        {
          "phrase": "digital decluttering",
          "meaning": "Telefon xotirasini bo'shatish uchun keraksiz suratlarni o'chirib tashlash"
        },
        {
          "phrase": "rely on digital records",
          "meaning": "Xotira o'rniga faqat telefon xotirasidagi suratlarga tayanib qolmoq"
        },
        {
          "phrase": "visual aid in education",
          "meaning": "Dars jarayonida o'quvchilarga mavzuni tushunishga yordam beruvchi ko'rgazmali qurol"
        },
        {
          "phrase": "news photojournalism",
          "meaning": "Dunyo voqealarini fosh etuvchi ta'sirchan fotojurnalistika"
        },
        {
          "phrase": "framed family portraits",
          "meaning": "Devorga osib qo'yilgan ramkali oilaviy suratlar"
        },
        {
          "phrase": "cloud storage solutions",
          "meaning": "Suratlarni xavfsiz saqlash uchun bulutli internet omborlari"
        },
        {
          "phrase": "master the craft of composition",
          "meaning": "Suratga olish burchagi va yorug'lik san'atini chuqur o'rganmoq"
        },
        {
          "phrase": "freeze an ephemeral instant",
          "meaning": "Ko'z ochib yumguncha o'tib ketadigan lahzani abadiylashtirmoq"
        },
        {
          "phrase": "document life milestones",
          "meaning": "Bitiruv, to'y yoki yubiley kabi katta hayotiy marralarni hujjatlashtirmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-health-magazine",
    "part": 3,
    "title": "Health Information, Public Wellness & Media Reliability",
    "topicTag": "daily_life",
    "topicLabel": "Health & Public Awareness",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on public health, fitness trends, and medical media:",
      "followUpQuestions": [
        "Where do people in your country typically get their health and wellness information?",
        "Can health articles published in popular magazines and social media always be trusted?",
        "What role should governments play in encouraging healthy lifestyle choices among citizens?",
        "Why do people often ignore healthy habits even when they know the risks of unhealthy behavior?",
        "Do you think mental health awareness is given as much priority as physical fitness nowadays?",
        "How will emerging medical technologies reshape personal healthcare in the future?"
      ],
      "usefulChunks": [
        {
          "phrase": "reliable medical sources",
          "meaning": "Ishonchli va mutaxassislar tomonidan tasdiqlangan tibbiy manbalar"
        },
        {
          "phrase": "sensationalized health fads",
          "meaning": "Odamlarni jalb qilish uchun o'ylab topilgan soxta parhez va odatlar"
        },
        {
          "phrase": "promote preventative medicine",
          "meaning": "Kasallik yuz berguncha uning oldini olish choralarini targ'ib qilmoq"
        },
        {
          "phrase": "sedentary desk jobs",
          "meaning": "Kun bo'yi stulda o'tirib bajariladigan kamharakat ishlar"
        },
        {
          "phrase": "destigmatize mental health",
          "meaning": "Ruhiy salomatlik muammolarini uyat deb bilmasdan, unga to'g'ri munosabatda bo'lmoq"
        },
        {
          "phrase": "telemedicine consultations",
          "meaning": "Shifokor bilan masofadan video orqali tibbiy maslahatlashuv"
        },
        {
          "phrase": "long-term lifestyle modifications",
          "meaning": "Vaqtinchalik emas, butun umrga mos sog'lom turmush o'zgarishlari"
        },
        {
          "phrase": "public health campaigns",
          "meaning": "Aholi salomatligini saqlash bo'yicha davlat targ'ibot loyihalari"
        }
      ]
    }
  },
  {
    "id": "spk-p3-aging-admiration",
    "part": 3,
    "title": "Elderly Care, Intergenerational Wisdom & Modern Society",
    "topicTag": "daily_life",
    "topicLabel": "Society & Elderly Care",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on aging populations, respecting elders, and generational wisdom:",
      "followUpQuestions": [
        "What valuable life lessons and wisdom can younger generations gain from senior citizens?",
        "What role do grandparents traditionally play in raising grandchildren in your society?",
        "Should retirement ages be raised as global life expectancy continues to increase?",
        "What unique challenges do countries face when experiencing an aging demographic?",
        "How can local communities prevent elderly individuals from experiencing social isolation?",
        "Are senior citizens given the same level of respect today as they received in earlier generations?"
      ],
      "usefulChunks": [
        {
          "phrase": "intergenerational bonding",
          "meaning": "Keksalar va yosh avlod o'rtasidagi mehr-oqibat va hamjihatlik"
        },
        {
          "phrase": "wealth of life experience",
          "meaning": "Yillar davomida to'plangan ulkan hayotiy tajriba"
        },
        {
          "phrase": "aging demographic shift",
          "meaning": "Jamiyatda keksalar ulushining ortib borishi hodisasi"
        },
        {
          "phrase": "pension burden on economy",
          "meaning": "Pensiya tizimining davlat byudjetiga tushadigan moliyaviy yuki"
        },
        {
          "phrase": "combat social isolation",
          "meaning": "Keksa insonlarning yolg'izlanib qolishiga yo'l qo'ymaslik"
        },
        {
          "phrase": "revere senior citizens",
          "meaning": "Yoshi ulug' otaxon va onaxonlarni yuksak e'zozlamoq"
        },
        {
          "phrase": "pass down cultural values",
          "meaning": "Milliy an'ana va qadriyatlarni nevaralarga meros qoldirmoq"
        },
        {
          "phrase": "nursing homes vs family care",
          "meaning": "Qariyalar uyi va oila bag'ridagi mehr-muruvvat o'rtasidagi farq"
        }
      ]
    }
  }
];

export const ALL_SPEAKING_TOPICS: SpeakingTopicItem[] = [
  {
    "id": "spk-p1-work-study",
    "part": 1,
    "title": "Work and Study: Careers, Academic Life & Ambitions",
    "topicTag": "study_work",
    "topicLabel": "Study & Work",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about your studies or career:",
      "followUpQuestions": [
        "Do you currently work or are you a student?",
        "What do you like most about your studies or your job?",
        "Why did you choose this field of study or career path?",
        "Do you prefer to study or work alone, or as part of a team?",
        "What are your future career plans or educational goals?",
        "Is there anything you would like to change about your study or work routine?"
      ],
      "usefulChunks": [
        {
          "phrase": "major in",
          "meaning": "Muayyan mutaxassislik bo'yicha oliygohda tahsil olmoq"
        },
        {
          "phrase": "pursue a career in",
          "meaning": "Ma'lum bir kasbiy sohada faoliyat yuritishga intilmoq"
        },
        {
          "phrase": "climb the corporate ladder",
          "meaning": "Kompaniyada martaba pog'onalaridan yuqoriga ko'tarilmoq"
        },
        {
          "phrase": "fast-paced environment",
          "meaning": "Shiddatli, tez sur'atlarda o'zgaruvchan ish muhiti"
        },
        {
          "phrase": "hands-on experience",
          "meaning": "Amaliy, bevosita tajriba orttirmoq"
        },
        {
          "phrase": "collaborative mindset",
          "meaning": "Jamoa bilan hamjihatlikda ishlash tafakkuri"
        },
        {
          "phrase": "juggle work and study",
          "meaning": "Bir paytning o'zida ham o'qish, ham ishni eplab olib bormoq"
        },
        {
          "phrase": "broaden my horizon",
          "meaning": "Dunyoqarash va bilim doirasini kengaytirmoq"
        },
        {
          "phrase": "steep learning curve",
          "meaning": "Qisqa vaqtda ko'p yangi narsalarni o'rganish talab etiladigan jarayon"
        },
        {
          "phrase": "job satisfaction",
          "meaning": "O'z kasbi va bajargan mehnatidan qoniqish hissi"
        },
        {
          "phrase": "heavy workload",
          "meaning": "Haddan tashqari ko'p ish yoki topshiriqlar yuki"
        },
        {
          "phrase": "lucrative career path",
          "meaning": "Katta daromad keltiruvchi, istiqbolli kasb yo'li"
        },
        {
          "phrase": "strike a healthy balance",
          "meaning": "Ish va dam olish o'rtasida sog'lom muvozanat o'rnatmoq"
        },
        {
          "phrase": "keep up with industry trends",
          "meaning": "O'z sohasidagi eng so'nggi yangilik va o'zgarishlardan xabardor bo'lib bormoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-area-you-live-in",
    "part": 1,
    "title": "The Area You Live In: Neighborhood & Local Environment",
    "topicTag": "travel",
    "topicLabel": "Neighborhood & Community",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about the neighborhood where you currently reside:",
      "followUpQuestions": [
        "Where do you currently live?",
        "What do you like most about the area you live in?",
        "What kinds of facilities or shops are available in your neighborhood?",
        "Is public transport convenient in your residential area?",
        "Has your neighborhood changed much since you first moved there?",
        "Would you recommend your area to families looking for a place to live?"
      ],
      "usefulChunks": [
        {
          "phrase": "residential neighborhood",
          "meaning": "Tinch, faqat aholi yashashiga mo'ljallangan dahasi"
        },
        {
          "phrase": "within walking distance",
          "meaning": "Piyoda bir necha daqiqada yetib borish mumkin bo'lgan yaqinlikda"
        },
        {
          "phrase": "vibrant and lively",
          "meaning": "Hayot qaynagan, gavjum va jo'shqin muhit"
        },
        {
          "phrase": "peaceful and quiet",
          "meaning": "Shovqinsiz, osuda va xotirjam maskan"
        },
        {
          "phrase": "local amenities",
          "meaning": "Mahalladagi do'kon, dorixona, bog'cha kabi qulayliklar"
        },
        {
          "phrase": "well-connected transport links",
          "meaning": "Jamoat transporti qatnovi juda qulay yo'lga qo'yilgan"
        },
        {
          "phrase": "close-knit community",
          "meaning": "Bir-biri bilan ahil, mehr-oqibatli mahalla ahilligi"
        },
        {
          "phrase": "green spaces and tree-lined streets",
          "meaning": "Daraxtzor ko'chalar va yashil hiyobonlar"
        },
        {
          "phrase": "undergo rapid development",
          "meaning": "Tez sur'atlar bilan obodonlashib, rivojlanib bormoq"
        },
        {
          "phrase": "hustle and bustle",
          "meaning": "Shahar markazidagi to'polon va shovqin-suron"
        },
        {
          "phrase": "safe and secure atmosphere",
          "meaning": "Xavfsiz va xotirjam muhit"
        },
        {
          "phrase": "convenient access to",
          "meaning": "... ga oson va qulay yetib borish imkoniyati"
        },
        {
          "phrase": "lively cafe culture",
          "meaning": "Ko'plab shinam qahvaxonalar mavjud bo'lgan zamonaviy muhit"
        }
      ]
    }
  },
  {
    "id": "spk-p1-family-friends",
    "part": 1,
    "title": "Family & Friends: Relationships & Social Connections",
    "topicTag": "daily_life",
    "topicLabel": "Family & Relationships",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about family bonds, friendships, and spending time together:",
      "followUpQuestions": [
        "Do you spend more time with your family or your friends?",
        "What activities do you usually enjoy doing with your family members?",
        "How do you usually keep in touch with friends you don't see often?",
        "Do you prefer to have a large group of friends or a few close confidants?",
        "Who in your family are you most similar to in personality?",
        "What qualities do you value most in a true friend?"
      ],
      "usefulChunks": [
        {
          "phrase": "close-knit family",
          "meaning": "Juda inoq, bir-birini doim qo'llab-quvvatlaydigan oila"
        },
        {
          "phrase": "keep in touch with",
          "meaning": "Doimiy ravishda aloqada bo'lib turmoq"
        },
        {
          "phrase": "drift apart over time",
          "meaning": "Vaqt o'tishi bilan munosabatlar sovuqlashib, uzoqlashib ketmoq"
        },
        {
          "phrase": "count on someone",
          "meaning": "Qiyin vaziyatda birovga to'liq suyanmoq va ishonmoq"
        },
        {
          "phrase": "have a lot in common",
          "meaning": "Umumiy qiziqishlar va o'xshash qarashlarga ega bo'lmoq"
        },
        {
          "phrase": "see eye to eye with",
          "meaning": "Fikr va qarashlarda bir joydan chiqmoq, to'liq hamfikr bo'lmoq"
        },
        {
          "phrase": "catch up over coffee",
          "meaning": "Qahva ustida ko'rishib, yangiliklar va dildan suhbat qurmoq"
        },
        {
          "phrase": "take after someone",
          "meaning": "Fe'l-atvori yoki ko'rinishi bilan ota-onaga tortmoq, o'xshamoq"
        },
        {
          "phrase": "through thick and thin",
          "meaning": "Har qanday qiyinchilik va shodlik kunlarida birga bo'lmoq"
        },
        {
          "phrase": "confide in someone",
          "meaning": "Yurakdagi eng ichki sirlarni ishonib ochmoq"
        },
        {
          "phrase": "unconditional support",
          "meaning": "Hech qanday shartsiz, beg'araz madad va qo'llov"
        },
        {
          "phrase": "strengthen family ties",
          "meaning": "Oila a'zolari o'rtasidagi mehr va rishtalarni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-home",
    "part": 1,
    "title": "Home: Accommodation, Comfort & Interior Spaces",
    "topicTag": "daily_life",
    "topicLabel": "Home & Living Space",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about your home and living accommodation:",
      "followUpQuestions": [
        "Do you live in a house or an apartment?",
        "Which room in your home do you spend the most time in?",
        "How long have you lived in your current accommodation?",
        "What would you like to improve or renovate in your home?",
        "Do you plan to move to a different home in the near future?",
        "What features make a home feel cozy, warm, and welcoming to you?"
      ],
      "usefulChunks": [
        {
          "phrase": "multi-storey apartment building",
          "meaning": "Ko'p qavatli zamonaviy turar-joy binosi"
        },
        {
          "phrase": "spacious and well-lit",
          "meaning": "Keng, shinam va tabiiy yorug'likka to'la"
        },
        {
          "phrase": "home decor",
          "meaning": "Uyning ichki bezagi va dizayn jilozi"
        },
        {
          "phrase": "create a cozy atmosphere",
          "meaning": "Issiq, iliq va qulay xonadon muhitini yaratmoq"
        },
        {
          "phrase": "cluttered with unnecessary items",
          "meaning": "Ortiqcha, keraksiz buyumlar bilan to'lib-toshib ketgan"
        },
        {
          "phrase": "minimalist interior",
          "meaning": "Ortiqcha bezaklarsiz, sodda va zamonaviy interyer"
        },
        {
          "phrase": "renovate the kitchen",
          "meaning": "Oshxonani qayta ta'mirlamoq va yangilamoq"
        },
        {
          "phrase": "feel right at home",
          "meaning": "O'zini juda erkin, qulay va xuddi o'z uyidagidek his qilmoq"
        },
        {
          "phrase": "peaceful sanctuary",
          "meaning": "Tashqi dunyo shovqinidan holi, sokin panohgoh"
        },
        {
          "phrase": "plenty of natural sunlight",
          "meaning": "Xonaga mo'l-ko'l tushib turuvchi tabiiy quyosh nuri"
        },
        {
          "phrase": "modern household appliances",
          "meaning": "Zamonaviy maishiy ro'zg'or texnikalari"
        }
      ]
    }
  },
  {
    "id": "spk-p1-morning-time",
    "part": 1,
    "title": "Morning Time: Morning Routines & Starting the Day",
    "topicTag": "daily_life",
    "topicLabel": "Daily Habits & Morning Time",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss how you usually spend your mornings:",
      "followUpQuestions": [
        "What is your typical morning routine?",
        "Do you consider yourself an early riser or a night owl?",
        "Do you usually eat a substantial breakfast in the morning?",
        "What is the very first thing you do right after waking up?",
        "Did you have the same morning routine when you were a school student?",
        "How does waking up early impact your energy and mood during the day?"
      ],
      "usefulChunks": [
        {
          "phrase": "early bird / early riser",
          "meaning": "Erta tongda barvaqt uyg'onishga odatlangan odam"
        },
        {
          "phrase": "night owl",
          "meaning": "Kechqurun uzoq vaqt bedor o'tirib, kech uxlaydigan inson"
        },
        {
          "phrase": "hit the snooze button",
          "meaning": "Budilnik jiringlaganda 'yana 5 daqiqa' deb qayta o'chirib qo'ymoq"
        },
        {
          "phrase": "jump out of bed",
          "meaning": "O'rindan chaqqon va sergak turib ketmoq"
        },
        {
          "phrase": "kick-start my day",
          "meaning": "Kunga ko'tarinki ruh va kuchli energiya bilan kirishmoq"
        },
        {
          "phrase": "grab a quick bite",
          "meaning": "Shoshilinchda tezda yengil tamaddi qilib olmoq"
        },
        {
          "phrase": "wholesome breakfast",
          "meaning": "Foydali, to'yimli va tabiiy ertalabki nonushta"
        },
        {
          "phrase": "mentally prepare for the day ahead",
          "meaning": "Kutilayotgan kundalik vazifalarga ruhan shaylanmoq"
        },
        {
          "phrase": "rush out the door",
          "meaning": "Vaqt tig'izligidan uydan shoshib-pishib chiqib ketmoq"
        },
        {
          "phrase": "feel refreshed and energized",
          "meaning": "O'zini tetik, kuch-quvvatga to'la va orom olgan his qilmoq"
        },
        {
          "phrase": "drag myself out of bed",
          "meaning": "Zo'rg'a, charchoq va uyqusirash bilan o'rindan turmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-hometown",
    "part": 1,
    "title": "Hometown: Origins, Culture & Urban Transformation",
    "topicTag": "travel",
    "topicLabel": "Hometown & Heritage",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about the city or town where you grew up:",
      "followUpQuestions": [
        "Where is your hometown located?",
        "What do you like most about your hometown?",
        "Is your hometown a good place for young people to build a future?",
        "Has your hometown undergone significant changes over recent years?",
        "What is the most well-known landmark or attraction in your hometown?",
        "Do you think you will continue living in your hometown for years to come?"
      ],
      "usefulChunks": [
        {
          "phrase": "born and bred",
          "meaning": "Tug'ilib, o'sib voyaga yetgan"
        },
        {
          "phrase": "picturesque scenery",
          "meaning": "Tasviriy san'at asaridek go'zal, ko'rkam manzara"
        },
        {
          "phrase": "rich cultural heritage",
          "meaning": "Boy tarixiy va madaniy meros"
        },
        {
          "phrase": "undergo drastic transformation",
          "meaning": "Keskin va keng ko'lamli ijobiy o'zgarishlarga yuz tutmoq"
        },
        {
          "phrase": "historical landmarks",
          "meaning": "Tarixiy obidalar va qadimiy me'moriy yodgorliklar"
        },
        {
          "phrase": "job opportunities for youth",
          "meaning": "Yoshlar uchun yangi ish o'rinlari va istiqbollar"
        },
        {
          "phrase": "hospitality of local people",
          "meaning": "Mahalliy aholining samimiy mehmondo'stligi va ochiqko'ngilligi"
        },
        {
          "phrase": "thriving commercial hub",
          "meaning": "Rivojlanib borayotgan yirik savdo-sanoat markazi"
        },
        {
          "phrase": "peaceful rural vibe",
          "meaning": "Qishloq joylariga xos osoyishta va sokin ruhiyat"
        },
        {
          "phrase": "special place in my heart",
          "meaning": "Qalbim to'ridan chuqur va aziz o'rin egallagan"
        }
      ]
    }
  },
  {
    "id": "spk-p1-old-buildings",
    "part": 1,
    "title": "Old Buildings: Historic Architecture & Heritage",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & History",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about old and historical buildings:",
      "followUpQuestions": [
        "Are there many historic or old buildings in your city or hometown?",
        "Do you enjoy visiting and exploring historical buildings?",
        "What do you think about preserving old buildings rather than replacing them?",
        "Have you ever lived in an older building or apartment block?",
        "Do ancient and historical buildings attract international tourists to your country?",
        "Should municipal governments allocate funds to restore heritage structures?"
      ],
      "usefulChunks": [
        {
          "phrase": "architectural marvel",
          "meaning": "Me'morchilik san'atining tengsiz mo'jizasi"
        },
        {
          "phrase": "preserve cultural heritage",
          "meaning": "Madaniy va tarixiy merosni asrab-avaylamoq"
        },
        {
          "phrase": "stand the test of time",
          "meaning": "Asrlar sinovidan omon va mustahkam o'tmoq"
        },
        {
          "phrase": "intricate carvings and mosaics",
          "meaning": "Nafis naqshlar, o'ymakorlik va rang-barang mozaikalar"
        },
        {
          "phrase": "demolish old structures",
          "meaning": "Qadimiy binolarni buzib tashlamoq"
        },
        {
          "phrase": "modern high-rise buildings",
          "meaning": "Ko'kka bo'y cho'zgan zamonaviy osmono'par binolar"
        },
        {
          "phrase": "a sense of nostalgia",
          "meaning": "O'tmish xotiralarini eslatuvchi sog'inch tuyg'usi"
        },
        {
          "phrase": "historical significance",
          "meaning": "Tarixiy ulkan ahamiyat va qimmat"
        },
        {
          "phrase": "renovate and restore",
          "meaning": "Asl qiyofasini tiklagan holda ta'mirlamoq"
        },
        {
          "phrase": "tourist hotspot",
          "meaning": "Sayyohlar eng ko'p oqib keladigan mashhur manzil"
        }
      ]
    }
  },
  {
    "id": "spk-p1-collecting-things",
    "part": 1,
    "title": "Collecting Things: Hobbies, Souvenirs & Antiques",
    "topicTag": "daily_life",
    "topicLabel": "Hobbies & Pastimes",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about collecting items as a hobby:",
      "followUpQuestions": [
        "Have you ever collected anything as a personal hobby?",
        "What kinds of items do people commonly collect in your culture?",
        "Why do you think some people enjoy collecting unique items?",
        "Did you collect coins, stamps, or stickers when you were a child?",
        "Would you like to collect expensive items like rare art or vintage cars in the future?",
        "Do you think collecting can ever get out of hand and become an obsession?"
      ],
      "usefulChunks": [
        {
          "phrase": "sentimental value",
          "meaning": "Moddiy bahosidan qat'i nazar, yuksak ma'naviy xotira qiymati"
        },
        {
          "phrase": "rare and vintage items",
          "meaning": "Kamdan-kam uchraydigan noyob va antiqa buyumlar"
        },
        {
          "phrase": "passionate collector",
          "meaning": "O'z kolleksiyasiga butun mehrini bergan ishqiboz"
        },
        {
          "phrase": "hunt for bargains",
          "meaning": "Bozorlarda arzon va noyob narsalarni izlab topmoq"
        },
        {
          "phrase": "pride of my collection",
          "meaning": "Kolleksiyamning eng sara va faxrli durdonasi"
        },
        {
          "phrase": "preserve memories",
          "meaning": "O'tmishdagi qadrli damlar va lahzalarni esda saqlamoq"
        },
        {
          "phrase": "turn into an obsession",
          "meaning": "Oddiy qiziqishdan me'yordan oshiq xira vasvasaga aylanmoq"
        },
        {
          "phrase": "clutter up the house",
          "meaning": "Uyni ortiqcha narsalar bilan to'ldirib, toraytirib yubormoq"
        },
        {
          "phrase": "valuable investment",
          "meaning": "Kelajakda qimmati oshadigan foydali sarmoya"
        },
        {
          "phrase": "sense of accomplishment",
          "meaning": "Katta qiyinchilik bilan narsani topgandagi yutuq hissi"
        }
      ]
    }
  },
  {
    "id": "spk-p1-advertisements",
    "part": 1,
    "title": "Advertisements & Commercials: Marketing & Consumer Influence",
    "topicTag": "daily_life",
    "topicLabel": "Media & Advertising",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss commercials, online ads, and marketing campaigns:",
      "followUpQuestions": [
        "What kinds of advertisements do you see most frequently?",
        "Do you pay attention to commercials when watching videos or TV shows?",
        "Have you ever bought a product solely because of an advertisement?",
        "Where do you encounter ads more often: on social media or on outdoor billboards?",
        "What factors make a commercial entertaining, memorable, or persuasive?",
        "Do you think there are too many intrusive advertisements on the internet today?"
      ],
      "usefulChunks": [
        {
          "phrase": "catch someone's attention",
          "meaning": "Kishining e'tiborini bir qarashda jalb qilmoq"
        },
        {
          "phrase": "intrusive pop-up ads",
          "meaning": "Ekranda ruxsatsiz chiqib, g'ashga tegadigan reklamalar"
        },
        {
          "phrase": "celebrity endorsement",
          "meaning": "Taniqli yulduz yoki blogerlar orqali mahsulotni targ'ib qilish"
        },
        {
          "phrase": "misleading advertisement",
          "meaning": "Xaridorni chalg'ituvchi, haqiqatga to'g'ri kelmaydigan reklama"
        },
        {
          "phrase": "targeted marketing",
          "meaning": "Foydalanuvchi qiziqishiga qarab moslashtirilgan maqsadli reklama"
        },
        {
          "phrase": "impulse buying",
          "meaning": "O'ylab o'tirmasdan, reklama ta'sirida birdaniga sotib olish"
        },
        {
          "phrase": "catchy slogan / jingle",
          "meaning": "Yodda tez qoladigan, quloqqa yoquvchi shior yoki kuy"
        },
        {
          "phrase": "manipulate consumer behavior",
          "meaning": "Iste'molchilar xatti-harakati va qarorlarini o'ziga moslash"
        },
        {
          "phrase": "skip ads",
          "meaning": "Video oldidagi reklamalarni o'tkazib yubormoq"
        },
        {
          "phrase": "word-of-mouth recommendation",
          "meaning": "Reklamadan ko'ra tanishlarning og'zaki tavsiyasiga ishonish"
        }
      ]
    }
  },
  {
    "id": "spk-p1-tiredness-boredom",
    "part": 1,
    "title": "Tiredness and Boredom: Fatigue, Leisure & Recharging",
    "topicTag": "daily_life",
    "topicLabel": "Wellbeing & Lifestyle",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about dealing with tiredness and feelings of boredom:",
      "followUpQuestions": [
        "What kinds of activities usually make you feel mentally or physically tired?",
        "What do you like to do to recharge your batteries when you feel exhausted?",
        "Do you ever find yourself feeling bored during the day?",
        "What do you typically do when boredom strikes?",
        "Did you feel bored more often when you were a child compared to nowadays?",
        "Do you agree that experiencing boredom can actually spark creative thinking?"
      ],
      "usefulChunks": [
        {
          "phrase": "burn the candle at both ends",
          "meaning": "Tunu kun tinimsiz ishlab, sog'likni xavf ostiga qo'ymoq"
        },
        {
          "phrase": "recharge my batteries",
          "meaning": "Dam olib, yo'qotilgan kuch-quvvatni qayta tiklamoq"
        },
        {
          "phrase": "mentally drained",
          "meaning": "Aqliy jihatdan butunlay toliqqan, tinkasi qurigan"
        },
        {
          "phrase": "bored to death / tears",
          "meaning": "Haddan tashqari zerikib, bekorchilikdan sillasi qurimoq"
        },
        {
          "phrase": "unwind with a book",
          "meaning": "Kitob mutolaa qilib orom olmoq, asablarni tinchlantirmoq"
        },
        {
          "phrase": "take a power nap",
          "meaning": "Kun o'rtasida 15-20 daqiqalik qisqa uyqu bilan tetiklashmoq"
        },
        {
          "phrase": "combat fatigue",
          "meaning": "Surunkali charchoq va holsizlikka qarshi kurashmoq"
        },
        {
          "phrase": "monotonous routine",
          "meaning": "Bir xil, takroriy va zerikarli kundalik tartib"
        },
        {
          "phrase": "spark imagination",
          "meaning": "Tasavvur va ijodiy fikrlashni uyg'otmoq"
        },
        {
          "phrase": "mindless scrolling",
          "meaning": "Maqsadsiz telefon ekranini pastga aylantirib vaqt o'tkazmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-daily-routine",
    "part": 1,
    "title": "Daily Routine: Schedules, Productivity & Habits",
    "topicTag": "daily_life",
    "topicLabel": "Habits & Routine",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about daily schedules, habits, and time management:",
      "followUpQuestions": [
        "What does your typical daily routine look like on weekdays?",
        "Which part of the day do you find yourself to be most productive?",
        "Do you usually plan out your schedule in advance or take things as they come?",
        "Has your daily routine changed noticeably over the past year?",
        "What is one thing you would love to improve about your daily habits?",
        "How do you handle your day when unforeseen events disrupt your schedule?"
      ],
      "usefulChunks": [
        {
          "phrase": "stick to a tight schedule",
          "meaning": "Aniq va qat'iy rejalashtirilgan jadvalga qat'iy rioya qilmoq"
        },
        {
          "phrase": "peak productivity hours",
          "meaning": "Kun davomida insonning eng sermahsul va tetik soatlari"
        },
        {
          "phrase": "procrastinate on tasks",
          "meaning": "Muhim vazifalarni orqaga surib, paysalga solmoq"
        },
        {
          "phrase": "prioritize important duties",
          "meaning": "Eng muhim vazifalarni birinchi o'ringa qo'ymoq"
        },
        {
          "phrase": "disrupt my daily flow",
          "meaning": "Kunlik tartib va ishlar oqimini izdan chiqarmoq"
        },
        {
          "phrase": "adapt on the fly",
          "meaning": "Vaziyatga qarab tezda yo'l topib, moslashmoq"
        },
        {
          "phrase": "strike a balance",
          "meaning": "Ish va dam olish o'rtasida mutanosiblik o'rnatmoq"
        },
        {
          "phrase": "set daily milestones",
          "meaning": "Har kuni erishilishi kerak bo'lgan aniq marralarni belgilamoq"
        },
        {
          "phrase": "ingrained habit",
          "meaning": "Inson tabiatiga chuqur singib ketgan mustahkam odat"
        },
        {
          "phrase": "wind down in the evening",
          "meaning": "Kechki payt tinchlanib, uyquga hozirlik ko'rmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-litter-rubbish",
    "part": 1,
    "title": "Litter & Rubbish: Waste Management & Clean Streets",
    "topicTag": "environment",
    "topicLabel": "Environment & Ecology",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about litter, recycling, and keeping public areas clean:",
      "followUpQuestions": [
        "Is littering a common issue in the city or neighborhood where you live?",
        "What do you do if you have garbage but cannot spot a trash bin nearby?",
        "Do households in your country actively sort and recycle their waste?",
        "What measures should municipal authorities take to prevent littering in public places?",
        "Did you learn about recycling and environmental cleanliness at school?",
        "Have you ever participated in a local neighborhood clean-up campaign?"
      ],
      "usefulChunks": [
        {
          "phrase": "litter the streets",
          "meaning": "Ko'chalarga chiqindi va axlat tashlab ifloslantirmoq"
        },
        {
          "phrase": "dispose of household waste",
          "meaning": "Uy-ro'zg'or chiqindilarini to'g'ri utilizatsiya qilmoq"
        },
        {
          "phrase": "separate recyclable materials",
          "meaning": "Qayta ishlanadigan qog'oz va plastikni alohida saralamoq"
        },
        {
          "phrase": "impose hefty fines",
          "meaning": "Ko'chaga chiqindi tashlaganlarga katta jarimalar qo'llamoq"
        },
        {
          "phrase": "raise civic awareness",
          "meaning": "Aholining ekologik ongi va fuqarolik mas'uliyatini oshirmoq"
        },
        {
          "phrase": "single-use plastic items",
          "meaning": "Bir martalik ishlatib tashlanadigan plastik buyumlar"
        },
        {
          "phrase": "keep the environment pristine",
          "meaning": "Atrof-muhitni toza, musaffo va ozoda saqlamoq"
        },
        {
          "phrase": "community clean-up drive",
          "meaning": "Mahalla va jamoat hashari, ko'chalarni tozalash aksiyasi"
        },
        {
          "phrase": "spoil the urban landscape",
          "meaning": "Shahar ko'rki va go'zalligiga putur yetkazmoq"
        },
        {
          "phrase": "biodegradable packaging",
          "meaning": "Tabiatda tez va zararsiz parchalanuvchi qadoqlar"
        }
      ]
    }
  },
  {
    "id": "spk-p1-politeness",
    "part": 1,
    "title": "Politeness: Etiquette, Manners & Respect",
    "topicTag": "daily_life",
    "topicLabel": "Manners & Social Etiquette",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about good manners, courtesy, and treating others politely:",
      "followUpQuestions": [
        "Who taught you manners and to be polite when you were growing up?",
        "What behaviors are considered polite and courteous in your culture?",
        "Do you think people nowadays are as polite as older generations were?",
        "How do you react when somebody behaves rudely or discourteously toward you?",
        "Is it always necessary to maintain politeness, even during heated disagreements?",
        "How do younger people in your country traditionally show respect to elders?"
      ],
      "usefulChunks": [
        {
          "phrase": "mind your manners",
          "meaning": "O'zini odobli va andishali tutmoq"
        },
        {
          "phrase": "treat someone with utmost respect",
          "meaning": "Birovga cheksiz ehtirom va izzat ko'rsatmoq"
        },
        {
          "phrase": "instill good values",
          "meaning": "Bolalikdan yoshlar ongiga go'zal fazilat va axloqni singdirmoq"
        },
        {
          "phrase": "lose your temper",
          "meaning": "Jahlni jilovlay olmay, o'zini yo'qotib qo'ymoq"
        },
        {
          "phrase": "take the high road",
          "meaning": "Birovning qo'polligiga qo'pollik bilan emas, vazminlik bilan javob bermoq"
        },
        {
          "phrase": "common courtesy",
          "meaning": "Har bir insondan kutiladigan oddiy xushmuomalalik"
        },
        {
          "phrase": "give up your seat for elders",
          "meaning": "Jamoat transportida yoshi kattalarga joy bo'shatmoq"
        },
        {
          "phrase": "diplomatic and tactful",
          "meaning": "Og'ir-bosiq, nozik andishali va muloyim muomalali"
        },
        {
          "phrase": "decline an invitation politely",
          "meaning": "Taklifni xushmuomalalik bilan rad etmoq"
        },
        {
          "phrase": "bridge social gaps",
          "meaning": "Samimiy tabassum va odob bilan munosabatlarni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-science",
    "part": 1,
    "title": "Science, Discoveries & School Experiments",
    "topicTag": "technology",
    "topicLabel": "Science & Innovation",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss science, school lab classes, and practical technology:",
      "followUpQuestions": [
        "Do you like science?",
        "Did you like science classes when you were young?",
        "Which science subject is most interesting for you?",
        "At what age did you start learning about science at school?",
        "On what occasions has scientific knowledge been useful to you in daily life?",
        "Do you think science and technology are crucial to our modern society?"
      ],
      "usefulChunks": [
        {
          "phrase": "hands-on experiments",
          "meaning": "Laboratoriyada o'z qo'li bilan amaliy tajribalar o'tkazmoq"
        },
        {
          "phrase": "breakthrough discovery",
          "meaning": "Ilm-fanda inqilobiy yangilik yoki kashfiyot"
        },
        {
          "phrase": "pique my curiosity",
          "meaning": "Mening qiziqishim va ishtiyoqimni uyg'otmoq"
        },
        {
          "phrase": "scientific breakthrough",
          "meaning": "Fan olamidagi ulkan ilmiy sakrash"
        },
        {
          "phrase": "evidence-based approach",
          "meaning": "Xomxayollarga emas, aniq fakt va dalillarga asoslangan yondashuv"
        },
        {
          "phrase": "unravel the mysteries of the universe",
          "meaning": "Koinot va tabiatning sir-asrorlarini ochmoq"
        },
        {
          "phrase": "apply theory into practice",
          "meaning": "Nazariy bilimlarni hayotiy amaliyotga tatbiq etmoq"
        },
        {
          "phrase": "drive human progress",
          "meaning": "Insoniyat taraqqiyotining asosiy harakatlantiruvchi kuchi bo'lmoq"
        },
        {
          "phrase": "technological advancements",
          "meaning": "Zamonaviy texnologik yutuqlar va yangiliklar"
        },
        {
          "phrase": "take things for granted",
          "meaning": "Ilm-fan tufayli paydo bo'lgan qulayliklarni tabiiy deb qabul qilmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-patience",
    "part": 1,
    "title": "Patience: Tolerance, Self-Control & Waiting",
    "topicTag": "daily_life",
    "topicLabel": "Personality & Patience",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's talk about patience and dealing with delays:",
      "followUpQuestions": [
        "Would you consider yourself to be an inherently patient person?",
        "In what kinds of situations do you find yourself losing patience?",
        "How important is patience when working or studying toward long-term goals?",
        "Were you more patient as a child, or have you grown more patient over time?",
        "How do you stay calm and composed when stuck in heavy traffic or long lines?",
        "Do you believe instant gratification in digital technology has reduced our patience?"
      ],
      "usefulChunks": [
        {
          "phrase": "virtue of patience",
          "meaning": "Sabr-toqatli bo'lishdek yuksak insoniy fazilat"
        },
        {
          "phrase": "keep your composure",
          "meaning": "Har qanday asabiy holatda ham xotirjamlikni saqlab qolmoq"
        },
        {
          "phrase": "lose patience quickly",
          "meaning": "Juda tez sabri tugab, asabiylashib ketmoq"
        },
        {
          "phrase": "instant gratification",
          "meaning": "Hamma narsani darhol, bir zumda qo'lga kiritish istagi"
        },
        {
          "phrase": "short attention span",
          "meaning": "Diqqatni uzoq vaqt bir narsaga qaratib tura olmaslik"
        },
        {
          "phrase": "patience pays off",
          "meaning": "Qilingan mashaqqatli sabr oxir-oqibat o'z mevasini beradi"
        },
        {
          "phrase": "wait something out",
          "meaning": "Vaziyat o'tib ketguncha bosiqlik bilan kutib turmoq"
        },
        {
          "phrase": "test one's patience",
          "meaning": "Insonning chidami va asabini sinovdan o'tkazmoq"
        },
        {
          "phrase": "hasty decisions",
          "meaning": "Yetarlicha o'ylamasdan, shoshma-shosharlik bilan qabul qilingan qarorlar"
        },
        {
          "phrase": "calm under pressure",
          "meaning": "Bosim va tanglik ostida ham aql bilan ish tuta bilmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p1-websites",
    "part": 1,
    "title": "Websites, Online Tools & Digital Platforms",
    "topicTag": "technology",
    "topicLabel": "Technology & The Internet",
    "questionCount": 6,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "Let's discuss internet browsing, favorite websites, and AI tools:",
      "followUpQuestions": [
        "What kinds of websites do you visit on a regular basis?",
        "What types of websites are currently most popular in your country?",
        "What is your absolute favorite website and why do you find it indispensable?",
        "Have you noticed any significant transformations in websites you frequently use?",
        "What design aspects make a website intuitive, enjoyable, and user-friendly?",
        "Do you regularly utilize websites powered by modern artificial intelligence?"
      ],
      "usefulChunks": [
        {
          "phrase": "browse the web",
          "meaning": "Internet sahifalarini ko'zdan kechirmoq"
        },
        {
          "phrase": "user-friendly interface",
          "meaning": "Foydalanish nihoyatda qulay va sodda bo'lgan sayt ko'rinishi"
        },
        {
          "phrase": "seamless navigation",
          "meaning": "Sahifalar bo'ylab qiyinchiliksiz va ravon harakatlanish"
        },
        {
          "phrase": "go-to website",
          "meaning": "Muntazam va eng birinchi navbatda kiradigan sevimli sayt"
        },
        {
          "phrase": "wealth of information",
          "meaning": "U yerda jamlangan tuganmas va boy ma'lumotlar xazinasi"
        },
        {
          "phrase": "AI-powered tools",
          "meaning": "Sun'iy intellekt texnologiyalari bilan jihozlangan aqlli vositalar"
        },
        {
          "phrase": "streamline workflows",
          "meaning": "Ish jarayonlarini sezilarli darajada yengillashtirmoq va tezlashtirmoq"
        },
        {
          "phrase": "cluttered with ads",
          "meaning": "Ortiqcha banner va reklamalar bilan tiqilib ketgan"
        },
        {
          "phrase": "reliable source of information",
          "meaning": "Haqiqiy va ishonchli ma'lumot manbai"
        },
        {
          "phrase": "integrate smart features",
          "meaning": "Saytga yangi va qulay funksiyalarni integratsiya qilmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-difficult-decision",
    "part": 2,
    "title": "Describe a difficult decision that you made and had a good result",
    "topicTag": "study_work",
    "topicLabel": "Life Choices & Decisions",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the decision was and when you had to make it",
        "What choices or alternative options you were weighing",
        "Why making that decision was so challenging for you",
        "And explain how you felt after making the decision and what positive outcome occurred."
      ],
      "usefulChunks": [
        {
          "phrase": "at a critical crossroads",
          "meaning": "Hayotdagi eng muhim chorrahada, qiyin tanlov qarshisida qolmoq"
        },
        {
          "phrase": "weigh the pros and cons",
          "meaning": "Har bir variantning foydali va zararli tomonlarini puxta tahlil qilmoq"
        },
        {
          "phrase": "take a leap of faith",
          "meaning": "Noma'lum xatarga qaramasdan qat'iy tavakkal qilib qadam tashlamoq"
        },
        {
          "phrase": "nerve-wracking experience",
          "meaning": "Inson asablarini taranglashtiradigan og'ir vaziyat"
        },
        {
          "phrase": "pay off in the long run",
          "meaning": "Kelajakda kutilganidan ham ziyoda ijobiy natija bermoq"
        },
        {
          "phrase": "turn out for the best",
          "meaning": "Kutilmaganda eng yaxshi va xayrli yakun topmoq"
        },
        {
          "phrase": "listen to my gut feeling",
          "meaning": "O'z ichki hissiyoti va qalbiga quloq solmoq"
        },
        {
          "phrase": "stepping stone to success",
          "meaning": "Katta yutuqlar sari muhim poydevor va tramplin bo'lmoq"
        },
        {
          "phrase": "sigh of relief",
          "meaning": "Yengil nafas tortmoq, dildagi xavotir tarqamoq"
        },
        {
          "phrase": "boost my self-confidence",
          "meaning": "O'z kuchiga bo'lgan ishonchni mustahkamlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-interesting-video-social-media",
    "part": 2,
    "title": "Describe an interesting video you watched in social media",
    "topicTag": "technology",
    "topicLabel": "Social Media & Media Content",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the video was about and which platform you saw it on",
        "Who created or was featured in the video",
        "Why you decided to click on and watch it",
        "And explain why you found this video so fascinating or inspiring."
      ],
      "usefulChunks": [
        {
          "phrase": "scroll through my social media feed",
          "meaning": "Ijtimoiy tarmoq lentasini bemaqsad ko'zdan kechirib o'tirmoq"
        },
        {
          "phrase": "instantly grab my attention",
          "meaning": "Darhol mening butun diqqat-e'tiborimni o'ziga tortmoq"
        },
        {
          "phrase": "viral video",
          "meaning": "Qisqa vaqt ichida millionlab odamlar ko'rgan mashhur video"
        },
        {
          "phrase": "thought-provoking concept",
          "meaning": "Insonni chuqur o'yga toldiradigan falsafiy g'oya"
        },
        {
          "phrase": "visually stunning production",
          "meaning": "Tasviriy jihatdan benuqson va yuqori darajada ishlangan montaj"
        },
        {
          "phrase": "food for thought",
          "meaning": "Aql va tafakkur uchun ozuqa beradigan fikrlar"
        },
        {
          "phrase": "leave a lasting impression",
          "meaning": "Xotirada uzoq vaqt unutilmas chuqur iz qoldirmoq"
        },
        {
          "phrase": "broaden my perspective",
          "meaning": "Dunyoqarash va fikrlash ufqini kengaytirmoq"
        },
        {
          "phrase": "resonate with the audience",
          "meaning": "Tomoshabinlar qalbidan chuqur joy olmoq"
        },
        {
          "phrase": "educational yet entertaining",
          "meaning": "Ham ibratli va foydali, ham ko'ngilochar xarakterdagi"
        }
      ]
    }
  },
  {
    "id": "spk-p2-home-visit-not-live",
    "part": 2,
    "title": "Describe a home that you like to visit but did not want to live in",
    "topicTag": "daily_life",
    "topicLabel": "Homes & Living Spaces",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Whose home it is and where it is situated",
        "What the interior and exterior of the home look like",
        "What you usually do when you visit there",
        "And explain why you enjoy visiting this home but would not want to reside there permanently."
      ],
      "usefulChunks": [
        {
          "phrase": "lavish and luxurious decor",
          "meaning": "Haddan ziyod dabdabali, qimmatbaho va hashamatli jihozlar"
        },
        {
          "phrase": "architectural masterpiece",
          "meaning": "Me'morchilik san'atining yuksak namunasi"
        },
        {
          "phrase": "remote and secluded location",
          "meaning": "Shahar shovqinidan juda uzoq, xilvat go'sha"
        },
        {
          "phrase": "cut off from modern amenities",
          "meaning": "Shahar qulayliklari va infratuzilmasidan uzilib qolgan"
        },
        {
          "phrase": "warm hospitality",
          "meaning": "Mezbonlarning samimiy va iliq mehmondo'stligi"
        },
        {
          "phrase": "feel like a museum",
          "meaning": "Uydan ko'ra ko'proq teginish taqiqlangan muzeyga o'xshamoq"
        },
        {
          "phrase": "high-maintenance property",
          "meaning": "Uni saranjom tutish uchun juda ko'p xarajat va mehnat talab etiladigan uy"
        },
        {
          "phrase": "long and exhausting commute",
          "meaning": "U yerga yetib borish uchun uzoq va toliqtiruvchi yo'l bosish"
        },
        {
          "phrase": "great for a short getaway",
          "meaning": "Qisqa muddat dam olib qaytish uchun ideal maskan"
        },
        {
          "phrase": "lack practical convenience",
          "meaning": "Kundalik doimiy yashash uchun zarur amaliy qulayliklarning yetishmasligi"
        }
      ]
    }
  },
  {
    "id": "spk-p2-time-wasting-activity",
    "part": 2,
    "title": "Describe an activity you usually do that wastes your time",
    "topicTag": "daily_life",
    "topicLabel": "Habits & Time Management",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What the activity is",
        "When and how frequently you usually find yourself doing it",
        "Why you consider this activity to be unproductive and a waste of precious time",
        "And explain how you feel afterwards and why it is so difficult to stop doing it."
      ],
      "usefulChunks": [
        {
          "phrase": "guilty pleasure",
          "meaning": "Foydasizligini bilsa-da, insonga vaqtincha zavq beruvchi odat"
        },
        {
          "phrase": "fall down a rabbit hole",
          "meaning": "Internetda bir mavzudan boshqasiga o'tib, soatlab qolib ketmoq"
        },
        {
          "phrase": "procrastinate on crucial tasks",
          "meaning": "Eng muhim vazifalarni bajarishdan qochib, vaqtni bekorga o'tkazmoq"
        },
        {
          "phrase": "lose all sense of time",
          "meaning": "Vaqt qanday o'tib ketganini mutlaqo sezmay qolmoq"
        },
        {
          "phrase": "drain my mental energy",
          "meaning": "Insonning butun ruhiy va jismoniy quvvatini so'rib olmoq"
        },
        {
          "phrase": "a sense of regret",
          "meaning": "Bekor ketgan vaqt uchun ichki pushaymonlik va nadomat"
        },
        {
          "phrase": "vicious cycle",
          "meaning": "Tugamaydigan, bir-birini takrorlovchi yomon doira"
        },
        {
          "phrase": "short-lived dopamine hit",
          "meaning": "Ijtimoiy tarmoqlardagi layk va videolardan keladigan qisqa lazzat"
        },
        {
          "phrase": "break this bad habit",
          "meaning": "Ushbu salbiy va samarasiz odatni butunlay tashlamoq"
        },
        {
          "phrase": "regain control over my schedule",
          "meaning": "O'z vaqtini qaytadan to'liq o'z nazoratiga olmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-building-enjoyed-spending-time",
    "part": 2,
    "title": "Describe a building that you have enjoyed spending time in",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & Public Places",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Where this building is located and what its design looks like",
        "What facilities, atmosphere, and amenities it provides",
        "What you typically do whenever you visit this building",
        "And explain why spending time inside this building brings you genuine satisfaction."
      ],
      "usefulChunks": [
        {
          "phrase": "architectural splendour",
          "meaning": "Me'morchilik san'atining mahobati va ko'rki"
        },
        {
          "phrase": "serene and tranquil atmosphere",
          "meaning": "Osoyiishta, sokin va xotirjam ichki muhit"
        },
        {
          "phrase": "floor-to-ceiling glass windows",
          "meaning": "Poldan shiftgacha bo'lgan bahaybat shisha derazalar"
        },
        {
          "phrase": "spacious and well-ventilated",
          "meaning": "Havosini yaxshi aylantiradigan keng va yorug' zallar"
        },
        {
          "phrase": "peace of mind",
          "meaning": "Qalb xotirjamligi va ichki ruhiy sokinlik"
        },
        {
          "phrase": "immerse myself in study",
          "meaning": "O'zini butunlay kitob mutolaasi yoki darsga bag'ishlamoq"
        },
        {
          "phrase": "modern state-of-the-art facilities",
          "meaning": "Eng zamonaviy standartlar asosidagi qulayliklar"
        },
        {
          "phrase": "retreat from the bustling city",
          "meaning": "Shahar to'polonidan chekinib dam oladigan maskan"
        },
        {
          "phrase": "welcoming ambiance",
          "meaning": "Kishiga xush yoquvchi, iliq va mehmondo'st muhit"
        },
        {
          "phrase": "cherish every moment spent there",
          "meaning": "U yerda o'tgan har bir daqiqani qadrlamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-health-article",
    "part": 2,
    "title": "Describe an article on health you read in a magazine",
    "topicTag": "daily_life",
    "topicLabel": "Health & Well-being",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "What magazine or journal you read the article in",
        "What specific health topic or medical discovery it discussed",
        "What practical advice or preventative recommendations were outlined",
        "And explain why this article made an impression on you and how it influenced your lifestyle."
      ],
      "usefulChunks": [
        {
          "phrase": "wellness publication",
          "meaning": "Sog'lom turmush tarzi va salomatlikka bag'ishlangan jurnal"
        },
        {
          "phrase": "eye-opening revelation",
          "meaning": "Ko'zni ochadigan, insonni hayratga soluvchi yangilik"
        },
        {
          "phrase": "nutritional guidelines",
          "meaning": "To'g'ri va me'yorda ovqatlanish bo'yicha ilmiy qoidalar"
        },
        {
          "phrase": "boost the immune system",
          "meaning": "Inson immunitetini mustahkamlamoq va quvvatlantirmoq"
        },
        {
          "phrase": "counteract sedentary lifestyle",
          "meaning": "Kamharakat turmush tarzining zararli oqibatlarini bartaraf etmoq"
        },
        {
          "phrase": "incorporate into my daily routine",
          "meaning": "Tavsiyalarni o'z kundalik hayotiga tatbiq etmoq"
        },
        {
          "phrase": "backed by scientific evidence",
          "meaning": "Qat'iy ilmiy tajriba va dalillar bilan isbotlangan"
        },
        {
          "phrase": "prevent chronic illnesses",
          "meaning": "Surunkali kasalliklarning oldini olmoq"
        },
        {
          "phrase": "mental clarity and stamina",
          "meaning": "Zehn tiniqligi va jismoniy baquvvatlik"
        },
        {
          "phrase": "catalyst for positive change",
          "meaning": "Hayotni yaxshi tomonga burgan muhim turtki"
        }
      ]
    }
  },
  {
    "id": "spk-p2-admired-old-person",
    "part": 2,
    "title": "Describe an old person that you admired",
    "topicTag": "daily_life",
    "topicLabel": "Role Models & Wisdom",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Who this elderly individual is and how you first met them",
        "What kind of personality traits and life accomplishments they possess",
        "What profound wisdom or memorable advice they have shared with you",
        "And explain why you admire and hold this senior person in such high regard."
      ],
      "usefulChunks": [
        {
          "phrase": "fountain of wisdom",
          "meaning": "Tuganmas hayotiy hikmat va aql-idrok chashmasi"
        },
        {
          "phrase": "weather many storms in life",
          "meaning": "Hayotning barcha sinov va qiyinchiliklarini mardona yengib o'tmoq"
        },
        {
          "phrase": "exemplary character",
          "meaning": "Barchaga o'rnak va ibrat bo'la oladigan yuksak axloq"
        },
        {
          "phrase": "infectious optimism",
          "meaning": "Atrofdagilarga ham yuqadigan quvnoq va umidbaxsh qarash"
        },
        {
          "phrase": "humble and unassuming",
          "meaning": "Kamtargina, hech qachon manmanlik qilmaydigan olijanob inson"
        },
        {
          "phrase": "treasure their guidance",
          "meaning": "Ularning bergan dono maslahatlarini qadrlab asramoq"
        },
        {
          "phrase": "pillar of strength for the family",
          "meaning": "Oila a'zolari suyangan tog' va mustahkam tayanch"
        },
        {
          "phrase": "command great respect",
          "meaning": "Barcha insonlar orasida ulkan hurmat va ehtiromga sazovor bo'lmoq"
        },
        {
          "phrase": "leave a profound legacy",
          "meaning": "O'zidan keyin chuqur va unutilmas ma'naviy meros qoldirmoq"
        },
        {
          "phrase": "inspire me to be a better person",
          "meaning": "Meni yanada yaxshiroq va komilroq inson bo'lishga undamoq"
        }
      ]
    }
  },
  {
    "id": "spk-p2-photograph-of-yourself",
    "part": 2,
    "title": "Describe a photograph of yourself that you like",
    "topicTag": "art_culture",
    "topicLabel": "Memories & Photography",
    "questionCount": 1,
    "durationMinutes": 4,
    "questionsOrCueCard": {
      "leadIn": "You should say:",
      "points": [
        "Where and when this photograph was captured",
        "Who took the photo",
        "What you were doing, wearing, or celebrating in the image",
        "And explain why you cherish this particular photo of yourself above others."
      ],
      "usefulChunks": [
        {
          "phrase": "capture a candid moment",
          "meaning": "Beparvo, hech qanday qoliplarsiz tabiiy lahzani suratga muhrlamoq"
        },
        {
          "phrase": "evoke fond memories",
          "meaning": "O'tmishdagi eng shirin va qadrli xotiralarni uyg'otmoq"
        },
        {
          "phrase": "genuine smile",
          "meaning": "Sun'iy emas, chin dildan chiqqan samimiy tabassum"
        },
        {
          "phrase": "breathtaking backdrop",
          "meaning": "Surat orqasidagi lol qoldiruvchi tabiiy manzara"
        },
        {
          "phrase": "framed on my bedside table",
          "meaning": "Yotoqxona javoniga ramkada qo'yilgan"
        },
        {
          "phrase": "freeze a fleeting moment",
          "meaning": "Tez o'tib ketuvchi lahzani abadiy qilib to'xtatib qo'ymoq"
        },
        {
          "phrase": "photogenic angle",
          "meaning": "Inson qiyofasini eng chiroyli ko'rsatadigan surat burchagi"
        },
        {
          "phrase": "sense of joy and contentment",
          "meaning": "Yuzdagi baxt, shodlik va mamnunlik ifodasi"
        },
        {
          "phrase": "sentimental value",
          "meaning": "Moddiy jihatdan bebaho ma'naviy xotira qiymati"
        },
        {
          "phrase": "bring a smile to my face",
          "meaning": "Har safar qaraganda insonning labiga quvonch tabassumi keltirmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-decision-making",
    "part": 3,
    "title": "Decision Making, Advice & Personal Autonomy",
    "topicTag": "study_work",
    "topicLabel": "Decision Making & Advice",
    "questionCount": 12,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on consumer behavior, advice, and autonomy:",
      "followUpQuestions": [
        "Do advertisements influence consumers' decisions?",
        "Who do young people like to ask for advice when making decisions?",
        "Do you think it's necessary for kids to make as many decisions by themselves as they can?",
        "Do you think some people can make decisions without asking for advice from others?",
        "Do you think young people are easily influenced by others when they make decisions? Why or why not?",
        "What kinds of decisions do young people have to make?",
        "Why do some people find it difficult to make important decisions?",
        "Do young people make decisions differently from older people?",
        "Who do people usually ask for advice when making important decisions?",
        "Do you think people should always think carefully before making decisions?",
        "Can difficult decisions help people grow as individuals? Why?",
        "Do you prefer making decisions alone or with other people's advice?"
      ],
      "usefulChunks": [
        {
          "phrase": "swayed by advertisements",
          "meaning": "Reklamalar ta'siriga tushib fikrini o'zgartirmoq"
        },
        {
          "phrase": "make independent choices",
          "meaning": "Hech kimga qaram bo'lmagan mustaqil qarorlar qabul qilmoq"
        },
        {
          "phrase": "seek trusted guidance",
          "meaning": "Ishonchli va tajribali insonlardan yo'l-yo'riq so'ramoq"
        },
        {
          "phrase": "peer pressure",
          "meaning": "Tengdoshlar yoki do'stlar davrasining ruhiy ta'siri va bosimi"
        },
        {
          "phrase": "weigh alternative options",
          "meaning": "Bir nechta boshqa yo'llar va variantlarni solishtirib ko'rmoq"
        },
        {
          "phrase": "fear of making mistakes",
          "meaning": "Xato qilishdan yoki pushaymon bo'lishdan hadiksirash"
        },
        {
          "phrase": "foster self-reliance in children",
          "meaning": "Bolalarda mustaqillik va o'ziga ishonch tuyg'usini tarbiyalamoq"
        },
        {
          "phrase": "deliberate thoughtfully",
          "meaning": "Bir qarorga kelishdan avval har tomonlama chuqur mulohaza qilmoq"
        },
        {
          "phrase": "act on impulse",
          "meaning": "Oqibatini o'ylamasdan hissiyotga berilib harakat qilmoq"
        },
        {
          "phrase": "build character through challenges",
          "meaning": "Murakkab qarorlar va qiyinchiliklar orqali shaxs sifatida kamol topmoq"
        },
        {
          "phrase": "crossroad in life",
          "meaning": "Hayotiy yo'nalishni butunlay o'zgartiruvchi hal qiluvchi palla"
        },
        {
          "phrase": "accountability for one's actions",
          "meaning": "O'zining harakatlari va xatolari uchun shaxsiy javobgarlikni bo'yniga olmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-social-media",
    "part": 3,
    "title": "Social Media, Video Content & Digital Influence",
    "topicTag": "technology",
    "topicLabel": "Social Media & Public Opinion",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on online habits, video consumption, and social impact:",
      "followUpQuestions": [
        "Why do people spend so much time watching videos online?",
        "What types of videos are popular nowadays?",
        "Do social media videos influence people's opinions?",
        "Are online videos educational? Why or why not?",
        "Do you think social media has more advantages than disadvantages?",
        "Should children's use of social media be controlled?"
      ],
      "usefulChunks": [
        {
          "phrase": "algorithm-driven feeds",
          "meaning": "Sun'iy intellekt algoritmlari asosida shakllanadigan tavsiyalar lentasi"
        },
        {
          "phrase": "binge-watch content",
          "meaning": "Ketma-ket to'xtovsiz soatlab video tomosha qilmoq"
        },
        {
          "phrase": "shape public opinion",
          "meaning": "Keng jamoatchilik fikri va qarashlarini shakllantirmoq"
        },
        {
          "phrase": "bite-sized educational videos",
          "meaning": "Murakkab mavzularni oson tushuntiruvchi qisqa ma'rifiy videolar"
        },
        {
          "phrase": "double-edged sword",
          "meaning": "Ham ijobiy, ham xavfli salbiy oqibatlarga ega ikki tomonlama qurol"
        },
        {
          "phrase": "parental supervision",
          "meaning": "Ota-onalarning farzandlari ustidan nazorati va e'tibori"
        },
        {
          "phrase": "digital addiction",
          "meaning": "Smartfon va ijtimoiy tarmoqlarga qaram bo'lib qolish xastaligi"
        },
        {
          "phrase": "spread misinformation",
          "meaning": "Yolg'on va tekshirilmagan xabarlarni tarqatmoq"
        },
        {
          "phrase": "foster creativity",
          "meaning": "Yoshlarda ijodkorlik va kreativlikni rivojlantirmoq"
        },
        {
          "phrase": "screen time boundaries",
          "meaning": "Ekran qarshisida o'tkaziladigan vaqtga qat'iy cheklovlar qo'ymoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-home-accommodation",
    "part": 3,
    "title": "Home and Accommodation: Housing & Urban vs Rural Living",
    "topicTag": "daily_life",
    "topicLabel": "Housing & Community Living",
    "questionCount": 13,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on comfortable housing, architecture, and lifestyle choices:",
      "followUpQuestions": [
        "What makes a home comfortable to live in?",
        "Do people's housing preferences change as they get older?",
        "Is it better to live in a house or an apartment? Why?",
        "What factors do people consider when choosing a home?",
        "Do modern homes differ from homes in the past?",
        "How important is location when choosing a home?",
        "In your country, when people visit other people in their homes, do they usually bring a gift?",
        "What kind of houses or apartments do people prefer to buy?",
        "What is the difference between living in the countryside and the city?",
        "Do you prefer to live in the city or in the countryside?",
        "What are the differences between houses or buildings in the city and in the countryside?",
        "What safety risks are there in residential buildings in cities?",
        "Is it expensive to decorate a house or an apartment in the place where you live?"
      ],
      "usefulChunks": [
        {
          "phrase": "prime location",
          "meaning": "Shahar markazidagi eng qulay va qimmat joylashuv"
        },
        {
          "phrase": "spacious layout",
          "meaning": "Keng va qulay xonalar tuzilishi"
        },
        {
          "phrase": "suburban living",
          "meaning": "Shahar chetidagi tinch hududda yashash tarzi"
        },
        {
          "phrase": "skyrocketing property prices",
          "meaning": "Ko'chmas mulk narxlarining haddan tashqari balandlab ketishi"
        },
        {
          "phrase": "modern conveniences",
          "meaning": "Zamonaviy turmush uchun barcha zaruriy maishiy sharoitlar"
        },
        {
          "phrase": "guest hospitality customs",
          "meaning": "Mehmonga borganda shirinlik yoki sovg'a olib borish milliy odobi"
        },
        {
          "phrase": "fire hazard and building safety",
          "meaning": "Ko'p qavatli binolardagi yong'in va seysmik xavfsizlik choralari"
        },
        {
          "phrase": "countryside tranquility",
          "meaning": "Qishloq hayotiga xos musaffo havo, sukunat va tinchlik"
        },
        {
          "phrase": "interior renovation expenses",
          "meaning": "Uyning ichki ta'miri va pardozlash xarajatlari"
        },
        {
          "phrase": "energy-efficient housing",
          "meaning": "Energiyani tejaydigan va issiqlikni saqlaydigan xonadonlar"
        },
        {
          "phrase": "proximity to essential amenities",
          "meaning": "Maktab, shifoxona va do'konlarga yaqin masofada bo'lish"
        }
      ]
    }
  },
  {
    "id": "spk-p3-time-management",
    "part": 3,
    "title": "Time Management, Work-Life Balance & Social Pressure",
    "topicTag": "study_work",
    "topicLabel": "Productivity & Life Balance",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on managing time, handling pressure, and daily discipline:",
      "followUpQuestions": [
        "How do you balance life and work?",
        "Will you continue doing something when you are aware that it's a waste of time?",
        "What kinds of things make people feel pressured?",
        "Why do some people refuse to abide by rules?",
        "Why do many professionals struggle with chronic procrastination?",
        "How can modern digital tools help people optimize their daily schedule?"
      ],
      "usefulChunks": [
        {
          "phrase": "maintain work-life equilibrium",
          "meaning": "Ish faoliyati va shaxsiy hayot o'rtasida muvozanatni saqlamoq"
        },
        {
          "phrase": "unrealistic deadlines",
          "meaning": "Bajarish uchun yetarli bo'lmagan qisqa va qattiq muddatlar"
        },
        {
          "phrase": "rebellion against authority",
          "meaning": "Mavjud qonun-qoidalarga bo'ysunmaslik, isyonkorlik"
        },
        {
          "phrase": "chronic procrastination",
          "meaning": "Barcha ishlarni surunkali ravishda oxirgi fursatga surib yurish"
        },
        {
          "phrase": "set realistic boundaries",
          "meaning": "Ish va dam olish vaqtlariga aniq chegara belgilamoq"
        },
        {
          "phrase": "burnout syndrome",
          "meaning": "Haddan tashqari zo'riqishdan kelib chiqadigan kasbiy toliqish"
        },
        {
          "phrase": "eliminate time wasters",
          "meaning": "Vaqtni behuda sarflaydigan keraksiz mashg'ulotlardan xalos bo'lmoq"
        },
        {
          "phrase": "focus on high-priority tasks",
          "meaning": "Eng muhim va natija beruvchi ishlarga diqqatni jamlamoq"
        },
        {
          "phrase": "peace of mind over hustle",
          "meaning": "Tinimsiz yugur-yugurdan ko'ra ruhiy xotirjamlikni ustun qo'ymoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-building-architecture",
    "part": 3,
    "title": "Building, Public Architecture & Urban Design",
    "topicTag": "art_culture",
    "topicLabel": "Architecture & Urban Planning",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on public buildings, architectural trends, and urban design:",
      "followUpQuestions": [
        "What is the most important for a public building: design, location, or facilities?",
        "Do you think the appearance of a building is important?",
        "How have buildings changed in the past few years?",
        "Should governments protect historic buildings from being demolished?",
        "How do green and sustainable buildings benefit modern cities?",
        "Does the architecture of a workplace affect the productivity and mood of employees?"
      ],
      "usefulChunks": [
        {
          "phrase": "form follows function",
          "meaning": "Binoning tashqi ko'rinishi uning amaliy qulayligiga xizmat qilishi kerak"
        },
        {
          "phrase": "aesthetic appeal",
          "meaning": "Ko'zni quvontiruvchi go'zal tashqi ko'rinish va did"
        },
        {
          "phrase": "eco-friendly construction",
          "meaning": "Atrof-muhitga zarar yetkazmaydigan ekologik qurilish"
        },
        {
          "phrase": "architectural landmark",
          "meaning": "Shaharga shon-shuhrat keltiruvchi ramziy bino"
        },
        {
          "phrase": "harmonize with the surroundings",
          "meaning": "Atrofdagi tabiiy muhit bilan uyg'unlashib ketmoq"
        },
        {
          "phrase": "demolish heritage sites",
          "meaning": "Tarixiy obidalarni buzib tashlash xatosi"
        },
        {
          "phrase": "accessible for people with disabilities",
          "meaning": "Nogironligi bor insonlar uchun barcha qulayliklar bilan ta'minlangan"
        },
        {
          "phrase": "smart building technology",
          "meaning": "Harorat va yoritishni avtomatik boshqaruvchi aqlli binolar"
        },
        {
          "phrase": "boost civic pride",
          "meaning": "Shahar aholisining o'z shahri bilan faxrlanish tuyg'usini oshirmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-photography",
    "part": 3,
    "title": "Photography, Visual Memory & Digital Media",
    "topicTag": "art_culture",
    "topicLabel": "Photography & Visual Culture",
    "questionCount": 15,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on photo taking, visual documentation, and memory:",
      "followUpQuestions": [
        "What do most people in your country use to take photos?",
        "What kinds of devices do people like to use for taking photos these days?",
        "Is it easier to take pictures now than in the past?",
        "Why is taking photographs such an important part of people's lives?",
        "Why do some people like to keep photos?",
        "Why do some people not like to keep photos of themselves?",
        "Why do some people like to delete photos?",
        "Do you agree that people rely too much on photographs to remember people and places?",
        "How are photographs used to help people learn?",
        "How are photographs used in textbooks and advertisements?",
        "Why can one photograph of an important news event be so powerful?",
        "What photos do people often hang on the wall at home?",
        "How do people keep their photos?",
        "Is it difficult for people to learn how to take good photos?",
        "Why do people take photos?"
      ],
      "usefulChunks": [
        {
          "phrase": "ubiquitous smartphones",
          "meaning": "Har bir inson cho'ntagida bo'lgan keng tarqalgan smartfonlar"
        },
        {
          "phrase": "capture precious memories",
          "meaning": "Eng qadrli va baxtli lahzalarni suratga muhrlamoq"
        },
        {
          "phrase": "a picture is worth a thousand words",
          "meaning": "Bitta rasm mingta so'zdan ko'proq ma'no bera oladi (maqol)"
        },
        {
          "phrase": "digital decluttering",
          "meaning": "Telefon xotirasini bo'shatish uchun keraksiz suratlarni o'chirib tashlash"
        },
        {
          "phrase": "rely on digital records",
          "meaning": "Xotira o'rniga faqat telefon xotirasidagi suratlarga tayanib qolmoq"
        },
        {
          "phrase": "visual aid in education",
          "meaning": "Dars jarayonida o'quvchilarga mavzuni tushunishga yordam beruvchi ko'rgazmali qurol"
        },
        {
          "phrase": "news photojournalism",
          "meaning": "Dunyo voqealarini fosh etuvchi ta'sirchan fotojurnalistika"
        },
        {
          "phrase": "framed family portraits",
          "meaning": "Devorga osib qo'yilgan ramkali oilaviy suratlar"
        },
        {
          "phrase": "cloud storage solutions",
          "meaning": "Suratlarni xavfsiz saqlash uchun bulutli internet omborlari"
        },
        {
          "phrase": "master the craft of composition",
          "meaning": "Suratga olish burchagi va yorug'lik san'atini chuqur o'rganmoq"
        },
        {
          "phrase": "freeze an ephemeral instant",
          "meaning": "Ko'z ochib yumguncha o'tib ketadigan lahzani abadiylashtirmoq"
        },
        {
          "phrase": "document life milestones",
          "meaning": "Bitiruv, to'y yoki yubiley kabi katta hayotiy marralarni hujjatlashtirmoq"
        }
      ]
    }
  },
  {
    "id": "spk-p3-health-magazine",
    "part": 3,
    "title": "Health Information, Public Wellness & Media Reliability",
    "topicTag": "daily_life",
    "topicLabel": "Health & Public Awareness",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on public health, fitness trends, and medical media:",
      "followUpQuestions": [
        "Where do people in your country typically get their health and wellness information?",
        "Can health articles published in popular magazines and social media always be trusted?",
        "What role should governments play in encouraging healthy lifestyle choices among citizens?",
        "Why do people often ignore healthy habits even when they know the risks of unhealthy behavior?",
        "Do you think mental health awareness is given as much priority as physical fitness nowadays?",
        "How will emerging medical technologies reshape personal healthcare in the future?"
      ],
      "usefulChunks": [
        {
          "phrase": "reliable medical sources",
          "meaning": "Ishonchli va mutaxassislar tomonidan tasdiqlangan tibbiy manbalar"
        },
        {
          "phrase": "sensationalized health fads",
          "meaning": "Odamlarni jalb qilish uchun o'ylab topilgan soxta parhez va odatlar"
        },
        {
          "phrase": "promote preventative medicine",
          "meaning": "Kasallik yuz berguncha uning oldini olish choralarini targ'ib qilmoq"
        },
        {
          "phrase": "sedentary desk jobs",
          "meaning": "Kun bo'yi stulda o'tirib bajariladigan kamharakat ishlar"
        },
        {
          "phrase": "destigmatize mental health",
          "meaning": "Ruhiy salomatlik muammolarini uyat deb bilmasdan, unga to'g'ri munosabatda bo'lmoq"
        },
        {
          "phrase": "telemedicine consultations",
          "meaning": "Shifokor bilan masofadan video orqali tibbiy maslahatlashuv"
        },
        {
          "phrase": "long-term lifestyle modifications",
          "meaning": "Vaqtinchalik emas, butun umrga mos sog'lom turmush o'zgarishlari"
        },
        {
          "phrase": "public health campaigns",
          "meaning": "Aholi salomatligini saqlash bo'yicha davlat targ'ibot loyihalari"
        }
      ]
    }
  },
  {
    "id": "spk-p3-aging-admiration",
    "part": 3,
    "title": "Elderly Care, Intergenerational Wisdom & Modern Society",
    "topicTag": "daily_life",
    "topicLabel": "Society & Elderly Care",
    "questionCount": 6,
    "durationMinutes": 5,
    "questionsOrCueCard": {
      "leadIn": "Discussion points on aging populations, respecting elders, and generational wisdom:",
      "followUpQuestions": [
        "What valuable life lessons and wisdom can younger generations gain from senior citizens?",
        "What role do grandparents traditionally play in raising grandchildren in your society?",
        "Should retirement ages be raised as global life expectancy continues to increase?",
        "What unique challenges do countries face when experiencing an aging demographic?",
        "How can local communities prevent elderly individuals from experiencing social isolation?",
        "Are senior citizens given the same level of respect today as they received in earlier generations?"
      ],
      "usefulChunks": [
        {
          "phrase": "intergenerational bonding",
          "meaning": "Keksalar va yosh avlod o'rtasidagi mehr-oqibat va hamjihatlik"
        },
        {
          "phrase": "wealth of life experience",
          "meaning": "Yillar davomida to'plangan ulkan hayotiy tajriba"
        },
        {
          "phrase": "aging demographic shift",
          "meaning": "Jamiyatda keksalar ulushining ortib borishi hodisasi"
        },
        {
          "phrase": "pension burden on economy",
          "meaning": "Pensiya tizimining davlat byudjetiga tushadigan moliyaviy yuki"
        },
        {
          "phrase": "combat social isolation",
          "meaning": "Keksa insonlarning yolg'izlanib qolishiga yo'l qo'ymaslik"
        },
        {
          "phrase": "revere senior citizens",
          "meaning": "Yoshi ulug' otaxon va onaxonlarni yuksak e'zozlamoq"
        },
        {
          "phrase": "pass down cultural values",
          "meaning": "Milliy an'ana va qadriyatlarni nevaralarga meros qoldirmoq"
        },
        {
          "phrase": "nursing homes vs family care",
          "meaning": "Qariyalar uyi va oila bag'ridagi mehr-muruvvat o'rtasidagi farq"
        }
      ]
    }
  },
  {
    "id": "spk-full-mock-1",
    "part": "full_mock",
    "title": "IELTS Speaking Full Mock Interview (Parts 1, 2 & 3)",
    "topicTag": "all",
    "topicLabel": "Full Exam Simulation",
    "questionCount": 16,
    "durationMinutes": 14,
    "questionsOrCueCard": {
      "leadIn": "Complete official exam simulation featuring: Part 1 Warm-up, Part 2 Individual Long Turn, and Part 3 Two-Way Discussion.",
      "usefulChunks": [
        {
          "phrase": "fluency and coherence",
          "meaning": "Nutq ravonligi, tutilmasdan gapirish va fikrlar izchilligi"
        },
        {
          "phrase": "lexical resource",
          "meaning": "Keng so'z boyligi, aniq kollokatsiyalar va idiomalar"
        },
        {
          "phrase": "grammatical range and accuracy",
          "meaning": "Murakkab grammatik strukturalarning to'g'ri va xatosiz qo'llanishi"
        },
        {
          "phrase": "pronunciation and intonation",
          "meaning": "To'g'ri talaffuz, tabiiy urg'u va ohangdor intonatsiya"
        }
      ]
    }
  }
];
