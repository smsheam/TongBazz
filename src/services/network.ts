/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameRoom } from '../types/game';

const CHANNEL_NAME = 'tongbaj_multiplayer_channel';

export class NetworkService {
  private channel: BroadcastChannel | null = null;
  private onRoomUpdateCallback: ((room: GameRoom) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'ROOM_UPDATE' && event.data.room) {
            if (this.onRoomUpdateCallback) {
              this.onRoomUpdateCallback(event.data.room);
            }
          }
        };
      } catch {
        // Fallback or ignore in restricted contexts
      }
    }

    // Storage event fallback for older browsers or if BroadcastChannel is blocked
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'tongbaj_active_room' && e.newValue) {
          try {
            const room: GameRoom = JSON.parse(e.newValue);
            if (this.onRoomUpdateCallback) {
              this.onRoomUpdateCallback(room);
            }
          } catch {
            // Ignore malformed JSON
          }
        }
      });
    }
  }

  public subscribeRoomUpdate(callback: (room: GameRoom) => void) {
    this.onRoomUpdateCallback = callback;
  }

  public broadcastRoom(room: GameRoom) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tongbaj_active_room', JSON.stringify(room));
      } catch {
        // storage quota or private browsing
      }
    }

    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'ROOM_UPDATE', room });
      } catch {
        // Ignore message error
      }
    }
  }

  public getStoredRoom(): GameRoom | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('tongbaj_active_room');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export const network = new NetworkService();
