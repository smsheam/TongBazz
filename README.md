# টংবাজ (Tongbaj)

A Bangla-first 2D tea-stall social deduction game prototype.

## Current build

This branch is a clean rebuild foundation using **Phaser 3 + React + Vite**.

- Phaser renders the 2D tea-stall world.
- React renders responsive dashboards and menus.
- The first playable slice is a local Shopkeeper practice mode.
- Three cooking stations, five menu items, inventory purchases, timed preparation, order queue, serving, a short arcade challenge, and random neighbourhood events are included.
- The existing player image asset is retained at \`public/assets/aistudio/image_62254eee.png\`.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Build:

\`\`\`bash
npm run build
\`\`\`

## Important scope note

This is **not yet an online multiplayer release**. The current practice mode uses local guest characters to test the tea-stall loop. It does not pretend these guests are real network players. Google sign-in, authoritative multiplayer, role assignment, Saboteur logic, voting, persistent profiles, cosmetics, and admin tools are later milestones.

## Planned architecture

- Phaser 3: 2D world, characters, interactions, animation and game scene.
- React: menus, dashboards, settings and admin UI.
- Firebase Authentication / Firestore: player identity and persistent profile data, added after the gameplay loop is stable.
- Dedicated authoritative multiplayer service: room membership, hidden roles, timer, actions, scoring and anti-cheat. Do not use Firestore for high-frequency movement updates.
- Capacitor: Android packaging after the web game is stable.

## Design rules

- Bangla is the default language.
- 180-second round target.
- Planned online match size: 4–5 real players.
- Exactly five sellable items: রং চা, দুধ চা, বন, কলা, বিস্কুট.
- Shopkeeper has three cooking stations.
- Gameplay rewards decisions and objectives, not repetitive button presses.
- Cosmetics must not provide competitive advantages.
