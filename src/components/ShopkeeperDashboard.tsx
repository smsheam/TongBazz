/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameRoom, OrderItem } from '../types/game';
import { PRODUCTS } from '../data/gameData';
import { formatTaka } from '../utils/bangla';
import { sound } from '../utils/audio';

interface ShopkeeperDashboardProps {
  room: GameRoom;
  onBuyPack: (productId: string) => void;
  onStartCooking: (productId: string) => void;
  onServeProduct: (customerId: string, item: OrderItem) => void;
  selectedCustomerId?: string;
  onSelectCustomer: (customerId: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  room,
  onBuyPack,
  onStartCooking,
  onServeProduct,
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const isProcurement = room.phase === 'PROCUREMENT';
  const remainingProcurementTime = Math.max(0, 30 - Math.floor((Date.now() - room.roundStartTime) / 1000));
  const [selectedReadyIndex, setSelectedReadyIndex] = useState<number | null>(null);

  const currentTime = Date.now();
  // 5 seconds memory disappearance rule
  const visibleOrders = room.activeOrders.filter(
    (o) => currentTime < o.expiresFromShopkeeperViewAt && o.phase === 'PENDING'
  );

  const activeCookingTasks = room.cookingTasks.filter((t) => !t.completed);

  return (
    <div className="w-full space-y-3">
      {/* PROCUREMENT BANNER (FIRST 30 SECONDS) */}
      {isProcurement && (
        <div className="bg-white border-2 border-amber-500 rounded-2xl p-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-100 pb-2 gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🛒</span>
                <h3 className="font-bold text-amber-900 text-sm md:text-base">
                  মালামাল ক্রয় (Wholesale Packs): ৫টি পণ্য
                </h3>
              </div>
              <p className="text-xs text-stone-600">
                মূলধন: <span className="font-bold text-amber-800">৳২০০</span> • হাতে ক্যাশ:{' '}
                <span className="font-bold text-emerald-700 font-mono text-sm">
                  {formatTaka(room.shopkeeperBudget)}
                </span>
              </p>
            </div>

            <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
              ⏳ বাকি: {remainingProcurementTime} সেকেন্ড
            </div>
          </div>

          {/* 5 Product Packs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3">
            {PRODUCTS.map((prod) => {
              const currentStock = room.shopkeeperStock[prod.id] || 0;
              const canAfford = room.shopkeeperBudget >= prod.packCost;

              return (
                <div
                  key={prod.id}
                  className="bg-[#FFF8F0] border border-amber-200 rounded-xl p-2.5 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{prod.icon}</span>
                      <span className="font-bold font-mono text-emerald-700">
                        {formatTaka(prod.packCost)}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-800 mt-1">{prod.nameBn}</h4>
                    <p className="text-[10px] text-stone-500">
                      ১ প্যাক = {prod.yieldCount}টি (খুচরা ৳{prod.retailPrice})
                    </p>
                    <p className="text-[10px] text-amber-800 font-bold mt-1">
                      স্টক: {currentStock}টি
                    </p>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      onBuyPack(prod.id);
                      sound.playCashRegister();
                    }}
                    className={`mt-2 py-1 px-2 rounded-lg font-bold text-xs transition-all ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    +১ প্যাক ({formatTaka(prod.packCost)})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 COMPACT DASHBOARD PANELS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* PANEL 1: INCOMING ORDERS (5 SECONDS MEMORY CHALLENGE) */}
        <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              📢 নতুন অর্ডার
            </span>
            <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-mono font-bold">
              ৫ সেকেন্ড!
            </span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-44">
            {visibleOrders.length === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-center text-stone-400">
                <span className="text-xl mb-1">⏳</span>
                <p className="text-[11px]">নতুন কোনো অর্ডার নেই</p>
                <p className="text-[9px]">(অর্ডার আসার সাথে সাথে মনে রাখুন!)</p>
              </div>
            ) : (
              visibleOrders.map((order) => {
                const secLeft = Math.max(
                  0,
                  Math.ceil((order.expiresFromShopkeeperViewAt - currentTime) / 1000)
                );
                return (
                  <div
                    key={order.id}
                    className="bg-amber-50 border-2 border-amber-400 rounded-xl p-2 space-y-1 animate-pulse"
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-stone-900">{order.customerName}</span>
                      <span className="text-red-600 font-mono text-[10px]">
                        ⏳ {secLeft}s এ মুছবে!
                      </span>
                    </div>
                    <p className="text-amber-900 italic text-[11px]">"{order.banglaSentence}"</p>
                    <div className="flex justify-between text-[10px] text-stone-600 border-t border-amber-200 pt-0.5">
                      <span>বিল: {formatTaka(order.totalBill)}</span>
                      <span className="text-emerald-700 font-bold">অগ্রিম জমা</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 2: PREPARATION & COOKING STATIONS */}
        <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              🔥 চুলা ও তৈরি
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              ব্যস্ত: {activeCookingTasks.length}/৩
            </span>
          </div>

          <div className="space-y-1 mb-2">
            {activeCookingTasks.length === 0 ? (
              <p className="text-[11px] text-stone-400 text-center py-2">কোনো চুলা ব্যস্ত নেই</p>
            ) : (
              activeCookingTasks.map((task) => {
                const prod = PRODUCTS.find((p) => p.id === task.productId);
                const elapsed = Date.now() - task.startTime;
                const remaining = Math.max(0, Math.ceil((task.durationMs - elapsed) / 1000));
                return (
                  <div
                    key={task.id}
                    className="bg-amber-50 p-1.5 rounded-lg border border-amber-300 flex items-center justify-between"
                  >
                    <span className="font-semibold text-amber-900">
                      {prod?.icon} {prod?.nameBn}
                    </span>
                    <span className="font-mono font-bold text-amber-700 animate-pulse text-[10px]">
                      ♨️ {remaining}s
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-amber-100 pt-2 flex-1 flex flex-col justify-end">
            <p className="text-[9px] text-stone-500 mb-1 font-bold">বানাতে ট্যাপ করুন (স্টক থাকলে):</p>
            <div className="grid grid-cols-2 gap-1">
              {PRODUCTS.map((prod) => {
                const stock = room.shopkeeperStock[prod.id] || 0;
                return (
                  <button
                    key={prod.id}
                    disabled={stock <= 0 || activeCookingTasks.length >= 3}
                    onClick={() => {
                      onStartCooking(prod.id);
                      sound.playTeaPour();
                    }}
                    className={`p-1 rounded-lg border flex items-center justify-between ${
                      stock > 0
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-stone-800'
                        : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {prod.icon} {prod.nameBn}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-amber-700">
                      ({stock})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: READY ITEMS TRAY */}
        <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              🍱 প্রস্তুত আইটেম
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">
              {room.readyItems.length}টি প্রস্তুত
            </span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto max-h-44">
            {room.readyItems.length === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-center text-stone-400">
                <span className="text-xl mb-1">📭</span>
                <p className="text-[11px]">ট্রে খালি</p>
              </div>
            ) : (
              room.readyItems.map((item, idx) => {
                const prod = PRODUCTS.find((p) => p.id === item.productId);
                const isSelected = selectedReadyIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedReadyIndex(isSelected ? null : idx)}
                    className={`w-full text-left p-1.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 font-bold ring-1 ring-amber-500'
                        : 'bg-[#FFF8F0] border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{prod?.icon}</span>
                      <span className="text-stone-800">{prod?.nameBn}</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-[10px]">
                      {formatTaka(item.itemPrice)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 4: CUSTOMER DELIVERY */}
        <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 mb-2">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                💁 কাস্টমারে ডেলিভারি
              </span>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {room.players
                .filter((p) => p.id !== room.currentShopkeeperId)
                .map((cust) => {
                  const isSelected = selectedCustomerId === cust.id;
                  return (
                    <button
                      key={cust.id}
                      onClick={() => onSelectCustomer(cust.id)}
                      className={`w-full text-left p-1.5 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-500 font-bold'
                          : 'bg-[#FFF8F0] border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>{cust.avatar}</span>
                        <span className="truncate">{cust.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-mono">
                        {isSelected ? '✓ নির্বাচিত' : 'ক্লিক'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-100 mt-2">
            <button
              disabled={selectedReadyIndex === null || !selectedCustomerId}
              onClick={() => {
                if (selectedReadyIndex !== null && selectedCustomerId) {
                  const item = room.readyItems[selectedReadyIndex];
                  onServeProduct(selectedCustomerId, item);
                  setSelectedReadyIndex(null);
                  sound.playSuccess();
                }
              }}
              className={`w-full py-2 px-2 rounded-xl font-bold text-xs shadow-xs transition-all ${
                selectedReadyIndex !== null && selectedCustomerId
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              }`}
            >
              🚀 পরিবেশন করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
