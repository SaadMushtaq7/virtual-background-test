import { useRef, useState, useEffect, useCallback } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
//import loader from "../../loading.gif";
//import "../../App.css";

const BlurImageBackground = () => {
  const [image, setImage] = useState<any>();

  const [imageProcessing, setImageProcessing] = useState<boolean>();
  const canvasRef = useRef<any>();
  const imageRef = useRef<any>();

  const handleImageChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const loadAndBlur = useCallback(async () => {
    if (image) {
      setImageProcessing(false);
      const net = await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });
      const segmentation = await net.segmentPerson(imageRef.current, {
        segmentationThreshold: 0.7,
        internalResolution: "full",
      });

      canvasRef.current.height = imageRef.current.height;
      canvasRef.current.width = imageRef.current.width;

      bodyPix.drawBokehEffect(
        canvasRef.current,
        imageRef.current,
        segmentation,
        20,
        10,
        false
      );
      setImageProcessing(true);
    }
  }, [image]);

  useEffect(() => {
    loadAndBlur();
  }, [loadAndBlur]);

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
      {/* {imageProcessing === false && <img src={loader} alt="loader" />} */}
      <img
        ref={imageRef}
        src={image}
        style={{ display: "none" }}
        id="preview"
        className="upload-image"
        alt=""
      />
      <br />
      <canvas
        ref={canvasRef}
        className="upload-image"
        style={{ display: imageProcessing ? "block" : "none" }}
        id="canvas"
      ></canvas>
    </div>
  );
};

export default BlurImageBackground;
