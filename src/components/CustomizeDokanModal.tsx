/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserTongDokan, saveUserDokan } from '../services/firebase';
import { sound } from '../utils/audio';

interface CustomizeModalProps {
  dokan: UserTongDokan;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: UserTongDokan) => void;
}

export const CustomizeDokanModal: React.FC<CustomizeModalProps> = ({
  dokan,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [stallName, setStallName] = useState(dokan.stallName);
  const [canopyStyle, setCanopyStyle] = useState(dokan.canopyStyle);
  const [specialtyItem, setSpecialtyItem] = useState(dokan.specialtyItem);
  const [benchColor, setBenchColor] = useState(dokan.benchColor);
  const [slogan, setSlogan] = useState(dokan.slogan);
  const [avatar, setAvatar] = useState(dokan.avatar);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updated: UserTongDokan = {
      ...dokan,
      stallName: stallName.trim() || 'মায়ের দোয়া টি স্টল',
      canopyStyle,
      specialtyItem: specialtyItem.trim() || 'স্পেশাল মালাই চা',
      benchColor,
      slogan: slogan.trim() || 'বাকি চাহিয়া লজ্জা দিবেন না!',
      avatar,
    };

    await saveUserDokan(updated);
    sound.playCashRegister();
    setIsSaving(false);
    onSaved(updated);
    onClose();
  };

  const CANOPIES = [
    { id: 'STRIPED_YELLOW', nameBn: 'হলুদ-সাদা ডোরাকাটা (ক্লাসিক)', bg: 'from-amber-500 via-amber-400 to-amber-600' },
    { id: 'BLUE_TIN', nameBn: 'নীল টিনের চালা', bg: 'from-sky-700 via-sky-600 to-sky-800' },
    { id: 'GREEN_RED', nameBn: 'লাল-সবুজ দেশি চালা', bg: 'from-emerald-700 via-red-600 to-emerald-800' },
    { id: 'BAMBOO_THATCH', nameBn: 'বাঁশের খাঁটি ছাউনি', bg: 'from-yellow-800 via-amber-700 to-yellow-900' },
  ];

  const BENCHES = [
    { id: 'RED_PLASTIC', nameBn: '🔴 লাল প্লাস্টিক টুল', color: 'bg-red-600 text-white' },
    { id: 'BLUE_PLASTIC', nameBn: '🔵 নীল প্লাস্টিক টুল', color: 'bg-blue-600 text-white' },
    { id: 'WOODEN', nameBn: '🪵 কাঠের লম্বা বেঞ্চ', color: 'bg-amber-800 text-amber-100' },
  ];

  const AVATARS = ['🧔', '👨‍🎓', '👩‍💻', '👨‍🏫', '👨‍⚕️', '🧕', '👨‍🌾', '👮‍♂️', '👩‍💼'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#161a24] border-2 border-amber-500/60 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 my-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛠️</span>
            <div>
              <h3 className="font-bold text-amber-400 text-lg">আপনার নিজস্ব টং দোকান কাস্টমাইজ করুন</h3>
              <p className="text-xs text-slate-400">
                দোকানের নাম, ছাউনি, স্পেশাল চা ও সাইনবোর্ড আপনার নিজের মতো সাজান।
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-1">
            ✕
          </button>
        </div>

        {/* Live Stall Preview Card */}
        <div className="bg-slate-900/90 border border-amber-600/40 rounded-2xl p-4 text-center relative overflow-hidden">
          <div className={`h-8 w-full rounded-t-xl bg-gradient-to-r ${CANOPIES.find(c => c.id === canopyStyle)?.bg} flex items-center justify-center text-xs font-bold text-white shadow`}>
            {stallName || 'দোকানের নাম'}
          </div>
          <div className="py-4 flex flex-col items-center">
            <div className="relative">
              <img
                src="/assets/aistudio/image_62254eee.png"
                alt="Customized Dokan"
                className="w-28 h-28 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 text-2xl">{avatar}</span>
            </div>
            <p className="text-xs font-bold text-amber-300 mt-2">স্পেশাল আইটেম: {specialtyItem}</p>
            <p className="text-[11px] text-slate-400 italic mt-0.5 max-w-md">"{slogan}"</p>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Dokan Name */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">দোকানের নাম (Stall Name):</label>
            <input
              type="text"
              value={stallName}
              onChange={(e) => setStallName(e.target.value)}
              placeholder="যেমন: বুয়েট মামার টং"
              maxLength={40}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* Specialty Item */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">সিগনেচার স্পেশাল চা / স্ন্যাক্স:</label>
            <input
              type="text"
              value={specialtyItem}
              onChange={(e) => setSpecialtyItem(e.target.value)}
              placeholder="যেমন: জাফরানি কড়াক মালাই চা"
              maxLength={35}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* Canopy Style */}
          <div className="md:col-span-2">
            <label className="font-bold text-slate-300 block mb-1.5">ছাউনির স্টাইল (Canopy Style):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANOPIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCanopyStyle(c.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    canopyStyle === c.id
                      ? 'border-amber-400 bg-amber-500/20 text-white font-bold ring-1 ring-amber-400'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div className={`h-3 rounded mb-1.5 bg-gradient-to-r ${c.bg}`} />
                  <span className="text-[11px] block">{c.nameBn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stool / Bench Color */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">টুল ও বসার বেঞ্চ:</label>
            <div className="space-y-1.5">
              {BENCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBenchColor(b.id as any)}
                  className={`w-full p-2 rounded-xl border text-left transition-all ${
                    benchColor === b.id
                      ? 'border-amber-400 bg-amber-500/20 font-bold'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {b.nameBn}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar / Mama Mascot */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">দোকানদার মামা / অবতার:</label>
            <div className="grid grid-cols-5 gap-1.5">
              {AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`h-10 text-xl rounded-xl border flex items-center justify-center transition-all ${
                    avatar === av
                      ? 'border-amber-400 bg-amber-500/20 scale-105'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Wall Slogan */}
          <div className="md:col-span-2">
            <label className="font-bold text-slate-300 block mb-1">সাইনবোর্ডের বানী / স্লোগান:</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="যেমন: বাকি চাহিয়া লজ্জা দিবেন না! নগদ চায়ে আসল সুখ।"
              maxLength={80}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
          >
            বাতিল (Cancel)
          </button>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-transform hover:scale-[1.01]"
          >
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : '✓ টং দোকান সংরক্ষণ করুন (Save)'}
          </button>
        </div>
      </div>
    </div>
  );
};
