import { useRef, useState, useEffect, useCallback } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as bodyPix from "@tensorflow-models/body-pix";
import background from "../../background.jpg";
import "../../App.css";

const ChangeImageBackground = () => {
  const [image, setImage] = useState<any>();

  const canvasRef = useRef<any>();

  const handleImageChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const removeBackground = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const net = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });

    const { data: map } = await net.segmentPerson(canvas, {
      internalResolution: "medium",
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

    ctx.putImageData(newImg, 0, 0);
  };

  const loadAndChangeBG = useCallback(async (src: string) => {
    const img = new Image();
    img.crossOrigin = "";
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    img.addEventListener("load", () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      removeBackground();
    });
    img.src = src;
  }, []);

  useEffect(() => {
    if (image) loadAndChangeBG(image);
  }, [loadAndChangeBG, image]);
  return (
    <div className="container">
      <h1 className="text-center">Change Image Background</h1>

      <div className="form-group">
        <input
          type="file"
          id="filetag"
          accept=".png,.jpg"
          className="form-control"
          onChange={handleImageChange}
        />
      </div>
      <img className="background-image" src={background} alt="" />
      <canvas
        ref={canvasRef}
        className="remove-image-background"
        id="canvas"
        width="460px"
        height="150px"
      />
    </div>
  );
};

export default ChangeImageBackground;
