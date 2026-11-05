/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, SaboteurState } from '../types/game';
import { sound } from '../utils/audio';

interface TeaStallProps {
  currentShopkeeper: Player | null;
  saboteurState: SaboteurState;
  activeCustomers: Player[];
  selectedCustomerId?: string;
  onSelectCustomer?: (customerId: string) => void;
  isShopkeeperView?: boolean;
  stallName?: string;
  slogan?: string;
  canopyStyle?: string;
}

export const TeaStallIllustration: React.FC<TeaStallProps> = ({
  currentShopkeeper,
  saboteurState,
  activeCustomers,
  selectedCustomerId,
  onSelectCustomer,
  isShopkeeperView,
  stallName,
  slogan,
  canopyStyle,
}) => {
  const isRain = saboteurState.isRainActive;
  const isBlackout = saboteurState.isBlackoutActive;

  const CANOPY_GRADIENTS: Record<string, string> = {
    STRIPED_YELLOW: 'from-amber-600 via-amber-500 to-amber-700',
    BLUE_TIN: 'from-sky-700 via-sky-600 to-sky-800',
    GREEN_RED: 'from-emerald-700 via-red-600 to-emerald-800',
    BAMBOO_THATCH: 'from-yellow-800 via-amber-700 to-yellow-900',
  };

  const activeGradient = canopyStyle && CANOPY_GRADIENTS[canopyStyle] ? CANOPY_GRADIENTS[canopyStyle] : 'from-amber-700 via-amber-600 to-amber-700';

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-amber-950/40 shadow-2xl transition-all duration-500 ${
        isBlackout ? 'bg-[#090b10] brightness-50 contrast-125' : isRain ? 'bg-[#182635]' : 'bg-[#1d222d]'
      }`}
      style={{ minHeight: '380px' }}
    >
      {/* Blackout Flicker Effect */}
      {isBlackout && (
        <div className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center pointer-events-none animate-pulse">
          <div className="text-center p-4">
            <span className="text-4xl animate-bounce">🕯️</span>
            <p className="mt-2 text-amber-300 font-bold text-lg font-sans">
              কারেন্ট চলে গেছে! (লোডশেডিং)
            </p>
            <p className="text-xs text-amber-200/70">দোকানদার অন্ধকারে হাতড়ে কাজ করছেন...</p>
          </div>
        </div>
      )}

      {/* Rain Effect Overlay */}
      {isRain && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[0.5px]" />
          {/* Animated rain lines */}
          <div className="absolute inset-0 rain-container opacity-70">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="rain-drop absolute bg-gradient-to-b from-transparent via-cyan-200 to-white w-[1.5px] rounded-full"
                style={{
                  left: `${(i * 3.7) % 100}%`,
                  top: `-${Math.random() * 20}%`,
                  height: `${20 + Math.random() * 35}px`,
                  animationDuration: `${0.45 + (i % 5) * 0.1}s`,
                  animationDelay: `${(i * 0.05) % 0.6}s`,
                }}
              />
            ))}
          </div>
          {/* Rain banner indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-950/90 text-cyan-200 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/40 shadow-lg flex items-center gap-1.5 z-40">
            <span className="animate-pulse">🌧️</span> ঝুম বৃষ্টি নামল! কাস্টমারদের অতিরিক্ত গরম চায়ের ধুম!
          </div>
        </div>
      )}

      {/* Background Ambience: Roadside Street with hanging cables & lamp */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/60 via-slate-900/80 to-[#1d222d]" />
        
        <svg className="absolute top-0 left-0 w-full h-16 opacity-30 stroke-slate-500 fill-none" preserveAspectRatio="none" viewBox="0 0 400 60">
          <path d="M0,5 Q100,35 200,10 T400,20" strokeWidth="1" />
          <path d="M0,15 Q150,45 300,15 T400,30" strokeWidth="1" />
          <path d="M0,0 Q80,25 220,15 T400,10" strokeWidth="0.8" />
        </svg>

        <div className="absolute top-4 left-4 bg-amber-900/40 border border-amber-600/30 rounded p-1 text-[9px] text-amber-200/70 rotate-[-4deg]">
          🎬 সিনেমা: টংয়ের নবাব
        </div>
      </div>

      {/* Top Banner Signboard */}
      <div className="relative z-10 pt-3 pb-1 text-center">
        <div className={`inline-block bg-gradient-to-r ${activeGradient} text-amber-50 px-5 py-1.5 rounded-lg shadow-md border-2 border-amber-400/50`}>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow">
            ☕ {stallName || 'মায়ের দোয়া টি স্টল'}
          </h2>
          <p className="text-[10px] md:text-xs text-amber-100 font-medium tracking-wide">
            {slogan || 'টংবাজ • আসল দেশি কড়াক চা ও গরম সিঙ্গারা'}
          </p>
        </div>
      </div>

      {/* Main Center Stage: Tea Stall Visuals */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 px-4 py-2">
        {/* Left Hand Menu Blackboard & Side Snacks */}
        <div className="hidden lg:flex flex-col items-center gap-2 w-48 shrink-0">
          <div className="w-full bg-[#13171e] border-2 border-amber-900/60 rounded-xl p-3 shadow-inner">
            <div className="text-center border-b border-amber-800/40 pb-1 mb-2">
              <span className="text-xs font-bold text-amber-400">📋 খাঁটি মেনু</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 font-mono">
              <li className="flex justify-between">
                <span>দুধ চা</span> <span className="text-amber-400 font-bold">৳১৫</span>
              </li>
              <li className="flex justify-between">
                <span>রং চা</span> <span className="text-amber-400 font-bold">৳১০</span>
              </li>
              <li className="flex justify-between">
                <span>মালাই চা</span> <span className="text-amber-400 font-bold">৳৩৫</span>
              </li>
              <li className="flex justify-between">
                <span>লেবু চা</span> <span className="text-amber-400 font-bold">৳১৫</span>
              </li>
              <li className="flex justify-between border-t border-slate-700/60 pt-1">
                <span>সিঙ্গারা/সমুচা</span> <span className="text-amber-400 font-bold">৳১০/১৫</span>
              </li>
              <li className="flex justify-between">
                <span>বনরুটি/কলা</span> <span className="text-amber-400 font-bold">৳১০/৫</span>
              </li>
            </ul>
          </div>

          {/* Biscuit Jars & Bananas visual box */}
          <div className="w-full flex items-center justify-around bg-amber-950/30 border border-amber-800/30 rounded-lg p-2 text-xl">
            <span title="বিস্কুট বয়াম" className="cursor-pointer hover:scale-110 transition-transform">🍪🫙</span>
            <span title="কলার ছড়া" className="cursor-pointer hover:scale-110 transition-transform">🍌</span>
            <span title="বনরুটি" className="cursor-pointer hover:scale-110 transition-transform">🍞</span>
          </div>
        </div>

        {/* Center: The Official Illustrated Tea Stall & Shopkeeper */}
        <div className="relative w-64 md:w-80 h-72 md:h-88 flex items-center justify-center shrink-0">
          {/* Main User Reference Photo */}
          <img
            src="/assets/aistudio/image_62254eee.png"
            alt="Bangladeshi Tea Stall Shopkeeper"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Interactive Steaming Kettle Animation on Counter */}
          <div
            onClick={() => {
              sound.playKettleWhistle();
            }}
            title="গরম কেটলি (ক্লিক করুন শব্দ শুনতে!)"
            className="absolute bottom-16 right-4 cursor-pointer group bg-black/40 hover:bg-black/60 p-1.5 rounded-lg border border-amber-500/40 backdrop-blur-xs transition-transform hover:scale-105"
          >
            <div className="relative flex items-center gap-1">
              <span className="text-2xl group-hover:rotate-[-6deg] transition-transform">🫖</span>
              <span className="text-[10px] text-amber-300 font-bold">গরম কেটলি</span>
              {/* Steaming particles */}
              <div className="absolute -top-4 left-2 flex gap-1 pointer-events-none">
                <span className="text-xs text-white/80 animate-ping">♨️</span>
              </div>
            </div>
          </div>

          {/* Shopkeeper Name Badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-amber-500/50 rounded-full px-3 py-0.5 text-center shadow-lg">
            <p className="text-xs font-bold text-amber-300 whitespace-nowrap">
              {currentShopkeeper ? `${currentShopkeeper.name} (দোকানদার)` : 'মামা (দোকানদার)'}
            </p>
          </div>
        </div>

        {/* Right Hand: Seated Customers on Plastic Chairs & Benches */}
        <div className="w-full md:w-72 flex flex-col gap-2">
          <div className="bg-[#141822] border border-slate-700/60 rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">🪑 টংয়ের বেঞ্চের আড্ডাবাজ</span>
              <span className="text-[10px] text-slate-400">
                {activeCustomers.length} জন গ্রাহক
              </span>
            </div>

            {/* Customers list / seats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {activeCustomers.map((cust) => {
                const isSelected = selectedCustomerId === cust.id;
                return (
                  <button
                    key={cust.id}
                    onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0 p-1 bg-slate-900/60 rounded-md">
                        {cust.avatar || '🧔'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {cust.name} {cust.isBot ? '🤖' : ''}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {cust.professionId ? 'কাস্টমার' : 'গ্রাহক'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ৳{cust.personalWallet}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isShopkeeperView && (
              <p className="mt-2 text-[10px] text-amber-300 text-center bg-amber-950/40 py-1 rounded border border-amber-800/30">
                👉 প্রস্তুত পণ্য পরিবেশন করতে কাস্টমারের নামের ওপর ক্লিক করুন!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
