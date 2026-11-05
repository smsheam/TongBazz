/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductPack, Objective } from '../types/game';

// EXACT 5 PRODUCTS AS SPECIFIED IN USER BRIEF
export const PRODUCTS: ProductPack[] = [
  {
    id: 'milk_tea',
    nameBn: 'দুধ চা',
    nameEn: 'Milk Tea',
    icon: '☕',
    category: 'TEA',
    retailPrice: 15,
    packCost: 40,
    yieldCount: 5,
    cookingTimeSec: 8,
  },
  {
    id: 'red_tea',
    nameBn: 'রং চা',
    nameEn: 'Red Tea',
    icon: '🍵',
    category: 'TEA',
    retailPrice: 10,
    packCost: 20,
    yieldCount: 5,
    cookingTimeSec: 5,
  },
  {
    id: 'lemon_tea',
    nameBn: 'লেবু চা',
    nameEn: 'Lemon Tea',
    icon: '🍋',
    category: 'TEA',
    retailPrice: 15,
    packCost: 30,
    yieldCount: 5,
    cookingTimeSec: 5,
  },
  {
    id: 'biscuit',
    nameBn: 'বিস্কুট',
    nameEn: 'Biscuit',
    icon: '🍪',
    category: 'SNACK',
    retailPrice: 5,
    packCost: 15,
    yieldCount: 5,
    cookingTimeSec: 0,
  },
  {
    id: 'singara',
    nameBn: 'সিঙ্গারা',
    nameEn: 'Singara',
    icon: '🥐',
    category: 'SNACK',
    retailPrice: 10,
    packCost: 30,
    yieldCount: 5,
    cookingTimeSec: 5,
  },
];

export const MINI_GAMES = [
  {
    id: 'calculator',
    nameBn: 'হিসাবের গোলমাল',
    nameEn: 'Quick Calculator',
    descriptionBn: 'টং দোকানের দ্রুত মানসিক হিসাব মেলান।',
    descriptionEn: 'Mental math calculation under 20s.',
    icon: '🧮',
  },
  {
    id: 'memory',
    nameBn: 'মনে আছে তো?',
    nameEn: 'Memory Challenge',
    descriptionBn: 'অর্ডার ও আইটেমের ক্রম মনে রেখে সঠিক তালিকা চিহ্নিত করুন।',
    descriptionEn: 'Sequence recall challenge.',
    icon: '🧠',
  },
  {
    id: 'pipes',
    nameBn: 'পাইপলাইন ঠিক করেন',
    nameEn: 'Pipe Puzzle',
    descriptionBn: 'দুধ ও পানির লাইন কেটলির সাথে নির্ভুলভাবে যুক্ত করুন।',
    descriptionEn: 'Connecting milk/water lines.',
    icon: '🚰',
  },
  {
    id: 'traffic',
    nameBn: 'যানজট ছাড়ান',
    nameEn: 'Traffic Control',
    descriptionBn: 'ঢাকার মোড়ের রিকশা ও সিএনজি জ্যাম ছাড়িয়ে রাস্তা ক্লিয়ার করুন।',
    descriptionEn: 'Clearing rickshaws & CNGs at intersections.',
    icon: '🚦',
  },
  {
    id: 'wordsearch',
    nameBn: 'শব্দ খুঁজে বের করেন',
    nameEn: 'Word Finder',
    descriptionBn: 'টংয়ের চেনা বাংলা স্ল্যাং বা চায়ের শব্দ উদ্ধার করুন।',
    descriptionEn: 'Bangla tea-stall slang unscrambler.',
    icon: '🔍',
  },
  {
    id: 'sorting',
    nameBn: 'মাল গুছান',
    nameEn: 'Sorting Challenge',
    descriptionBn: 'গরম চায়ের কাপ ও সিঙ্গারা দ্রুত ট্রের সঠিক বক্সে সাজান।',
    descriptionEn: 'Routing cups & snacks to correct trays.',
    icon: '📦',
  },
  {
    id: 'emergency',
    nameBn: 'জরুরি ব্যবস্থা',
    nameEn: 'Emergency Response',
    descriptionBn: 'স্টোভের আগুন ও সিলিন্ডার ফ্লেয়ার-আপ সঠিক পদক্ষেপে থামান।',
    descriptionEn: 'Extinguishing stove flare-ups safely.',
    icon: '🧯',
  },
  {
    id: 'maze',
    nameBn: 'রাস্তা খুঁজে বের করেন',
    nameEn: 'Route Finder',
    descriptionBn: 'ঢাকার অলিগলি শর্টকাট পেরিয়ে কাস্টমারের টেবিলে গরম চা নিন।',
    descriptionEn: 'Dhaka alleyway shortcuts delivery.',
    icon: '🗺️',
  },
  {
    id: 'pattern',
    nameBn: 'পরের সংখ্যাটা কী?',
    nameEn: 'Pattern Master',
    descriptionBn: 'টাইলস ও রঙের সিকোয়েন্স ম্যাচ করে প্যাটার্ন পূরণ করুন।',
    descriptionEn: 'Color and tile pattern matching.',
    icon: '🔢',
  },
  {
    id: 'detective',
    nameBn: 'কে মিথ্যা বলছে?',
    nameEn: 'Detective Challenge',
    descriptionBn: 'জাল টাকা বা কাস্টমারের ভুয়া দাবি শনাক্ত করুন।',
    descriptionEn: 'Spotting fake money and contradictions.',
    icon: '🕵️',
  },
];

