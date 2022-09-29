import React from "react";
import { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

import "../App.css";

const Practice2 = () => {
  const [image, setImage] = useState<any>();

  const canvasRef = useRef<any>();
  const imageRef = useRef<any>();
  const contextRef = useRef<any>();

  const handleImageChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const onResults = (results: any) => {
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
    contextRef.current.filter = "blur(10px)";
    contextRef.current.globalCompositeOperation = "destination-over";
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
    });

    selfieSegmentation.onResults(onResults);

    selfieSegmentation.send({ image: image });
  }, [image]);

  return (
    <div className="container">
      <h1 className="text-center">Blur Image Background</h1>

      <div className="form-group">
        <input
          type="file"
          id="filetag"
          accept=".png,.jpg"
          className="form-control"
          onChange={handleImageChange}
        />
      </div>
      <img
        ref={imageRef}
        src={image}
        style={{ display: "none" }}
        id="preview"
        className="upload-image"
        alt=""
      />
      <br />
      <canvas ref={canvasRef} className="upload-image" id="canvas"></canvas>
    </div>
  );
};

export default Practice2;
