/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaboteurState } from '../types/game';
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
  const [isOpen, setIsOpen] = useState(true);

  const TEASES = [
    'মামা, দোকান চালান নাকি দিনে দুপুরে ঘুমান?',
    'এক কাপ চা বানাইতে কি এক ঘণ্টা লাগব?',
    'চায়ে পানি বেশি নাকি পানিতে চা পাতা ফেলেছেন?',
    'পাশের দোকানে মালাই চা মাখনের মতো বানায়!',
    'ভাইয়েরা, চায়ে চিনি নাই, অর্ডার ক্যানসেল করেন!',
  ];

  return (
    <div className="bg-purple-50 border-2 border-purple-400 rounded-2xl p-3 shadow-md text-stone-800 space-y-2.5">
      <div className="flex items-center justify-between border-b border-purple-200 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🕵️</span>
          <div>
            <h3 className="font-bold text-purple-900 text-xs">
              গোপন গোলমালবাজ প্যানেল (Secret Saboteur)
            </h3>
            <p className="text-[10px] text-purple-700">ধরা না পড়ে দোকানে বিভ্রান্তি সৃষ্টি করুন!</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] bg-purple-200 hover:bg-purple-300 text-purple-900 px-2 py-0.5 rounded-md font-bold"
        >
          {isOpen ? 'লুকান ▲' : 'খুলুন ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Action 1: Fake order */}
            <div className="bg-white border border-purple-200 rounded-xl p-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center font-bold text-purple-900 text-[11px]">
                  <span>১. ভুয়া অর্ডার (Fake)</span>
                  <span className="text-purple-600 font-mono text-[10px]">
                    {2 - saboteurState.fakeOrdersUsed}/২
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5">৩ সেকেন্ড পর নিজে থেকেই উধাও হবে।</p>
              </div>
              <button
                disabled={saboteurState.fakeOrdersUsed >= 2}
                onClick={() => {
                  onFakeOrder();
                  sound.playBreakingNews();
                }}
                className={`mt-1.5 py-1 px-2 rounded-lg font-bold text-[10px] ${
                  saboteurState.fakeOrdersUsed < 2
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-2xs'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                🚨 ভুয়া অর্ডার পাঠান (+৩pt)
              </button>
            </div>

            {/* Action 2: Trigger Rain */}
            <div className="bg-white border border-purple-200 rounded-xl p-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center font-bold text-purple-900 text-[11px]">
                  <span>২. বৃষ্টি নামাও (Rain)</span>
                  <span className="text-purple-600 font-mono text-[10px]">
                    {1 - saboteurState.rainUsed}/১
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5">কাস্টমারদের অতিরিক্ত চায়ের চাহিদা তৈরি করুন।</p>
              </div>
              <button
                disabled={saboteurState.rainUsed >= 1}
                onClick={() => {
                  onTriggerRain();
                  sound.playThunder();
                }}
                className={`mt-1.5 py-1 px-2 rounded-lg font-bold text-[10px] ${
                  saboteurState.rainUsed < 1
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xs'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                🌧️ বৃষ্টি নামান (+৪pt)
              </button>
            </div>

            {/* Action 3: Power Outage */}
            <div className="bg-white border border-purple-200 rounded-xl p-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center font-bold text-purple-900 text-[11px]">
                  <span>৩. লোডশেডিং (Blackout)</span>
                  <span className="text-purple-600 font-mono text-[10px]">
                    {2 - saboteurState.blackoutUsed}/২
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5">৫ সেকেন্ডের জন্য স্ক্রিন অন্ধকার করুন।</p>
              </div>
              <button
                disabled={saboteurState.blackoutUsed >= 2}
                onClick={() => {
                  onTriggerBlackout();
                  sound.playBlackout();
                }}
                className={`mt-1.5 py-1 px-2 rounded-lg font-bold text-[10px] ${
                  saboteurState.blackoutUsed < 2
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-2xs'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                ⚡ কারেন্ট বন্ধ (+৩pt)
              </button>
            </div>
          </div>

          {/* Misleading Teases */}
          <div className="bg-white border border-purple-200 rounded-xl p-2">
            <p className="text-[10px] font-bold text-purple-900 mb-1">
              🗣️ বিভ্রান্তিকর তথ্য ও টিজিং (চ্যাটে পাঠান):
            </p>
            <div className="flex flex-wrap gap-1">
              {TEASES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => onSendTease(msg)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-950 text-[10px] px-2 py-0.5 rounded-lg border border-purple-200 transition-colors"
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
