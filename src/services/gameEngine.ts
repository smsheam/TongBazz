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
  PRODUCTS,
  MINI_GAMES,
  generateCustomerObjectives,
  generateShopkeeperObjectives,
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
    professionId: 'student',
    assignedMiniGameId: MINI_GAMES[0].id,
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
      itemsConsumed: 0,
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
    shopkeeperStock: {},
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
    chatMessages: [
      {
        id: 'msg-welcome',
        senderId: 'system',
        senderName: 'টংবাজ মামা',
        text: 'স্বাগতম টংবাজে! চা খান, ধান্দা করুন আর টং জমান।',
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
    professionId: 'customer',
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
      itemsConsumed: 0,
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
    const miniGame = MINI_GAMES[(idx + roundNumber) % MINI_GAMES.length];

    const objectives = isShopkeeper
      ? generateShopkeeperObjectives()
      : generateCustomerObjectives(miniGame.id);

    return {
      ...p,
      isCurrentShopkeeper: isShopkeeper,
      isSaboteur,
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
    shopkeeperStock: {},
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
    currentSettlement: undefined,
    saboteurRevealed: false,
    chatMessages: [
      ...room.chatMessages,
      {
        id: `round-start-${Date.now()}`,
        senderId: 'system',
        senderName: 'টংবাজ মামা',
        text: `🔔 রাউন্ড ${roundNumber} শুরু! দোকানদার: ${shopkeeper.name}। মূলধন: ৳২০০। মালামাল কিনুন!`,
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

  // 5 Phases
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

  // Cooking tasks completion
  const updatedCookingTasks = room.cookingTasks.map((task) => {
    if (!task.completed && now >= task.startTime + task.durationMs) {
      return { ...task, completed: true };
    }
    return task;
  });

  // Newly finished tasks add to ready items
  const newlyFinished = updatedCookingTasks.filter(
    (t) => t.completed && !room.cookingTasks.find((ot) => ot.id === t.id && ot.completed)
  );

  const newReadyItems: OrderItem[] = newlyFinished.map((t) => {
    const prod = PRODUCTS.find((p) => p.id === t.productId);
    return {
      productId: t.productId,
      quantity: 1,
      itemPrice: prod ? prod.retailPrice : 15,
    };
  });

  // Reset blackout if expired
  let saboteurState = { ...room.saboteurState };
  if (saboteurState.isBlackoutActive && now >= saboteurState.blackoutEndsAt) {
    saboteurState.isBlackoutActive = false;
  }

  let updatedRoom: GameRoom = {
    ...room,
    remainingSeconds: remaining,
    phase,
    cookingTasks: updatedCookingTasks,
    readyItems: [...room.readyItems, ...newReadyItems],
    saboteurState,
  };

  updatedRoom = runBotAI(updatedRoom, elapsed);

  // Round ends at 180s
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

// BOT SIMULATION
function runBotAI(room: GameRoom, elapsedSeconds: number): GameRoom {
  let updatedRoom = { ...room };
  const currentShopkeeper = room.players.find((p) => p.id === room.currentShopkeeperId);

  // 1. Bot Shopkeeper: Buys packs during procurement, cooks & serves
  if (currentShopkeeper?.isBot) {
    if (elapsedSeconds === 6 && updatedRoom.shopkeeperBudget >= 120) {
      // Buy 1 pack of each 5 products (Milk Tea: 40, Red Tea: 20, Lemon: 30, Biscuit: 15, Singara: 30 = 135)
      const toBuy = ['milk_tea', 'red_tea', 'lemon_tea', 'biscuit', 'singara'];
      let budget = updatedRoom.shopkeeperBudget;
      const stock = { ...updatedRoom.shopkeeperStock };

      for (const pid of toBuy) {
        const prod = PRODUCTS.find((p) => p.id === pid);
        if (prod && budget >= prod.packCost) {
          stock[pid] = (stock[pid] || 0) + prod.yieldCount;
          budget -= prod.packCost;
        }
      }
      updatedRoom.shopkeeperBudget = budget;
      updatedRoom.shopkeeperStock = stock;
    }

    // Cook and serve during main gameplay
    if (elapsedSeconds > 32 && elapsedSeconds < 140 && elapsedSeconds % 7 === 0) {
      const pendingOrder = updatedRoom.activeOrders.find((o) => o.phase === 'PENDING');
      if (pendingOrder && pendingOrder.items.length > 0) {
        const item = pendingOrder.items[0];
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        const currentStock = updatedRoom.shopkeeperStock[item.productId] || 0;

        if (prod && currentStock > 0 && updatedRoom.cookingTasks.filter((t) => !t.completed).length < 3) {
          updatedRoom.shopkeeperStock[item.productId] = currentStock - 1;
          if (prod.cookingTimeSec === 0) {
            updatedRoom.readyItems = [
              ...updatedRoom.readyItems,
              { productId: prod.id, quantity: 1, itemPrice: prod.retailPrice },
            ];
          } else {
            updatedRoom.cookingTasks = [
              ...updatedRoom.cookingTasks,
              {
                id: `task-${Date.now()}`,
                productId: prod.id,
                startTime: Date.now(),
                durationMs: prod.cookingTimeSec * 1000,
                completed: false,
              },
            ];
          }
        }
      }

      // Deliver ready item
      if (updatedRoom.readyItems.length > 0) {
        const ready = updatedRoom.readyItems[0];
        const targetOrder = updatedRoom.activeOrders.find((o) => o.phase === 'PENDING');
        if (targetOrder) {
          updatedRoom.readyItems = updatedRoom.readyItems.slice(1);
          updatedRoom.activeOrders = updatedRoom.activeOrders.map((o) =>
            o.id === targetOrder.id
              ? {
                  ...o,
                  deliveredItems: [...o.deliveredItems, ready],
                  phase: 'DELIVERED',
                }
              : o
          );
        }
      }
    }
  }

  // 2. Bot Customers: Place orders, complete mini-game, confirm
  for (const bot of updatedRoom.players) {
    if (!bot.isBot || bot.id === updatedRoom.currentShopkeeperId) continue;

    const orderTime = 32 + (parseInt(bot.id.slice(-2), 16) % 20);
    const hasOrder = updatedRoom.activeOrders.some(
      (o) => o.customerId === bot.id && o.phase !== 'CANCELLED' && o.phase !== 'CONFIRMED'
    );

    if (elapsedSeconds >= orderTime && !hasOrder && elapsedSeconds < 90) {
      const p1 = PRODUCTS[0]; // milk tea
      const p2 = PRODUCTS[4]; // singara
      const orderItems: OrderItem[] = [
        { productId: p1.id, quantity: 1, itemPrice: p1.retailPrice },
        { productId: p2.id, quantity: 1, itemPrice: p2.retailPrice },
      ];
      const total = p1.retailPrice + p2.retailPrice;
      const sentence = generateBanglaOrderSentence(orderItems);

      if (bot.personalWallet >= total) {
        bot.personalWallet -= total;
        const newOrder = {
          id: `order-${Date.now()}-${bot.id}`,
          customerId: bot.id,
          customerName: bot.name,
          items: orderItems,
          totalBill: total,
          banglaSentence: sentence,
          timestamp: Date.now(),
          phase: 'PENDING' as const,
          expiresFromShopkeeperViewAt: Date.now() + 5000, // 5s disappearing memory rule
          deliveredItems: [],
        };
        updatedRoom.activeOrders = [...updatedRoom.activeOrders, newOrder];
      }
    }

    // Mini-game completion
    if (elapsedSeconds === 70) {
      const winChance = bot.botDifficulty === 'HARD' ? 0.95 : bot.botDifficulty === 'NORMAL' ? 0.8 : 0.6;
      if (Math.random() < winChance) {
        bot.objectives = bot.objectives.map((obj) =>
          obj.type === 'PROFESSION' ? { ...obj, isCompleted: true, progress: 1 } : obj
        );
        bot.roleScores.customer += 5;
        bot.stats.arcadeGamesWon += 1;
      }
    }

    // Confirm delivery
    const delivered = updatedRoom.activeOrders.find(
      (o) => o.customerId === bot.id && o.phase === 'DELIVERED'
    );
    if (delivered && elapsedSeconds % 4 === 0) {
      updatedRoom.activeOrders = updatedRoom.activeOrders.map((o) =>
        o.id === delivered.id ? { ...o, phase: 'CONFIRMED' } : o
      );
      bot.stats.itemsConsumed += delivered.items.reduce((sum, i) => sum + i.quantity, 0);
      bot.objectives = bot.objectives.map((obj) =>
        obj.type === 'TEA_STALL' ? { ...obj, isCompleted: true, progress: 1 } : obj
      );
    }

    // 3. Bot Saboteur: Fake order, rain, blackout
    if (bot.isSaboteur) {
      if (elapsedSeconds === 50 && updatedRoom.saboteurState.fakeOrdersUsed < 2) {
        updatedRoom.saboteurState.fakeOrdersUsed += 1;
        const fakeOrder = {
          id: `fake-${Date.now()}`,
          customerId: bot.id,
          customerName: bot.name,
          items: [{ productId: 'milk_tea', quantity: 2, itemPrice: 15 }],
          totalBill: 30,
          banglaSentence: 'মামা, ২ কাপ কড়া দুধ চা দেন! জলদি!',
          timestamp: Date.now(),
          phase: 'PENDING' as const,
          expiresFromShopkeeperViewAt: Date.now() + 3000,
          deliveredItems: [],
          isFake: true,
        };
        updatedRoom.activeOrders = [...updatedRoom.activeOrders, fakeOrder];
        bot.roleScores.saboteur += 3;
        bot.stats.sabotageSuccesses += 1;
      }

      if (elapsedSeconds === 85 && updatedRoom.saboteurState.rainUsed < 1) {
        updatedRoom.saboteurState.rainUsed += 1;
        updatedRoom.saboteurState.isRainActive = true;
        bot.roleScores.saboteur += 4;
        bot.stats.sabotageSuccesses += 1;
        updatedRoom.chatMessages = [
          ...updatedRoom.chatMessages,
          {
            id: `rain-${Date.now()}`,
            senderId: 'system',
            senderName: 'টংবাজ মামা',
            text: '🌧️ আকাশে মেঘ, ঝুম বৃষ্টি শুরু হলো! আরেক কাপ গরম চা নেওয়ার সুযোগ!',
            timestamp: Date.now(),
            isBreakingNews: true,
          },
        ];
      }

      if (elapsedSeconds === 110 && updatedRoom.saboteurState.blackoutUsed < 2) {
        updatedRoom.saboteurState.blackoutUsed += 1;
        updatedRoom.saboteurState.isBlackoutActive = true;
        updatedRoom.saboteurState.blackoutEndsAt = Date.now() + 5000;
        bot.roleScores.saboteur += 3;
        bot.stats.sabotageSuccesses += 1;
      }
    }
  }

  return updatedRoom;
}

// SETTLEMENT AND SCORING
export function calculateSettlement(room: GameRoom): FinancialSettlement {
  const initialCapital = 200;
  const remainingCash = room.shopkeeperBudget;
  const procurementSpending = initialCapital - remainingCash;

  const confirmedOrders = room.activeOrders.filter((o) => o.phase === 'CONFIRMED' && !o.isFake);
  const salesRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalBill, 0);

  const cancelledOrders = room.activeOrders.filter((o) => o.phase === 'CANCELLED' && !o.isFake);
  const cancellationCompensation = cancelledOrders.reduce((sum, o) => sum + o.totalBill, 0);

  // Unsold inventory (unit value = packCost / yieldCount)
  let unsoldInventoryValue = 0;
  for (const [pid, count] of Object.entries(room.shopkeeperStock)) {
    const prod = PRODUCTS.find((p) => p.id === pid);
    if (prod && count > 0) {
      const unitCost = prod.packCost / prod.yieldCount;
      unsoldInventoryValue += Math.floor(count * unitCost);
    }
  }

  // Net Profit
  const netProfit =
    salesRevenue + cancellationCompensation + remainingCash + unsoldInventoryValue - initialCapital;

  const ordersAttempted = room.activeOrders.filter((o) => !o.isFake).length;
  const ordersSuccessful = confirmedOrders.length;
  const orderAccuracy =
    ordersAttempted > 0 ? Math.round((ordersSuccessful / ordersAttempted) * 100) : 100;

  // Shopkeeper scoring (up to 40)
  let shopkeeperPoints = ordersSuccessful * 5;
  if (orderAccuracy >= 90) shopkeeperPoints += 5;
  else if (orderAccuracy >= 75) shopkeeperPoints += 3;
  if (netProfit > 0) {
    shopkeeperPoints += Math.min(8, Math.floor(netProfit / 20));
  }
  shopkeeperPoints = Math.min(40, shopkeeperPoints);

  const shopkeeper = room.players.find((p) => p.id === room.currentShopkeeperId);
  if (shopkeeper) {
    shopkeeper.roleScores.shopkeeper += shopkeeperPoints;
    shopkeeper.totalScore += shopkeeperPoints;
    shopkeeper.stats.totalProfit += netProfit;
    shopkeeper.stats.ordersFulfilled += ordersSuccessful;
    shopkeeper.stats.roundsAsShopkeeper += 1;
  }

  // Saboteur bonus for remaining unidentified
  const saboteur = room.players.find((p) => p.isSaboteur);
  if (saboteur) {
    saboteur.roleScores.saboteur += 5;
    saboteur.totalScore += 5;
  }

  // Customers scoring (up to 17)
  for (const p of room.players) {
    if (p.id !== room.currentShopkeeperId) {
      let custPoints = 0;
      for (const obj of p.objectives) {
        if (obj.isCompleted) custPoints += obj.rewardPoints;
      }
      p.roleScores.customer += custPoints;
      p.totalScore += custPoints;
    }
  }

  return {
    initialCapital,
    procurementSpending,
    remainingCash,
    salesRevenue,
    cancellationCompensation,
    unsoldInventoryValue,
    netProfit,
    orderAccuracy,
    ordersAttempted,
    ordersSuccessful,
  };
}
