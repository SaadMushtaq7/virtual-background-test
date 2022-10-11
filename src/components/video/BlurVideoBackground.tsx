import { useEffect, useRef } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils";
import "../../App.css";

const BlurVideoBackground = () => {
  const inputVideoRef = useRef<any>();
  const canvasRef = useRef<any>();
  const contextRef = useRef<any>();

  const onResults = (results: any) => {
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

    contextRef.current.filter = "blur(20px)";
    contextRef.current.globalCompositeOperation = "destination-over";
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.restore();
  };

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
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
    });

    selfieSegmentation.onResults(onResults);

    const camera = new Camera(inputVideoRef.current, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: inputVideoRef.current });
      },
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    });

    camera.start();
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-bold text-center text-blue-500 mb-3">
        Blur Video Background
      </h1>

      <div>
        <video ref={inputVideoRef} className="blur-bg-result-bg" />
        <canvas ref={canvasRef} className="blur-bg-result" />
      </div>
    </div>
  );
};

export default BlurVideoBackground;
