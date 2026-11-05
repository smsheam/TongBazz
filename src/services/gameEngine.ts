/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GameRoom,
  Player,
  BotDifficulty,
  OrderItem,
  FinancialSettlement,
  RoundPhase,
} from '../types/game';
import {
  WHOLESALE_INGREDIENTS,
  MENU_ITEMS,
  PROFESSIONS,
  MINI_GAMES,
  generateCustomerObjectives,
  generateShopkeeperObjectives,
  FUNNY_BREAKING_NEWS,
} from '../data/gameData';
import { generateBanglaOrderSentence } from '../utils/bangla';

const BOT_NAMES = [
  'রাহাত ইসলাম',
  'তানভীর আহমেদ',
  'সাকিবুল হাসান',
  'সুমাইয়া আক্তার',
  'আরিফ হোসেন',
  'ফারহানা কবির',
  'আশরাফ আলী',
  'নাজমুল হুদা',
];

const AVATARS = ['🧔', '👨‍🎓', '👩‍💻', '👨‍🏫', '👨‍⚕️', '🧕', '👨‍🌾', '👮‍♂️', '👩‍💼'];

export function createInitialRoom(hostName: string, hostId: string): GameRoom {
  const roomCode = `TONG-${Math.floor(10 + Math.random() * 90)}`;
  const hostPlayer: Player = {
    id: hostId,
    name: hostName,
    avatar: AVATARS[0],
    isBot: false,
    isHost: true,
    personalWallet: 200,
    reputation: 10,
    professionId: PROFESSIONS[0].id,
    assignedMiniGameId: MINI_GAMES[0].id,
    objectives: [],
    inventory: ['টংয়ের কয়েন', 'খাতা'],
    isSaboteur: false,
    isCurrentShopkeeper: false,
    totalScore: 0,
    roleScores: { shopkeeper: 0, customer: 0, saboteur: 0 },
    stats: {
      roundsAsShopkeeper: 0,
      ordersFulfilled: 0,
      ordersPlaced: 0,
      ordersCancelled: 0,
      totalProfit: 0,
      sabotageSuccesses: 0,
      arcadeGamesWon: 0,
    },
  };

  return {
    roomCode,
    hostId,
    status: 'LOBBY',
    players: [hostPlayer],
    currentShopkeeperId: '',
    roundIndex: 0,
    totalRounds: 0,
    roundStartTime: 0,
    roundDurationSeconds: 180,
    remainingSeconds: 180,
    phase: 'PROCUREMENT',
    shopkeeperInventory: {},
    shopkeeperBudget: 200,
    cookingTasks: [],
    readyItems: [],
    activeOrders: [],
    completedOrders: [],
    saboteurState: {
      fakeOrdersUsed: 0,
      rainUsed: 0,
      blackoutUsed: 0,
      teaseCount: 0,
      isRainActive: false,
      isBlackoutActive: false,
      blackoutEndsAt: 0,
    },
    activeEvents: [],
    chatMessages: [
      {
        id: 'msg-welcome',
        senderId: 'system',
        senderName: 'টংবাজ মামা',
        text: 'স্বাগতম টংবাজে! আসল দেশি চা খান আর ধান্দা জমান।',
        timestamp: Date.now(),
        isSystem: true,
      },
    ],
    saboteurRevealed: false,
  };
}

export function addBotToRoom(room: GameRoom, difficulty: BotDifficulty = 'NORMAL'): GameRoom {
  if (room.players.length >= 6) return room;

  const usedNames = room.players.map((p) => p.name);
  const availableNames = BOT_NAMES.filter((n) => !usedNames.includes(n));
  const botName = availableNames[0] || `বট #${room.players.length + 1}`;
  const avatar = AVATARS[room.players.length % AVATARS.length];

  const botPlayer: Player = {
    id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: botName,
    avatar,
    isBot: true,
    botDifficulty: difficulty,
    isHost: false,
    personalWallet: 180,
    reputation: 10,
    professionId: PROFESSIONS[room.players.length % PROFESSIONS.length].id,
    assignedMiniGameId: MINI_GAMES[room.players.length % MINI_GAMES.length].id,
    objectives: [],
    inventory: ['টংয়ের টোকেন'],
    isSaboteur: false,
    isCurrentShopkeeper: false,
    totalScore: 0,
    roleScores: { shopkeeper: 0, customer: 0, saboteur: 0 },
    stats: {
      roundsAsShopkeeper: 0,
      ordersFulfilled: 0,
      ordersPlaced: 0,
      ordersCancelled: 0,
      totalProfit: 0,
      sabotageSuccesses: 0,
      arcadeGamesWon: 0,
    },
  };

  return {
    ...room,
    players: [...room.players, botPlayer],
  };
}

