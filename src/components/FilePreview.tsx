"use client";

import { useEffect, useState } from "react";

import useFileStore from "@/stores/FileStore";
import { CircularProgress } from "@mui/material";
import { getBaseName, getExtension } from "@/utils/file";
import { createCanvasFromFile } from "@/utils/client/fabric";
import {
  getFilenameFromContentDisposition,
  readFileAsDataURL,
} from "@/utils/client/file";

export default function FilePreview({
  fileId,
  loadingSize,
  imageWidth,
  imageSize,
  opacity,
  onError,
}: {
  fileId: string;
  loadingSize: number;
  imageWidth?: number;
  imageSize?: number;
  opacity?: number;
  onError?: (fileId: string) => void;
}) {
  const [isError, setIsError] = useState<boolean>();
  const [file, setFile] = useState<File>();
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageDataURL, setImageDataURL] = useState<string>();
  const fileStore = useFileStore();

  useEffect(() => {
    const getAndSetFile = async () => {
      const endpoint = `/api/files/${fileId}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        if (onError) onError(fileId);
        setIsError(true);
        return;
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");
      if (!contentDisposition) {
        if (onError) onError(fileId);
        setIsError(true);
        return;
      }

      const filename = getFilenameFromContentDisposition(contentDisposition);
      if (!filename) {
        if (onError) onError(fileId);
        setIsError(true);
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
    const updateDataURL = async () => {
      if (!file) return;
      let dataURL = fileStore.getDataURL(fileId);
      if (!dataURL) {
        let newDataURL;
        if (file.type.startsWith("image/")) {
          newDataURL = await readFileAsDataURL(file);
        } else if (file.name.endsWith(".canvas")) {
          const canvas = await createCanvasFromFile(file);
          if (canvas) newDataURL = canvas.toDataURL();
        } else {
          throw new Error("Can only read data url from image or canvas file");
        }
        if (!newDataURL) {
          if (onError) onError(fileId);
          setIsError(true);
        } else {
          dataURL = newDataURL.toString();
          setIsError(false);
        }
      }
      setImageDataURL(dataURL);
      fileStore.addDataURL(fileId, dataURL!);
    };
    if (
      file &&
      (file.type.startsWith("image/") || file.name.endsWith(".canvas"))
    ) {
      updateDataURL();
      setShowImage(true);
    }
  }, [file]);

  if (isError) {
    return <div>error</div>;
  }

  console.log(imageSize);

  return (
    <div className="flex justify-center items-center">
      {file ? (
        showImage ? (
          imageDataURL ? (
            <img
              className={`w-${imageWidth} size-${imageSize} object-cover opacity-${opacity}`}
              src={imageDataURL}
              alt="Uploaded Preview"
            />
          ) : (
            <div
              className={`size-${loadingSize} flex justify-center items-center`}
            >
              <CircularProgress disableShrink />
            </div>
          )
        ) : (
          <div className="w-64 h-14 pr-10 flex bg-slate-300 overflow-hidden border-slate-400 border-2 rounded-xl">
            <div className="h-full w-fit p-4 flex justify-center items-center font-bold">
              {getExtension(file.name).toUpperCase()}
            </div>
            <div className="size-full flex items-center overflow-x-hidden text-nowrap truncate">
              <span className="truncate">{getBaseName(file.name)}</span>
            </div>
          </div>
        )
      ) : (
        <div
          className={`size-${loadingSize} flex justify-center items-center bg-slate-400`}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
