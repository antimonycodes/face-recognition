import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const Capture = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  let intervalId = null;

  useEffect(() => {
    loadModels();
    startVideo();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        // Wait for the video to load metadata
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play(); // Play the video once metadata is loaded
        };
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
  };

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      console.log("Face detection models loaded successfully.");
      startFaceDetection(); // Start face detection after models are loaded
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const startFaceDetection = () => {
    console.log("Starting face detection...");
    intervalId = setInterval(async () => {
      try {
        // Check if videoRef is ready
        if (videoRef.current.readyState === 4) {
          console.log("Video stream received:", videoRef.current);
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

          console.log("Face detections:", detections);

          const context = canvasRef.current.getContext("2d");
          console.log("Canvas context:", context);
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;

          const resizedDetections = faceapi.resizeResults(detections, {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });

          context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          // Draw model outlines regardless of face detections
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }, 500);
  };

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvide" style={{ position: "relative" }}>
        {/* Ensure the video fills its container */}
        <video
          crossOrigin="anonymous"
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "100%", height: "auto" }}
        ></video>
        {/* Overlay the canvas on top of the video */}
        <canvas
          ref={canvasRef}
          className="appcanvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Capture;
