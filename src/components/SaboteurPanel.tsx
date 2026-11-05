/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaboteurState } from '../types/game';
import { SABOTEUR_TEASE_MESSAGES } from '../data/gameData';
import { sound } from '../utils/audio';

interface SaboteurPanelProps {
  saboteurState: SaboteurState;
  onFakeOrder: () => void;
  onTriggerRain: () => void;
  onTriggerBlackout: () => void;
  onSendTease: (text: string) => void;
}

export const SaboteurPanel: React.FC<SaboteurPanelProps> = ({
  saboteurState,
  onFakeOrder,
  onTriggerRain,
  onTriggerBlackout,
  onSendTease,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="bg-[#191420] border-2 border-purple-500/70 rounded-2xl p-4 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-800/40 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕵️‍♂️</span>
          <div>
            <h3 className="font-bold text-purple-300 text-sm">
              ধান্দাবাজ কন্ট্রোল প্যানেল (গোপন ষড়যন্ত্রকারী)
            </h3>
            <p className="text-[10px] text-purple-200/70">
              আপনার লক্ষ্য: ধরা না পড়ে দোকানে বিশৃঙ্খলা সৃষ্টি করা ও সময় নষ্ট করা!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-purple-300 hover:text-white bg-purple-900/40 px-2 py-1 rounded-lg border border-purple-700/50"
        >
          {isOpen ? 'লুকান ▲' : 'খুলুন ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3">
          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Action 1: Fake order */}
            <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-purple-200">১. ফেক অর্ডার ও ক্যানসেল</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    বাকি: {2 - saboteurState.fakeOrdersUsed}/২
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  দোকানদারকে বিভ্রান্ত করতে ৩ সেকেন্ডের ভুয়া অর্ডার পাঠান।
                </p>
              </div>

              <button
                disabled={saboteurState.fakeOrdersUsed >= 2}
                onClick={() => {
                  onFakeOrder();
                  sound.playBreakingNews();
                }}
                className={`mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  saboteurState.fakeOrdersUsed < 2
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                🚨 ফেক অর্ডার পাঠান (+৩pt)
              </button>
            </div>

            {/* Action 2: Trigger Rain */}
            <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-purple-200">২. বৃষ্টি নামাও</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    বাকি: {1 - saboteurState.rainUsed}/১
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  ঝুম বৃষ্টি নামিয়ে কাস্টমারদের অতিরিক্ত চায়ের চাহিদা তৈরি করুন!
                </p>
              </div>

              <button
                disabled={saboteurState.rainUsed >= 1}
                onClick={() => {
                  onTriggerRain();
                  sound.playThunder();
                }}
                className={`mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  saboteurState.rainUsed < 1
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                🌧️ বৃষ্টি নামান (+৪pt)
              </button>
            </div>

            {/* Action 3: Power Outage */}
            <div className="bg-purple-950/40 border border-purple-800/50 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-purple-200">৩. কারেন্ট অফ (লোডশেডিং)</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    বাকি: {2 - saboteurState.blackoutUsed}/২
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  ৫ সেকেন্ডের জন্য দোকানদারের স্ক্রিনে অন্ধকার নামিয়ে দিন।
                </p>
              </div>

              <button
                disabled={saboteurState.blackoutUsed >= 2}
                onClick={() => {
                  onTriggerBlackout();
                  sound.playBlackout();
                }}
                className={`mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  saboteurState.blackoutUsed < 2
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                ⚡ কারেন্ট বন্ধ করুন (+৩pt)
              </button>
            </div>
          </div>

          {/* Action 4: Tease / Dalali quick triggers */}
          <div className="bg-purple-950/20 border border-purple-800/30 rounded-xl p-2.5">
            <p className="text-[11px] font-semibold text-purple-200 mb-1.5">
              🗣️ টিজিং ও দালালি (দোকানদারকে বিভ্রান্ত করুন):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SABOTEUR_TEASE_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => onSendTease(msg)}
                  className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-[10px] px-2.5 py-1 rounded-lg border border-purple-700/40 transition-colors"
                >
                  "{msg}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
