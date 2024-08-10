"use client";

import React, { useEffect, useRef, useState } from "react";

import { Download, Upload } from "lucide-react";
import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";

import useFileStore from "@/stores/FileStore";
import { CircularProgress, IconButton } from "@mui/material";
import { readFileAsDataURL, readFileAsText } from "@/utils/client/file";

export default function Canvas({ fileId }: { fileId?: string }) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const fileStore = useFileStore();
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const canvasWidth = screen.width * 0.7;
  const canvasHeight = screen.height * 0.7;

  // useEffect(() => {
  //   const getAndSetFile = async () => {
  //     const file = await getFile(fileId);
  //     fileStore.addFile(fileId, file);
  //     setFile(file);
  //   };

  // }, [fileId]);

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (canvasElementRef.current) {
        fabricCanvasRef.current = new FabricCanvas(canvasElementRef.current, {
          width: canvasWidth,
          height: canvasHeight,
        });
      }

      if (fileId && fabricCanvasRef.current) {
        const file = fileStore.getFile(fileId);
        if (!file) return;

        if (file.type.startsWith("image/")) {
          const dataURL = await readFileAsDataURL(file);
          if (dataURL)
            fabricCanvasRef.current.backgroundImage = await FabricImage.fromURL(
              dataURL.toString(),
            );
        } else if (file.name.endsWith(".canvas")) {
          const json = await readFileAsText(file);
          if (json) await fabricCanvasRef.current.loadFromJSON(json);
        } else {
          return;
        }

        const backgroundImage = fabricCanvasRef.current.backgroundImage;
        if (backgroundImage) {
          const zoomRatio =
            fabricCanvasRef.current.getWidth() /
            backgroundImage.getScaledWidth();
          fabricCanvasRef.current.setZoom(zoomRatio);
          fabricCanvasRef.current.setHeight(
            backgroundImage.getScaledHeight() * zoomRatio,
          );
        }

        fabricCanvasRef.current.renderAll();
        setIsLoading(false);
      }
    };

    const disposeFabric = () => {
      if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();
    };

    initFabricCanvas();
    return disposeFabric;
  }, [file]);

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (!fabricCanvasRef.current) return;
    // if (!event.target.files?.length) return;
    // const file = event.target.files[0];
    // const dataURL = await readFileToDataURL(file);
    // if (!dataURL) return;
    // const backgroundImage = await FabricImage.fromURL(dataURL);
    // backgroundImage.set("filename", file.name);
    // fabricCanvasRef.current.backgroundImage = backgroundImage;
    // const zoomRatio = CANVAS_WIDTH / backgroundImage.getScaledWidth();
    // fabricCanvasRef.current.setZoom(zoomRatio);
    // fabricCanvasRef.current.setHeight(
    //   backgroundImage.getScaledHeight() * zoomRatio,
    // );
    // fabricCanvasRef.current.renderAll();
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
    <div className="flex flex-col bg-slate-500">
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <IconButton onClick={handleUploadClick}>
          <Upload />
        </IconButton>
        <IconButton onClick={handleDownloadClick}>
          <Download />
        </IconButton>
      </div>

      <canvas className="w-40 h-40" ref={canvasElementRef}>
        {isLoading && <CircularProgress disableShrink />}
      </canvas>
    </div>
  );
}