export function removePlayerFromRoom(room: GameRoom, playerId: string): GameRoom {
  return {
    ...room,
    players: room.players.filter((p) => p.id !== playerId),
  };
}

export function startMatch(room: GameRoom): GameRoom {
  const totalRounds = room.players.length;
  return setupRound(room, 1, 0, totalRounds);
}

export function setupRound(
  room: GameRoom,
  roundNumber: number,
  shopkeeperIndex: number,
  totalRounds: number
): GameRoom {
  const shopkeeper = room.players[shopkeeperIndex % room.players.length];
  const customerCandidates = room.players.filter((p) => p.id !== shopkeeper.id);

  // Pick 1 secret saboteur among customers
  const saboteurIndex = Math.floor(Math.random() * customerCandidates.length);
  const saboteurId = customerCandidates[saboteurIndex]?.id;

  const updatedPlayers = room.players.map((p, idx) => {
    const isShopkeeper = p.id === shopkeeper.id;
    const isSaboteur = !isShopkeeper && p.id === saboteurId;
    const profession = PROFESSIONS[(idx + roundNumber) % PROFESSIONS.length];
    const miniGame = MINI_GAMES[(idx + roundNumber) % MINI_GAMES.length];

    const objectives = isShopkeeper
      ? generateShopkeeperObjectives()
      : generateCustomerObjectives(miniGame.id);

    return {
      ...p,
      isCurrentShopkeeper: isShopkeeper,
      isSaboteur,
      professionId: profession.id,
      assignedMiniGameId: miniGame.id,
      objectives,
      personalWallet: isShopkeeper ? p.personalWallet : Math.floor(160 + Math.random() * 80),
    };
  });

  return {
    ...room,
    status: 'ROUND_RUNNING',
    roundIndex: roundNumber,
    totalRounds,
    currentShopkeeperId: shopkeeper.id,
    roundStartTime: Date.now(),
    roundDurationSeconds: 180,
    remainingSeconds: 180,
    phase: 'PROCUREMENT',
    players: updatedPlayers,
    shopkeeperBudget: 200,
    shopkeeperInventory: {},
    cookingTasks: [],
    readyItems: [],
    activeOrders: [],
    completedOrders: [],
    saboteurState: {
      fakeOrdersUsed: 0,
      rainUsed: 0,
      blackoutUsed: 0,
      teaseCount: 0,
      isRainActive: false,
      isBlackoutActive: false,
      blackoutEndsAt: 0,
    },
    activeEvents: [],
    currentSettlement: undefined,
    saboteurRevealed: false,
    chatMessages: [
      ...room.chatMessages,
      {
        id: `round-start-${Date.now()}`,
        senderId: 'system',
        senderName: 'টংবাজ মামা',
        text: `🔔 রাউন্ড ${roundNumber} শুরু! দোকানদার: ${shopkeeper.name}। প্রথম ৩০ সেকেন্ড মালামাল ক্রয়!`,
        timestamp: Date.now(),
        isSystem: true,
      },
    ],
  };
}

