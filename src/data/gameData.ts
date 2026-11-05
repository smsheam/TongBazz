/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ingredient, MenuItem, Profession, Objective } from '../types/game';

export const WHOLESALE_INGREDIENTS: Ingredient[] = [
  { id: 'milk', nameBn: 'দুধ (তরল)', nameEn: 'Milk', unit: 'ml', wholesalePrice: 60, packSize: 1000, consumptionPerTeaCup: 50 },
  { id: 'tea_leaves', nameBn: 'চা পাতা', nameEn: 'Tea Leaves', unit: 'g', wholesalePrice: 20, packSize: 40, consumptionPerTeaCup: 2 },
  { id: 'sugar', nameBn: 'চিনি', nameEn: 'Sugar', unit: 'g', wholesalePrice: 15, packSize: 160, consumptionPerTeaCup: 8 },
  { id: 'water', nameBn: 'বিশুদ্ধ পানি', nameEn: 'Water', unit: 'ml', wholesalePrice: 0, packSize: 5000, consumptionPerTeaCup: 100 },
  { id: 'cups', nameBn: 'ওয়ান-টাইম কাপ', nameEn: 'Paper Cups', unit: 'pcs', wholesalePrice: 10, packSize: 10, consumptionPerTeaCup: 1 },
  { id: 'bread', nameBn: 'বনরুটি', nameEn: 'Bread Bun', unit: 'pcs', wholesalePrice: 5, packSize: 1 },
  { id: 'biscuit', nameBn: 'টোস্ট বিস্কুট', nameEn: 'Toast Biscuit', unit: 'pcs', wholesalePrice: 3, packSize: 1 },
  { id: 'singara', nameBn: 'কাঁচা সিঙ্গারা', nameEn: 'Raw Singara', unit: 'pcs', wholesalePrice: 7, packSize: 1 },
  { id: 'samosa', nameBn: 'কাঁচা সমুচা', nameEn: 'Raw Samosa', unit: 'pcs', wholesalePrice: 9, packSize: 1 },
  { id: 'banana', nameBn: 'সবরি কলা', nameEn: 'Banana', unit: 'pcs', wholesalePrice: 5, packSize: 1 },
  { id: 'egg', nameBn: 'পোল্ট্রি ডিম', nameEn: 'Raw Egg', unit: 'pcs', wholesalePrice: 12, packSize: 1 },
];

export const MENU_ITEMS: MenuItem[] = [
  // Teas
  {
    id: 'dudh_cha',
    nameBn: 'দুধ চা',
    nameEn: 'Regular Milk Tea',
    category: 'TEA',
    price: 15,
    cookingTimeSec: 10,
    recipe: { milkMl: 50, teaLeavesG: 2, sugarG: 8, waterMl: 100, cupsPcs: 1 },
  },
  {
    id: 'rong_cha',
    nameBn: 'রং চা',
    nameEn: 'Black / Red Tea',
    category: 'TEA',
    price: 10,
    cookingTimeSec: 5,
    recipe: { teaLeavesG: 2, sugarG: 8, waterMl: 150, cupsPcs: 1 },
  },
  {
    id: 'special_cha',
    nameBn: 'স্পেশাল চা',
    nameEn: 'Special Cardamom Tea',
    category: 'TEA',
    price: 25,
    cookingTimeSec: 15,
    recipe: { milkMl: 70, teaLeavesG: 3, sugarG: 10, waterMl: 80, cupsPcs: 1 },
  },
  {
    id: 'malai_cha',
    nameBn: 'মালাই চা',
    nameEn: 'Rich Malai Tea',
    category: 'TEA',
    price: 35,
    cookingTimeSec: 15,
    recipe: { milkMl: 100, teaLeavesG: 4, sugarG: 12, waterMl: 50, cupsPcs: 1 },
  },
  {
    id: 'lebu_cha',
    nameBn: 'লেবু চা',
    nameEn: 'Lemon Tea',
    category: 'TEA',
    price: 15,
    cookingTimeSec: 5,
    recipe: { teaLeavesG: 2, sugarG: 10, waterMl: 150, cupsPcs: 1 },
  },
  // Foods
  {
    id: 'ruti',
    nameBn: 'রুটি',
    nameEn: 'Bread Bun',
    category: 'FOOD',
    price: 10,
    cookingTimeSec: 0,
    recipe: { breadPcs: 1 },
  },
  {
    id: 'kola',
    nameBn: 'কলা',
    nameEn: 'Banana',
    category: 'FOOD',
    price: 5,
    cookingTimeSec: 0,
    recipe: { bananaPcs: 1 },
  },
  {
    id: 'biscuit',
    nameBn: 'বিস্কুট',
    nameEn: 'Biscuit',
    category: 'FOOD',
    price: 5,
    cookingTimeSec: 0,
    recipe: { biscuitPcs: 1 },
  },
  {
    id: 'singara',
    nameBn: 'সিঙ্গারা',
    nameEn: 'Singara',
    category: 'FOOD',
    price: 10,
    cookingTimeSec: 5,
    recipe: { singaraPcs: 1 },
  },
  {
    id: 'samosa',
    nameBn: 'সমুচা',
    nameEn: 'Samosa',
    category: 'FOOD',
    price: 15,
    cookingTimeSec: 5,
    recipe: { samosaPcs: 1 },
  },
  {
    id: 'shiddho_dim',
    nameBn: 'সিদ্ধ ডিম',
    nameEn: 'Boiled Egg',
    category: 'FOOD',
    price: 20,
    cookingTimeSec: 10,
    recipe: { eggPcs: 1 },
  },
];

