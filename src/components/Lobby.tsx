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

  // If room exists, show Room Waiting Screen
  if (room && currentPlayer) {
    const isHost = room.hostId === currentPlayer.id;
    const canStart = room.players.length >= 4 && room.players.length <= 6;

    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 py-2 px-3 text-stone-900">
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-amber-100 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl">☕</span>
                <h2 className="text-xl font-black text-amber-900">টংবাজ রুম লবি</h2>
              </div>
              <p className="text-xs text-stone-600">
                বন্ধুদের কোড দিন বা বট দিয়ে ৪–৬ জন পূর্ণ করে খেলা শুরু করুন।
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[9px] text-stone-500 block uppercase font-bold">রুম কোড</span>
              <span className="text-lg font-mono font-black text-amber-900 tracking-wider">
                {room.roomCode}
              </span>
            </div>
          </div>

          {/* Player Seats Grid (4-6 Players) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-800">
                👥 খেলোয়াড় তালিকা ({room.players.length}/৬ জন):
              </span>
              <span className="text-[11px] text-amber-800 font-mono font-bold">
                {room.players.length < 4
                  ? `আর ${4 - room.players.length} জন লাগবে`
                  : '✓ ম্যাচ শুরুর প্রস্তুত'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className={`border rounded-xl p-2.5 flex items-center justify-between shadow-2xs ${
                    p.id === currentPlayer.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 bg-[#FFF8F0]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xl p-1 bg-white rounded-lg border border-amber-100 shrink-0">
                      {p.avatar}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {p.name} {p.id === currentPlayer.id ? '(আপনি)' : ''}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {p.isHost ? '👑 হোস্ট' : p.isBot ? `🤖 বট (${p.botDifficulty})` : 'খেলোয়াড়'}
                      </p>
                    </div>
                  </div>

                  {isHost && p.isBot && (
                    <button
                      onClick={() => onRemoveBot(p.id)}
                      className="text-red-600 hover:text-red-700 text-xs px-2 py-0.5 rounded bg-white border border-red-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {Array.from({ length: 6 - room.players.length }).map((_, i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-stone-200 rounded-xl p-2.5 flex items-center justify-center text-stone-400 text-xs"
                >
                  খালি আসন #{room.players.length + i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Host Bot Controls */}
          {isHost && room.players.length < 6 && (
            <div className="bg-[#FFF8F0] border border-amber-200 rounded-2xl p-3 space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-amber-900">🤖 AI বট যুক্ত করুন</h4>
                  <p className="text-[10px] text-stone-500">
                    বটরা আসল মানুষের মতোই খাবার অর্ডার দেয় ও গোলমাল করে!
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as BotDifficulty)}
                    className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                  >
                    <option value="EASY">সহজ (Easy)</option>
                    <option value="NORMAL">স্বাভাবিক (Normal)</option>
                    <option value="HARD">কঠিন (Hard)</option>
                  </select>

                  <button
                    onClick={() => {
                      onAddBot(selectedDifficulty);
                      sound.playRickshawBell();
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                  >
                    + বট
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
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg"
                  >
                    ⚡ ৪ জন পূর্ণ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="pt-2 border-t border-amber-100">
            {isHost ? (
              <button
                disabled={!canStart}
                onClick={() => {
                  onStartMatch();
                  sound.playKettleWhistle();
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                  canStart
                    ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                {canStart
                  ? '🚀 টংয়ের খেলা শুরু করুন! (Start Match)'
                  : `ম্যাচ শুরুর জন্য কমপক্ষে ৪ জন দরকার (${room.players.length}/৪)`}
              </button>
            ) : (
              <p className="text-center text-xs text-amber-800 animate-pulse">
                হোস্ট ম্যাচ শুরু করার অপেক্ষায়...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Welcome Form: Create or Join
  return (
    <div className="w-full max-w-md mx-auto py-4 px-3 text-stone-900 space-y-4">
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-md space-y-4">
        <div className="text-center space-y-1">
          <span className="text-3xl">☕</span>
          <h2 className="text-xl font-black text-amber-900">টংবাজ ম্যাচ লবি</h2>
          <p className="text-xs text-stone-500">রুম তৈরি করুন অথবা কোড দিয়ে প্রবেশ করুন</p>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            আপনার নাম (Player Name):
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="যেমন: তানভীর, সাকিব, রাহাত..."
            maxLength={18}
            className="w-full bg-[#FFF8F0] border border-amber-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex bg-[#FFF8F0] p-1 rounded-xl border border-amber-200">
          <button
            onClick={() => setIsJoining(false)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              !isJoining ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600'
            }`}
          >
            নতুন রুম (Create)
          </button>
          <button
            onClick={() => setIsJoining(true)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              isJoining ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600'
            }`}
          >
            কোড দিয়ে প্রবেশ (Join)
          </button>
        </div>

        {isJoining && (
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              রুম কোড (Room Code):
            </label>
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="যেমন: TONG-89"
              maxLength={10}
              className="w-full bg-[#FFF8F0] border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-900 uppercase focus:outline-hidden focus:border-amber-500"
            />
          </div>
        )}

        <div>
          {isJoining ? (
            <button
              disabled={!nameInput.trim() || !roomCodeInput.trim()}
              onClick={() => {
                onJoinRoom(roomCodeInput.trim(), nameInput.trim());
                sound.playRickshawBell();
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs disabled:opacity-40 shadow-xs"
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
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs disabled:opacity-40 shadow-xs"
            >
              রুম তৈরি করুন ☕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
