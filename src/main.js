import "./style.css";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { isFist, getPalmX, GestureDebouncer } from "./gestureDetector.js";
import { BreakoutGame } from "./breakoutGame.js";

// DOM Elements
const videoElement = document.querySelector("video");
const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");

// Game Instance
const game = new BreakoutGame(canvasElement);

// Gesture Control State
const fistDebouncer = new GestureDebouncer(500); // 500ms cooldown for fist
let lastFistState = false;
let currentLandmarks = null;

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

// Handle hand detection results
hands.onResults((results) => {
  // Store landmarks for game logic
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    currentLandmarks = results.multiHandLandmarks[0];
  } else {
    currentLandmarks = null;
  }

  // Draw hand tracking overlay (semi-transparent)
  canvasCtx.save();
  
  // Draw video feed with transparency
  canvasCtx.globalAlpha = 0.3;
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.globalAlpha = 1.0;

  // Draw hand landmarks
  if (currentLandmarks) {
    drawConnectors(
      canvasCtx,
      currentLandmarks,
      HAND_CONNECTIONS,
      { color: "#00FF00", lineWidth: 3 }
    );
    drawLandmarks(
      canvasCtx,
      currentLandmarks,
      { color: "#FF0000", lineWidth: 1, radius: 2 }
    );
  }

  canvasCtx.restore();
});

// Initialize Camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});

// Start camera
camera.start();

// Game Loop with Gesture Integration
function gameLoop() {
  // Process gesture controls
  if (currentLandmarks) {
    // Open palm → Move paddle
    const palmX = getPalmX(currentLandmarks);
    if (palmX !== null) {
      game.paddle.updateFromGesture(palmX);
    }

    // Fist → Launch ball
    const currentFistState = isFist(currentLandmarks);
    
    // Detect fist gesture (state change from open to fist)
    if (currentFistState && !lastFistState && fistDebouncer.canTrigger()) {
      game.ball.launch(game.paddle.getCenterX());
      console.log("🚀 Ball launched!");
    }
    
    lastFistState = currentFistState;
  }

  // Update and draw game
  game.update();
  game.draw();

  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

console.log("🎮 Breakout Game Started!");
console.log("🖐️  Use OPEN PALM to move paddle");
console.log("👊 Make a FIST to launch ball");
