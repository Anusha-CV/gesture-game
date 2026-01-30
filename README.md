# gesture-game

A real-time hand gesture detection application using MediaPipe Hands and Vite.

## Setup Steps

1. npm create vite@latest .
2. Framework = Vanilla
3. Variant = Javascript
4. Install dependencies: `npm install`
5. Install MediaPipe packages:
   - `@mediapipe/hands`
   - `@mediapipe/camera_utils`
   - `@mediapipe/drawing_utils`

## Development Log

### January 30, 2026 - V 0.0.2
- **Breakout Game Implementation**
  - Created gesture-controlled Breakout game with paddle and ball physics
  - Paddle class with smooth gesture-based horizontal movement
  - Ball class with velocity, collision detection, and spin mechanics
  - BreakoutGame class managing game state, scoring, and auto-restart
- **Gesture Control System**
  - Created modular gesture detection utilities (`gestureDetector.js`)
  - Open palm gesture → moves paddle (tracks wrist X position)
  - Fist gesture → launches ball (fingertips below wrist detection)
  - Debouncer class for 500ms cooldown to prevent accidental triggers
- **Game Mechanics**
  - Wall collision detection with proper bouncing
  - Paddle collision with position-based spin effect
  - Score tracking (10 points per bounce)
  - HUD display with score, bounces, and instructions
  - Game over detection and 3-second auto-restart
- **Visual Enhancements**
  - Increased canvas size to 1280x720 (HD resolution)
  - Increased ball size to 15px radius for better visibility
  - Semi-transparent hand tracking overlay
  - Green paddle with outline styling
  - Updated CSS for centered game layout
- **Technical Improvements**
  - Separated game loop from MediaPipe processing
  - requestAnimationFrame for smooth 60 FPS gameplay
  - Modular architecture with separated concerns
  - No camera reinitialization per frame

### January 30, 2026 - V 0.0.1
- Fixed program initialization issues
  - Added missing `<video>` and `<canvas>` elements to index.html
  - Added CSS import to main.js for proper styling
- Implemented MediaPipe Hands integration
  - Camera feed capture and hand landmark detection
  - Real-time hand tracking with configurable confidence thresholds
- Fixed visualization rendering
  - Corrected drawing utilities imports for proper hand skeleton display
  - Green lines connecting hand landmarks (joints and finger structure)
  - Red dots marking 21 key hand landmarks
  - Increased line width for better visibility

## Features
- Gesture-controlled Breakout game
- Real-time hand tracking with MediaPipe Hands
- Open palm to move paddle, fist to launch ball
- Physics-based ball movement with collision detection
- Score tracking and auto-restart functionality
- Visual hand tracking overlay
- HD canvas (1280x720) for larger play area
- Single hand tracking mode with high accuracy

## Usage
Run the development server:
```bash
npm run dev
```

Then open your browser and allow camera access.