export function gameTick(room: GameRoom): GameRoom {
  if (room.status !== 'ROUND_RUNNING') return room;

  const now = Date.now();
  const elapsed = Math.floor((now - room.roundStartTime) / 1000);
  const remaining = Math.max(0, room.roundDurationSeconds - elapsed);

  // Determine current phase
  let phase: RoundPhase = 'PROCUREMENT';
  if (elapsed >= 150) {
    phase = 'SETTLEMENT';
  } else if (elapsed >= 120) {
    phase = 'FINAL_FULFILMENT';
  } else if (elapsed >= 90) {
    phase = 'MISSION_TIME';
  } else if (elapsed >= 30) {
    phase = 'MAIN_GAMEPLAY';
  }

  // Handle cooking tasks completion
  const updatedCookingTasks = room.cookingTasks.map((task) => {
    if (!task.completed && now >= task.startTime + task.durationMs) {
      return { ...task, completed: true };
    }
    return task;
  });

  // Collect newly completed cooking items into readyItems
  const justFinishedTasks = updatedCookingTasks.filter(
    (t) => t.completed && !room.cookingTasks.find((ot) => ot.id === t.id && ot.completed)
  );
  const newReadyItems: OrderItem[] = justFinishedTasks.map((t) => {
    const item = MENU_ITEMS.find((m) => m.id === t.menuItemId);
    return {
      itemId: t.menuItemId,
      quantity: 1,
      itemPrice: item ? item.price : 10,
    };
  });

  // Reset blackout if expired
  let saboteurState = { ...room.saboteurState };
  if (saboteurState.isBlackoutActive && now >= saboteurState.blackoutEndsAt) {
    saboteurState.isBlackoutActive = false;
  }

  // Run Bot AI Actions
  let updatedRoom: GameRoom = {
    ...room,
    remainingSeconds: remaining,
    phase,
    cookingTasks: updatedCookingTasks,
    readyItems: [...room.readyItems, ...newReadyItems],
    saboteurState,
  };

  updatedRoom = runBotAI(updatedRoom, elapsed);

  // End of 180s Round -> Settlement Calculation
  if (remaining <= 0 && room.status === 'ROUND_RUNNING') {
    const settlement = calculateSettlement(updatedRoom);
    return {
      ...updatedRoom,
      status: 'ROUND_SETTLEMENT',
      currentSettlement: settlement,
      saboteurRevealed: true,
    };
  }

  return updatedRoom;
}

