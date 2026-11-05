/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameRoom } from '../types/game';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-amber-500 rounded-3xl w-full max-w-xl p-5 shadow-2xl text-stone-900 my-6 space-y-3.5">
        {/* Header */}
        <div className="text-center border-b border-amber-100 pb-3">
          <span className="text-3xl">🧾</span>
          <h2 className="text-xl font-bold text-amber-900 mt-1">
            টংয়ের রাউন্ড সমাপ্তি ও হিসাব-নিকাশ
          </h2>
          <p className="text-xs text-stone-600">
            দোকানদার: <span className="font-bold text-stone-900">{currentShopkeeper?.name}</span> • রাউন্ড{' '}
            {room.roundIndex}/{room.totalRounds}
          </p>
        </div>

        {/* Financial Accounting Grid */}
        <div className="bg-[#FFF8F0] border border-amber-200 rounded-2xl p-3.5 text-xs">
          <h3 className="font-bold text-amber-900 mb-2 uppercase text-[11px]">
            📊 আর্থিক খতিয়ান (Financial Balance Sheet)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">প্রারম্ভিক মূলধন</span>
              <span className="font-bold text-stone-900 font-mono">
                {formatTaka(settlement.initialCapital)}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">মালামাল ক্রয় খরচ</span>
              <span className="font-bold text-red-600 font-mono">
                -{formatTaka(settlement.procurementSpending)}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">হাতে থাকা ক্যাশ</span>
              <span className="font-bold text-stone-800 font-mono">
                {formatTaka(settlement.remainingCash)}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">বিক্রয় আয় (Revenue)</span>
              <span className="font-bold text-emerald-700 font-mono">
                +{formatTaka(settlement.salesRevenue)}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">ক্যানসেল ক্ষতিপূরণ</span>
              <span className="font-bold text-amber-800 font-mono">
                +{formatTaka(settlement.cancellationCompensation)}
              </span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-200">
              <span className="text-stone-500 block text-[9px]">অবশিষ্ট মজুদ মূল্য</span>
              <span className="font-bold text-blue-700 font-mono">
                +{formatTaka(settlement.unsoldInventoryValue)}
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center justify-between">
            <span className="font-semibold text-stone-700 text-xs">নীট লাভ / লোকসান:</span>
            <span
              className={`text-lg font-bold font-mono px-3 py-0.5 rounded-xl ${
                settlement.netProfit >= 0
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {settlement.netProfit >= 0 ? '+' : ''}
              {formatTaka(settlement.netProfit)}
            </span>
          </div>
        </div>

        {/* Accuracy & Points */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] text-stone-500">ডেলিভারি নির্ভুলতা</span>
            <p className="text-base font-bold text-amber-900 font-mono">
              {settlement.orderAccuracy}%
            </p>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] text-stone-500">দোকানদার পয়েন্ট</span>
            <p className="text-base font-bold text-emerald-700 font-mono">
              +{currentShopkeeper?.roleScores.shopkeeper || 0} pt
            </p>
          </div>
        </div>

        {/* Saboteur Reveal */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3 text-center">
          <span className="text-2xl">🎭</span>
          <h4 className="font-bold text-purple-900 text-xs mt-0.5">গোপন গোলমালবাজ উন্মোচন!</h4>
          <p className="text-xs text-purple-800">
            এই রাউন্ডের আসল গোপন ষড়যন্ত্রকারী ছিলেন:{' '}
            <span className="font-bold text-purple-950 underline">{saboteur?.name}</span>
          </p>
        </div>

        {/* Action */}
        <div className="pt-1">
          {isHost ? (
            <button
              onClick={onProceedNext}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              {isMatchOver ? '🏆 চূড়ান্ত ম্যাচ লিডারবোর্ড দেখুন' : '➡️ পরবর্তী দোকানদারের রাউন্ড শুরু করুন'}
            </button>
          ) : (
            <p className="text-xs text-stone-500 text-center animate-pulse">
              হোস্ট পরবর্তী রাউন্ড শুরু করার জন্য অপেক্ষা করুন...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
