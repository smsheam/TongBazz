# Security Spec: টংবাজ (TONGBAJ) Firestore Security

## 1. Data Invariants
1. User profiles (`/users/{userId}`) can only be written by the authenticated owner of the document (`request.auth.uid == userId`).
2. Document IDs in `/users/{userId}` and `/rooms/{roomId}` must be valid alphanumeric identifiers (`size() <= 128`).
3. Rooms (`/rooms/{roomId}`) must have a valid `hostId` and `status` from the allowed enum.
4. Users cannot modify other players' Tong Dokan settings or room states without participation.
5. All reads for public Tong Dokans are limited to authenticated users or public directory with size limits.

## 2. The Dirty Dozen Payloads
1. **Payload 1 (Identity Spoofing)**: Attacker attempts to update `/users/user_victim` with `id: "user_victim"` while authenticated as `user_attacker`. Expected: PERMISSION_DENIED.
2. **Payload 2 (Ghost Field Injection)**: Attacker sends an update with `isAdmin: true` into their user document. Expected: PERMISSION_DENIED.
3. **Payload 3 (ID Poisoning)**: Attacker attempts to create a document with a 2MB identifier string. Expected: PERMISSION_DENIED.
4. **Payload 4 (Oversized Stall Name)**: Attacker submits `stallName` with 5,000 characters. Expected: PERMISSION_DENIED.
5. **Payload 5 (Unauthenticated Room Write)**: Unauthenticated request to `/rooms/TONG-12`. Expected: PERMISSION_DENIED.
6. **Payload 6 (Room Status Hijack)**: Non-host user attempts to change room status to `MATCH_OVER`. Expected: PERMISSION_DENIED.
7. **Payload 7 (Null User Name)**: User profile creation with missing required `displayName`. Expected: PERMISSION_DENIED.
8. **Payload 8 (Invalid Enum Status)**: Room created with `status: "SUPER_WINNER"`. Expected: PERMISSION_DENIED.
9. **Payload 9 (Oversized Slogan)**: Slogan length exceeding 120 characters. Expected: PERMISSION_DENIED.
10. **Payload 10 (Direct Field Mutation without Auth)**: Reading another user's private email without ownership. Expected: PERMISSION_DENIED.
11. **Payload 11 (Empty Room Code)**: Room creation with empty `roomCode`. Expected: PERMISSION_DENIED.
12. **Payload 12 (Unauthorized Room Deletion)**: Non-host attempts to delete active room. Expected: PERMISSION_DENIED.