export const PROFESSIONS: Profession[] = [
  {
    id: 'student',
    nameBn: 'বিশ্ববিদ্যালয়ের শিক্ষার্থী',
    nameEn: 'University Student',
    icon: '🎓',
    loreBn: 'এসাইনমেন্টের প্যারা ভুলে টংয়ের ধোঁয়া ওঠা চায়ের আড্ডায় ব্যস্ত।',
    loreEn: 'Escaping assignment stress over steaming tea stall debates.',
    suggestedItems: ['dudh_cha', 'biscuit'],
  },
  {
    id: 'rickshaw_puller',
    nameBn: 'রিকশাচালক',
    nameEn: 'Rickshaw Puller',
    icon: '🚲',
    loreBn: 'সকাল থেকে প্যাডেল মেরে ক্লান্ত, এক কাপ কড়া রং চা আর রুটি দরকার।',
    loreEn: 'Pedaled all morning, urgently needs strong black tea and bread.',
    suggestedItems: ['rong_cha', 'ruti', 'kola'],
  },
  {
    id: 'cng_driver',
    nameBn: 'সিএনজি চালক',
    nameEn: 'CNG Driver',
    icon: '🛺',
    loreBn: 'জ্যামের ঠেলায় মাথা গরম, এক কাপ স্পেশাল চা ছাড়া গতি নাই।',
    loreEn: 'Stuck in gridlock, nothing works without a special tea.',
    suggestedItems: ['special_cha', 'singara'],
  },
  {
    id: 'bus_driver',
    nameBn: 'বাস চালক',
    nameEn: 'Bus Driver',
    icon: '🚌',
    loreBn: 'ট্রিপের মাঝখানে ৫ মিনিটের ব্রেক। জলদি এক কাপ লেবু চা লাগবে!',
    loreEn: '5-minute trip break. Needs quick lemon tea right away!',
    suggestedItems: ['lebu_cha', 'samosa'],
  },
  {
    id: 'garments_worker',
    nameBn: 'গার্মেন্টস কর্মী',
    nameEn: 'Garments Worker',
    icon: '🧵',
    loreBn: 'লাঞ্চের পর টংয়ের মিষ্টি দুধ চা দিনের সেরা সান্ত্বনা।',
    loreEn: 'Sweet milk tea after lunch is the sweetest joy of the day.',
    suggestedItems: ['dudh_cha', 'ruti'],
  },
  {
    id: 'teacher',
    nameBn: 'স্কুল শিক্ষক',
    nameEn: 'School Teacher',
    icon: '📚',
    loreBn: 'খাতা দেখার বিরতিতে টং দোকানে এসে সান্ধ্য পত্রিকা পাঠ।',
    loreEn: 'Reading evening newspaper with a polite cup of black tea.',
    suggestedItems: ['rong_cha', 'biscuit'],
  },
  {
    id: 'police',
    nameBn: 'পুলিশ কনস্টেবল',
    nameEn: 'Police Constable',
    icon: '👮',
    loreBn: 'রোদে ডিউটি দিয়ে গলা শুকিয়ে কাঠ। এক কাপ মালাই চা মামা!',
    loreEn: 'Heavy duty in scorching sun. Malai tea requested!',
    suggestedItems: ['malai_cha', 'singara'],
  },
  {
    id: 'journalist',
    nameBn: 'অনুসন্ধানী সাংবাদিক',
    nameEn: 'Investigative Journalist',
    icon: '🎙️',
    loreBn: 'টংয়ের চায়ের কাপেই দেশের সব গোপন খবরের জন্ম হয়।',
    loreEn: 'Where all breaking political scoops are overheard.',
    suggestedItems: ['lebu_cha', 'shiddho_dim'],
  },
  {
    id: 'businessman',
    nameBn: 'লোকাল ব্যবসায়ী',
    nameEn: 'Local Businessman',
    icon: '💼',
    loreBn: 'ফোনে লাখ টাকার ডিল ফাইনাল করার সময়ে টংয়ের স্পেশাল চা মাস্ট।',
    loreEn: 'Finalizing lucrative deals over special tea and hot samosas.',
    suggestedItems: ['special_cha', 'samosa'],
  },
  {
    id: 'freelancer',
    nameBn: 'নাইট-আউল ফ্রিল্যান্সার',
    nameEn: 'Freelancer',
    icon: '💻',
    loreBn: 'সারারাত কোডিং শেষে ভোরবেলার তাজা দুধ চায়ের অপেক্ষায়।',
    loreEn: 'Coded through the night, waiting for morning fresh milk tea.',
    suggestedItems: ['dudh_cha', 'biscuit', 'kola'],
  },
  {
    id: 'doctor',
    nameBn: 'জুনিয়র ডাক্তার',
    nameEn: 'Junior Doctor',
    icon: '🩺',
    loreBn: 'নাইট শিফট শেষ করে টংয়ে বসে এক নিঃশ্বাসে চা গিলে ফেলা।',
    loreEn: 'Night shift over, sipping rejuvenating lemon tea.',
    suggestedItems: ['lebu_cha', 'shiddho_dim'],
  },
  {
    id: 'job_seeker',
    nameBn: 'বিসিএস পরীক্ষার্থী',
    nameEn: 'BCS Aspirant',
    icon: '📖',
    loreBn: 'সাধারণ জ্ঞান পড়তে পড়তে মুখস্ত করা তথ্য চা দোকানে আওড়ানো।',
    loreEn: 'Reviewing general knowledge facts with budget red tea.',
    suggestedItems: ['rong_cha', 'ruti'],
  },
];