export const QUICK_CHAT_BUTTONS = [
  'মামা, চা কড়া দিয়েন!',
  'আমার সিঙ্গারা কই?',
  'আরেক কাপ দেন!',
  'চিনি কম দিয়েন!',
  'বাকি রাখেন মামা!',
  'এত দেরি কেন?',
  'আগে আমারটা দেন!',
  'মামা, হিসাবটা মিলান!',
];

export const FUNNY_CANCELLATION_EXCUSES = [
  'আম্মু ফোন দিছে, বাসায় জলদি যাইতে হবে!',
  'মানিব্যাগ বাসায় রেখে আসছি মামা!',
  'ডায়েটের কথা হঠাৎ মনে পড়ে গেছে!',
  'প্রেমিকা ফোন দিয়া রাগারাগি শুরু করছে!',
  'পাশের দোকানে শুনলাম বাকিতে চা পাওয়া যায়!',
  'ভুল করে অর্ডার দিয়ে ফেলছি মামা, মাফ চাই!',
  'পকেটে টাকা আছে, কিন্তু মন সায় দিচ্ছে না!',
  'বন্ধুর জন্য অর্ডার দিছিলাম, বন্ধু পালাইছে!',
  'এত দাম দিয়ে চা খাওয়া আমাদের মানায় না!',
  'হঠাৎ পেট ভইরা গেছে মামা!',
];

