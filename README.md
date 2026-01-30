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

### January 30, 2026
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
- Real-time webcam hand detection
- Visual feedback with landmark points and connections
- Single hand tracking mode
- Adjustable detection and tracking confidence levels

## Usage
Run the development server:
```bash
npm run dev
```

Then open your browser and allow camera access.