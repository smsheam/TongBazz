/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'SHOPKEEPER' | 'CUSTOMER' | 'SABOTEUR';
export type BotDifficulty = 'EASY' | 'NORMAL' | 'HARD';
export type RoundPhase = 'PROCUREMENT' | 'MAIN_GAMEPLAY' | 'MISSION_TIME' | 'FINAL_FULFILMENT' | 'SETTLEMENT';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  isHost: boolean;
  personalWallet: number; // Customer personal funds (starts ৳150-৳250)
  reputation: number; // Starts at 10, lost on cancellation
  professionId: string;
  assignedMiniGameId: string;
  objectives: Objective[];
  inventory: string[]; // Private non-transferable items
  isSaboteur: boolean; // Hidden role
  isCurrentShopkeeper: boolean;
  totalScore: number;
  roleScores: {
    shopkeeper: number;
    customer: number;
    saboteur: number;
  };
  stats: {
    roundsAsShopkeeper: number;
    ordersFulfilled: number;
    ordersPlaced: number;
    ordersCancelled: number;
    totalProfit: number;
    sabotageSuccesses: number;
    arcadeGamesWon: number;
  };
}

export interface Ingredient {
  id: string;
  nameBn: string;
  nameEn: string;
  unit: string;
  wholesalePrice: number; // e.g. ৳60 for 1000ml milk
  packSize: number; // e.g. 1000
  consumptionPerTeaCup?: number; // e.g. 50ml per cup
}

export interface MenuItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'TEA' | 'FOOD';
  price: number; // Wholesale / selling price
  cookingTimeSec: number;
  recipe?: {
    milkMl?: number;
    teaLeavesG?: number;
    sugarG?: number;
    waterMl?: number;
    cupsPcs?: number;
    singaraPcs?: number;
    samosaPcs?: number;
    breadPcs?: number;
    bananaPcs?: number;
    eggPcs?: number;
    biscuitPcs?: number;
  };
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  itemPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalBill: number;
  banglaSentence: string;
  timestamp: number;
  phase: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  expiresFromShopkeeperViewAt: number; // 5 seconds after placement
  deliveredItems: OrderItem[];
  cancellationReason?: string;
  isFake?: boolean; // Saboteur fake order
}

export interface CookingTask {
  id: string;
  menuItemId: string;
  targetCustomerId?: string;
  startTime: number;
  durationMs: number;
  completed: boolean;
}

export interface Objective {
  id: string;
  type: 'ECONOMIC' | 'PROFESSION_ARCADE' | 'TEA_STALL' | 'BONUS' | 'SHOPKEEPER';
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  rewardPoints: number;
  isCompleted: boolean;
  progress: number;
  targetProgress: number;
}

export interface Profession {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  loreBn: string;
  loreEn: string;
  suggestedItems: string[];
}

export interface FinancialSettlement {
  initialCapital: number; // ৳200
  procurementSpending: number;
  remainingCash: number;
  salesRevenue: number;
  cancellationCompensation: number;
  unsoldInventoryValue: number;
  wastedCost: number;
  netProfit: number;
  orderAccuracy: number;
  ordersAttempted: number;
  ordersSuccessful: number;
}

export interface SaboteurState {
  fakeOrdersUsed: number; // max 2
  rainUsed: number; // max 1
  blackoutUsed: number; // max 2
  teaseCount: number;
  isRainActive: boolean;
  isBlackoutActive: boolean;
  blackoutEndsAt: number;
}

export interface GameEvent {
  id: string;
  titleBn: string;
  descriptionBn: string;
  type: 'RAIN' | 'BLACKOUT' | 'VIP' | 'MILK_SHORTAGE' | 'INSPECTION';
  expiresAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: Role;
  text: string;
  timestamp: number;
  isBreakingNews?: boolean;
  isSystem?: boolean;
  isSaboteurTease?: boolean;
}

export interface GameRoom {
  roomCode: string;
  hostId: string;
  status: 'LOBBY' | 'ROUND_RUNNING' | 'ROUND_SETTLEMENT' | 'MATCH_OVER';
  players: Player[];
  currentShopkeeperId: string;
  roundIndex: number;
  totalRounds: number; // Equal to player count so everyone gets 1 shopkeeper turn
  roundStartTime: number;
  roundDurationSeconds: number; // 180 seconds
  remainingSeconds: number;
  phase: RoundPhase;
  
  // Shopkeeper inventory in stock
  shopkeeperInventory: Record<string, number>;
  shopkeeperBudget: number; // starts at ৳200
  cookingTasks: CookingTask[];
  readyItems: OrderItem[];
  
  // Orders
  activeOrders: Order[];
  completedOrders: Order[];
  
  // Sabotage & Events
  saboteurState: SaboteurState;
  activeEvents: GameEvent[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Settlement of current round
  currentSettlement?: FinancialSettlement;
  saboteurRevealed: boolean;
}