export function generateCustomerObjectives(assignedMiniGameId: string): Objective[] {
  const miniGame = MINI_GAMES.find((m) => m.id === assignedMiniGameId) || MINI_GAMES[0];

  const economicPool: Objective[] = [
    {
      id: 'eco_1',
      type: 'ECONOMIC',
      titleBn: 'বাজেট সচেতন',
      titleEn: 'Budget Conscious',
      descriptionBn: '৳৩৫ টাকার কম খরচ করে অর্ডার করুন।',
      descriptionEn: 'Spend less than ৳35 on orders.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 35,
    },
    {
      id: 'eco_2',
      type: 'ECONOMIC',
      titleBn: 'টাকা বাঁচাও',
      titleEn: 'Save Cash',
      descriptionBn: 'রাউন্ড শেষে ওয়ালেটে কমপক্ষে ৳১২০ রাখুন।',
      descriptionEn: 'Keep at least ৳120 in wallet at round end.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 120,
    },
    {
      id: 'eco_3',
      type: 'ECONOMIC',
      titleBn: 'ভোজন রসিক',
      titleEn: 'Snack Combo',
      descriptionBn: 'চা ও সিঙ্গারা একসাথে অর্ডার করুন।',
      descriptionEn: 'Order tea and singara together.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 2,
    },
  ];

  const arcadeObjective: Objective = {
    id: 'prof_arcade',
    type: 'PROFESSION',
    titleBn: `পেশাগত আর্কেড: ${miniGame.nameBn}`,
    titleEn: `Arcade: ${miniGame.nameEn}`,
    descriptionBn: `${miniGame.nameBn} সফলভাবে সম্পন্ন করুন।`,
    descriptionEn: `Win the ${miniGame.nameEn} arcade challenge.`,
    rewardPoints: 5,
    isCompleted: false,
    progress: 0,
    targetProgress: 1,
  };

  const teaStallPool: Objective[] = [
    {
      id: 'stall_delivery',
      type: 'TEA_STALL',
      titleBn: 'সঠিক ডেলিভারি গ্রহণ',
      titleEn: 'Accurate Delivery',
      descriptionBn: 'দোকানদারের থেকে সঠিক চা অর্ডার গ্রহণ ও কনফার্ম করুন।',
      descriptionEn: 'Receive and confirm correct order delivery.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
    {
      id: 'stall_early',
      type: 'TEA_STALL',
      titleBn: 'তাড়াতাড়ি অর্ডার',
      titleEn: 'Early Order',
      descriptionBn: 'প্রথম ৬০ সেকেন্ডের মধ্যেই অর্ডার জমা দিন।',
      descriptionEn: 'Place order within first 60 seconds.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
  ];

  const bonusPool: Objective[] = [
    {
      id: 'bonus_detect',
      type: 'BONUS',
      titleBn: 'গোলমালবাজ শনাক্ত',
      titleEn: 'Identify Saboteur',
      descriptionBn: 'রাউন্ড শেষে সঠিক গোলমালবাজকে চিহ্নিত করুন।',
      descriptionEn: 'Correctly identify the secret saboteur.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
    {
      id: 'bonus_flawless',
      type: 'BONUS',
      titleBn: 'নিখুঁত গ্রাহক',
      titleEn: 'Zero Cancellations',
      descriptionBn: 'কোনো অর্ডার বাতিল না করে রাউন্ড শেষ করুন।',
      descriptionEn: 'Complete round with zero cancellations.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
  ];

  return [
    economicPool[Math.floor(Math.random() * economicPool.length)],
    arcadeObjective,
    teaStallPool[Math.floor(Math.random() * teaStallPool.length)],
    bonusPool[Math.floor(Math.random() * bonusPool.length)],
  ];
}

export function generateShopkeeperObjectives(): Objective[] {
  return [
    {
      id: 'shop_profit',
      type: 'SHOPKEEPER',
      titleBn: 'মুনাফার টার্গেট',
      titleEn: 'Profit Target',
      descriptionBn: '৳৪০ টাকার বেশি নীট লাভ অর্জন করুন।',
      descriptionEn: 'Earn more than ৳40 net profit.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 40,
    },
    {
      id: 'shop_accuracy',
      type: 'SHOPKEEPER',
      titleBn: 'নিখুঁত সার্ভিস',
      titleEn: '80% Accuracy',
      descriptionBn: '৮০% বা তার বেশি অর্ডারে নির্ভুল ডেলিভারি দিন।',
      descriptionEn: 'Maintain 80%+ order delivery accuracy.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 80,
    },
    {
      id: 'shop_volume',
      type: 'SHOPKEEPER',
      titleBn: 'জনপ্রিয় মামা',
      titleEn: 'Serve Customers',
      descriptionBn: 'অন্তত ৩ জন কাস্টমারকে সঠিক খাবার পরিবেশন করুন।',
      descriptionEn: 'Serve at least 3 orders accurately.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 3,
    },
  ];
}
