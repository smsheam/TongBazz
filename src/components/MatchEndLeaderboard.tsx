/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameRoom, Player } from '../types/game';
import { formatTaka } from '../utils/bangla';

interface MatchEndProps {
  room: GameRoom;
  onRestart: () => void;
  isHost: boolean;
}

export const MatchEndLeaderboard: React.FC<MatchEndProps> = ({ room, onRestart, isHost }) => {
  const players = [...room.players].sort((a, b) => b.totalScore - a.totalScore);

  // Calculate special prestigious titles
  const overallWinner = players[0];
  const bestShopkeeper = [...players].sort(
    (a, b) => b.roleScores.shopkeeper - a.roleScores.shopkeeper
  )[0];
  const bestCustomer = [...players].sort(
    (a, b) => b.roleScores.customer - a.roleScores.customer
  )[0];
  const bestSaboteur = [...players].sort(
    (a, b) => b.roleScores.saboteur - a.roleScores.saboteur
  )[0];
  const bestFinancial = [...players].sort(
    (a, b) => b.stats.totalProfit - a.stats.totalProfit
  )[0];
  const mostCancellations = [...players].sort(
    (a, b) => b.stats.ordersCancelled - a.stats.ordersCancelled
  )[0];
  const worstBusiness = [...players].sort(
    (a, b) => a.stats.totalProfit - b.stats.totalProfit
  )[0];

  const TITLES = [
    { title: '👑 সর্বময় টংবাজ (Overall Winner)', player: overallWinner, desc: 'টংয়ের অবিসংবাদিত চ্যাম্পিয়ন!' },
    { title: '🏪 টংয়ের ব্যবসায়ী (Best Shopkeeper)', player: bestShopkeeper, desc: 'সবচেয়ে দক্ষ ও নির্ভুল মামা' },
    { title: '🍽️ ভিআইপি খাদক (Best Customer)', player: bestCustomer, desc: 'সবচেয়ে নিয়মিত চা ও স্ন্যাক্স খাদক' },
    { title: '🕵️‍♂️ ধান্দার সম্রাট (Best Saboteur)', player: bestSaboteur, desc: 'সবচেয়ে ধুরন্ধর ষড়যন্ত্রকারী' },
    { title: '💰 হিসাবের রাজা (Best Financials)', player: bestFinancial, desc: `সর্বোচ্চ নীট লাভ (${formatTaka(bestFinancial?.stats.totalProfit || 0)})` },
    { title: '📜 ক্যানসেল মন্ত্রী (Most Cancellations)', player: mostCancellations, desc: `বাতিল করেছেন ${mostCancellations?.stats.ordersCancelled || 0} বার!` },
    { title: '📉 লোকসানের সম্রাট (Worst Loss)', player: worstBusiness, desc: 'চাকরি খোঁজাই ভালো ছিল মামা!' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-5xl">🏆</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400">
          টংবাজ চূড়ান্ত গ্র্যান্ড ফিনালে
        </h1>
        <p className="text-slate-300 text-sm">
          চা খাওয়া শেষ, ধান্দা শেষ, এবার বিজয়ীদের নাম ঘোষণার পালা!
        </p>
      </div>

      {/* Prestigious Titles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TITLES.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#161a24] border border-amber-600/40 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-amber-300 block mb-1">{t.title}</span>
              <div className="flex items-center gap-2 my-1">
                <span className="text-2xl">{t.player?.avatar}</span>
                <span className="font-bold text-white text-sm">{t.player?.name}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic mt-2 border-t border-slate-700/60 pt-1">
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Standings Table */}
      <div className="bg-[#141822] border border-slate-700 rounded-2xl p-4 shadow-xl overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-200 mb-3">🏅 সামগ্রিক স্কোরবোর্ড (Standings)</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="pb-2">র‌্যাংক</th>
              <th className="pb-2">খেলোয়াড়</th>
              <th className="pb-2 text-right">দোকানদার pt</th>
              <th className="pb-2 text-right">কাস্টমার pt</th>
              <th className="pb-2 text-right">ধান্দাবাজ pt</th>
              <th className="pb-2 text-right">মোট পয়েন্ট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {players.map((p, rank) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="py-2.5 font-bold font-mono text-amber-400">#{rank + 1}</td>
                <td className="py-2.5 flex items-center gap-2">
                  <span>{p.avatar}</span>
                  <span className="font-medium text-slate-100">
                    {p.name} {p.isBot ? '🤖' : ''}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-300">
                  +{p.roleScores.shopkeeper}
                </td>
                <td className="py-2.5 text-right font-mono text-slate-300">
                  +{p.roleScores.customer}
                </td>
                <td className="py-2.5 text-right font-mono text-purple-300">
                  +{p.roleScores.saboteur}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-400 text-sm">
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
            className="py-3 px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-xl transition-transform hover:scale-105"
          >
            🔄 নতুন ম্যাচ শুরু করুন (Play Again)
          </button>
        ) : (
          <p className="text-xs text-slate-400">হোস্ট নতুন ম্যাচ শুরু করার অপেক্ষায়...</p>
        )}
      </div>
    </div>
  );
};
