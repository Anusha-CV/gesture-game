import "./style.css";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const videoElement = document.querySelector("video");
const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");

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

hands.onResults((results) => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(
        canvasCtx,
        landmarks,
        HAND_CONNECTIONS,
        { color: "#00FF00", lineWidth: 5 }
      );
      drawLandmarks(
        canvasCtx,
        landmarks,
        { color: "#FF0000", lineWidth: 2, radius: 3 }
      );
    }
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

camera.start();
