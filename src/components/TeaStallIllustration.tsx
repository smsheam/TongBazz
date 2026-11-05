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
    STRIPED_YELLOW: 'from-amber-500 via-amber-400 to-amber-600',
    BLUE_TIN: 'from-sky-600 via-sky-500 to-sky-700',
    GREEN_RED: 'from-emerald-600 via-red-500 to-emerald-700',
    BAMBOO_THATCH: 'from-yellow-700 via-amber-600 to-yellow-800',
  };

  const activeGradient =
    canopyStyle && CANOPY_GRADIENTS[canopyStyle]
      ? CANOPY_GRADIENTS[canopyStyle]
      : 'from-amber-600 via-amber-500 to-amber-700';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-lg ${
        isBlackout
          ? 'bg-[#18181b] border-zinc-800 brightness-50'
          : isRain
          ? 'bg-[#E0F2FE] border-sky-300'
          : 'bg-[#FFFBEB] border-amber-200'
      }`}
    >
      {/* Blackout Flicker Overlay */}
      {isBlackout && (
        <div className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center pointer-events-none animate-pulse">
          <div className="text-center p-4">
            <span className="text-4xl animate-bounce">🕯️</span>
            <p className="mt-2 text-amber-300 font-bold text-lg">কারেন্ট চলে গেছে! (লোডশেডিং)</p>
            <p className="text-xs text-amber-100/70">দোকানদার অন্ধকারে হাতড়ে কাজ করছেন...</p>
          </div>
        </div>
      )}

      {/* Rain Effect Overlay */}
      {isRain && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 rain-container opacity-80">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="rain-drop absolute bg-gradient-to-b from-transparent via-cyan-400 to-blue-600 w-[1.5px] rounded-full"
                style={{
                  left: `${(i * 4.2) % 100}%`,
                  top: `-${Math.random() * 20}%`,
                  height: `${22 + Math.random() * 30}px`,
                  animationDuration: `${0.45 + (i % 4) * 0.1}s`,
                  animationDelay: `${(i * 0.06) % 0.6}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-cyan-100 px-3 py-0.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 z-40">
            <span className="animate-pulse">🌧️</span> ঝুম বৃষ্টি নামল! অতিরিক্ত চা অর্ডার করার সুযোগ!
          </div>
        </div>
      )}

      {/* Top Banner Signboard */}
      <div className="pt-2 px-4 text-center">
        <div
          className={`inline-block bg-gradient-to-r ${activeGradient} text-white px-4 py-1.5 rounded-xl shadow-md border border-white/30`}
        >
          <h2 className="text-base md:text-lg font-black tracking-tight drop-shadow">
            ☕ {stallName || 'মায়ের দোয়া টি স্টল'}
          </h2>
          <p className="text-[10px] md:text-xs text-amber-100 font-medium">
            {slogan || 'টংবাজ • আসল দেশি কড়াক চা ও গরম সিঙ্গারা'}
          </p>
        </div>
      </div>

      {/* Main Center Stage: Tea Stall Visuals & Seated Customers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 py-2">
        {/* Center: The Illustrated Tea Stall */}
        <div className="relative w-48 sm:w-60 h-48 sm:h-60 flex items-center justify-center shrink-0">
          <img
            src="/assets/aistudio/image_62254eee.png"
            alt="Bangladeshi Tea Stall Shopkeeper"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.15)] select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Steaming Kettle Audio Trigger */}
          <button
            onClick={() => sound.playKettleWhistle()}
            title="গরম কেটলি (ক্লিক করুন শব্দ শুনতে!)"
            className="absolute bottom-12 right-2 bg-white/90 hover:bg-white p-1 rounded-lg border border-amber-300 shadow-sm transition-transform hover:scale-105 flex items-center gap-1"
          >
            <span className="text-lg">🫖</span>
            <span className="text-[9px] font-bold text-amber-800">গরম কেটলি</span>
          </button>

          {/* Shopkeeper Tag */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-amber-700 text-white rounded-full px-3 py-0.5 text-center shadow">
            <p className="text-[10px] font-bold whitespace-nowrap">
              {currentShopkeeper ? `${currentShopkeeper.name} (দোকানদার)` : 'মামা (দোকানদার)'}
            </p>
          </div>
        </div>

        {/* Right / Seated Customers on Benches */}
        <div className="w-full sm:w-64 bg-white/80 border border-amber-200 rounded-2xl p-2.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-amber-100">
            <span className="text-xs font-bold text-stone-800">🪑 টংয়ের আড্ডাবাজ</span>
            <span className="text-[10px] text-amber-800 font-mono font-bold">
              {activeCustomers.length} জন কাস্টমার
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
            {activeCustomers.map((cust) => {
              const isSelected = selectedCustomerId === cust.id;
              return (
                <button
                  key={cust.id}
                  onClick={() => onSelectCustomer && onSelectCustomer(cust.id)}
                  className={`w-full text-left p-1.5 rounded-xl border transition-all flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 shadow-xs ring-1 ring-amber-500'
                      : 'bg-[#FFF8F0] border-amber-200/80 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-lg shrink-0">{cust.avatar}</span>
                    <span className="text-xs font-semibold text-stone-800 truncate">
                      {cust.name} {cust.isBot ? '🤖' : ''}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-700 shrink-0">
                    ৳{cust.personalWallet}
                  </span>
                </button>
              );
            })}
          </div>

          {isShopkeeperView && (
            <p className="mt-1.5 text-[9px] text-amber-800 text-center bg-amber-50 py-0.5 rounded border border-amber-200">
              👉 খাবার পরিবেশন করতে কাস্টমারে ক্লিক করুন
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
