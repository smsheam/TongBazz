/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface ArcadeModalProps {
  miniGameId: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
}

export const ArcadeModal: React.FC<ArcadeModalProps> = ({
  miniGameId,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [gameState, setGameState] = useState<'INTRO' | 'PLAYING' | 'SUCCESS' | 'FAILED'>('INTRO');
  const [timeLeft, setTimeLeft] = useState<number>(25);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('FAILED');
          sound.playBuzzer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, gameState]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setGameState('SUCCESS');
    sound.playSuccess();
    setTimeout(() => {
      onComplete(true);
      onClose();
    }, 1500);
  };

  const handleFail = () => {
    setGameState('FAILED');
    sound.playBuzzer();
    setTimeout(() => {
      onComplete(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#181d28] border border-amber-600/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <div>
              <h3 className="font-bold text-amber-400 text-lg">পেশাগত মিনি-গেম আর্কেড</h3>
              <p className="text-xs text-slate-400">সফল হলে +৫ পয়েন্ট ও পেশা মিশন সম্পন্ন!</p>
            </div>
          </div>
          {gameState === 'PLAYING' && (
            <div className="bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300">
              ⏱️ {timeLeft}s
            </div>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Content based on miniGameId */}
        {gameState === 'INTRO' && (
          <div className="py-6 text-center space-y-4">
            <div className="text-5xl">🎯</div>
            <h4 className="text-xl font-bold text-slate-100">
              {getMiniGameTitle(miniGameId)}
            </h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {getMiniGameInstruction(miniGameId)}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setTimeLeft(25);
                  setGameState('PLAYING');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                খেলা শুরু করুন! (Start)
              </button>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="py-2">
            <GameRenderer
              gameId={miniGameId}
              onSuccess={handleSuccess}
              onFail={handleFail}
            />
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="text-6xl animate-bounce">🎉</div>
            <h4 className="text-2xl font-bold text-emerald-400">অসাধারণ! আপনি বিজয়ী!</h4>
            <p className="text-sm text-slate-300">পেশাগত চ্যালেঞ্জ সফলভাবে শেষ হয়েছে। (+৫ পয়েন্ট)</p>
          </div>
        )}

        {gameState === 'FAILED' && (
          <div className="py-8 text-center space-y-3">
            <div className="text-6xl">💥</div>
            <h4 className="text-2xl font-bold text-red-400">সময় শেষ বা ভুল উত্তর!</h4>
            <p className="text-sm text-slate-300">পরের রাউন্ডে আবার চেষ্টা করবেন।</p>
          </div>
        )}
      </div>
    </div>
  );
};

function getMiniGameTitle(id: string): string {
  switch (id) {
    case 'calculator': return 'হিসাবের গোলমাল (Quick Calculator)';
    case 'memory': return 'মনে আছে তো? (Memory Challenge)';
    case 'pipes': return 'পাইপলাইন ঠিক করেন (Pipe Puzzle)';
    case 'traffic': return 'যানজট ছাড়ান (Traffic Control)';
    case 'wordsearch': return 'শব্দ খুঁজে বের করেন (Word Finder)';
    case 'sorting': return 'মাল গুছান (Sorting Challenge)';
    case 'emergency': return 'জরুরি ব্যবস্থা (Emergency Response)';
    case 'maze': return 'রাস্তা খুঁজে বের করেন (Route Finder)';
    case 'pattern': return 'পরের সংখ্যাটা কী? (Pattern Master)';
    case 'detective': return 'কে মিথ্যা বলছে? (Detective Challenge)';
    default: return 'টংবাজ আর্কেড চ্যালেঞ্জ';
  }
}

function getMiniGameInstruction(id: string): string {
  switch (id) {
    case 'calculator': return 'টংয়ের চায়ের হিসাবটি ঝটপট ক্যালকুলেট করে সঠিক উত্তর নির্বাচন করুন।';
    case 'memory': return 'কিছুক্ষণ পর ছবিগুলো লুকিয়ে যাবে, সঠিক আইটেমগুলো বেছে বের করুন।';
    case 'pipes': return 'পাইপের অংশ ঘুরিয়ে পানির কল থেকে চায়ের কেটলিতে পানি পৌঁছান।';
    case 'traffic': return 'সিগন্যাল অন/অফ করে ট্রাফিক জ্যাম ছাড়াই রিকশা ও সিএনজি পার করুন।';
    case 'wordsearch': return 'বর্ণের গ্রিড থেকে নির্দেশিত শব্দটি খুঁজে বের করুন।';
    case 'sorting': return 'খাবার ও চায়ের আইটেমগুলোকে সঠিক বক্সে বাছাই করে ফেলুন।';
    case 'emergency': return 'নিরাপত্তা নিশ্চিত করতে সঠিক ক্রমানুসারে পদক্ষেপগুলো ক্লিক করুন।';
    case 'maze': return 'চায়ের কাপটি গর্ত এড়িয়ে কাস্টমারের টেবিলে নিরাপদে পৌঁছে দিন।';
    case 'pattern': return 'সংখ্যার ক্রমটি দেখে পরবর্তী সংখ্যাটি বেছে নিন।';
    case 'detective': return 'কাস্টমারদের বক্তব্য শুনে খুঁজে বের করুন কে মিথ্যা কথা বলছে!';
    default: return 'সঠিক নিয়মে চ্যালেঞ্জটি সম্পন্ন করুন।';
  }
}

// -------------------------------------------------------------
// INDIVIDUAL MINI-GAME LOGIC COMPONENTS
// -------------------------------------------------------------

interface SubGameProps {
  gameId: string;
  onSuccess: () => void;
  onFail: () => void;
}

const GameRenderer: React.FC<SubGameProps> = ({ gameId, onSuccess, onFail }) => {
  switch (gameId) {
    case 'calculator':
      return <CalculatorGame onSuccess={onSuccess} onFail={onFail} />;
    case 'memory':
      return <MemoryGame onSuccess={onSuccess} onFail={onFail} />;
    case 'pipes':
      return <PipesGame onSuccess={onSuccess} />;
    case 'traffic':
      return <TrafficGame onSuccess={onSuccess} onFail={onFail} />;
    case 'wordsearch':
      return <WordSearchGame onSuccess={onSuccess} />;
    case 'sorting':
      return <SortingGame onSuccess={onSuccess} onFail={onFail} />;
    case 'emergency':
      return <EmergencyGame onSuccess={onSuccess} onFail={onFail} />;
    case 'maze':
      return <MazeGame onSuccess={onSuccess} />;
    case 'pattern':
      return <PatternGame onSuccess={onSuccess} onFail={onFail} />;
    case 'detective':
      return <DetectiveGame onSuccess={onSuccess} onFail={onFail} />;
    default:
      return <CalculatorGame onSuccess={onSuccess} onFail={onFail} />;
  }
};

// 1. Quick Calculator
const CalculatorGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  // Question: ৩ কাপ দুধ চা (@ ৳১৫) + ২টা সিঙ্গারা (@ ৳১০) = ?
  // 3 * 15 = 45; 2 * 10 = 20; Total = 65
  const options = [55, 65, 75, 70];
  return (
    <div className="space-y-4 text-center">
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
        <p className="text-base text-amber-200 font-medium">
          ৩ কাপ দুধ চা (প্রতি কাপ ৳১৫) + ২টা সিঙ্গারা (প্রতিটা ৳১০)
        </p>
        <p className="text-sm text-slate-400 mt-1">মোট বিল কত টাকা হবে?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              if (opt === 65) onSuccess();
              else onFail();
            }}
            className="p-3 bg-slate-800 hover:bg-amber-600 rounded-xl text-lg font-bold border border-slate-700 hover:text-slate-950 transition-colors"
          >
            ৳{opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. Memory Game
const MemoryGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  const targetItems = ['☕', '🍌', '🍞', '🫖', '🍪'];
  const allGrid = ['☕', '🍌', '🍞', '🫖', '🍪', '🥚', '🥛', '🍋', '🍗'];
  const [phase, setPhase] = useState<'SHOW' | 'PICK'>('SHOW');
  const [selected, setSelected] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('PICK');
    }
  }, [countdown]);

  const handleSelect = (item: string) => {
    if (selected.includes(item)) return;
    const next = [...selected, item];
    setSelected(next);
    if (!targetItems.includes(item)) {
      onFail();
      return;
    }
    if (next.length === targetItems.length) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4 text-center">
      {phase === 'SHOW' ? (
        <div>
          <p className="text-xs text-amber-300 font-bold mb-2">
            মনোযোগ দিয়ে দেখুন ({countdown} সেকেন্ড):
          </p>
          <div className="flex justify-center gap-2 p-4 bg-slate-900 rounded-xl">
            {targetItems.map((item, i) => (
              <span key={i} className="text-3xl p-2 bg-slate-800 rounded-lg">
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-slate-300 mb-2">
            যে ৫টি আইটেম দেখেছিলেন সেগুলোতে ক্লিক করুন ({selected.length}/৫):
          </p>
          <div className="grid grid-cols-3 gap-2">
            {allGrid.map((item, i) => {
              const isPicked = selected.includes(item);
              return (
                <button
                  key={i}
                  disabled={isPicked}
                  onClick={() => handleSelect(item)}
                  className={`text-3xl p-3 rounded-xl border transition-all ${
                    isPicked
                      ? 'bg-emerald-800/60 border-emerald-500 opacity-60'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:scale-105'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Pipe Puzzle Game
const PipesGame: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  // 3 segments between tap and kettle
  const [angles, setAngles] = useState<number[]>([90, 180, 270]);
  const handleRotate = (idx: number) => {
    const next = [...angles];
    next[idx] = (next[idx] + 90) % 360;
    setAngles(next);
    // Solved when all are aligned to 0 or 180 (horizontal alignment)
    if (next.every((a) => a === 0 || a === 180)) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-xs text-slate-300">
        পাইপে ক্লিক করে ঘুরান যাতে পানির কল 🚰 থেকে কেটলি 🫖 পর্যন্ত সোজা সংযোগ তৈরি হয়:
      </p>
      <div className="flex items-center justify-center gap-3 p-4 bg-slate-900 rounded-xl">
        <span className="text-3xl">🚰</span>
        {angles.map((angle, idx) => (
          <button
            key={idx}
            onClick={() => handleRotate(idx)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-amber-500/50 rounded-lg flex items-center justify-center text-2xl transition-transform"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            ━
          </button>
        ))}
        <span className="text-3xl">🫖</span>
      </div>
      <p className="text-[11px] text-amber-300/80">পাইপ সোজা সমান্তরাল করুন</p>
    </div>
  );
};

// 4. Traffic Control Game
const TrafficGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  const [signalGreen, setSignalGreen] = useState<boolean>(false);
  const [passedCount, setPassedCount] = useState<number>(0);
  const [vehicle, setVehicle] = useState<'RICKSHAW' | 'CNG' | 'PEDESTRIAN'>('RICKSHAW');

  useEffect(() => {
    const interval = setInterval(() => {
      // Vehicle arrives
      if (signalGreen) {
        setPassedCount((c) => {
          const next = c + 1;
          if (next >= 3) {
            onSuccess();
          }
          return next;
        });
        // Switch next vehicle
        const types: ('RICKSHAW' | 'CNG' | 'PEDESTRIAN')[] = ['RICKSHAW', 'CNG', 'PEDESTRIAN'];
        setVehicle(types[Math.floor(Math.random() * types.length)]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [signalGreen, onSuccess]);

  return (
    <div className="space-y-4 text-center">
      <p className="text-xs text-slate-300">
        ট্রাফিক সিগন্যাল সবুজ করে ৩টি রিকশা/সিএনজি পার করুন:
      </p>
      <div className="bg-slate-900 p-4 rounded-xl flex flex-col items-center gap-3">
        <div className="text-4xl">
          {vehicle === 'RICKSHAW' ? '🚲 রিকশা' : vehicle === 'CNG' ? '🛺 সিএনজি' : '🚶 পথচারী'}
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSignalGreen(!signalGreen)}
            className={`px-4 py-2 rounded-xl font-bold border transition-colors ${
              signalGreen
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-red-600 text-white border-red-400'
            }`}
          >
            {signalGreen ? '🟢 সিগন্যাল: সবুজ (যানবাহন চলছে)' : '🔴 সিগন্যাল: লাল (থামান)'}
          </button>
        </div>
        <p className="text-xs text-amber-300 font-mono">পার হয়েছে: {passedCount}/৩</p>
      </div>
    </div>
  );
};

// 5. Word Finder
const WordSearchGame: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const target = ['ট', 'ং', 'বা', 'জ'];
  const [clicked, setClicked] = useState<number[]>([]);

  const grid = [
    ['ট', 'দ', 'ম'],
    ['ং', 'চ', 'হ'],
    ['বা', 'জ', 'ক'],
  ];

  const handleCell = (val: string, index: number) => {
    if (clicked.includes(index)) return;
    const nextClicked = [...clicked, index];
    setClicked(nextClicked);
    if (nextClicked.length === 4) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-3 text-center">
      <p className="text-xs text-slate-300">
        শব্দ খুঁজুন: <span className="font-bold text-amber-400 text-sm">ট ং বা জ</span>
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {grid.flat().map((char, idx) => (
          <button
            key={idx}
            onClick={() => handleCell(char, idx)}
            className={`h-12 text-lg font-bold rounded-lg border ${
              clicked.includes(idx)
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};

// 6. Sorting Game
const SortingGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  const items = [
    { name: 'দুধ চা', type: 'TEA' },
    { name: 'সিঙ্গারা', type: 'FOOD' },
    { name: 'মালাই চা', type: 'TEA' },
    { name: 'বনরুটি', type: 'FOOD' },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSort = (type: 'TEA' | 'FOOD') => {
    if (items[currentIndex].type === type) {
      if (currentIndex + 1 >= items.length) {
        onSuccess();
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      onFail();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-xs text-slate-300">আইটেমটি সঠিক ক্যাটাগরিতে বাছাই করুন:</p>
      <div className="bg-slate-900 p-4 rounded-xl">
        <span className="text-2xl font-bold text-amber-300">
          {items[currentIndex].name}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSort('TEA')}
          className="p-3 bg-amber-600/30 hover:bg-amber-600 border border-amber-500 rounded-xl font-bold"
        >
          ☕ চা ও পানীয়
        </button>
        <button
          onClick={() => handleSort('FOOD')}
          className="p-3 bg-blue-600/30 hover:bg-blue-600 border border-blue-500 rounded-xl font-bold"
        >
          🥐 খাবার ও স্ন্যাক্স
        </button>
      </div>
    </div>
  );
};

// 7. Emergency Response Game
const EmergencyGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  const steps = [
    { id: 1, text: '১. স্টোভ বা চুলা বন্ধ করুন' },
    { id: 2, text: '২. গ্যাস রেগুলেটর লক করুন' },
    { id: 3, text: '৩. বালতির ভেজা চট চাপা দিন' },
  ];
  const [expectedId, setExpectedId] = useState(1);

  const handleClick = (id: number) => {
    if (id === expectedId) {
      if (expectedId === 3) {
        onSuccess();
      } else {
        setExpectedId(expectedId + 1);
      }
    } else {
      onFail();
    }
  };

  return (
    <div className="space-y-3 text-center">
      <p className="text-xs text-slate-300">
        চা দোকানে আগুনের শঙ্কা! ক্রমানুসারে সঠিক পদক্ষেপে ক্লিক করুন:
      </p>
      <div className="space-y-2">
        {/* Scrambled order */}
        {[steps[1], steps[0], steps[2]].map((s) => (
          <button
            key={s.id}
            onClick={() => handleClick(s.id)}
            className="w-full p-2.5 bg-slate-800 hover:bg-amber-600 rounded-xl text-sm font-semibold border border-slate-700"
          >
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// 8. Maze Game
const MazeGame: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = { x: 2, y: 2 };

  const move = (dx: number, dy: number) => {
    const nx = Math.max(0, Math.min(2, pos.x + dx));
    const ny = Math.max(0, Math.min(2, pos.y + dy));
    setPos({ x: nx, y: ny });
    if (nx === target.x && ny === target.y) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-3 text-center">
      <p className="text-xs text-slate-300">তীরচিহ্ন দিয়ে কাস্টমারের টেবিল 🧔 পর্যন্ত যান:</p>
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto p-2 bg-slate-900 rounded-xl">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = i % 3;
          const y = Math.floor(i / 3);
          const isMe = pos.x === x && pos.y === y;
          const isTarget = target.x === x && target.y === y;
          return (
            <div
              key={i}
              className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-xl"
            >
              {isMe ? '☕' : isTarget ? '🧔' : ''}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={() => move(-1, 0)} className="px-3 py-1 bg-slate-800 rounded border">⬅️</button>
        <button onClick={() => move(0, -1)} className="px-3 py-1 bg-slate-800 rounded border">⬆️</button>
        <button onClick={() => move(0, 1)} className="px-3 py-1 bg-slate-800 rounded border">⬇️</button>
        <button onClick={() => move(1, 0)} className="px-3 py-1 bg-slate-800 rounded border">➡️</button>
      </div>
    </div>
  );
};

// 9. Pattern Master Game
const PatternGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
        <p className="text-xl font-mono text-amber-300 font-bold">৫, ১০, ২০, ৪০, ?</p>
        <p className="text-xs text-slate-400 mt-1">পরবর্তী সংখ্যাটি কত?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[50, 60, 80, 100].map((num) => (
          <button
            key={num}
            onClick={() => {
              if (num === 80) onSuccess();
              else onFail();
            }}
            className="p-3 bg-slate-800 hover:bg-amber-600 rounded-xl text-lg font-bold border border-slate-700"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

// 10. Detective Challenge Game
const DetectiveGame: React.FC<{ onSuccess: () => void; onFail: () => void }> = ({ onSuccess, onFail }) => {
  return (
    <div className="space-y-3 text-center">
      <div className="bg-slate-900 p-3 rounded-xl text-left text-xs space-y-1.5 border border-slate-700">
        <p><span className="text-amber-400 font-bold">রাহাত:</span> আমি ১ কাপ রং চা খেয়েছি (৳১০)।</p>
        <p><span className="text-amber-400 font-bold">শাকিল:</span> আমি আর রাহাত মিলে মোট ৳৩৫ বিল দিয়েছি।</p>
        <p><span className="text-amber-400 font-bold">সুমন:</span> শাকিল নিজে কিন্তু ২টা সমুচা খেয়েছিল (প্রতিটা ৳১৫)!</p>
      </div>
      <p className="text-xs text-amber-300 font-bold">
        হিসাব মিলিয়ে বলুন, কে মিথ্যা কথা বলছে?
      </p>
      <div className="space-y-2">
        <button
          onClick={onFail}
          className="w-full p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border"
        >
          রাহাত (রং চা ৳১০)
        </button>
        <button
          onClick={onSuccess} // শাকিল মিথ্যা বলছে, কারণ ১০ + ৩০ = ৪০, ৩৫ নয়!
          className="w-full p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border font-bold text-amber-300"
        >
          শাকিল (বলেছিল মোট বিল ৳৩৫)
        </button>
        <button
          onClick={onFail}
          className="w-full p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border"
        >
          সুমন (সমুচার কথা বলেছিল)
        </button>
      </div>
    </div>
  );
};
