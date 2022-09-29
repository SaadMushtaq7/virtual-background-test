import { useRef, useState, useEffect, useCallback } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import background from "../../background.jpg";
import natureBackground from "../../natureBackground.jpg";
import "../../App.css";

const ChangeVideoBackground = () => {
  const webcamRef = useRef<any>();
  const canvasRef = useRef<any>();

  const [backgroundImage, setBackgroundImage] = useState<string>(background);
  const [videoProcessing, setvideoProcessing] = useState<boolean>();

  const removeBackground = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      setvideoProcessing(false);

      const net = await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });

      const { data: map } = await net.segmentPerson(canvas, {
        internalResolution: "medium",
        segmentationThreshold: 0.7,
        scoreThreshold: 0.7,
      });

      const { data: imgData } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const newImg = ctx.createImageData(canvas.width, canvas.height);
      const newImgData = newImg.data;

      for (let i = 0; i < map.length; i++) {
        //The data array stores four values for each pixel
        const [r, g, b, a] = [
          imgData[i * 4],
          imgData[i * 4 + 1],
          imgData[i * 4 + 2],
          imgData[i * 4 + 3],
        ];
        [
          newImgData[i * 4],
          newImgData[i * 4 + 1],
          newImgData[i * 4 + 2],
          newImgData[i * 4 + 3],
        ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
      }

      ctx.putImageData(webcamRef.current, 0, 0, canvas.width, canvas.height);
    }
  };
  const runBodySegment = useCallback(async () => {
    /*setInterval(() => {
      removeBackground();
    }, 0.00001);*/
  }, []);

  useEffect(() => {
    runBodySegment();
  }, [runBodySegment]);

  return (
    <div className="change-video-backgroung-container">
      <h1 className="text-center">Change Video Background</h1>
      <img
        className="background-image"
        src={backgroundImage}
        alt="background"
      />
      <div className="change-video-background-webcam">
        <Webcam
          ref={webcamRef}
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