export const FUNNY_CANCELLATION_EXCUSES = [
  'আম্মু ফোন দিছে, বাসায় জলদি যাইতে হবে!',
  'মানিব্যাগ বাসায় রেখে আসছি মামা!',
  'ডায়েটের কথা হঠাৎ মনে পড়ে গেছে!',
  'প্রেমিকা ফোন দিয়া কান্নাকাটি শুরু করছে!',
  'পাশের দোকানে শুনলাম বাকিতে চা পাওয়া যায়!',
  'ভুল করে অর্ডার দিয়ে ফেলছি মামা, মাফ চাই!',
  'পকেটে টাকা আছে, কিন্তু মন সায় দিচ্ছে না!',
  'বন্ধুর জন্য অর্ডার দিছিলাম, বন্ধু বিল না দিয়ে পালাইছে!',
  'এত দাম দিয়ে চা খাওয়া আমাদের মানায় না!',
  'হঠাৎ পেট ভইরা গেছে মামা!',
];

export const FUNNY_BREAKING_NEWS = [
  '🚨 ব্রেকিং নিউজ! টংয়ের চায়ের পাতি নিয়ে গভীর তদন্ত শুরু!',
  '🚨 ব্রেকিং নিউজ! কাস্টমার বাকিতে চা চেয়ে দোকানদারের তোপের মুখে!',
  '🚨 ব্রেকিং নিউজ! সিঙ্গারা নাকি আলু বোম্ব—টংয়ে তোলপাড়!',
  '🚨 ব্রেকিং নিউজ! আকাশে মেঘ দেখা যেতেই দুধ চায়ের চাহিদা ৩০০% বৃদ্ধি!',
  '🚨 ব্রেকিং নিউজ! লোডশেডিংয়ের মধ্যেও টংয়ের কেটলি অবিচল!',
];

