"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";
import useFileStore from "@/stores/FileStore";
import { readFileAsText, readFileAsDataURL } from "@/utils/client/file";
import classes from "./Canvas.module.css";
import { IconButton } from "@mui/material";
import useCanvasStore from "@/stores/CanvasStore";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function Canvas({
  onError,
}: {
  onError: (fileId: string) => void;
}) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const fileStore = useFileStore();
  const canvasStore = useCanvasStore();
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (canvasElementRef.current) {
        fabricCanvasRef.current = new FabricCanvas(canvasElementRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        });
      }

      const fileId = canvasStore.fileId;
      if (fileId && fabricCanvasRef.current) {
        const file = fileStore.getFile(fileId);

        if (!file) const json = await readFileAsText(file);
        if (!json) return;
        await fabricCanvasRef.current.loadFromJSON(json);
        const backgroundImage = fabricCanvasRef.current.backgroundImage;
        if (backgroundImage) {
          const zoomRatio = CANVAS_WIDTH / backgroundImage.getScaledWidth();
          fabricCanvasRef.current.setZoom(zoomRatio);
          fabricCanvasRef.current.setHeight(
            backgroundImage.getScaledHeight() * zoomRatio,
          );
        }
        fabricCanvasRef.current.on("mouse:down", () => console.log("hihi"));
        fabricCanvasRef.current.renderAll();
      }
    };

    const disposeFabric = () => {
      if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();
    };

    initFabricCanvas();
    return disposeFabric;
  }, [canvasStore]);

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current) return;
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    const dataURL = await readFileToDataURL(file);
    if (!dataURL) return;

    const backgroundImage = await FabricImage.fromURL(dataURL);
    backgroundImage.set("filename", file.name);
    fabricCanvasRef.current.backgroundImage = backgroundImage;
    const zoomRatio = CANVAS_WIDTH / backgroundImage.getScaledWidth();
    fabricCanvasRef.current.setZoom(zoomRatio);
    fabricCanvasRef.current.setHeight(
      backgroundImage.getScaledHeight() * zoomRatio,
    );
    fabricCanvasRef.current.renderAll();
  };

  const handleRemoveObject = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadClick = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = fabricCanvasRef.current.backgroundImage?.get("filename");
      link.click();
    }
  };

  return (
    <div>
      <div className={classes.toolbar}>
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          className={classes.file_input}
          ref={fileInputRef}
        />
      </div>
      <IconButton onClick={handleUploadClick}>
        <MdAddPhotoAlternate />
      </IconButton>
      <IconButton onClick={handleDownloadClick}>
        <MdFileDownload className="size-full" />
      </IconButton>

      <canvas className={classes.main} ref={canvasElementRef}></canvas>
    </div>
  );
}
