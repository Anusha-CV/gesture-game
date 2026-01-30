/**
 * Gesture Detection Utilities for Hand Tracking
 * Detects fist and open palm gestures using MediaPipe hand landmarks
 */

// Landmark indices for fingertips and base joints
const LANDMARKS = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20
};

/**
 * Detects if the hand is making a fist gesture
 * A fist is detected when all fingertips are below (higher y value) the wrist
 * @param {Array} landmarks - Array of 21 hand landmarks from MediaPipe
 * @returns {boolean} - True if fist is detected
 */
export function isFist(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return false;
  }

  const wristY = landmarks[LANDMARKS.WRIST].y;
  
  // Check if all fingertips are below the wrist (closed hand)
  const fingertips = [
    LANDMARKS.THUMB_TIP,
    LANDMARKS.INDEX_TIP,
    LANDMARKS.MIDDLE_TIP,
    LANDMARKS.RING_TIP,
    LANDMARKS.PINKY_TIP
  ];

  const allFingersClosed = fingertips.every(tipIndex => {
    return landmarks[tipIndex].y > wristY - 0.05; // Small threshold for detection
  });

  return allFingersClosed;
}

/**
 * Gets the horizontal position of the palm (wrist landmark)
 * Returns normalized X coordinate (0 to 1)
 * @param {Array} landmarks - Array of 21 hand landmarks from MediaPipe
 * @returns {number} - Normalized X position (0-1), or null if invalid
 */
export function getPalmX(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return null;
  }

  return landmarks[LANDMARKS.WRIST].x;
}

/**
 * Debounce helper for gesture detection
 * Prevents rapid repeated detections of the same gesture
 */
export class GestureDebouncer {
  constructor(cooldownMs = 500) {
    this.cooldownMs = cooldownMs;
    this.lastTriggerTime = 0;
  }

  /**
   * Check if enough time has passed since last trigger
   * @returns {boolean} - True if gesture can be triggered
   */
  canTrigger() {
    const now = Date.now();
    if (now - this.lastTriggerTime >= this.cooldownMs) {
      this.lastTriggerTime = now;
      return true;
    }
    return false;
  }

  /**
   * Reset the debouncer
   */
  reset() {
    this.lastTriggerTime = 0;
  }
}
