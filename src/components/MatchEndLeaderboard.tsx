/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameRoom } from '../types/game';
import { formatTaka } from '../utils/bangla';

interface MatchEndProps {
  room: GameRoom;
  onRestart: () => void;
  isHost: boolean;
}

export const MatchEndLeaderboard: React.FC<MatchEndProps> = ({ room, onRestart, isHost }) => {
  const players = [...room.players].sort((a, b) => b.totalScore - a.totalScore);

  // Exact 5 Humorous Titles as requested in prompt:
  // 1. Ultimate Shopkeeper (Highest profit)
  const bestShopkeeper = [...players].sort((a, b) => b.stats.totalProfit - a.stats.totalProfit)[0];
  // 2. VIP Gourmet (Most items consumed)
  const vipGourmet = [...players].sort((a, b) => b.stats.itemsConsumed - a.stats.itemsConsumed)[0];
  // 3. King of Mischief (Best saboteur disruption)
  const bestSaboteur = [...players].sort((a, b) => b.stats.sabotageSuccesses - a.stats.sabotageSuccesses)[0];
  // 4. Master Accountant (Highest fulfilled orders / accuracy)
  const masterAccountant = [...players].sort((a, b) => b.stats.ordersFulfilled - a.stats.ordersFulfilled)[0];
  // 5. Minister of Cancellations (Most cancelled orders)
  const cancelMinister = [...players].sort((a, b) => b.stats.ordersCancelled - a.stats.ordersCancelled)[0];

  const TITLES = [
    {
      title: '🏆 সর্বময় টংবাজ / টংয়ের ব্যবসায়ী',
      subtitle: 'Ultimate Shopkeeper',
      player: bestShopkeeper,
      desc: `সর্বোচ্চ নীট লাভ (${formatTaka(bestShopkeeper?.stats.totalProfit || 0)})`,
      color: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    {
      title: '🥐 ভিআইপি খাদক',
      subtitle: 'VIP Gourmet',
      player: vipGourmet,
      desc: `সবচেয়ে বেশি খাবার সাবাড় করেছেন (${vipGourmet?.stats.itemsConsumed || 0}টি আইটেম)`,
      color: 'bg-orange-50 border-orange-300 text-orange-900',
    },
    {
      title: '🕵️ ধান্দার সম্রাট',
      subtitle: 'King of Mischief',
      player: bestSaboteur,
      desc: `সেরা গোলমাল সৃষ্টি করেছেন (${bestSaboteur?.stats.sabotageSuccesses || 0} বার)`,
      color: 'bg-purple-50 border-purple-300 text-purple-900',
    },
    {
      title: '🧮 হিসাবের রাজা',
      subtitle: 'Master Accountant',
      player: masterAccountant,
      desc: `নির্ভুল সার্ভিসে এগিয়ে (${masterAccountant?.stats.ordersFulfilled || 0}টি সফল অর্ডার)`,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    },
    {
      title: '❌ ক্যানসেল মন্ত্রী',
      subtitle: 'Minister of Cancellations',
      player: cancelMinister,
      desc: `অর্ডার বাতিল করে পালাইছেন (${cancelMinister?.stats.ordersCancelled || 0} বার)`,
      color: 'bg-red-50 border-red-300 text-red-900',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4 px-3">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-4xl">🏆</span>
        <h1 className="text-2xl md:text-3xl font-black text-amber-900">
          টংবাজ চূড়ান্ত গ্র্যান্ড ফিনালে
        </h1>
        <p className="text-stone-600 text-xs md:text-sm">
          চা খাওয়া শেষ, ধান্দা শেষ, এবার মজাদার উপাধি ও বিজয়ীদের নাম ঘোষণার পালা!
        </p>
      </div>

      {/* 5 Humorous Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TITLES.map((t, idx) => (
          <div
            key={idx}
            className={`border-2 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between ${t.color}`}
          >
            <div>
              <span className="text-xs font-bold block mb-1">{t.title}</span>
              <p className="text-[10px] text-stone-500 font-semibold mb-2">{t.subtitle}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.player?.avatar}</span>
                <span className="font-bold text-stone-900 text-sm">{t.player?.name}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 italic mt-2 border-t border-stone-200/80 pt-1">
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Standings Table */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-stone-800 mb-3">🏅 খেলোয়াড়দের সামগ্রিক স্কোরবোর্ড</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 font-bold">
              <th className="pb-2">র‌্যাংক</th>
              <th className="pb-2">খেলোয়াড়</th>
              <th className="pb-2 text-right">দোকানদার pt</th>
              <th className="pb-2 text-right">কাস্টমার pt</th>
              <th className="pb-2 text-right">গোলমালবাজ pt</th>
              <th className="pb-2 text-right">মোট পয়েন্ট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {players.map((p, rank) => (
              <tr key={p.id} className="hover:bg-amber-50/50">
                <td className="py-2.5 font-bold font-mono text-amber-700">#{rank + 1}</td>
                <td className="py-2.5 flex items-center gap-1.5 font-medium text-stone-900">
                  <span>{p.avatar}</span>
                  <span>
                    {p.name} {p.isBot ? '🤖' : ''}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono text-stone-600">
                  +{p.roleScores.shopkeeper}
                </td>
                <td className="py-2.5 text-right font-mono text-stone-600">
                  +{p.roleScores.customer}
                </td>
                <td className="py-2.5 text-right font-mono text-purple-700">
                  +{p.roleScores.saboteur}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-700 text-sm">
                  {p.totalScore} pt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Restart CTA */}
      <div className="text-center pt-2">
        {isHost ? (
          <button
            onClick={onRestart}
            className="py-3 px-8 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-sm shadow-md transition-transform hover:scale-105"
          >
            🔄 নতুন ম্যাচ শুরু করুন (Play Again)
          </button>
        ) : (
          <p className="text-xs text-stone-500">হোস্ট নতুন ম্যাচ শুরু করার অপেক্ষায়...</p>
        )}
      </div>
    </div>
  );
};
