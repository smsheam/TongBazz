/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, GameRoom, OrderItem } from '../types/game';
import { MENU_ITEMS, PROFESSIONS, FUNNY_CANCELLATION_EXCUSES } from '../data/gameData';
import { generateBanglaOrderSentence, formatTaka } from '../utils/bangla';
import { sound } from '../utils/audio';

interface CustomerDashboardProps {
  player: Player;
  room: GameRoom;
  onPlaceOrder: (items: OrderItem[], sentence: string, totalBill: number) => void;
  onConfirmDelivery: (orderId: string) => void;
  onRejectDelivery: (orderId: string) => void;
  onCancelOrder: (orderId: string, excuse: string) => void;
  onOpenArcade: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  player,
  room,
  onPlaceOrder,
  onConfirmDelivery,
  onRejectDelivery,
  onCancelOrder,
  onOpenArcade,
}) => {
  const isProcurement = room.phase === 'PROCUREMENT';
  const remainingProcurementTime = Math.max(0, 30 - Math.floor((Date.now() - room.roundStartTime) / 1000));
  
  // Selected order items in cart
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCancellationModal, setShowCancellationModal] = useState<boolean>(false);
  const [selectedExcuse, setSelectedExcuse] = useState<string>(FUNNY_CANCELLATION_EXCUSES[0]);

  // Current customer active order
  const activeOrder = room.activeOrders.find(
    (o) => o.customerId === player.id && o.phase !== 'CONFIRMED' && o.phase !== 'CANCELLED'
  );

  // Escrow amount currently reserved
  const escrowAmount = activeOrder ? activeOrder.totalBill : 0;

  // Calculate cart items array and total
  const cartItems: OrderItem[] = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([itemId, quantity]) => {
      const m = MENU_ITEMS.find((item) => item.id === itemId);
      return {
        itemId,
        quantity,
        itemPrice: m ? m.price : 0,
      };
    });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const generatedBangla = generateBanglaOrderSentence(cartItems);

  // Handlers for cart
  const handleQuantityChange = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const handleOrderSubmit = () => {
    if (cartItems.length === 0) return;
    if (player.personalWallet < cartTotal) {
      sound.playBuzzer();
      return;
    }
    onPlaceOrder(cartItems, generatedBangla, cartTotal);
    sound.playCashRegister();
    setCart({});
  };

  const currentProfession = PROFESSIONS.find((p) => p.id === player.professionId) || PROFESSIONS[0];

  return (
    <div className="w-full space-y-4">
      {/* Top Customer Info Bar */}
      <div className="bg-[#151922] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-1 bg-slate-800 rounded-xl">{player.avatar}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">{player.name}</h3>
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">
                {currentProfession.nameBn}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 italic">{currentProfession.loreBn}</p>
          </div>
        </div>

        {/* Escrow and Wallet meters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">মানিব্যাগ (Wallet)</span>
            <span className="text-emerald-400 font-bold text-sm">{formatTaka(player.personalWallet)}</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">এসক্রো জমা (Escrow)</span>
            <span className="text-amber-400 font-bold text-sm">{formatTaka(escrowAmount)}</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 block text-[10px]">সুনাম (Reputation)</span>
            <span className="text-yellow-400 font-bold text-sm">⭐ {player.reputation}/১০</span>
          </div>
        </div>
      </div>

      {/* Main Customer Grid: Menu & Cart vs Objectives & Mini-game */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Digital Tea Stall Menu (7 Cols) */}
        <div className="lg:col-span-7 bg-[#151922] border border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h4 className="font-bold text-slate-100 text-base">টংয়ের ডিজিটাল মেনু</h4>
              </div>
              {isProcurement && (
                <span className="text-xs text-amber-400 font-mono animate-pulse">
                  ⏳ অর্ডার শুরু হবে: {remainingProcurementTime}s
                </span>
              )}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {MENU_ITEMS.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {item.category === 'TEA' ? '☕' : '🥐'} {item.nameBn}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-400 font-bold">
                        {formatTaka(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-slate-200 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold font-mono">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-7 h-7 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-bold text-slate-950"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Bill & Auto Bangla sentence */}
          <div className="bg-slate-900/90 border border-amber-600/30 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">অর্ডার প্রিভিউ (Bangla Sentence):</span>
              <span className="font-mono text-amber-300 font-bold">বিল: {formatTaka(cartTotal)}</span>
            </div>

            <p className="text-xs text-amber-200 font-medium italic bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              "{generatedBangla}"
            </p>

            <button
              disabled={isProcurement || cartItems.length === 0 || !!activeOrder}
              onClick={handleOrderSubmit}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                !isProcurement && cartItems.length > 0 && !activeOrder
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer hover:scale-[1.01]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {activeOrder
                ? 'একটি অর্ডার প্রক্রিয়াধীন রয়েছে...'
                : isProcurement
                ? `অর্ডার লক রয়েছে (আর ${remainingProcurementTime} সেকেন্ড)`
                : `অর্ডার দিন (${formatTaka(cartTotal)} অগ্রিম জমা)`}
            </button>
          </div>
        </div>

        {/* Right Column: Private Objectives & Arcade Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Order Status Box (if exists) */}
          {activeOrder && (
            <div className="bg-[#151922] border-2 border-emerald-500/50 rounded-2xl p-3.5 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">📦 আপনার বর্তমান অর্ডার</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  {activeOrder.phase}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic">"{activeOrder.banglaSentence}"</p>

              {/* Delivery confirmation / rejection buttons */}
              {activeOrder.deliveredItems && activeOrder.deliveredItems.length > 0 && (
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 space-y-2 mt-2">
                  <p className="text-[11px] text-amber-300 font-bold">
                    দোকানদার আইটেম পাঠিয়েছেন! গ্রহণ করবেন?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onConfirmDelivery(activeOrder.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      ✓ সঠিক (Confirm)
                    </button>
                    <button
                      onClick={() => onRejectDelivery(activeOrder.id)}
                      className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold"
                    >
                      ✕ ভুল আইটেম (Reject)
                    </button>
                  </div>
                </div>
              )}

              {/* Cancellation trigger */}
              <div className="pt-1">
                <button
                  onClick={() => setShowCancellationModal(true)}
                  className="text-[11px] text-red-400 hover:text-red-300 underline block text-center w-full"
                >
                  অর্ডার বাতিল করতে চান? (পেনাল্টি প্রযোজ্য)
                </button>
              </div>
            </div>
          )}

          {/* Arcade Mini-Game Play Trigger */}
          <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-600/50 rounded-2xl p-3.5 shadow-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🕹️</span>
                <h4 className="font-bold text-amber-300 text-xs">পেশাগত আর্কেড মিনি-গেম</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                ১টি সুযোগ • বিজয়ী হলে +৫ পয়েন্ট!
              </p>
            </div>

            <button
              onClick={onOpenArcade}
              className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow hover:scale-105 transition-all"
            >
              আর্মি গেম খেলুন! 🎯
            </button>
          </div>

          {/* 4 Private Objectives Tracker */}
          <div className="bg-[#151922] border border-slate-700 rounded-2xl p-3.5 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="text-xs font-bold text-slate-200">🎯 আপনার ৪টি গোপন মিশন</span>
              <span className="text-[10px] text-amber-400 font-mono">সর্বোচ্চ +১৭ পয়েন্ট</span>
            </div>

            <div className="space-y-2">
              {player.objectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-2 rounded-xl border text-xs transition-all ${
                    obj.isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{obj.titleBn}</span>
                    <span className="font-mono text-amber-400">+{obj.rewardPoints}pt</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{obj.descriptionBn}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className={obj.isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {obj.isCompleted ? '✓ সম্পন্ন হয়েছে!' : 'চলমান...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funny Cancellation Modal */}
      {showCancellationModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#181d28] border-2 border-red-500/60 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-bold text-red-400 text-sm">অর্ডার বাতিলের শর্ত ও কারণ</h4>
                <p className="text-[11px] text-slate-400">টাকা ফেরত হবে না, ২ সুনাম পয়েন্ট কর্তন হবে!</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">একটি হাসির কারণ বা অজুহাত নির্বাচন করুন:</p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {FUNNY_CANCELLATION_EXCUSES.map((excuse, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExcuse(excuse)}
                  className={`w-full text-left p-2 rounded-lg text-xs border transition-colors ${
                    selectedExcuse === excuse
                      ? 'bg-red-950/60 border-red-500 text-red-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {excuse}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancellationModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
              >
                না, অর্ডার রাখব
              </button>
              <button
                onClick={() => {
                  onCancelOrder(activeOrder.id, selectedExcuse);
                  setShowCancellationModal(false);
                  sound.playBreakingNews();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow"
              >
                হ্যাঁ, বাতিল নিশ্চিত করুন!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