// -------------------------------------------------------------
// BOT AI LOGIC (Shopkeeper, Customer, Saboteur)
// -------------------------------------------------------------
function runBotAI(room: GameRoom, elapsedSeconds: number): GameRoom {
  let updatedRoom = { ...room };
  const currentShopkeeper = room.players.find((p) => p.id === room.currentShopkeeperId);

  // 1. BOT AS SHOPKEEPER
  if (currentShopkeeper?.isBot) {
    // Procurement phase (first 30s): Bot buys ingredients
    if (elapsedSeconds === 5 && updatedRoom.shopkeeperBudget >= 180) {
      // Balanced purchase
      const toBuy = [
        { id: 'milk', qty: 1000, cost: 60 },
        { id: 'tea_leaves', qty: 40, cost: 20 },
        { id: 'sugar', qty: 160, cost: 15 },
        { id: 'cups', qty: 20, cost: 20 },
        { id: 'singara', qty: 5, cost: 35 },
        { id: 'bread', qty: 4, cost: 20 },
      ];
      let budget = updatedRoom.shopkeeperBudget;
      const inv = { ...updatedRoom.shopkeeperInventory };
      for (const b of toBuy) {
        if (budget >= b.cost) {
          inv[b.id] = (inv[b.id] || 0) + b.qty;
          budget -= b.cost;
        }
      }
      updatedRoom.shopkeeperBudget = budget;
      updatedRoom.shopkeeperInventory = inv;
    }

    // Main phase: Bot shopkeeper cooks pending items & delivers
    if (elapsedSeconds > 32 && elapsedSeconds < 140 && elapsedSeconds % 8 === 0) {
      // Find unfulfilled order
      const pendingOrder = updatedRoom.activeOrders.find((o) => o.phase === 'PENDING');
      if (pendingOrder) {
        // Start cooking first item
        const firstItem = pendingOrder.items[0];
        if (firstItem && updatedRoom.cookingTasks.filter((t) => !t.completed).length < 3) {
          const menuItem = MENU_ITEMS.find((m) => m.id === firstItem.itemId);
          if (menuItem) {
            updatedRoom.cookingTasks = [
              ...updatedRoom.cookingTasks,
              {
                id: `task-${Date.now()}`,
                menuItemId: menuItem.id,
                targetCustomerId: pendingOrder.customerId,
                startTime: Date.now(),
                durationMs: menuItem.cookingTimeSec * 1000,
                completed: false,
              },
            ];
          }
        }
      }

      // Serve ready items
      if (updatedRoom.readyItems.length > 0) {
        const itemToDeliver = updatedRoom.readyItems[0];
        const pendingOrder = updatedRoom.activeOrders.find((o) => o.phase === 'PENDING');
        if (pendingOrder) {
          updatedRoom.readyItems = updatedRoom.readyItems.slice(1);
          updatedRoom.activeOrders = updatedRoom.activeOrders.map((o) =>
            o.id === pendingOrder.id
              ? {
                  ...o,
                  deliveredItems: [...o.deliveredItems, itemToDeliver],
                  phase: 'DELIVERED',
                }
              : o
          );
        }
      }
    }
  }

  // 2. BOTS AS CUSTOMERS
  for (const bot of updatedRoom.players) {
    if (!bot.isBot || bot.id === updatedRoom.currentShopkeeperId) continue;

    // Placing orders at staggered times (32s, 40s, 50s)
    const botElapsedTrigger = 32 + (parseInt(bot.id.slice(-2), 16) % 25);
    const hasActiveOrder = updatedRoom.activeOrders.some(
      (o) => o.customerId === bot.id && o.phase !== 'CANCELLED' && o.phase !== 'CONFIRMED'
    );

    if (elapsedSeconds >= botElapsedTrigger && !hasActiveOrder && elapsedSeconds < 100) {
      // Select 1-2 items
      const item1 = MENU_ITEMS[0]; // dudh_cha
      const item2 = MENU_ITEMS[5]; // ruti
      const orderItems: OrderItem[] = [
        { itemId: item1.id, quantity: 1, itemPrice: item1.price },
        { itemId: item2.id, quantity: 1, itemPrice: item2.price },
      ];
      const bill = item1.price + item2.price;
      const sentence = generateBanglaOrderSentence(orderItems);

      if (bot.personalWallet >= bill) {
        bot.personalWallet -= bill;
        const newOrder = {
          id: `order-${Date.now()}-${bot.id}`,
          customerId: bot.id,
          customerName: bot.name,
          items: orderItems,
          totalBill: bill,
          banglaSentence: sentence,
          timestamp: Date.now(),
          phase: 'PENDING' as const,
          expiresFromShopkeeperViewAt: Date.now() + 5000, // 5s disappearing memory rule!
          deliveredItems: [],
        };
        updatedRoom.activeOrders = [...updatedRoom.activeOrders, newOrder];
      }
    }

    // Bot completes mini-game around 60-80s
    if (elapsedSeconds === 65) {
      const successRate =
        bot.botDifficulty === 'HARD' ? 0.95 : bot.botDifficulty === 'NORMAL' ? 0.8 : 0.6;
      if (Math.random() < successRate) {
        bot.objectives = bot.objectives.map((obj) =>
          obj.type === 'PROFESSION_ARCADE' ? { ...obj, isCompleted: true, progress: 1 } : obj
        );
        bot.roleScores.customer += 5;
      }
    }

    // Bot confirms delivered order
    const deliveredOrder = updatedRoom.activeOrders.find(
      (o) => o.customerId === bot.id && o.phase === 'DELIVERED'
    );
    if (deliveredOrder && elapsedSeconds % 5 === 0) {
      updatedRoom.activeOrders = updatedRoom.activeOrders.map((o) =>
        o.id === deliveredOrder.id ? { ...o, phase: 'CONFIRMED' } : o
      );
      bot.objectives = bot.objectives.map((obj) =>
        obj.type === 'TEA_STALL' ? { ...obj, isCompleted: true, progress: 1 } : obj
      );
    }

    // 3. BOT AS SABOTEUR
    if (bot.isSaboteur) {
      // Trigger fake order around 50s
      if (elapsedSeconds === 50 && updatedRoom.saboteurState.fakeOrdersUsed < 2) {
        updatedRoom.saboteurState.fakeOrdersUsed += 1;
        const fakeOrder = {
          id: `fake-${Date.now()}`,
          customerId: bot.id,
          customerName: bot.name,
          items: [{ itemId: 'dudh_cha', quantity: 2, itemPrice: 30 }],
          totalBill: 30,
          banglaSentence: 'মামা, ২ কাপ কড়া চা দেন! জলদি!',
          timestamp: Date.now(),
          phase: 'PENDING' as const,
          expiresFromShopkeeperViewAt: Date.now() + 3000, // 3s fake disappear
          deliveredItems: [],
          isFake: true,
        };
        updatedRoom.activeOrders = [...updatedRoom.activeOrders, fakeOrder];
        bot.roleScores.saboteur += 3;
      }

      // Trigger rain around 85s
      if (elapsedSeconds === 85 && updatedRoom.saboteurState.rainUsed < 1) {
        updatedRoom.saboteurState.rainUsed += 1;
        updatedRoom.saboteurState.isRainActive = true;
        bot.roleScores.saboteur += 4;
        updatedRoom.chatMessages = [
          ...updatedRoom.chatMessages,
          {
            id: `rain-${Date.now()}`,
            senderId: 'system',
            senderName: 'টংবাজ মামা',
            text: '🌧️ আকাশে মেঘ, ঝুম বৃষ্টি নামল! সবাই আরেক কাপ চা খান!',
            timestamp: Date.now(),
            isBreakingNews: true,
          },
        ];
      }

      // Trigger blackout around 110s
      if (elapsedSeconds === 110 && updatedRoom.saboteurState.blackoutUsed < 2) {
        updatedRoom.saboteurState.blackoutUsed += 1;
        updatedRoom.saboteurState.isBlackoutActive = true;
        updatedRoom.saboteurState.blackoutEndsAt = Date.now() + 5000;
        bot.roleScores.saboteur += 3;
      }
    }
  }

  return updatedRoom;
}

