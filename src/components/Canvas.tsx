"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, FabricObject } from "fabric";
import useFileStore from "@/stores/FileStore";
import {
  getFilenameFromContentDisposition,
  readFileAsText,
} from "@/utils/client/file";
import { IconButton } from "@mui/material";
import useCanvasStore from "@/stores/CanvasStore";
import { Download, Upload } from "lucide-react";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function Canvas({ fileId }: { fileId: string }) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas>();
  const fileStore = useFileStore();
  const canvasStore = useCanvasStore();
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const getAndSetFile = async () => {
      const endpoint = `/api/files/${fileId}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        // if (onError) onError(fileId);
        // setIsError(true);
        return;
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");
      if (!contentDisposition) {
        // if (onError) onError(fileId);
        // setIsError(true);
        return;
      }

      const filename = getFilenameFromContentDisposition(contentDisposition);
      if (!filename) {
        // if (onError) onError(fileId);
        // setIsError(true);
        return;
      }

      const file = new File([blob], filename, { type: blob.type });
      fileStore.addFile(fileId, file);
      setFile(file);
    };
    const file = fileStore.getFile(fileId);
    if (!file) getAndSetFile();
    else setFile(file);
  }, [fileId]);

  useEffect(() => {
    const initFabricCanvas = async () => {
      if (canvasElementRef.current) {
        fabricCanvasRef.current = new FabricCanvas(canvasElementRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        });
      }

      if (fileId && fabricCanvasRef.current) {
        const file = fileStore.getFile(fileId);
        if (!file) {
          return;
        }

        const json = await readFileAsText(file);
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
    <div className="flex flex-col">
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

      <canvas className="" ref={canvasElementRef}></canvas>
    </div>
  );
}
