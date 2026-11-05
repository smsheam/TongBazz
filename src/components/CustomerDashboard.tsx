/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, GameRoom, OrderItem } from '../types/game';
import { PRODUCTS, FUNNY_CANCELLATION_EXCUSES } from '../data/gameData';
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

  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCancellationModal, setShowCancellationModal] = useState<boolean>(false);
  const [selectedExcuse, setSelectedExcuse] = useState<string>(FUNNY_CANCELLATION_EXCUSES[0]);

  // Current customer active order
  const activeOrder = room.activeOrders.find(
    (o) => o.customerId === player.id && o.phase !== 'CONFIRMED' && o.phase !== 'CANCELLED'
  );

  const escrowAmount = activeOrder ? activeOrder.totalBill : 0;

  // Cart items
  const cartItems: OrderItem[] = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, quantity]) => {
      const p = PRODUCTS.find((item) => item.id === productId);
      return {
        productId,
        quantity,
        itemPrice: p ? p.retailPrice : 0,
      };
    });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const generatedBangla = generateBanglaOrderSentence(cartItems);

  const handleQty = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleOrderSubmit = () => {
    if (cartItems.length === 0 || player.personalWallet < cartTotal) {
      sound.playBuzzer();
      return;
    }
    onPlaceOrder(cartItems, generatedBangla, cartTotal);
    sound.playCashRegister();
    setCart({});
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Customer Wallet & Escrow Stats Bar */}
      <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl p-1 bg-amber-50 rounded-xl border border-amber-200">
            {player.avatar}
          </span>
          <div>
            <h3 className="font-bold text-stone-900">{player.name}</h3>
            <p className="text-[10px] text-amber-800 font-medium">কাস্টমার আড্ডাবাজ</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
            <span className="text-stone-500 block text-[9px]">মানিব্যাগ</span>
            <span className="text-emerald-700 font-bold">{formatTaka(player.personalWallet)}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
            <span className="text-stone-500 block text-[9px]">এসক্রো জমা</span>
            <span className="text-amber-800 font-bold">{formatTaka(escrowAmount)}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
            <span className="text-stone-500 block text-[9px]">সুনাম</span>
            <span className="text-yellow-600 font-bold">⭐ {player.reputation}/১০</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 5 Products Menu vs Objectives & Arcade */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        {/* Left Column: 5 Products Menu & Order Submission (7 cols) */}
        <div className="md:col-span-7 bg-white border border-amber-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-2.5">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                📜 খাঁটি ৫টি মেনু
              </span>
              {isProcurement && (
                <span className="text-[10px] text-amber-700 font-mono font-bold animate-pulse">
                  ⏳ অর্ডার শুরু হবে: {remainingProcurementTime}s
                </span>
              )}
            </div>

            {/* 5 Product Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-stone-900">
                        {prod.icon} {prod.nameBn}
                      </p>
                      <p className="text-[10px] font-mono text-emerald-700 font-bold">
                        {formatTaka(prod.retailPrice)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQty(prod.id, -1)}
                        disabled={qty === 0}
                        className="w-6 h-6 bg-stone-200 hover:bg-stone-300 rounded-md font-bold disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold font-mono">{qty}</span>
                      <button
                        onClick={() => handleQty(prod.id, 1)}
                        className="w-6 h-6 bg-amber-600 hover:bg-amber-500 rounded-md font-bold text-white"
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
          <div className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-2.5 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-stone-600 font-medium">অর্ডার প্রিভিউ:</span>
              <span className="font-mono text-amber-900 font-bold">মোট: {formatTaka(cartTotal)}</span>
            </div>

            <p className="text-[11px] text-amber-900 font-medium italic bg-white p-2 rounded-lg border border-amber-200">
              "{generatedBangla}"
            </p>

            <button
              disabled={isProcurement || cartItems.length === 0 || !!activeOrder}
              onClick={handleOrderSubmit}
              className={`w-full py-2 rounded-xl font-bold transition-all ${
                !isProcurement && cartItems.length > 0 && !activeOrder
                  ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-xs'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
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

        {/* Right Column: Private Objectives & Arcade (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          {/* Active Order Confirmation / Rejection */}
          {activeOrder && (
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-3 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 text-[11px]">📦 বর্তমান অর্ডার</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeOrder.phase}
                </span>
              </div>

              <p className="text-[11px] text-stone-700 italic">"{activeOrder.banglaSentence}"</p>

              {activeOrder.deliveredItems && activeOrder.deliveredItems.length > 0 && (
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 space-y-1.5">
                  <p className="text-[10px] text-amber-900 font-bold">
                    খাবার ডেলিভারি এসেছে! সঠিক হলে কনফার্ম করুন:
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onConfirmDelivery(activeOrder.id)}
                      className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      ✓ সঠিক
                    </button>
                    <button
                      onClick={() => onRejectDelivery(activeOrder.id)}
                      className="flex-1 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                    >
                      ✕ ভুল আইটেম
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCancellationModal(true)}
                className="text-[10px] text-red-600 hover:underline block text-center w-full pt-1"
              >
                অর্ডার বাতিল করবেন? (পেনাল্টি প্রযোজ্য)
              </button>
            </div>
          )}

          {/* Profession Arcade Mini-Game Play Trigger */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3 text-white shadow-xs flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs">🕹️ পেশাগত আর্কেড মিনি-গেম</h4>
              <p className="text-[10px] opacity-90">১৫–২৫ সেকেন্ড • জিতলে +৫ পয়েন্ট!</p>
            </div>

            <button
              onClick={onOpenArcade}
              className="py-1.5 px-3 bg-white hover:bg-amber-50 text-amber-900 rounded-xl font-bold text-xs shadow-xs transition-transform hover:scale-105"
            >
              খেলুন 🎯
            </button>
          </div>

          {/* 4 Private Objectives */}
          <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
              <span className="font-bold text-stone-800">🎯 ৪টি ব্যক্তিগত মিশন</span>
              <span className="text-[10px] text-amber-800 font-mono font-bold">সর্বোচ্চ ১৭pt</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
              {player.objectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-2 rounded-xl border text-[11px] ${
                    obj.isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-[#FFF8F0] border-amber-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{obj.titleBn}</span>
                    <span className="font-mono text-amber-700">+{obj.rewardPoints}pt</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">{obj.descriptionBn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancellationModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-red-500 rounded-2xl w-full max-w-sm p-4 shadow-xl space-y-3 text-xs">
            <div className="border-b border-stone-200 pb-2">
              <h4 className="font-bold text-red-600 text-sm">⚠️ অর্ডার বাতিলের কারণ নির্বাচন করুন</h4>
              <p className="text-[10px] text-stone-500">টাকা ফেরত হবে না, ২ সুনাম পয়েন্ট কাটা যাবে!</p>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {FUNNY_CANCELLATION_EXCUSES.map((excuse, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedExcuse(excuse)}
                  className={`w-full text-left p-1.5 rounded-lg border text-[11px] ${
                    selectedExcuse === excuse
                      ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  {excuse}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancellationModal(false)}
                className="flex-1 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl"
              >
                না, রাখব
              </button>
              <button
                onClick={() => {
                  onCancelOrder(activeOrder.id, selectedExcuse);
                  setShowCancellationModal(false);
                  sound.playBreakingNews();
                }}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
              >
                বাতিল করুন!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
