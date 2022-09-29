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
    contextRef.current.drawImage(results.image, 0, 0, 0, 0);
    inputVideoRef.current.hidden = true;
    contextRef.current.restore();
  }, []);

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    const constraints = {
      video: { width: { min: 400 }, height: { min: 380 } },
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
      width: 400,
      height: 380,
    });

    camera.start();
  }, [onResults]);

  return (
    <div className="change-video-backgroung-container">
      <h1 className="text-center">Change Video Background</h1>
      <img
        className="background-image"
        src={backgroundImage}
        alt="background"
      />
      <div className="change-video-background-webcam">
        <video
          ref={inputVideoRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 400,
            height: 380,
          }}
          width={400}
          height={300}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 400,
            height: 380,
          }}
          width={400}
          height={300}
        />
      </div>

      <div className="image-options-row-video">
        <div
          className="column-option"
          onClick={() => setBackgroundImage(background)}
        >
          <img src={background} alt="city wall" style={{ width: "100%" }} />
        </div>
        <div
          className="column-option"
          onClick={() => setBackgroundImage(natureBackground)}
        >
          <img src={natureBackground} alt="nature" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default ChangeVideoBackground;
