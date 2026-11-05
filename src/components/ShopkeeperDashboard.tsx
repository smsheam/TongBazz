/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameRoom, OrderItem, MenuItem } from '../types/game';
import { WHOLESALE_INGREDIENTS, MENU_ITEMS } from '../data/gameData';
import { formatTaka } from '../utils/bangla';
import { sound } from '../utils/audio';

interface ShopkeeperDashboardProps {
  room: GameRoom;
  onBuyIngredient: (ingredientId: string, quantity: number) => void;
  onStartCooking: (menuItemId: string) => void;
  onServeProduct: (customerId: string, item: OrderItem) => void;
  selectedCustomerId?: string;
  onSelectCustomer: (customerId: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  room,
  onBuyIngredient,
  onStartCooking,
  onServeProduct,
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const isProcurement = room.phase === 'PROCUREMENT';
  const remainingProcurementTime = Math.max(0, 30 - Math.floor((Date.now() - room.roundStartTime) / 1000));
  
  // Selected ready item to deliver
  const [selectedReadyItemIndex, setSelectedReadyItemIndex] = useState<number | null>(null);

  // Incoming orders visible only for 5 seconds
  const currentTime = Date.now();
  const visibleIncomingOrders = room.activeOrders.filter(
    (o) => currentTime < o.expiresFromShopkeeperViewAt && o.phase === 'PENDING'
  );

  // Calculate potential regular milk tea capacity based on limiting ingredient
  const milkStock = room.shopkeeperInventory['milk'] || 0;
  const teaLeavesStock = room.shopkeeperInventory['tea_leaves'] || 0;
  const sugarStock = room.shopkeeperInventory['sugar'] || 0;
  const cupsStock = room.shopkeeperInventory['cups'] || 0;

  const cupsFromMilk = Math.floor(milkStock / 50);
  const cupsFromTea = Math.floor(teaLeavesStock / 2);
  const cupsFromSugar = Math.floor(sugarStock / 8);
  const cupsFromCups = cupsStock;

  const potentialMilkTea = Math.min(cupsFromMilk, cupsFromTea, cupsFromSugar, cupsFromCups);

  // Ready-made vs recipes
  const teaMenuItems = MENU_ITEMS.filter((m) => m.category === 'TEA');
  const foodMenuItems = MENU_ITEMS.filter((m) => m.category === 'FOOD');

  // Active cooking tasks
  const activeCookingTasks = room.cookingTasks.filter((t) => !t.completed);

  return (
    <div className="w-full space-y-4">
      {/* SECTION A: PROCUREMENT PHASE (FIRST 30 SECONDS) */}
      {isProcurement ? (
        <div className="bg-[#151922] border-2 border-amber-500/60 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/80 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <h3 className="font-bold text-amber-400 text-lg">পাইকারি মালামাল ক্রয় (Procurement)</h3>
              </div>
              <p className="text-xs text-slate-300">
                ব্যবসা শুরুর মূলধন: <span className="font-bold text-amber-300">৳২০০</span> • হাতে বাকি আছে:{' '}
                <span className="font-bold text-emerald-400 text-sm font-mono">
                  {formatTaka(room.shopkeeperBudget)}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-amber-500/20 border border-amber-500 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                ⏳ সময় বাকি: {remainingProcurementTime} সেকেন্ড
              </div>
            </div>
          </div>

          {/* Potential capacity banner */}
          <div className="my-3 bg-amber-950/40 border border-amber-800/40 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-2">
            <div>
              <span className="font-bold text-amber-300">সম্ভাব্য রেগুলার দুধ চা উৎপাদন ক্ষমতা: </span>
              <span className="text-white font-mono font-bold text-sm">{potentialMilkTea} কাপ</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              (দুধ: {milkStock}ml, চা পাতা: {teaLeavesStock}g, চিনি: {sugarStock}g, কাপ: {cupsStock}pcs)
            </div>
          </div>

          {/* Wholesale Ingredient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {WHOLESALE_INGREDIENTS.map((ing) => {
              const currentStock = room.shopkeeperInventory[ing.id] || 0;
              const canAfford = room.shopkeeperBudget >= ing.wholesalePrice;

              return (
                <div
                  key={ing.id}
                  className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-sm">{ing.nameBn}</h4>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {formatTaka(ing.wholesalePrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      প্যাক: {ing.packSize} {ing.unit}
                    </p>
                    <p className="text-[11px] text-amber-300/80 mt-1">
                      বর্তমান স্টক: {currentStock} {ing.unit}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        onBuyIngredient(ing.id, ing.packSize);
                        sound.playCashRegister();
                      }}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      + ১ প্যাক কিনুন ({formatTaka(ing.wholesalePrice)})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-center text-xs text-slate-400 italic">
            *ঠিক ৩০ সেকেন্ড পর কাঁচামাল ক্রয় স্বয়ংক্রিয়ভাবে বন্ধ হবে এবং কাস্টমারদের অর্ডার শুরু হবে!
          </div>
        </div>
      ) : null}

      {/* SECTION B: MAIN GAMEPLAY DASHBOARD (4 PANELS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PANEL 1: INCOMING ORDERS (DISAPPEARS AFTER 5 SECONDS!) */}
        <div className="bg-[#151922] border border-amber-600/40 rounded-2xl p-3.5 flex flex-col shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">📢</span>
              <h4 className="font-bold text-amber-400 text-sm">নতুন অর্ডার</h4>
            </div>
            <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/40 px-2 py-0.5 rounded-full font-mono">
              স্মৃতি পরীক্ষা: ৫ সেকেন্ড!
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-56">
            {visibleIncomingOrders.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center p-2 text-slate-500">
                <span className="text-2xl mb-1">⏳</span>
                <p className="text-xs">নতুন কোনো অর্ডার দৃশ্যমান নেই।</p>
                <p className="text-[10px] text-slate-500">
                  (অর্ডার আসার সাথে সাথে ৫ সেকেন্ডের মধ্যে মুখস্থ করে নিন!)
                </p>
              </div>
            ) : (
              visibleIncomingOrders.map((order) => {
                const secondsLeft = Math.max(
                  0,
                  Math.ceil((order.expiresFromShopkeeperViewAt - currentTime) / 1000)
                );
                return (
                  <div
                    key={order.id}
                    className="bg-amber-500/10 border-2 border-amber-400 rounded-xl p-2.5 animate-pulse text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{order.customerName}</span>
                      <span className="text-red-400 font-mono font-bold text-[11px]">
                        ⏳ {secondsLeft}s এ মুছে যাবে!
                      </span>
                    </div>
                    <p className="text-amber-200 font-medium italic">"{order.banglaSentence}"</p>
                    <div className="flex justify-between text-[11px] text-slate-300 border-t border-slate-700/60 pt-1">
                      <span>বিল: {formatTaka(order.totalBill)}</span>
                      <span className="text-emerald-400 font-bold">অগ্রিম জমা</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 2: COOKING & PREPARATION STATIONS */}
        <div className="bg-[#151922] border border-slate-700 rounded-2xl p-3.5 flex flex-col shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <h4 className="font-bold text-slate-200 text-sm">রান্না ও চুলা</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              চুলা: {activeCookingTasks.length}/৩
            </span>
          </div>

          {/* Active Tasks Progress */}
          <div className="space-y-1.5 mb-2">
            {activeCookingTasks.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-2">কোনো চুলা চালু নেই</p>
            ) : (
              activeCookingTasks.map((task) => {
                const menuItem = MENU_ITEMS.find((m) => m.id === task.menuItemId);
                const elapsed = Date.now() - task.startTime;
                const remaining = Math.max(0, Math.ceil((task.durationMs - elapsed) / 1000));
                return (
                  <div
                    key={task.id}
                    className="bg-slate-800 p-2 rounded-lg border border-amber-500/30 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-amber-300">{menuItem?.nameBn}</span>
                    <span className="font-mono text-[11px] text-amber-400 animate-pulse">
                      ♨️ {remaining}s
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Start Cooking Quick Triggers */}
          <div className="border-t border-slate-700/60 pt-2 flex-1 flex flex-col justify-end">
            <p className="text-[10px] text-slate-400 mb-1.5 font-semibold">চা বানাতে ক্লিক করুন:</p>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {teaMenuItems.map((item) => (
                <button
                  key={item.id}
                  disabled={activeCookingTasks.length >= 3}
                  onClick={() => {
                    onStartCooking(item.id);
                    sound.playTeaPour();
                  }}
                  className="bg-slate-800 hover:bg-amber-600/80 text-slate-200 hover:text-white p-1.5 rounded-lg text-[11px] font-medium border border-slate-700 flex flex-col items-center"
                >
                  <span>{item.nameBn}</span>
                  <span className="text-[9px] text-amber-300 font-mono">({item.cookingTimeSec}s)</span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 mb-1 font-semibold">খাবার প্রস্তুত করতে:</p>
            <div className="grid grid-cols-3 gap-1">
              {foodMenuItems.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  disabled={activeCookingTasks.length >= 3}
                  onClick={() => onStartCooking(item.id)}
                  className="bg-slate-800 hover:bg-slate-700 p-1 rounded text-[10px] text-slate-300 border border-slate-700 truncate"
                >
                  {item.nameBn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL 3: READY PRODUCTS TRAY */}
        <div className="bg-[#151922] border border-slate-700 rounded-2xl p-3.5 flex flex-col shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🍱</span>
              <h4 className="font-bold text-slate-200 text-sm">প্রস্তুত আইটেম ট্রে</h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {room.readyItems.length} টি প্রস্তুত
            </span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-56">
            {room.readyItems.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center p-2 text-slate-500">
                <span className="text-2xl mb-1">📭</span>
                <p className="text-xs">ট্রে খালি।</p>
                <p className="text-[10px]">চা বা খাবার প্রস্তুত হলে এখানে জমা হবে।</p>
              </div>
            ) : (
              room.readyItems.map((item, idx) => {
                const menuItem = MENU_ITEMS.find((m) => m.id === item.itemId);
                const isSelected = selectedReadyItemIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedReadyItemIndex(isSelected ? null : idx)}
                    className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{menuItem?.category === 'TEA' ? '☕' : '🥐'}</span>
                      <span className="text-xs font-semibold">{menuItem?.nameBn}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {formatTaka(item.itemPrice)}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <p className="mt-2 text-[10px] text-slate-400 text-center italic">
            *ট্রে থেকে আইটেম সিলেক্ট করে ডানপাশের কাস্টমারকে পরিবেশন করুন
          </p>
        </div>

        {/* PANEL 4: CUSTOMERS & DELIVERY ASSIGNMENT */}
        <div className="bg-[#151922] border border-slate-700 rounded-2xl p-3.5 flex flex-col shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">💁</span>
              <h4 className="font-bold text-slate-200 text-sm">ডেলিভারি প্রদান</h4>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-48 mb-2">
            {room.players
              .filter((p) => p.id !== room.currentShopkeeperId)
              .map((cust) => {
                const isSelected = selectedCustomerId === cust.id;
                return (
                  <button
                    key={cust.id}
                    onClick={() => onSelectCustomer(cust.id)}
                    className={`w-full text-left p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{cust.avatar}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {cust.name} {cust.isBot ? '🤖' : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {isSelected ? '✓ নির্বাচিত' : 'ক্লিক'}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="border-t border-slate-700/60 pt-2">
            <button
              disabled={selectedReadyItemIndex === null || !selectedCustomerId}
              onClick={() => {
                if (selectedReadyItemIndex !== null && selectedCustomerId) {
                  const item = room.readyItems[selectedReadyItemIndex];
                  onServeProduct(selectedCustomerId, item);
                  setSelectedReadyItemIndex(null);
                  sound.playSuccess();
                }
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow ${
                selectedReadyItemIndex !== null && selectedCustomerId
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              🚀 সিলেক্টেড কাস্টমারকে পরিবেশন করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
