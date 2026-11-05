/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameRoom, Player } from '../types/game';
import { formatTaka } from '../utils/bangla';

interface SettlementModalProps {
  room: GameRoom;
  onProceedNext: () => void;
  isHost: boolean;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  room,
  onProceedNext,
  isHost,
}) => {
  const settlement = room.currentSettlement;
  const currentShopkeeper = room.players.find((p) => p.id === room.currentShopkeeperId);
  const saboteur = room.players.find((p) => p.isSaboteur);

  if (!settlement) return null;

  const isMatchOver = room.roundIndex >= room.totalRounds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#161a24] border-2 border-amber-500/60 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 my-8">
        {/* Header */}
        <div className="text-center border-b border-slate-700/80 pb-4 mb-4">
          <span className="text-4xl">🧾</span>
          <h2 className="text-2xl font-bold text-amber-400 mt-1">
            টংয়ের রাউন্ড সমাপ্তি ও হিসাব-নিকাশ
          </h2>
          <p className="text-xs text-slate-300">
            দোকানদার: <span className="font-bold text-white">{currentShopkeeper?.name}</span> • রাউন্ড{' '}
            {room.roundIndex}/{room.totalRounds}
          </p>
        </div>

        {/* Financial Accounting Grid */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            📊 আর্থিক খতিয়ান (Financial Balance Sheet)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">প্রারম্ভিক মূলধন</span>
              <span className="font-bold text-white text-sm font-mono">
                {formatTaka(settlement.initialCapital)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">পাইকারি ক্রয় খরচ</span>
              <span className="font-bold text-red-400 text-sm font-mono">
                -{formatTaka(settlement.procurementSpending)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">হাতে থাকা ক্যাশ</span>
              <span className="font-bold text-slate-200 text-sm font-mono">
                {formatTaka(settlement.remainingCash)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">বিক্রয় আয় (Revenue)</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">
                +{formatTaka(settlement.salesRevenue)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">ক্যানসেল জরিমানা ক্ষতিপূরণ</span>
              <span className="font-bold text-amber-400 text-sm font-mono">
                +{formatTaka(settlement.cancellationCompensation)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px]">অবশিষ্ট মজুদ মূল্য</span>
              <span className="font-bold text-blue-400 text-sm font-mono">
                +{formatTaka(settlement.unsoldInventoryValue)}
              </span>
            </div>
          </div>

          {/* Net Profit Summary */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-300">নীট লাভ / লোকসান: </span>
              <p className="text-[10px] text-slate-500">
                (আয় + ক্ষতিপূরণ + ক্যাশ + মজুদ - প্রারম্ভিক মূলধন)
              </p>
            </div>
            <span
              className={`text-xl font-bold font-mono px-3 py-1 rounded-xl ${
                settlement.netProfit >= 0
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-950 text-red-400 border border-red-500/40'
              }`}
            >
              {settlement.netProfit >= 0 ? '+' : ''}
              {formatTaka(settlement.netProfit)}
            </span>
          </div>
        </div>

        {/* Operational Stats: Accuracy & Orders */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px]">ডেলিভারি নির্ভুলতা</span>
            <p className="text-lg font-bold text-amber-300 font-mono mt-0.5">
              {settlement.orderAccuracy}%
            </p>
            <p className="text-[10px] text-slate-500">
              সফল: {settlement.ordersSuccessful}/{settlement.ordersAttempted}
            </p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px]">দোকানদারের রাউন্ড পয়েন্ট</span>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              +{currentShopkeeper?.roleScores.shopkeeper || 0} pt
            </p>
            <p className="text-[10px] text-slate-500">সর্বোচ্চ ৪০ পয়েন্টের মধ্যে</p>
          </div>
        </div>

        {/* Saboteur Reveal Banner */}
        <div className="bg-purple-950/50 border-2 border-purple-500/60 rounded-2xl p-4 mb-4 text-center">
          <span className="text-3xl">🎭</span>
          <h4 className="text-lg font-bold text-purple-300 mt-1">গোপন ধান্দাবাজ উন্মোচন!</h4>
          <p className="text-xs text-purple-200 mt-0.5">
            এই রাউন্ডের আসল গোপন ষড়যন্ত্রকারী ছিলেন:{' '}
            <span className="font-bold text-white text-sm underline decoration-amber-400">
              {saboteur?.name} ({saboteur?.avatar})
            </span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            ধান্দাবাজ স্কোর: +{saboteur?.roleScores.saboteur || 0} পয়েন্ট
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isHost ? (
            <button
              onClick={onProceedNext}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl transition-transform hover:scale-[1.01]"
            >
              {isMatchOver ? '🏆 চূড়ান্ত ম্যাচ লিডারবোর্ড দেখুন' : '➡️ পরবর্তী দোকানদারের রাউন্ড শুরু করুন'}
            </button>
          ) : (
            <p className="text-xs text-slate-400 text-center animate-pulse">
              হোস্ট পরবর্তী রাউন্ড শুরু করার জন্য অপেক্ষা করুন...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
