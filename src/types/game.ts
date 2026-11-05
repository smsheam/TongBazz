/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'SHOPKEEPER' | 'CUSTOMER' | 'SABOTEUR';
export type BotDifficulty = 'EASY' | 'NORMAL' | 'HARD';
export type RoundPhase = 'PROCUREMENT' | 'MAIN_GAMEPLAY' | 'MISSION_TIME' | 'FINAL_FULFILMENT' | 'SETTLEMENT';

export interface ProductPack {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  category: 'TEA' | 'SNACK';
  retailPrice: number;   // Selling price per serving
  packCost: number;      // Wholesale cost for 1 pack
  yieldCount: number;    // Servings yielded per pack (5 for all)
  cookingTimeSec: number; // Red Tea: 5s, Milk Tea: 8s, Lemon Tea: 5s, Biscuit: 0s, Singara: 5s
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  isHost: boolean;
  personalWallet: number; // Customer personal funds (starts ৳150-৳250)
  reputation: number;     // Starts at 10, lost on cancellation
  professionId: string;
  assignedMiniGameId: string;
  objectives: Objective[];
  inventory: string[];
  isSaboteur: boolean;
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
    itemsConsumed: number;
    sabotageSuccesses: number;
    arcadeGamesWon: number;
  };
}

export interface OrderItem {
  productId: string;
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
  expiresFromShopkeeperViewAt: number; // 5 seconds after placement (memory challenge)
  deliveredItems: OrderItem[];
  cancellationReason?: string;
  isFake?: boolean; // Saboteur fake order
}

export interface CookingTask {
  id: string;
  productId: string;
  targetCustomerId?: string;
  startTime: number;
  durationMs: number;
  completed: boolean;
}

export interface Objective {
  id: string;
  type: 'ECONOMIC' | 'PROFESSION' | 'TEA_STALL' | 'BONUS' | 'SHOPKEEPER';
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  rewardPoints: number;
  isCompleted: boolean;
  progress: number;
  targetProgress: number;
}

export interface FinancialSettlement {
  initialCapital: number; // ৳200
  procurementSpending: number;
  remainingCash: number;
  salesRevenue: number;
  cancellationCompensation: number;
  unsoldInventoryValue: number;
  netProfit: number;
  orderAccuracy: number;
  ordersAttempted: number;
  ordersSuccessful: number;
}

export interface SaboteurState {
  fakeOrdersUsed: number; // max 2
  rainUsed: number;       // max 1
  blackoutUsed: number;   // max 2
  teaseCount: number;
  isRainActive: boolean;
  isBlackoutActive: boolean;
  blackoutEndsAt: number;
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
  totalRounds: number;
  roundStartTime: number;
  roundDurationSeconds: number; // 180 seconds
  remainingSeconds: number;
  phase: RoundPhase;
  
  // Shopkeeper Stock & Budget (Starting ৳200)
  shopkeeperStock: Record<string, number>; // productId -> available prepared servings
  shopkeeperBudget: number; // starts at ৳200
  cookingTasks: CookingTask[];
  readyItems: OrderItem[];
  
  // Orders
  activeOrders: Order[];
  completedOrders: Order[];
  
  // Sabotage & Events
  saboteurState: SaboteurState;
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Settlement
  currentSettlement?: FinancialSettlement;
  saboteurRevealed: boolean;
}
