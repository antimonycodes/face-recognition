import React, { useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="50%"
        videoConstraints={{
          width: 280,
          height: 200,
          facingMode: "user",
        }}
      />
      <button className=" bg-Green rounded-md px-1 py-1" onClick={capture}>
        Capture photo
      </button>
      {imgSrc && <img src={imgSrc} alt="Captured" />}
    </>
  );
};

export default WebcamCapture;
