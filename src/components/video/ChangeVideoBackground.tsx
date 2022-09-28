import { useCallback, useEffect, useRef } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "../../App.css";

const ChangeVideoBackground = () => {
  const webcamRef = useRef<any>();
  const canvasRef = useRef<any>();

  const detect = async (net: any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoHeight = video.clientHeight;
      const videoWidth = video.clientWidth;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const segmentation = await net.segmentPerson(video);
      bodyPix.drawBokehEffect(
        canvasRef.current,
        video,
        segmentation,
        20,
        10,
        false
      );

      /*const person = await net.segmentPersonParts(video);

      const coloredPartImage = await bodyPix.toColoredPartMask(person);
      bodyPix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      );*/
    }
  };
  const runBodySegment = useCallback(async () => {
    const net = await bodyPix.load();
    console.log("bodypix model loaded");
    setInterval(() => {
      detect(net);
    }, 0.1);
  }, []);

  useEffect(() => {
    runBodySegment();
  }, [runBodySegment]);

  return (
    <div>
      <h1>Work in progress!!!</h1>
      {/* <Webcam
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
      /> */}
    </div>
  );
};

export default ChangeVideoBackground;
