# Mobile Snake Base Game

A cross-platform (iOS + Android) starter project for a modern Snake game built with Expo, React Native, and TypeScript. This serves as a clean foundation that we can iterate on together, with structured game logic, reusable UI components, and clear documentation.

## Highlights
- Single codebase targeting iOS, Android, and web (via Expo).
- Modular game reducer controlling snake movement, collisions, scoring, and difficulty scaling.
- Responsive board rendering that adapts to device dimensions, plus on-screen controls optimised for touch.
- Session high-score tracking, pause/resume, and restart flows ready for future enhancements.
- Strict TypeScript setup, Jest preconfigured via `jest-expo`, and sensible project structure for scalability.

## Tech Stack
- **React Native** via **Expo SDK 51**
- **TypeScript** with Expo’s base tsconfig
- **React Native Reanimated** & **Gesture Handler** (bundled via Expo)

## Getting Started
1. **Install prerequisites**
   - Node.js ≥ 20.0.0 (recommended 20 LTS or newer)
   - Expo CLI: `npm install -g expo-cli` (optional, `npx expo` also works)
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm start
   ```
   Use the on-screen prompts to launch the app on:
   - an iOS simulator (`i`),
   - an Android emulator (`a`), or
   - a physical device via the Expo Go app (scan the QR code).

## Project Structure
```
.
├── App.tsx                # App entry – wires UI, reducer, and loop
├── assets/                # Placeholder icons & splash assets
├── src/
│   ├── components/        # UI components (board, controls, scoreboard)
│   ├── constants/         # Game-wide configuration values
│   ├── game/              # Reducer and state helpers
│   ├── hooks/             # Reusable hooks (game loop timer)
│   └── types/             # Shared TypeScript types
├── app.json               # Expo configuration (app metadata, assets)
├── babel.config.js        # Babel preset with Reanimated plugin
├── jest.config.js         # Jest setup for React Native testing
├── package.json           # Scripts and dependencies
└── tsconfig.json          # TypeScript compiler options
```

## Gameplay Notes
- Tap **Start** to begin – the snake launches from the centre of the grid.
- Use the on-screen arrow pad to steer; the snake cannot reverse direction instantly.
- Eating food increases the score and speeds up the game to raise the challenge.
- Colliding with walls or your tail ends the run and records a session high score.

## Next Ideas
1. Persist high scores with AsyncStorage or a backend.
2. Add swipe gesture controls and haptic feedback.
3. Introduce obstacles, multiple levels, or power-ups.
4. Create automated tests for reducer edge cases and UI behaviour.

Enjoy experimenting, and let me know what you’d like to tackle next!
