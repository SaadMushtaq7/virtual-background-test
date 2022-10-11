import { useRef, useState, useEffect, useCallback } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils";
import background from "../../background.jpg";
import natureBackground from "../../natureBackground.jpg";
import "../../App.css";

const ChangeVideoBackground = () => {
  const inputVideoRef = useRef<any>();
  const canvasRef = useRef<any>();
  const backgroundImageRef = useRef<any>();
  const contextRef = useRef<any>();

  const [backgroundImage, setBackgroundImage] = useState<any>(background);

  const onResults = useCallback((results: any) => {
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.filter = "none";
    contextRef.current.globalCompositeOperation = "source-over";
    contextRef.current.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.globalCompositeOperation = "source-in";
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.filter = "none";
    contextRef.current.globalCompositeOperation = "destination-over";
    contextRef.current.drawImage(backgroundImageRef.current, 0, 0, 300, 150);

    contextRef.current.restore();
  }, []);

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    const constraints = {
      video: {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      inputVideoRef.current.srcObject = stream;
    });

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
    });

    selfieSegmentation.onResults(onResults);

    const camera = new Camera(inputVideoRef.current, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: inputVideoRef.current });
      },
      width: 5000,
      height: 7500,
    });

    camera.start();
  }, [onResults]);

  return (
    <div>
      <h1 className="text-2xl text-bold text-center text-blue-500 mb-4">
        Change Video Background
      </h1>

      <div className="flex relative flex-col justify-items-center">
        <img
          ref={backgroundImageRef}
          className="background-image"
          src={backgroundImage}
          alt="background"
        />
        <video ref={inputVideoRef} className="virtual-bg-result-bg" />
        <canvas ref={canvasRef} className="virtual-bg-result" />
      </div>

      <div className="flex flex-row mt-8">
        <div
          className="w-36 h-36 mr-4"
          onClick={() => setBackgroundImage(background)}
        >
          <img src={background} alt="city wall" />
        </div>
        <div
          className="w-36 h-36 ml-4"
          onClick={() => setBackgroundImage(natureBackground)}
        >
          <img src={natureBackground} alt="nature" />
        </div>
      </div>
    </div>
  );
};

export default ChangeVideoBackground;
