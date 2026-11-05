/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { GameRoom, Player, BotDifficulty, OrderItem } from './types/game';
import {
  createInitialRoom,
  addBotToRoom,
  removePlayerFromRoom,
  startMatch,
  setupRound,
  gameTick,
} from './services/gameEngine';
import { network } from './services/network';
import { sound } from './utils/audio';
import { PRODUCTS } from './data/gameData';
import { formatSeconds, formatTaka } from './utils/bangla';
import {
  auth,
  loadUserDokan,
  UserTongDokan,
  DEFAULT_TONG_DOKAN,
} from './services/firebase';

import { HomeHub } from './components/HomeHub';
import { Lobby } from './components/Lobby';
import { TeaStallIllustration } from './components/TeaStallIllustration';
import { ShopkeeperDashboard } from './components/ShopkeeperDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { SaboteurPanel } from './components/SaboteurPanel';
import { ArcadeModal } from './components/ArcadeModal';
import { SettlementModal } from './components/SettlementModal';
import { MatchEndLeaderboard } from './components/MatchEndLeaderboard';
import { ChatDrawer } from './components/ChatDrawer';
import { CustomizeDokanModal } from './components/CustomizeDokanModal';
import { SettingsModal } from './components/SettingsModal';

type AppView = 'HOME' | 'LOBBY' | 'ROUND_RUNNING' | 'ROUND_SETTLEMENT' | 'MATCH_OVER';

