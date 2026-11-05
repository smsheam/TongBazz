/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with designated firestoreDatabaseId (as mandated)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
}

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.warn('Google Sign In Cancelled or Failed:', err);
    return null;
  }
}

// Sign Out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export interface UserTongDokan {
  id: string;
  displayName: string;
  email?: string;
  avatar: string;
  stallName: string;
  canopyStyle: 'STRIPED_YELLOW' | 'BLUE_TIN' | 'GREEN_RED' | 'BAMBOO_THATCH';
  specialtyItem: string;
  benchColor: 'RED_PLASTIC' | 'BLUE_PLASTIC' | 'WOODEN';
  slogan: string;
  totalMatchesPlayed: number;
  bestProfit: number;
}

export const DEFAULT_TONG_DOKAN: UserTongDokan = {
  id: 'guest',
  displayName: 'টংবাজ মামা',
  avatar: '🧔',
  stallName: 'মায়ের দোয়া টি স্টল',
  canopyStyle: 'STRIPED_YELLOW',
  specialtyItem: 'স্পেশাল মালাই চা ☕',
  benchColor: 'RED_PLASTIC',
  slogan: 'বাকি চাহিয়া লজ্জা দিবেন না! নগদ চায়ে আসল সুখ।',
  totalMatchesPlayed: 0,
  bestProfit: 0,
};

// Save user Dokan to Firestore (if logged in) or LocalStorage
export async function saveUserDokan(dokan: UserTongDokan): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tongbaj_custom_dokan', JSON.stringify(dokan));
  }

  if (auth.currentUser) {
    const docPath = `users/${auth.currentUser.uid}`;
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...dokan,
        id: auth.currentUser.uid,
        email: auth.currentUser.email || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  }
}

// Fetch user Dokan from Firestore or LocalStorage
export async function loadUserDokan(): Promise<UserTongDokan> {
  if (auth.currentUser) {
    const docPath = `users/${auth.currentUser.uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (snap.exists()) {
        return snap.data() as UserTongDokan;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('tongbaj_custom_dokan');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
  }

  return DEFAULT_TONG_DOKAN;
}

// Fetch community Tong Dokans (with optimization to limit read units to max 6)
export async function getCommunityDokans(): Promise<UserTongDokan[]> {
  const fallbackDokans: UserTongDokan[] = [
    {
      id: 'demo-1',
      displayName: 'তানভীর আহমেদ',
      avatar: '👨‍🎓',
      stallName: 'বুয়েট মামার টং',
      canopyStyle: 'BLUE_TIN',
      specialtyItem: 'জাফরানি কড়াক চা',
      benchColor: 'RED_PLASTIC',
      slogan: 'রাত জাগা ইঞ্জিনিয়ারদের প্রিয় ঠিকানা!',
      totalMatchesPlayed: 14,
      bestProfit: 95,
    },
    {
      id: 'demo-2',
      displayName: 'ফারহানা কবির',
      avatar: '👩‍💼',
      stallName: 'ধানমন্ডি লেকভিউ কর্নার',
      canopyStyle: 'STRIPED_YELLOW',
      specialtyItem: 'চকলেট মালাই চা',
      benchColor: 'BLUE_PLASTIC',
      slogan: 'লেকপাড়ে গরম চায়ে মন জুড়ায়।',
      totalMatchesPlayed: 21,
      bestProfit: 120,
    },
    {
      id: 'demo-3',
      displayName: 'সাকিবুল হাসান',
      avatar: '🧔',
      stallName: 'শাহবাগ বুদ্ধিজীবী আড্ডা',
      canopyStyle: 'GREEN_RED',
      specialtyItem: 'স্পাইসি লেবু চা',
      benchColor: 'WOODEN',
      slogan: 'রাজনীতি নিয়ে আলোচনা করুন, তবে বিল আগে দিন!',
      totalMatchesPlayed: 8,
      bestProfit: 65,
    },
  ];

  if (!auth.currentUser) {
    return fallbackDokans;
  }

  try {
    const q = query(collection(db, 'users'), limit(6));
    const snap = await getDocs(q);
    const results: UserTongDokan[] = [];
    snap.forEach((d) => {
      const data = d.data() as UserTongDokan;
      if (data.stallName) {
        results.push(data);
      }
    });
    return results.length > 0 ? results : fallbackDokans;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
    return fallbackDokans;
  }
}