export const QUICK_CHAT_MESSAGES = [
  { text: 'মামা, কেমন আছেন?', reply: 'আলহামদুলিল্লাহ মামা! চা কি মিষ্টি হবে?' },
  { text: 'আরেক কাপ দেন!', reply: 'একদম গরম গরম ঢালতেছি!' },
  { text: 'দুধ বেশি দিয়েন!', reply: 'গাভীর খাঁটি দুধ মামা, কোনো ভেজাল নাই!' },
  { text: 'চিনি কম দিয়েন!', reply: 'স্বাস্থ্যসচেতন কাস্টমার! চিনি একদম হালকা।' },
  { text: 'বাকি রাখেন মামা!', reply: 'বাকির খাতা লাল হয়ে গেছে মামা, আগে ক্যাশ ফেলেন!' },
  { text: 'টাকা পরে দিমু!', reply: 'টাকা না দিলে কেটলি বন্ধ!' },
  { text: 'এইটা কী চা বানাইছেন?', reply: 'আরে মামা, একবার খেলে বারবার চাইবেন!' },
  { text: 'এত দেরি কেন?', reply: 'ধৈর্য ধরেন মামা, খাঁটি জিনিস সময় নেয়!' },
  { text: 'আগে আমারটা দেন!', reply: 'সিরিয়াল বজায় রাখেন ভাই!' },
  { text: 'মামা, হিসাবটা মিলান!', reply: 'হিসাব তো একদম পানির মতো পরিষ্কার!' },
  { text: 'এই দোকানে আর আসুম না!', reply: 'কাল সকালেই আবার আসবেন মামা, জানা আছে!' },
];

export const SABOTEUR_TEASE_MESSAGES = [
  'মামা, দোকান চালান নাকি দিনে দুপুরে ঘুমান?',
  'এক কাপ চা বানাইতে কি এক ঘণ্টা লাগব?',
  'পাশের দোকানের মামা তো মালাই চা মাখনের মতো বানায়!',
  'ভাইয়েরা, জলদি অর্ডার ক্যানসেল করেন, চায়ে চিনি নাই!',
  'এই দোকানের ভবিষ্যৎ পুরো লোডশেডিংয়ের মতো অন্ধকার!',
  'মামা, চায়ে পানি বেশি নাকি পানিতে চা পাতা ফেলেছেন?',
];

