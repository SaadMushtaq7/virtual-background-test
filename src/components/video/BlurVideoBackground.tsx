import { useCallback, useEffect, useRef } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "../../App.css";

const BlurVideoBackground = () => {
  const webcamRef = useRef<any>();
  const canvasRef = useRef<any>();

  const detect = async (net: any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const videoHeight = video.height;
      const videoWidth = video.width;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const segmentation = await net.segmentPerson(video, {
        segmentationThreshold: 0.7,
        internalResolution: "full",
      });
      bodyPix.drawBokehEffect(
        canvasRef.current,
        video,
        segmentation,
        20,
        10,
        false
      );
    }
  };
  const runBodySegment = useCallback(async () => {
    const net = await bodyPix.load();
    console.log("bodypix model loaded");
    setInterval(() => {
      detect(net);
    }, 0.01);
  }, []);

  useEffect(() => {
    runBodySegment();
  }, [runBodySegment]);

  return (
    <div>
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
          width: 640,
          height: 480,
        }}
        width={640}
        height={480}
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
          width: 640,
          height: 480,
        }}
        width={640}
        height={480}
      />
    </div>
  );
};

export default BlurVideoBackground;
