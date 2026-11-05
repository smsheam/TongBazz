/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameRoom, Player, BotDifficulty } from '../types/game';
import { sound } from '../utils/audio';

interface LobbyProps {
  room: GameRoom | null;
  currentPlayer: Player | null;
  onCreateRoom: (hostName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  onAddBot: (difficulty: BotDifficulty) => void;
  onRemoveBot: (botId: string) => void;
  onStartMatch: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  room,
  currentPlayer,
  onCreateRoom,
  onJoinRoom,
  onAddBot,
  onRemoveBot,
  onStartMatch,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<BotDifficulty>('NORMAL');
  const [isJoining, setIsJoining] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // If room exists, show Room Waiting Screen
  if (room && currentPlayer) {
    const isHost = room.hostId === currentPlayer.id;
    const canStart = room.players.length >= 4 && room.players.length <= 6;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 py-4 px-3">
        {/* Room Header */}
        <div className="bg-[#151922] border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/80 pb-3 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">☕</span>
                <h2 className="text-2xl font-black text-amber-400">টংবাজ রুম লবি</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                বন্ধুদের সাথে কোড শেয়ার করুন অথবা বট যোগ করে ৪–৬ জন পূর্ণ করুন।
              </p>
            </div>

            <div className="bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                রুম কোড (Room Code)
              </span>
              <span className="text-xl font-mono font-black text-amber-300 tracking-widest select-all">
                {room.roomCode}
              </span>
            </div>
          </div>

          {/* Player Seats Grid (4-6 Players) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                👥 অংশগ্রহণকারী ({room.players.length}/৬ জন):
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {room.players.length < 4
                  ? `ম্যাচ শুরুর জন্য আরও ${4 - room.players.length} জন লাগবে`
                  : 'ম্যাচ শুরু করার জন্য প্রস্তুত!'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {room.players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`bg-slate-800/80 border rounded-2xl p-3 flex items-center justify-between shadow ${
                    p.id === currentPlayer.id
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0 p-1 bg-slate-900 rounded-xl">
                      {p.avatar}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-100 truncate">
                        {p.name} {p.id === currentPlayer.id ? '(আপনি)' : ''}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {p.isHost ? '👑 হোস্ট' : p.isBot ? `🤖 বট (${p.botDifficulty})` : 'খেলোয়াড়'}
                      </p>
                    </div>
                  </div>

                  {isHost && p.isBot && (
                    <button
                      onClick={() => onRemoveBot(p.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {/* Empty seats placeholders */}
              {Array.from({ length: 6 - room.players.length }).map((_, i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-slate-700/80 rounded-2xl p-3 flex items-center justify-center text-slate-500 text-xs"
                >
                  খালি আসন #{room.players.length + i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Host Bot Controls */}
          {isHost && room.players.length < 6 && (
            <div className="mt-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-300">🤖 AI বট যোগ করুন</h4>
                  <p className="text-[11px] text-slate-400">
                    বটরা আসল খেলোয়াড়ের মতোই খাবার অর্ডার দেয়, চা বানায় ও ষড়যন্ত্র করে!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as BotDifficulty)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-hidden"
                  >
                    <option value="EASY">সহজ বট (Easy)</option>
                    <option value="NORMAL">স্বাভাবিক বট (Normal)</option>
                    <option value="HARD">কঠিন বট (Hard)</option>
                  </select>

                  <button
                    onClick={() => {
                      onAddBot(selectedDifficulty);
                      sound.playRickshawBell();
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    + বট যোগ করুন
                  </button>

                  <button
                    onClick={() => {
                      const needed = 4 - room.players.length;
                      if (needed > 0) {
                        for (let k = 0; k < needed; k++) {
                          onAddBot(selectedDifficulty);
                        }
                        sound.playRickshawBell();
                      }
                    }}
                    className="bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-slate-950 border border-amber-500 text-xs font-bold px-3 py-1.5 rounded-xl"
                  >
                    ⚡ ৪ জন পূর্ণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="mt-5 pt-3 border-t border-slate-700/80">
            {isHost ? (
              <button
                disabled={!canStart}
                onClick={() => {
                  onStartMatch();
                  sound.playKettleWhistle();
                }}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl ${
                  canStart
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 cursor-pointer hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {canStart
                  ? '🚀 টংয়ের খেলা শুরু করুন! (Start Match)'
                  : `ম্যাচ শুরুর জন্য কমপক্ষে ৪ জন খেলোয়াড় দরকার (${room.players.length}/৪)`}
              </button>
            ) : (
              <p className="text-center text-xs text-amber-300 animate-pulse py-2">
                হোস্ট ম্যাচ শুরু করার অপেক্ষায়...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial Welcome Screen (Create or Join)
  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Brand Hero */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <img
            src="/assets/aistudio/image_62254eee.png"
            alt="টংবাজ লোগো"
            className="w-32 h-32 mx-auto object-contain filter drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
          টংবাজ (TONGBAJ)
        </h1>
        <p className="text-amber-200 font-semibold text-base">
          চা খাও, ধান্দা করো, টং জমাও! ☕
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          একটি রোমাঞ্চকর বাংলাদেশি মাল্টিপ্লেয়ার সামাজিক পার্টি গেম। ৪–৬ জন খেলোয়াড়, ৩ মিনিটের
          রাউন্ড, দোকানদার, কাস্টমার, গোপন ধান্দাবাজ ও ১০টি আর্কেড গেম!
        </p>
      </div>

      {/* Action Card */}
      <div className="bg-[#151922] border-2 border-amber-600/50 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Player Name Input */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">
            আপনার নাম (Your Name):
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="যেমন: রাহাত, তানভীর, সাকিব..."
            maxLength={18}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        {/* Tab switch: Create vs Join */}
        <div className="flex bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setIsJoining(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              !isJoining ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            নতুন রুম তৈরি করুন (Create)
          </button>
          <button
            onClick={() => setIsJoining(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              isJoining ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            কোড দিয়ে প্রবেশ (Join)
          </button>
        </div>

        {/* Join Code Input (if joining) */}
        {isJoining && (
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              রুম কোড (Room Code):
            </label>
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="যেমন: TONG-89"
              maxLength={10}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-300 uppercase placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>
        )}

        {/* Submit Button */}
        <div>
          {isJoining ? (
            <button
              disabled={!nameInput.trim() || !roomCodeInput.trim()}
              onClick={() => {
                onJoinRoom(roomCodeInput.trim(), nameInput.trim());
                sound.playRickshawBell();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              রুমে প্রবেশ করুন 🚪
            </button>
          ) : (
            <button
              disabled={!nameInput.trim()}
              onClick={() => {
                onCreateRoom(nameInput.trim());
                sound.playRickshawBell();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              রুম তৈরি করুন (Host Room) ☕
            </button>
          )}
        </div>

        {/* Rules button */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-xs text-amber-300/80 hover:text-amber-300 underline"
          >
            {showRules ? 'নিয়মাবলী বন্ধ করুন ▲' : 'টংবাজ খেলার নিয়মাবলী দেখুন ▼'}
          </button>
        </div>

        {showRules && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-2 text-left">
            <p className="font-bold text-amber-300 text-sm">টংবাজ কীভাবে খেলবেন?</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
              <li>প্রত্যেক রাউন্ডে একজন দোকানদার এবং বাকিরা কাস্টমার।</li>
              <li>দোকানদার ২০০০ টাকার পাইকারি মালামাল কিনে ৩ মিনিটে দোকান চালায়।</li>
              <li>অর্ডার আসার পর মাত্র ৫ সেকেন্ডের মধ্যে তা দোকানদারের চোখ থেকে মিলিয়ে যায়!</li>
              <li>কাস্টমারদের মধ্যে একজন গোপন ধান্দাবাজ—যার কাজ লোডশেডিং, বৃষ্টি ও ভুয়া অর্ডার দেওয়া!</li>
              <li>কাস্টমাররা ১০টি বিভিন্ন আর্কেড মিনি-গেম খেলে তাদের পেশা মিশন পূর্ণ করে।</li>
              <li>সবাই একটি করে দোকানদার রাউন্ড খেলার পর চ্যাম্পিয়ন ট্রফি দেওয়া হয়!</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