// -------------------------------------------------------------
// SETTLEMENT AND SCORING CALCULATIONS
// -------------------------------------------------------------
export function calculateSettlement(room: GameRoom): FinancialSettlement {
  const initialCapital = 200;
  const remainingCash = room.shopkeeperBudget;
  const procurementSpending = initialCapital - remainingCash;

  // Sales revenue from confirmed deliveries
  const confirmedOrders = room.activeOrders.filter((o) => o.phase === 'CONFIRMED' && !o.isFake);
  const salesRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalBill, 0);

  // Cancellation compensation
  const cancelledOrders = room.activeOrders.filter((o) => o.phase === 'CANCELLED' && !o.isFake);
  const cancellationCompensation = cancelledOrders.reduce((sum, o) => sum + o.totalBill, 0);

  // Unsold inventory recoverable value (at wholesale cost)
  let unsoldInventoryValue = 0;
  for (const [ingId, qty] of Object.entries(room.shopkeeperInventory)) {
    const ing = WHOLESALE_INGREDIENTS.find((i) => i.id === ingId);
    if (ing && qty > 0) {
      const unitCost = ing.wholesalePrice / ing.packSize;
      unsoldInventoryValue += Math.floor(qty * unitCost);
    }
  }

  // Net Profit Formula:
  // Net profit = Sales revenue + Cancellation compensation + Remaining cash + Recoverable inventory value - Initial business capital (৳200).
  const netProfit =
    salesRevenue + cancellationCompensation + remainingCash + unsoldInventoryValue - initialCapital;

  const ordersAttempted = room.activeOrders.filter((o) => !o.isFake).length;
  const ordersSuccessful = confirmedOrders.length;
  const orderAccuracy =
    ordersAttempted > 0 ? Math.round((ordersSuccessful / ordersAttempted) * 100) : 100;

  // Points for current shopkeeper
  let shopkeeperPoints = ordersSuccessful * 5;
  if (orderAccuracy >= 90) shopkeeperPoints += 5;
  else if (orderAccuracy >= 75) shopkeeperPoints += 3;
  if (netProfit > 0) {
    const profitBonus = Math.min(8, Math.floor(netProfit / 20));
    shopkeeperPoints += profitBonus;
  }
  shopkeeperPoints = Math.min(40, shopkeeperPoints);

  // Award to shopkeeper
  const shopkeeper = room.players.find((p) => p.id === room.currentShopkeeperId);
  if (shopkeeper) {
    shopkeeper.roleScores.shopkeeper += shopkeeperPoints;
    shopkeeper.totalScore += shopkeeperPoints;
    shopkeeper.stats.totalProfit += netProfit;
    shopkeeper.stats.ordersFulfilled += ordersSuccessful;
    shopkeeper.stats.roundsAsShopkeeper += 1;
  }

  // Saboteur points update
  const saboteur = room.players.find((p) => p.isSaboteur);
  if (saboteur) {
    // Saboteur bonus for remaining undetected
    saboteur.roleScores.saboteur += 5;
    saboteur.totalScore += 5;
  }

  // Customer objective points
  for (const player of room.players) {
    if (player.id !== room.currentShopkeeperId) {
      let custRoundPoints = 0;
      for (const obj of player.objectives) {
        if (obj.isCompleted) {
          custRoundPoints += obj.rewardPoints;
        }
      }
      player.roleScores.customer += custRoundPoints;
      player.totalScore += custRoundPoints;
    }
  }

  return {
    initialCapital,
    procurementSpending,
    remainingCash,
    salesRevenue,
    cancellationCompensation,
    unsoldInventoryValue,
    wastedCost: 0,
    netProfit,
    orderAccuracy,
    ordersAttempted,
    ordersSuccessful,
  };
}
