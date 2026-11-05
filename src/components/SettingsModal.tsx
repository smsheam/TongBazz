/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogle, logOut } from '../services/firebase';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  onUserChanged: (u: FirebaseUser | null) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: 'BN' | 'EN';
  onChangeLanguage: (l: 'BN' | 'EN') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserChanged,
  isMuted,
  onToggleMute,
  language,
  onChangeLanguage,
}) => {
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    const loggedUser = await signInWithGoogle();
    if (loggedUser) {
      sound.playSuccess();
      onUserChanged(loggedUser);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    onUserChanged(null);
    sound.playRickshawBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="bg-[#161a24] border-2 border-amber-500/60 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h3 className="font-bold text-amber-400 text-lg">সেটিংস (Settings)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-1">
            ✕
          </button>
        </div>

        {/* Google Authentication Section */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-300 block">
            গুগল অ্যাকাউন্ট ও প্রোফাইল (Google Account):
          </span>

          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full border border-amber-400 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl p-1 bg-slate-800 rounded-full">🧔</span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {user.displayName || 'Google User'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="py-1.5 px-3 bg-slate-800 hover:bg-red-950 text-red-300 border border-slate-700 rounded-xl text-xs font-semibold"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google দিয়ে সাইন ইন করুন (Save Progress)
              </button>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                লগইন করলে আপনার টং দোকান ও অর্জিত ট্রফি ফায়ারবেসে স্থায়ীভাবে সংরক্ষিত থাকবে।
              </p>
            </div>
          )}
        </div>

        {/* Audio Sound Settings */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-200 block">সাউন্ড এফেক্টস (Web Audio API):</span>
            <p className="text-[10px] text-slate-400">রিকশার ঘণ্টা, কেটলির বাঁশি, চা ঢালার শব্দ</p>
          </div>
          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
              !isMuted
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-red-950/40 border-red-500 text-red-300'
            }`}
          >
            {isMuted ? '🔇 সাউন্ড বন্ধ' : '🔊 সাউন্ড চালু'}
          </button>
        </div>

        {/* Language Switch */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-200 block">ভাষা (Language):</span>
            <p className="text-[10px] text-slate-400">বাংলা-প্রথম ইন্টারফেস</p>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onChangeLanguage('BN')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                language === 'BN' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => onChangeLanguage('EN')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                language === 'EN' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Vercel Deployment Note */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
          <p className="text-amber-300 font-semibold flex items-center gap-1">
            ▲ Vercel ডেপ্লয়মেন্ট অপটিমাইজড:
          </p>
          <p>
            প্রজেক্টটিতে <code className="text-slate-300 bg-slate-900 px-1 rounded">vercel.json</code>{' '}
            যুক্ত রয়েছে। গিটহাবে পুশ করে Vercel-এ ইম্পোর্ট করলেই কোনো বাড়তি কনফিগারেশন ছাড়াই লাইভ চলবে।
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
        >
          বন্ধ করুন (Close)
        </button>
      </div>
    </div>
  );
};
