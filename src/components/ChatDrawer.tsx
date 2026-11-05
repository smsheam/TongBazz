/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChatMessage, Player } from '../types/game';
import { QUICK_CHAT_MESSAGES } from '../data/gameData';
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

  return (
    <div className="bg-[#141822] border border-slate-700/80 rounded-2xl p-3.5 shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h4 className="font-bold text-slate-200 text-sm">টংয়ের আড্ডা ও চ্যাট</h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-white"
        >
          {isExpanded ? 'ছোট করুন ▲' : 'বড় করুন ▼'}
        </button>
      </div>

      {/* Messages Feed */}
      <div
        className={`space-y-2 overflow-y-auto pr-1 transition-all ${
          isExpanded ? 'max-h-72' : 'max-h-36'
        }`}
      >
        {messages.length === 0 ? (
          <p className="text-[11px] text-slate-500 text-center py-4">এখনো কোনো কথা হয়নি...</p>
        ) : (
          messages.map((msg) => {
            if (msg.isBreakingNews) {
              return (
                <div
                  key={msg.id}
                  className="bg-red-950/80 border border-red-500/60 rounded-xl p-2 text-xs text-red-200 animate-pulse font-semibold"
                >
                  {msg.text}
                </div>
              );
            }

            const isMine = msg.senderId === currentPlayer.id;
            return (
              <div
                key={msg.id}
                className={`text-xs p-2 rounded-xl border ${
                  isMine
                    ? 'bg-amber-600/20 border-amber-500/40 text-amber-100 ml-4'
                    : msg.isSystem
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 italic'
                    : msg.isSaboteurTease
                    ? 'bg-purple-950/40 border-purple-700/40 text-purple-200 mr-4'
                    : 'bg-slate-800/60 border-slate-700 mr-4 text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-300">{msg.senderName}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className="break-words">{msg.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Chat Bangla Presets */}
      <div className="pt-2 border-t border-slate-700/60 mt-2">
        <p className="text-[10px] text-slate-400 mb-1 font-semibold">টংয়ের পরিচিত ডায়লগ:</p>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {QUICK_CHAT_MESSAGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                onQuickChat(preset.text, preset.reply);
                sound.playTeaPour();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-md text-[10px] border border-slate-700 truncate max-w-[150px]"
            >
              {preset.text}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-1.5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="কিছু বলুন..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold"
        >
          পাঠান
        </button>
      </form>
    </div>
  );
};
