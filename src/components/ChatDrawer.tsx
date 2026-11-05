/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChatMessage, Player } from '../types/game';
import { QUICK_CHAT_BUTTONS } from '../data/gameData';
import { sound } from '../utils/audio';

interface ChatDrawerProps {
  messages: ChatMessage[];
  currentPlayer: Player;
  onSendMessage: (text: string) => void;
  onQuickChat: (text: string, reply: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  messages,
  currentPlayer,
  onSendMessage,
  onQuickChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const getMamaReply = (text: string): string => {
    if (text.includes('কড়া')) return 'একদম কড়াক করে বানাইতেছি মামা!';
    if (text.includes('সিঙ্গারা')) return 'এইমাত্র গরম কড়াই থেকে তুললাম, দিচ্ছি!';
    if (text.includes('আরেক কাপ')) return 'গরম গরম ঢেলে দিলাম!';
    if (text.includes('চিনি কম')) return 'ঠিক আছে মামা, চিনি একদম হালকা!';
    if (text.includes('বাকি')) return 'বাকির খাতা লাল হয়ে গেছে মামা, আগে ক্যাশ ফেলেন!';
    if (text.includes('দেরি')) return 'ধৈর্য ধরেন মামা, খাঁটি মালাই তৈরি হতে সময় লাগে!';
    if (text.includes('আগে')) return 'সিরিয়াল বজায় রাখেন ভাই!';
    if (text.includes('হিসাব')) return 'হিসাব তো একদম পানির মতো পরিষ্কার!';
    return 'আলহামদুলিল্লাহ মামা!';
  };

  return (
    <div className="bg-white border-2 border-amber-300 rounded-2xl p-3 shadow-md space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">💬</span>
          <h4 className="font-bold text-stone-800 text-xs">টংয়ের তাজা আড্ডা ও চ্যাট</h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-semibold text-amber-800 hover:underline"
        >
          {isExpanded ? 'ছোট করুন ▲' : 'বড় করুন ▼'}
        </button>
      </div>

      {/* Messages Feed */}
      <div
        className={`space-y-1.5 overflow-y-auto pr-1 transition-all ${
          isExpanded ? 'max-h-56' : 'max-h-24'
        }`}
      >
        {messages.length === 0 ? (
          <p className="text-[11px] text-stone-400 text-center py-2">এখনো কোনো কথা হয়নি...</p>
        ) : (
          messages.map((msg) => {
            if (msg.isBreakingNews) {
              return (
                <div
                  key={msg.id}
                  className="bg-amber-100 border border-amber-400 rounded-lg p-1.5 text-[11px] text-amber-900 font-semibold"
                >
                  {msg.text}
                </div>
              );
            }

            const isMine = msg.senderId === currentPlayer.id;
            return (
              <div
                key={msg.id}
                className={`text-[11px] p-1.5 rounded-xl border ${
                  isMine
                    ? 'bg-amber-100 border-amber-300 text-amber-950 ml-4'
                    : msg.isSystem
                    ? 'bg-stone-100 border-stone-200 text-stone-700 italic'
                    : msg.isSaboteurTease
                    ? 'bg-purple-50 border-purple-200 text-purple-900 mr-4'
                    : 'bg-[#FFF8F0] border-amber-200 mr-4 text-stone-800'
                }`}
              >
                <div className="flex justify-between items-center text-[9px] text-stone-500 mb-0.5">
                  <span className="font-bold">{msg.senderName}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className="break-words">{msg.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* MANDATORY QUICK-REPLY BANGLA BUTTONS */}
      <div className="border-t border-amber-100 pt-1.5">
        <p className="text-[10px] text-stone-500 mb-1 font-semibold">টংয়ের কুইক ডায়লগ বাটন:</p>
        <div className="flex flex-wrap gap-1">
          {QUICK_CHAT_BUTTONS.map((btnText, idx) => (
            <button
              key={idx}
              onClick={() => {
                onQuickChat(btnText, getMamaReply(btnText));
                sound.playTeaPour();
              }}
              className="bg-[#FFF8F0] hover:bg-amber-100 text-stone-800 hover:text-amber-900 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-amber-200 transition-colors shadow-2xs"
            >
              {btnText}
            </button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="চা দোকানে কিছু বলুন..."
          className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-500"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-xl text-xs font-bold"
        >
          পাঠান
        </button>
      </form>
    </div>
  );
};
