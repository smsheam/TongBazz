/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserTongDokan, getCommunityDokans } from '../services/firebase';
import { MINI_GAMES } from '../data/gameData';
import { sound } from '../utils/audio';

interface HomeHubProps {
  userDokan: UserTongDokan;
  onNewGame: () => void;
  onOpenSettings: () => void;
  onOpenCustomize: () => void;
  onOpenRules: () => void;
  onExit: () => void;
  onPlayArcadeGame: (gameId: string) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  userDokan,
  onNewGame,
  onOpenSettings,
  onOpenCustomize,
  onOpenRules,
  onExit,
  onPlayArcadeGame,
}) => {
  const [communityDokans, setCommunityDokans] = useState<UserTongDokan[]>([]);

  useEffect(() => {
    getCommunityDokans().then((dokans) => {
      setCommunityDokans(dokans);
    });
  }, []);

  const CANOPY_CLASSES: Record<string, string> = {
    STRIPED_YELLOW: 'from-amber-500 via-amber-400 to-amber-600',
    BLUE_TIN: 'from-sky-700 via-sky-600 to-sky-800',
    GREEN_RED: 'from-emerald-700 via-red-600 to-emerald-800',
    BAMBOO_THATCH: 'from-yellow-800 via-amber-700 to-yellow-900',
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-4 px-3">
      {/* SECTION 1: HERO & MAIN MENU */}
      <div className="bg-[#141822] border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Brand & Main Menu Buttons */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              ☕ খাঁটি দেশি আড্ডা ও মাল্টিপ্লেয়ার পার্টি গেম
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
              টংবাজ (TONGBAJ)
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium">
              চা খাও, ধান্দা করো, টং জমাও! ৩ মিনিটের লড়াই, ১০টি আর্কেড গেম এবং গোপন ধান্দাবাজ।
            </p>

            {/* MANDATORY MAIN MENU BUTTONS */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              <button
                onClick={() => {
                  sound.playKettleWhistle();
                  onNewGame();
                }}
                className="py-3 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-transform hover:scale-105 flex flex-col items-center justify-center gap-1"
              >
                <span className="text-lg">🎮</span>
                <span>New Game</span>
                <span className="text-[9px] font-normal opacity-80">(নতুন খেলা)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenCustomize();
                }}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 hover:border-amber-400"
              >
                <span className="text-lg">🛠️</span>
                <span>Customize</span>
                <span className="text-[9px] font-normal text-slate-400">(টং দোকান)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenRules();
                }}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 hover:text-white"
              >
                <span className="text-lg">📜</span>
                <span>Rules</span>
                <span className="text-[9px] font-normal text-slate-400">(নিয়মাবলী)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenSettings();
                }}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 hover:text-white"
              >
                <span className="text-lg">⚙️</span>
                <span>Settings</span>
                <span className="text-[9px] font-normal text-slate-400">(সেটিংস)</span>
              </button>

              <button
                onClick={onExit}
                className="py-3 px-3 bg-slate-900 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-900/40 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1"
              >
                <span className="text-lg">🚪</span>
                <span>Exit</span>
                <span className="text-[9px] font-normal text-slate-400">(প্রস্থান)</span>
              </button>
            </div>
          </div>

          {/* Right: Player's Own Customized Tong Dokan Preview Card */}
          <div className="w-full lg:w-72 bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl shrink-0 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-[11px] font-bold text-amber-300">🏪 আপনার নিজস্ব টং</span>
              <button
                onClick={onOpenCustomize}
                className="text-[10px] text-amber-400 hover:underline"
              >
                পরিবর্তন করুন ✎
              </button>
            </div>

            <div
              className={`h-6 rounded-t-lg bg-gradient-to-r ${
                CANOPY_CLASSES[userDokan.canopyStyle] || CANOPY_CLASSES.STRIPED_YELLOW
              } flex items-center justify-center text-[10px] font-bold text-white shadow`}
            >
              {userDokan.stallName}
            </div>

            <div className="p-2 flex flex-col items-center">
              <div className="relative">
                <img
                  src="/assets/aistudio/image_62254eee.png"
                  alt="My Dokan"
                  className="w-20 h-20 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-1 text-xl">{userDokan.avatar}</span>
              </div>
              <p className="text-xs font-bold text-white mt-1">{userDokan.specialtyItem}</p>
              <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                "{userDokan.slogan}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SOLO ARCADE HUB (ANYONE CAN PLAY INDEPENDENTLY) */}
      <div className="bg-[#141822] border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <div>
              <h2 className="text-lg font-bold text-amber-400">
                মুক্ত আর্কেড জোন (Solo Arcade Hub)
              </h2>
              <p className="text-xs text-slate-400">
                যেকোনো সময় এককভাবে ১০টি গেম খেলে হাত পাকান ও নিজের সেরা স্কোর গড়ুন!
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            ১০টি মিনি-গেম প্রস্তুত
          </span>
        </div>

        {/* 10 Mini-Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MINI_GAMES.map((game, idx) => (
            <div
              key={game.id}
              className="bg-slate-800/70 border border-slate-700 hover:border-amber-500/60 rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-amber-400">#{idx + 1}</span>
                  <span className="text-xl">{getGameEmoji(game.id)}</span>
                </div>
                <h3 className="font-bold text-slate-100 text-xs">{game.nameBn}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{game.descriptionBn}</p>
              </div>

              <div className="mt-3">
                <button
                  onClick={() => {
                    sound.playTeaPour();
                    onPlayArcadeGame(game.id);
                  }}
                  className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold rounded-xl text-[11px] border border-amber-500/40 transition-colors"
                >
                  খেলুন (Play) ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: COMMUNITY TONG DOKANS (SEE OTHER PLAYERS' TONG DOKANS) */}
      <div className="bg-[#141822] border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <h2 className="text-lg font-bold text-slate-200">
                এলাকার জনপ্রিয় টং দোকানসমূহ (Community Dokans)
              </h2>
              <p className="text-xs text-slate-400">
                অন্যান্য খেলোয়াড়দের কাস্টমাইজ করা টং ও তাদের সিগনেচার চায়ের মেনু।
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {communityDokans.map((dokan) => (
            <div
              key={dokan.id}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`h-5 rounded-t-lg bg-gradient-to-r ${
                    CANOPY_CLASSES[dokan.canopyStyle] || CANOPY_CLASSES.STRIPED_YELLOW
                  } flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {dokan.stallName}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg">{dokan.avatar}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{dokan.displayName}</h3>
                    <p className="text-[10px] text-amber-400 font-semibold">{dokan.specialtyItem}</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic mt-1.5">"{dokan.slogan}"</p>
              </div>

              <div className="border-t border-slate-700/60 pt-2 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>ম্যাচ: {dokan.totalMatchesPlayed}</span>
                <span className="text-emerald-400 font-bold">সেরা লাভ: ৳{dokan.bestProfit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getGameEmoji(id: string): string {
  switch (id) {
    case 'calculator': return '🧮';
    case 'memory': return '🧠';
    case 'pipes': return '🚰';
    case 'traffic': return '🚦';
    case 'wordsearch': return '🔍';
    case 'sorting': return '📦';
    case 'emergency': return '🧯';
    case 'maze': return '🗺️';
    case 'pattern': return '🔢';
    case 'detective': return '🕵️';
    default: return '🎯';
  }
}