export const MINI_GAMES = [
  {
    id: 'calculator',
    nameBn: 'হিসাবের গোলমাল',
    nameEn: 'Quick Calculator',
    descriptionBn: 'টং দোকানের দ্রুত হিসাব মেলান। সঠিক উত্তর দিন।',
    descriptionEn: 'Calculate the tea-stall total bill accurately.',
  },
  {
    id: 'memory',
    nameBn: 'মনে আছে তো?',
    nameEn: 'Memory Challenge',
    descriptionBn: '৩ সেকেন্ডে আইটেমগুলো দেখুন, তারপর লুকিয়ে রাখা তালিকা থেকে সঠিকগুলো বেছে নিন।',
    descriptionEn: 'Memorize the stall items and select the correct ones.',
  },
  {
    id: 'pipes',
    nameBn: 'পাইপলাইন ঠিক করেন',
    nameEn: 'Pipe Puzzle',
    descriptionBn: 'পাইপ ঘুরিয়ে পানির কল থেকে কেটলির সংযোগ সম্পূর্ণ করুন।',
    descriptionEn: 'Rotate pipes to connect water tap to kettle.',
  },
  {
    id: 'traffic',
    nameBn: 'যানজট ছাড়ান',
    nameEn: 'Traffic Control',
    descriptionBn: 'রিকশা ও সিএনজির সিগন্যাল নিয়ন্ত্রণ করে অ্যাকসিডেন্ট এড়ান।',
    descriptionEn: 'Switch signals to prevent intersection crashes.',
  },
  {
    id: 'wordsearch',
    nameBn: 'শব্দ খুঁজে বের করেন',
    nameEn: 'Word Finder',
    descriptionBn: 'বর্ণমালার গ্রিড থেকে টংয়ের পরিচিত বাংলা শব্দটি খুঁজুন।',
    descriptionEn: 'Find the tea stall word in the letter grid.',
  },
  {
    id: 'sorting',
    nameBn: 'মাল গুছান',
    nameEn: 'Sorting Challenge',
    descriptionBn: 'দ্রুত পণ্যগুলো সঠিক ক্যাটাগরি বক্সে সাজিয়ে রাখুন।',
    descriptionEn: 'Sort products into appropriate stall categories.',
  },
  {
    id: 'emergency',
    nameBn: 'জরুরি ব্যবস্থা',
    nameEn: 'Emergency Response',
    descriptionBn: 'দোকানের নিরাপত্তা বজায় রাখতে সঠিক ক্রমানুসারে পদক্ষেপ নিন।',
    descriptionEn: 'Execute safety response actions in the right order.',
  },
  {
    id: 'maze',
    nameBn: 'রাস্তা খুঁজে বের করেন',
    nameEn: 'Route Finder',
    descriptionBn: 'গলির ভিড় এড়িয়ে কাস্টমারের টেবিলে গরম চায়ের পথ খুঁজুন।',
    descriptionEn: 'Navigate the tea maze to customer table.',
  },
  {
    id: 'pattern',
    nameBn: 'পরের সংখ্যাটা কী?',
    nameEn: 'Pattern Master',
    descriptionBn: 'টংয়ের হিসাবের ধারা দেখে পরবর্তী সংখ্যাটি বেছে নিন।',
    descriptionEn: 'Find the missing number in the sequence.',
  },
  {
    id: 'detective',
    nameBn: 'কে মিথ্যা বলছে?',
    nameEn: 'Detective Challenge',
    descriptionBn: '৩ জন কাস্টমারের বক্তব্য পড়ে আসল মিথ্যাবাদী বা ফাঁকিবাজকে ধরুন।',
    descriptionEn: 'Spot the contradictory claim among customers.',
  },
];

