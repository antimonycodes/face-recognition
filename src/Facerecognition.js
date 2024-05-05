// faceRecognition.js

const faceapi = "face-api.js";

// Load models
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
}

// Recognize face
async function recognizeFace(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detections.descriptor;
}

// Compare faces
async function compareFaces(descriptor1, descriptor2) {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < 0.6; // threshold for face similarity
}

// Initialize models
loadModels();

module.exports = {
  recognizeFace,
  compareFaces,
};
