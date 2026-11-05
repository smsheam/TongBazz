/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MENU_ITEMS } from '../data/gameData';
import { OrderItem } from '../types/game';

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumber(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[parseInt(digit, 10)]);
}

export function formatTaka(amount: number, banglaDigits = true): string {
  const formatted = banglaDigits ? toBanglaNumber(amount) : amount.toString();
  return `৳${formatted}`;
}

export function formatSeconds(seconds: number, banglaDigits = true): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  const res = `${mm}:${ss}`;
  return banglaDigits ? toBanglaNumber(res) : res;
}

export function generateBanglaOrderSentence(items: OrderItem[]): string {
  if (!items || items.length === 0) return 'মামা, কিছুই লাগবে না!';

  const phrases: string[] = [];
  for (const item of items) {
    const menuItem = MENU_ITEMS.find((m) => m.id === item.itemId);
    if (!menuItem) continue;

    const bnQty = toBanglaNumber(item.quantity);
    if (menuItem.category === 'TEA') {
      phrases.push(`${bnQty} কাপ ${menuItem.nameBn}`);
    } else {
      phrases.push(`${bnQty}টা ${menuItem.nameBn}`);
    }
  }

  if (phrases.length === 0) return 'মামা, শুধু এক গ্লাস পানি দিয়েন!';

  let itemsString = '';
  if (phrases.length === 1) {
    itemsString = phrases[0];
  } else if (phrases.length === 2) {
    itemsString = `${phrases[0]} আর ${phrases[1]}`;
  } else {
    const allExceptLast = phrases.slice(0, phrases.length - 1).join(', ');
    const last = phrases[phrases.length - 1];
    itemsString = `${allExceptLast} আর ${last}`;
  }

  const endings = ['দিয়েন তো।', 'তাড়াতাড়ি দেন মামা!', 'একটু গরম গরম দিয়েন।'];
  const ending = endings[items.length % endings.length];

  return `মামা, ${itemsString} ${ending}`;
}