export default function App() {
  const [view, setView] = useState<AppView>('HOME');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  // Modals
  const [isArcadeOpen, setIsArcadeOpen] = useState<boolean>(false);
  const [activeArcadeGameId, setActiveArcadeGameId] = useState<string>('calculator');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Settings & User state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userDokan, setUserDokan] = useState<UserTongDokan>(DEFAULT_TONG_DOKAN);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [language, setLanguage] = useState<'BN' | 'EN'>('BN');

  // Load Auth and User Tong Dokan on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const dokan = await loadUserDokan();
      if (currentUser && currentUser.displayName && dokan.id === 'guest') {
        dokan.displayName = currentUser.displayName;
        dokan.id = currentUser.uid;
      }
      setUserDokan(dokan);
    });

    // Network room sync
    network.subscribeRoomUpdate((updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.status === 'ROUND_RUNNING') setView('ROUND_RUNNING');
      else if (updatedRoom.status === 'ROUND_SETTLEMENT') setView('ROUND_SETTLEMENT');
      else if (updatedRoom.status === 'MATCH_OVER') setView('MATCH_OVER');
      else if (updatedRoom.status === 'LOBBY') setView('LOBBY');
    });

    const stored = network.getStoredRoom();
    if (stored) {
      setRoom(stored);
      if (stored.players.length > 0 && !currentPlayerId) {
        setCurrentPlayerId(stored.players[0].id);
      }
    }

    return () => unsubscribe();
  }, []);

  // Update room state and broadcast
  const updateRoom = (newRoom: GameRoom) => {
    setRoom(newRoom);
    network.broadcastRoom(newRoom);
  };

  // 1-second host game tick interval
  const roomRef = useRef<GameRoom | null>(room);
  roomRef.current = room;

  useEffect(() => {
    const timer = setInterval(() => {
      const current = roomRef.current;
      if (!current || current.status !== 'ROUND_RUNNING') return;

      const isHost = current.hostId === currentPlayerId;
      if (isHost) {
        const next = gameTick(current);
        updateRoom(next);
        if (next.status === 'ROUND_SETTLEMENT') {
          setView('ROUND_SETTLEMENT');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayerId]);

  // Current Player
  const currentPlayer: Player | undefined = room?.players.find((p) => p.id === currentPlayerId);
  const isShopkeeper = room?.currentShopkeeperId === currentPlayerId;
  const isSaboteur = !!currentPlayer?.isSaboteur;

  // LOBBY ACTIONS
  const handleCreateRoom = (hostName: string) => {
    const hostId = user?.uid || `player-${Date.now()}`;
    const newRoom = createInitialRoom(hostName || userDokan.displayName, hostId);
    newRoom.players[0].avatar = userDokan.avatar;
    setCurrentPlayerId(hostId);
    updateRoom(newRoom);
    setView('LOBBY');
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    const targetRoom = room || network.getStoredRoom();
    if (!targetRoom || targetRoom.roomCode !== roomCode) {
      alert('রুম খুঁজে পাওয়া যায়নি! অনুগ্রহ করে সঠিক কোড দিন।');
      return;
    }

    if (targetRoom.players.length >= 6) {
      alert('রুমে সর্বোচ্চ ৬ জন পূর্ণ হয়ে গেছে!');
      return;
    }

    const newPlayerId = user?.uid || `player-${Date.now()}`;
    const newPlayer: Player = {
      id: newPlayerId,
      name: playerName || userDokan.displayName,
      avatar: userDokan.avatar,
      isBot: false,
      isHost: false,
      personalWallet: 180,
      reputation: 10,
      professionId: 'student',
      assignedMiniGameId: 'calculator',
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

    const nextRoom: GameRoom = {
      ...targetRoom,
      players: [...targetRoom.players, newPlayer],
    };
    setCurrentPlayerId(newPlayerId);
    updateRoom(nextRoom);
    setView('LOBBY');
  };

  const handleAddBot = (difficulty: BotDifficulty) => {
    if (!room) return;
    const nextRoom = addBotToRoom(room, difficulty);
    updateRoom(nextRoom);
  };

  const handleRemoveBot = (botId: string) => {
    if (!room) return;
    const nextRoom = removePlayerFromRoom(room, botId);
    updateRoom(nextRoom);
  };

  const handleStartMatch = () => {
    if (!room) return;
    const nextRoom = startMatch(room);
    updateRoom(nextRoom);
    setView('ROUND_RUNNING');
  };

  // SHOPKEEPER ACTIONS (5 Wholesale Product Packs)
  const handleBuyPack = (productId: string) => {
    if (!room) return;
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod || room.shopkeeperBudget < prod.packCost) return;

    sound.playCoin();
    const nextRoom: GameRoom = {
      ...room,
      shopkeeperBudget: room.shopkeeperBudget - prod.packCost,
      shopkeeperStock: {
        ...room.shopkeeperStock,
        [productId]: (room.shopkeeperStock[productId] || 0) + prod.yieldCount,
      },
    };
    updateRoom(nextRoom);
  };

  const handleStartCooking = (productId: string) => {
    if (!room) return;
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;

    const currentStock = room.shopkeeperStock[productId] || 0;
    if (currentStock <= 0) return;

    const activeTasks = room.cookingTasks.filter((t) => !t.completed);
    if (activeTasks.length >= 3) return;

    sound.playStove();
    const newStock = {
      ...room.shopkeeperStock,
      [productId]: currentStock - 1,
    };

    if (prod.cookingTimeSec === 0) {
      const nextRoom: GameRoom = {
        ...room,
        shopkeeperStock: newStock,
        readyItems: [
          ...room.readyItems,
          { productId: prod.id, quantity: 1, itemPrice: prod.retailPrice },
        ],
      };
      updateRoom(nextRoom);
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      productId: prod.id,
      startTime: Date.now(),
      durationMs: prod.cookingTimeSec * 1000,
      completed: false,
    };

    const nextRoom: GameRoom = {
      ...room,
      shopkeeperStock: newStock,
      cookingTasks: [...room.cookingTasks, newTask],
    };
    updateRoom(nextRoom);
  };

  const handleServeProduct = (customerId: string, item: OrderItem) => {
    if (!room) return;
    const idx = room.readyItems.findIndex((i) => i.productId === item.productId);
    if (idx === -1) return;

    sound.playPour();
    const updatedReady = [...room.readyItems];
    updatedReady.splice(idx, 1);

    const updatedOrders = room.activeOrders.map((o) => {
      if (o.customerId === customerId && o.phase === 'PENDING') {
        return {
          ...o,
          deliveredItems: [...o.deliveredItems, item],
          phase: 'DELIVERED' as const,
        };
      }
      return o;
    });

    const nextRoom: GameRoom = {
      ...room,
      readyItems: updatedReady,
      activeOrders: updatedOrders,
    };
    updateRoom(nextRoom);
  };

  // CUSTOMER ACTIONS
  const handlePlaceOrder = (items: OrderItem[], sentence: string, totalBill: number) => {
    if (!room || !currentPlayer) return;

    const updatedPlayers = room.players.map((p) => {
      if (p.id === currentPlayer.id) {
        return { ...p, personalWallet: p.personalWallet - totalBill };
      }
      return p;
    });

    const newOrder = {
      id: `order-${Date.now()}`,
      customerId: currentPlayer.id,
      customerName: currentPlayer.name,
      items,
      totalBill,
      banglaSentence: sentence,
      timestamp: Date.now(),
      phase: 'PENDING' as const,
      expiresFromShopkeeperViewAt: Date.now() + 5000,
      deliveredItems: [],
    };

    const nextRoom: GameRoom = {
      ...room,
      players: updatedPlayers,
      activeOrders: [...room.activeOrders, newOrder],
      chatMessages: [
        ...room.chatMessages,
        {
          id: `order-msg-${Date.now()}`,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          text: sentence,
          timestamp: Date.now(),
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleConfirmDelivery = (orderId: string) => {
    if (!room) return;
    const nextRoom: GameRoom = {
      ...room,
      activeOrders: room.activeOrders.map((o) => (o.id === orderId ? { ...o, phase: 'CONFIRMED' } : o)),
    };
    if (currentPlayer) {
      nextRoom.players = nextRoom.players.map((p) => {
        if (p.id === currentPlayer.id) {
          return {
            ...p,
            objectives: p.objectives.map((obj) =>
              obj.type === 'TEA_STALL' ? { ...obj, isCompleted: true, progress: 1 } : obj
            ),
          };
        }
        return p;
      });
    }
    updateRoom(nextRoom);
  };

  const handleRejectDelivery = (orderId: string) => {
    if (!room) return;
    const order = room.activeOrders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedPlayers = room.players.map((p) => {
      if (p.id === order.customerId) {
        return { ...p, personalWallet: p.personalWallet + order.totalBill };
      }
      return p;
    });

    const nextRoom: GameRoom = {
      ...room,
      players: updatedPlayers,
      activeOrders: room.activeOrders.map((o) => (o.id === orderId ? { ...o, phase: 'REJECTED' } : o)),
    };
    updateRoom(nextRoom);
  };

  const handleCancelOrder = (orderId: string, excuse: string) => {
    if (!room || !currentPlayer) return;
    const order = room.activeOrders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedPlayers = room.players.map((p) => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          reputation: Math.max(0, p.reputation - 2),
          stats: { ...p.stats, ordersCancelled: p.stats.ordersCancelled + 1 },
        };
      }
      return p;
    });

    const breakingNews = `🚨 ব্রেকিং নিউজ! ${currentPlayer.name} ৳${order.totalBill} টাকার অর্ডার বাতিল করেছেন! কারণ: ${excuse}`;

    const nextRoom: GameRoom = {
      ...room,
      players: updatedPlayers,
      activeOrders: room.activeOrders.map((o) =>
        o.id === orderId ? { ...o, phase: 'CANCELLED', cancellationReason: excuse } : o
      ),
      chatMessages: [
        ...room.chatMessages,
        {
          id: `cancel-${Date.now()}`,
          senderId: 'system',
          senderName: 'টং নিউজ',
          text: breakingNews,
          timestamp: Date.now(),
          isBreakingNews: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  // SABOTEUR ACTIONS
  const handleFakeOrder = () => {
    if (!room || !currentPlayer || room.saboteurState.fakeOrdersUsed >= 2) return;

    const fakeOrder = {
      id: `fake-${Date.now()}`,
      customerId: currentPlayer.id,
      customerName: currentPlayer.name,
      items: [{ productId: 'milk_tea', quantity: 2, itemPrice: 15 }],
      totalBill: 30,
      banglaSentence: 'মামা, কড়া দুই কাপ দুধ চা দেন! জলদি!',
      timestamp: Date.now(),
      phase: 'PENDING' as const,
      expiresFromShopkeeperViewAt: Date.now() + 5000,
      deliveredItems: [],
      isFake: true,
    };

    const nextRoom: GameRoom = {
      ...room,
      activeOrders: [...room.activeOrders, fakeOrder],
      saboteurState: {
        ...room.saboteurState,
        fakeOrdersUsed: room.saboteurState.fakeOrdersUsed + 1,
      },
      chatMessages: [
        ...room.chatMessages,
        {
          id: `tease-${Date.now()}`,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          text: 'মামা, একটা সিগারেট দেন! ...থাক, লাগবে না!',
          timestamp: Date.now(),
          isSaboteurTease: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleTriggerRain = () => {
    if (!room || !currentPlayer || room.saboteurState.rainUsed >= 1) return;

    const nextRoom: GameRoom = {
      ...room,
      saboteurState: {
        ...room.saboteurState,
        rainUsed: room.saboteurState.rainUsed + 1,
        isRainActive: true,
      },
      chatMessages: [
        ...room.chatMessages,
        {
          id: `rain-${Date.now()}`,
          senderId: 'system',
          senderName: 'টংবাজ মামা',
          text: '🌧️ আকাশে মেঘ, ঝুম বৃষ্টি শুরু হলো! অতিরিক্ত এক কাপ গরম চায়ের সময়!',
          timestamp: Date.now(),
          isBreakingNews: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleTriggerBlackout = () => {
    if (!room || !currentPlayer || room.saboteurState.blackoutUsed >= 2) return;

    const nextRoom: GameRoom = {
      ...room,
      saboteurState: {
        ...room.saboteurState,
        blackoutUsed: room.saboteurState.blackoutUsed + 1,
        isBlackoutActive: true,
        blackoutEndsAt: Date.now() + 5000,
      },
      chatMessages: [
        ...room.chatMessages,
        {
          id: `blackout-${Date.now()}`,
          senderId: 'system',
          senderName: 'টং নিউজ',
          text: '⚡ লোডশেডিং! দোকানে ৫ সেকেন্ডের জন্য কারেন্ট চলে গেছে!',
          timestamp: Date.now(),
          isBreakingNews: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleSendTease = (text: string) => {
    if (!room || !currentPlayer) return;
    const nextRoom: GameRoom = {
      ...room,
      chatMessages: [
        ...room.chatMessages,
        {
          id: `tease-${Date.now()}`,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          text,
          timestamp: Date.now(),
          isSaboteurTease: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleSendMessage = (text: string) => {
    if (!room || !currentPlayer) return;
    const nextRoom: GameRoom = {
      ...room,
      chatMessages: [
        ...room.chatMessages,
        {
          id: `msg-${Date.now()}`,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          text,
          timestamp: Date.now(),
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleQuickChat = (text: string, reply: string) => {
    if (!room || !currentPlayer) return;
    const nextRoom: GameRoom = {
      ...room,
      chatMessages: [
        ...room.chatMessages,
        {
          id: `qc-${Date.now()}`,
          senderId: currentPlayer.id,
          senderName: currentPlayer.name,
          text,
          timestamp: Date.now(),
        },
        {
          id: `rep-${Date.now() + 1}`,
          senderId: 'mama',
          senderName: 'টংয়ের মামা',
          text: reply,
          timestamp: Date.now() + 200,
          isSystem: true,
        },
      ],
    };
    updateRoom(nextRoom);
  };

  const handleArcadeComplete = (success: boolean) => {
    if (!room || !currentPlayer) return;
    if (success) {
      const updatedPlayers = room.players.map((p) => {
        if (p.id === currentPlayer.id) {
          return {
            ...p,
            objectives: p.objectives.map((obj) =>
              obj.type === 'PROFESSION' ? { ...obj, isCompleted: true, progress: 1 } : obj
            ),
            stats: { ...p.stats, arcadeGamesWon: p.stats.arcadeGamesWon + 1 },
          };
        }
        return p;
      });

      const nextRoom: GameRoom = { ...room, players: updatedPlayers };
      updateRoom(nextRoom);
    }
  };

  const handleProceedNext = () => {
    if (!room) return;
    if (room.roundIndex >= room.totalRounds) {
      const nextRoom: GameRoom = { ...room, status: 'MATCH_OVER' };
      updateRoom(nextRoom);
      setView('MATCH_OVER');
    } else {
      const nextShopkeeperIndex = room.roundIndex % room.players.length;
      const nextRoom = setupRound(room, room.roundIndex + 1, nextShopkeeperIndex, room.totalRounds);
      updateRoom(nextRoom);
      setView('ROUND_RUNNING');
    }
  };

  const handleRestartMatch = () => {
    if (!room) return;
    const nextRoom: GameRoom = {
      ...room,
      status: 'LOBBY',
      roundIndex: 0,
      currentSettlement: undefined,
    };
    updateRoom(nextRoom);
    setView('LOBBY');
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleExitApp = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setView('HOME');
    setRoom(null);
  };

  const currentShopkeeper = room?.players.find((p) => p.id === room?.currentShopkeeperId) || null;
  const activeCustomers = room ? room.players.filter((p) => p.id !== room.currentShopkeeperId) : [];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Bar Contract (3 Zones) */}
      <header className="flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-3 border-b border-amber-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl select-none">☕</span>
          <button
            onClick={() => setView('HOME')}
            className="text-lg md:text-xl font-black tracking-tight text-amber-800 whitespace-nowrap shrink-0 hover:text-amber-700 transition-colors"
          >
            টংবাজ (TONGBAJ)
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-700">
          <button
            onClick={() => setView('HOME')}
            className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 ${
              view === 'HOME' ? 'text-amber-700 font-bold' : ''
            }`}
          >
            হোম পেজ
          </button>
          <button
            onClick={() => {
              if (room) setView('LOBBY');
              else setView('LOBBY');
            }}
            className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0"
          >
            খেলা শুরু (Game)
          </button>
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0"
          >
            টং কাস্টমাইজ
          </button>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0"
          >
            নিয়মাবলী
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="সেটিংস"
            className="p-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-stone-700 text-xs border border-amber-200 transition-colors shrink-0 shadow-xs"
          >
            ⚙️ <span className="hidden sm:inline">সেটিংস</span>
          </button>

          <button
            onClick={toggleSound}
            title={isMuted ? 'আনমিউট করুন' : 'মিউট করুন'}
            className="p-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-stone-700 text-xs border border-amber-200 transition-colors shrink-0 shadow-xs"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>🧔</span>
              )}
              <span className="text-amber-900 font-bold max-w-[80px] truncate">
                {user.displayName?.split(' ')[0] || 'User'}
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
            >
              লগইন
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 space-y-6">
        {/* VIEW 1: HOME HUB (MAIN MENU, SOLO ARCADE, CUSTOM DOKAN, COMMUNITY DOKANS) */}
        {view === 'HOME' && (
          <HomeHub
            userDokan={userDokan}
            onNewGame={() => setView('LOBBY')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onExit={handleExitApp}
            onPlayArcadeGame={(gameId) => {
              setActiveArcadeGameId(gameId);
              setIsArcadeOpen(true);
            }}
          />
        )}

        {/* VIEW 2: LOBBY */}
        {view === 'LOBBY' && (
          <div className="space-y-4">
            <button
              onClick={() => setView('HOME')}
              className="text-xs text-stone-600 hover:text-amber-800 font-bold flex items-center gap-1"
            >
              ← মূল মেনুতে ফিরুন (Home)
            </button>
            <Lobby
              room={room}
              currentPlayer={currentPlayer || null}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onAddBot={handleAddBot}
              onRemoveBot={handleRemoveBot}
              onStartMatch={handleStartMatch}
            />
          </div>
        )}

        {/* VIEW 3: ROUND RUNNING */}
        {view === 'ROUND_RUNNING' && room && currentPlayer && (
          <div className="space-y-4">
            {/* Top Synchronized Timer HUD */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-stone-600 block font-semibold uppercase">
                    রাউন্ড সময় বাকি
                  </span>
                  <span className="text-xl md:text-2xl font-mono font-black text-amber-800">
                    ⏱️ {formatSeconds(room.remainingSeconds, false)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      রাউন্ড {room.roundIndex}/{room.totalRounds}
                    </span>
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                      ফেজ: {getPhaseTitle(room.phase)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {getPhaseDescription(room.phase)}
                  </p>
                </div>
              </div>

              {/* Player Role Tag */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block">
                    {currentPlayer.name} ({currentPlayer.avatar})
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isShopkeeper
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isSaboteur
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {isShopkeeper
                      ? '🏪 আপনি দোকানদার'
                      : isSaboteur
                      ? '🕵️‍♂️ আপনি গোপন ধান্দাবাজ'
                      : '🧔 আপনি কাস্টমার'}
                  </span>
                </div>
              </div>
            </div>

            {/* Central Tea Stall with Custom Shopkeeper Dokan Styling */}
            <TeaStallIllustration
              currentShopkeeper={currentShopkeeper}
              saboteurState={room.saboteurState}
              activeCustomers={activeCustomers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
              isShopkeeperView={isShopkeeper}
              stallName={isShopkeeper ? userDokan.stallName : 'মায়ের দোয়া টি স্টল'}
              slogan={isShopkeeper ? userDokan.slogan : 'টংবাজ • আসল দেশি কড়াক চা ও গরম সিঙ্গারা'}
              canopyStyle={isShopkeeper ? userDokan.canopyStyle : 'STRIPED_YELLOW'}
            />

            {/* Interactive Dashboards */}
            {isShopkeeper ? (
              <ShopkeeperDashboard
                room={room}
                onBuyPack={handleBuyPack}
                onStartCooking={handleStartCooking}
                onServeProduct={handleServeProduct}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={(id) => setSelectedCustomerId(id)}
              />
            ) : (
              <div className="space-y-4">
                <CustomerDashboard
                  player={currentPlayer}
                  room={room}
                  onPlaceOrder={handlePlaceOrder}
                  onConfirmDelivery={handleConfirmDelivery}
                  onRejectDelivery={handleRejectDelivery}
                  onCancelOrder={handleCancelOrder}
                  onOpenArcade={() => {
                    setActiveArcadeGameId(currentPlayer.assignedMiniGameId || 'calculator');
                    setIsArcadeOpen(true);
                  }}
                />

                {isSaboteur && (
                  <SaboteurPanel
                    saboteurState={room.saboteurState}
                    onFakeOrder={handleFakeOrder}
                    onTriggerRain={handleTriggerRain}
                    onTriggerBlackout={handleTriggerBlackout}
                    onSendTease={handleSendTease}
                  />
                )}
              </div>
            )}

            {/* Chat & Banter */}
            <ChatDrawer
              messages={room.chatMessages}
              currentPlayer={currentPlayer}
              onSendMessage={handleSendMessage}
              onQuickChat={handleQuickChat}
            />
          </div>
        )}

        {/* VIEW 4: SETTLEMENT MODAL */}
        {view === 'ROUND_SETTLEMENT' && room && (
          <SettlementModal
            room={room}
            onProceedNext={handleProceedNext}
            isHost={room.hostId === currentPlayerId}
          />
        )}

        {/* VIEW 5: MATCH OVER LEADERBOARD */}
        {view === 'MATCH_OVER' && room && (
          <MatchEndLeaderboard
            room={room}
            onRestart={handleRestartMatch}
            isHost={room.hostId === currentPlayerId}
          />
        )}
      </main>

      {/* MODAL 1: ARCADE MINI-GAME (AVAILABLE ANYTIME FROM HOME OR ROUND) */}
      {isArcadeOpen && (
        <ArcadeModal
          miniGameId={activeArcadeGameId}
          isOpen={isArcadeOpen}
          onClose={() => setIsArcadeOpen(false)}
          onComplete={handleArcadeComplete}
        />
      )}

      {/* MODAL 2: CUSTOMIZE TONG DOKAN */}
      {isCustomizeOpen && (
        <CustomizeDokanModal
          dokan={userDokan}
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          onSaved={(updated) => setUserDokan(updated)}
        />
      )}

      {/* MODAL 3: SETTINGS & GOOGLE AUTH */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={user}
          onUserChanged={(u) => setUser(u)}
          isMuted={isMuted}
          onToggleMute={toggleSound}
          language={language}
          onChangeLanguage={(l) => setLanguage(l)}
        />
      )}

      {/* MODAL 4: RULES */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-amber-300 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-stone-900 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">📜</span>
                <h3 className="font-bold text-amber-900 text-lg">টংবাজ খেলার বিস্তারিত নিয়মাবলী (Rules)</h3>
              </div>
              <button onClick={() => setIsRulesOpen(false)} className="text-stone-400 hover:text-stone-800 text-lg p-1 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">১. রাউন্ডের ৫টি ধাপ (৩ মিনিটের টাইমলাইন):</h4>
                <ul className="list-disc pl-4 space-y-1 text-stone-600 text-[11px]">
                  <li><strong className="text-stone-800">০০:০০–০০:৩০ (মালামাল ক্রয়):</strong> দোকানদার ৳২০০ নিয়ে পাইকারি প্যাকেট কেনেন (দুধ চা ৳৪০, রং চা ৳২০, লেবু চা ৳৩০, বিস্কুট ৳১৫, সিঙ্গারা ৳৩০)। প্রতি প্যাকেটে ৫ পরিবেশন।</li>
                  <li><strong className="text-stone-800">০০:৩০–০১:৩০ (মূল খেলা):</strong> কাস্টমাররা অর্ডার দেন, অগ্রিম এসক্রো জমা হয়। দোকানদারের বোর্ডে অর্ডার মাত্র ৫ সেকেন্ড থাকে! কাস্টমাররা আর্কেড গেম খেলেন।</li>
                  <li><strong className="text-stone-800">০১:৩০–০২:০০ (ধান্দাবাজি ও মিশন):</strong> গোপন ধান্দাবাজ বৃষ্টি, লোডশেডিং ও ফেক অর্ডার পাঠিয়ে বিভ্রান্ত করে।</li>
                  <li><strong className="text-stone-800">০২:০০–০২:৩০ (শেষ চেষ্টা):</strong> নতুন অর্ডার বন্ধ, আগের অর্ডার তৈরি ও পরিবেশন।</li>
                  <li><strong className="text-stone-800">০২:৩০–০৩:০০ (হিসাব-নিকাশ):</strong> ডেলিভারি যাচাই, ক্যানসেল জরিমানা ও নীট লাভ হিসাব।</li>
                </ul>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">২. নীট মুনাফা সূত্র (Business Accounting):</h4>
                <p className="text-[11px] text-stone-600">
                  নীট লাভ = বিক্রয় আয় + ক্যানসেল ক্ষতিপূরণ + অবশিষ্ট ক্যাশ + অবিক্রিত মজুদ মূল্য (পাইকারি দর) − প্রারম্ভিক মূলধন (৳২০০)।
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">৩. গোপন ধান্দাবাজ ও কাস্টমার মিশন:</h4>
                <p className="text-[11px] text-stone-600">
                  একজন কাস্টমার গোপনে ধান্দাবাজ হন। তিনি ধরা না পড়ে বিশৃঙ্খলা ঘটালে বাড়তি পয়েন্ট পান। কাস্টমাররা সঠিক ডেলিভারি ও আর্কেড জিতে ১৭ পয়েন্ট পর্যন্ত নিতে পারেন।
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRulesOpen(false)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              বুঝেছি! (Got it)
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: EXIT CONFIRMATION DIALOG */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-red-300 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-stone-900 space-y-3 text-center">
            <span className="text-4xl">🚪</span>
            <h4 className="font-bold text-red-700 text-base">টং থেকে প্রস্থান করবেন?</h4>
            <p className="text-xs text-stone-600">
              আপনি কি খেলা বা সক্রিয় সেশন ছেড়ে হোম পেজে ফিরে যেতে চান?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold border border-stone-200"
              >
                না, থাকব
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                হ্যাঁ, বের হন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getPhaseTitle(phase: string): string {
  switch (phase) {
    case 'PROCUREMENT': return 'মালামাল ক্রয় (00:00–00:30)';
    case 'MAIN_GAMEPLAY': return 'মূল খেলা ও অর্ডার (00:30–01:30)';
    case 'MISSION_TIME': return 'মিশন ও তোলপাড় (01:30–02:00)';
    case 'FINAL_FULFILMENT': return 'শেষ ডেলিভারি (02:00–02:30)';
    case 'SETTLEMENT': return 'হিসাব-নিকাশ (02:30–03:00)';
    default: return 'খেলা চলমান';
  }
}

function getPhaseDescription(phase: string): string {
  switch (phase) {
    case 'PROCUREMENT': return 'দোকানদার পাইকারি মালামাল কিনছেন। কাস্টমাররা মেনু পর্যালোচনা করছেন।';
    case 'MAIN_GAMEPLAY': return 'অর্ডার শুরু হয়েছে! ৫ সেকেন্ডে স্মৃতিতে রাখুন। আর্কেড গেম খেলুন।';
    case 'MISSION_TIME': return 'গোপন মিশন পূরণ করুন। বৃষ্টি ও লোডশেডিংয়ের ঝুঁকি সামলান!';
    case 'FINAL_FULFILMENT': return 'নতুন অর্ডার বন্ধ! শুধু আগের অর্ডার পরিবেশন করা হচ্ছে।';
    case 'SETTLEMENT': return 'ডেলিভারি নিশ্চিত করুন ও দোকানের লাভ-ক্ষতি হিসাব মিলান।';
    default: return '';
  }
}