export function generateCustomerObjectives(assignedMiniGameId: string): Objective[] {
  // 1. Economic objective
  const economicObjectives: Objective[] = [
    {
      id: 'eco_1',
      type: 'ECONOMIC',
      titleBn: 'বাজেট যোদ্ধা',
      titleEn: 'Budget Fighter',
      descriptionBn: '৳৪০ টাকার কম খরচ করে অর্ডার সম্পন্ন করুন।',
      descriptionEn: 'Spend less than ৳40 on orders.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 40,
    },
    {
      id: 'eco_2',
      type: 'ECONOMIC',
      titleBn: 'মানিব্যাগ সেভার',
      titleEn: 'Wallet Saver',
      descriptionBn: 'রাউন্ড শেষে ওয়ালেটে কমপক্ষে ৳১০০ রাখুন।',
      descriptionEn: 'Keep at least ৳100 in your wallet at round end.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 100,
    },
    {
      id: 'eco_3',
      type: 'ECONOMIC',
      titleBn: 'ভোজনরসিক গ্রাহক',
      titleEn: 'Food Connoisseur',
      descriptionBn: 'অন্তত ২টি ভিন্ন ধরনের খাবারের অর্ডার দিন।',
      descriptionEn: 'Order at least 2 distinct items.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 2,
    },
  ];

  // 2. Profession arcade objective
  const miniGame = MINI_GAMES.find((m) => m.id === assignedMiniGameId) || MINI_GAMES[0];
  const arcadeObjective: Objective = {
    id: 'arcade_main',
    type: 'PROFESSION_ARCADE',
    titleBn: `দক্ষ কর্মী: ${miniGame.nameBn}`,
    titleEn: `Skilled Worker: ${miniGame.nameEn}`,
    descriptionBn: `${miniGame.nameBn} মিনি-গেমটি সফলভাবে সম্পন্ন করুন।`,
    descriptionEn: `Complete the assigned arcade challenge: ${miniGame.nameEn}.`,
    rewardPoints: 5,
    isCompleted: false,
    progress: 0,
    targetProgress: 1,
  };

  // 3. Tea-stall objective
  const teaStallObjectives: Objective[] = [
    {
      id: 'stall_1',
      type: 'TEA_STALL',
      titleBn: 'তৃপ্ত গ্রাহক',
      titleEn: 'Satisfied Customer',
      descriptionBn: 'দোকানদারের থেকে সঠিক চা ডেলিভারি গ্রহণ ও নিশ্চিত করুন।',
      descriptionEn: 'Receive and confirm a correct tea delivery.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
    {
      id: 'stall_2',
      type: 'TEA_STALL',
      titleBn: 'দ্রুত অর্ডারকারী',
      titleEn: 'Early Bird',
      descriptionBn: 'রাউন্ডের প্রথম ১ মিনিটের মধ্যেই অর্ডার জমা দিন।',
      descriptionEn: 'Place your order within the first 60 seconds.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
  ];

  // 4. Bonus objective
  const bonusObjectives: Objective[] = [
    {
      id: 'bonus_saboteur',
      type: 'BONUS',
      titleBn: 'ধান্দাবাজ শনাক্তকারী',
      titleEn: 'Saboteur Sleuth',
      descriptionBn: 'রাউন্ড শেষে সঠিক ধান্দাবাজকে ভোট দিন।',
      descriptionEn: 'Correctly identify the hidden saboteur at round end.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
    {
      id: 'bonus_perfect',
      type: 'BONUS',
      titleBn: 'নিখুঁত গ্রাহক',
      titleEn: 'Flawless Customer',
      descriptionBn: 'কোনো অর্ডার বাতিল না করে ডেলিভারি নিশ্চিত করুন।',
      descriptionEn: 'Confirm delivery without any cancellations.',
      rewardPoints: 4,
      isCompleted: false,
      progress: 0,
      targetProgress: 1,
    },
  ];

  return [
    economicObjectives[Math.floor(Math.random() * economicObjectives.length)],
    arcadeObjective,
    teaStallObjectives[Math.floor(Math.random() * teaStallObjectives.length)],
    bonusObjectives[Math.floor(Math.random() * bonusObjectives.length)],
  ];
}

export function generateShopkeeperObjectives(): Objective[] {
  return [
    {
      id: 'shop_1',
      type: 'SHOPKEEPER',
      titleBn: 'লাভজনক ব্যবসা',
      titleEn: 'Profitable Run',
      descriptionBn: '৳৫০ টাকার বেশি নীট মুনাফা অর্জন করুন।',
      descriptionEn: 'Earn more than ৳50 net profit.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 50,
    },
    {
      id: 'shop_2',
      type: 'SHOPKEEPER',
      titleBn: 'নিখুঁত ডেলিভারি',
      titleEn: 'Accurate Service',
      descriptionBn: '৮০% বা তার বেশি ডেলিভারি নির্ভুল রাখুন।',
      descriptionEn: 'Maintain 80% or higher order delivery accuracy.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 80,
    },
    {
      id: 'shop_3',
      type: 'SHOPKEEPER',
      titleBn: 'জনপ্রিয় মামা',
      titleEn: 'Beloved Mama',
      descriptionBn: 'অন্তত ৩টি কাস্টমার অর্ডার সফলভাবে পরিবেশন করুন।',
      descriptionEn: 'Successfully fulfil at least 3 customer orders.',
      rewardPoints: 3,
      isCompleted: false,
      progress: 0,
      targetProgress: 3,
    },
  ];
}
