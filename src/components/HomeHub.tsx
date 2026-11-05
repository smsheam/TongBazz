/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserTongDokan, getCommunityDokans } from '../services/firebase';
import { MINI_GAMES, PRODUCTS } from '../data/gameData';
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
    BLUE_TIN: 'from-sky-600 via-sky-500 to-sky-700',
    GREEN_RED: 'from-emerald-600 via-red-500 to-emerald-700',
    BAMBOO_THATCH: 'from-yellow-700 via-amber-600 to-yellow-800',
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-2 px-3 text-stone-900">
      {/* SECTION 1: HERO & MAIN MENU */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Brand & Main Menu Buttons */}
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full text-xs font-semibold text-amber-900">
              ☕ খাঁটি দেশি আড্ডা ও মাল্টিপ্লেয়ার পার্টি গেম
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-amber-800 tracking-tight">
              টংবাজ (TONGBAJ)
            </h1>
            <p className="text-xs md:text-sm text-stone-600 font-medium max-w-md">
              চা খাও, ধান্দা করো, টং জমাও! ৩ মিনিটের লড়াই, ৫টি খাঁটি আইটেম, ১০টি আর্কেড গেম এবং গোপন গোলমালবাজ।
            </p>

            {/* MANDATORY MAIN MENU BUTTONS */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  sound.playKettleWhistle();
                  onNewGame();
                }}
                className="py-2.5 px-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-md transition-transform hover:scale-105 flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-base">🎮</span>
                <span>New Game</span>
                <span className="text-[9px] font-normal opacity-85">(নতুন খেলা)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenCustomize();
                }}
                className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-base">🛠️</span>
                <span>Customize</span>
                <span className="text-[9px] font-normal text-stone-500">(টং দোকান)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenRules();
                }}
                className="py-2.5 px-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-base">📜</span>
                <span>Rules</span>
                <span className="text-[9px] font-normal text-stone-500">(নিয়মাবলী)</span>
              </button>

              <button
                onClick={() => {
                  sound.playRickshawBell();
                  onOpenSettings();
                }}
                className="py-2.5 px-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-base">⚙️</span>
                <span>Settings</span>
                <span className="text-[9px] font-normal text-stone-500">(সেটিংস)</span>
              </button>

              <button
                onClick={onExit}
                className="py-2.5 px-2 bg-stone-100 hover:bg-red-50 text-red-700 border border-red-200 font-bold rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-0.5 col-span-2 sm:col-span-1"
              >
                <span className="text-base">🚪</span>
                <span>Exit</span>
                <span className="text-[9px] font-normal text-stone-500">(প্রস্থান)</span>
              </button>
            </div>
          </div>

          {/* Right: Player's Own Dokan Card */}
          <div className="w-full lg:w-64 bg-[#FFF8F0] border-2 border-amber-300 rounded-2xl p-3 shadow-sm shrink-0 text-center">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200 mb-1.5">
              <span className="text-[10px] font-bold text-amber-900">🏪 আপনার নিজস্ব টং</span>
              <button onClick={onOpenCustomize} className="text-[9px] text-amber-700 hover:underline">
                সাজান ✎
              </button>
            </div>

            <div
              className={`h-5 rounded-t-lg bg-gradient-to-r ${
                CANOPY_CLASSES[userDokan.canopyStyle] || CANOPY_CLASSES.STRIPED_YELLOW
              } flex items-center justify-center text-[10px] font-bold text-white shadow-2xs`}
            >
              {userDokan.stallName}
            </div>

            <div className="p-2 flex flex-col items-center">
              <div className="relative">
                <img
                  src="/assets/aistudio/image_62254eee.png"
                  alt="My Dokan"
                  className="w-16 h-16 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 text-base">{userDokan.avatar}</span>
              </div>
              <p className="text-xs font-bold text-stone-900 mt-1">{userDokan.specialtyItem}</p>
              <p className="text-[10px] text-stone-500 italic line-clamp-1">"{userDokan.slogan}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 5 PRODUCTS MENU SHOWCASE */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-amber-100">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            ☕ টংয়ের ৫টি আসল প্রোডাক্ট (খুচরা ও পাইকারি)
          </span>
          <span className="text-[10px] text-amber-800 font-mono font-bold">
            দোকানদার মূলধন: ৳২০০
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-2 text-center">
              <span className="text-xl block">{p.icon}</span>
              <h4 className="font-bold text-stone-800 mt-0.5">{p.nameBn}</h4>
              <p className="text-[10px] text-emerald-700 font-bold font-mono">খুচরা: ৳{p.retailPrice}</p>
              <p className="text-[9px] text-stone-500 mt-0.5">
                প্যাক: ৳{p.packCost} ({p.yieldCount}টি)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SOLO ARCADE HUB (ANYONE CAN PLAY INDEPENDENTLY) */}
      <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-amber-100 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🕹️</span>
            <div>
              <h2 className="text-base font-bold text-amber-900">
                মুক্ত আর্কেড জোন (Solo Arcade Hub)
              </h2>
              <p className="text-[11px] text-stone-500">
                ম্যাচ ছাড়াও যেকোনো সময় এককভাবে ১০টি আর্কেড গেম খেলে পয়েন্ট তুলুন!
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            ১০টি মিনি-গেম
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {MINI_GAMES.map((game, idx) => (
            <div
              key={game.id}
              className="bg-[#FFF8F0] border border-amber-200 hover:border-amber-400 rounded-xl p-2.5 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700">#{idx + 1}</span>
                  <span className="text-base">{game.icon}</span>
                </div>
                <h3 className="font-bold text-stone-800 text-[11px]">{game.nameBn}</h3>
                <p className="text-[9px] text-stone-500 line-clamp-2 mt-0.5">{game.descriptionBn}</p>
              </div>

              <div className="mt-2">
                <button
                  onClick={() => {
                    sound.playTeaPour();
                    onPlayArcadeGame(game.id);
                  }}
                  className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[10px] shadow-2xs"
                >
                  খেলুন ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: COMMUNITY DOKANS */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🏪</span>
            <h2 className="text-xs font-bold text-stone-800">
              এলাকার জনপ্রিয় টং দোকানসমূহ (Community Dokans)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {communityDokans.map((dokan) => (
            <div
              key={dokan.id}
              className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-2.5 space-y-1"
            >
              <div
                className={`h-4 rounded bg-gradient-to-r ${
                  CANOPY_CLASSES[dokan.canopyStyle] || CANOPY_CLASSES.STRIPED_YELLOW
                } flex items-center justify-center text-[9px] font-bold text-white`}
              >
                {dokan.stallName}
              </div>

              <div className="pt-1 flex items-center gap-1.5">
                <span className="text-lg">{dokan.avatar}</span>
                <div className="truncate">
                  <h3 className="font-bold text-stone-900 text-[11px] truncate">
                    {dokan.displayName}
                  </h3>
                  <p className="text-[10px] text-amber-800 font-semibold truncate">
                    {dokan.specialtyItem}
                  </p>
                </div>
              </div>

              <p className="text-[9px] text-stone-500 italic truncate">"{dokan.slogan}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
