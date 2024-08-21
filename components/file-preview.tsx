"use client";

import { ComponentProps, useEffect, useState } from "react";

import { cn } from "@/utils/client/styling";
import useFileStore from "@/stores/file-store";
import { LinearProgress } from "@mui/material";
import { readFileAsDataURL } from "@/utils/client/file";
import { getBaseName, getExtension } from "@/utils/file";
import { createCanvasFromFile } from "@/utils/client/fabric";

export default function FilePreview({
  className,
  fileId,
  file,
  onError,
  onLoaded,
}: ComponentProps<"div"> & {
  fileId: string;
  file: File | null | undefined;
  onError: (fileId: string) => void;
  onLoaded?: (fileId: string) => void;
}) {
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [status, setStatus] = useState<"loading" | "error" | "loaded">(
    "loading",
  );
  const fileStore = useFileStore();

  useEffect(() => {
    const loadImgSrc = async () => {
      if (file === undefined) return;
      if (file === null) {
        setStatus("error");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isCanvas = file.name.endsWith(".canvas");

      if (!isImage && !isCanvas) {
        setStatus("loaded");
        if (onLoaded) onLoaded(fileId);
        return;
      }

      const dataURL = fileStore.getDataURL(fileId);
      if (dataURL) {
        setImgSrc(dataURL);
        setStatus("loaded");
        if (onLoaded) onLoaded(fileId);
        return;
      }

      if (isImage) {
        let dataURL = await readFileAsDataURL(file);
        if (dataURL) {
          dataURL = dataURL.toString();
          setImgSrc(dataURL);
          fileStore.addDataURL(fileId, dataURL);
          setStatus("loaded");
          if (onLoaded) onLoaded(fileId);
          return;
        }
      }

      if (isCanvas) {
        const canvas = await createCanvasFromFile(file);
        if (canvas) {
          let dataURL = canvas.toDataURL();
          fileStore.addDataURL(fileId, dataURL);
          setImgSrc(dataURL);
          setStatus("loaded");
          if (onLoaded) onLoaded(fileId);
          return;
        }
      }

      onError(fileId);
      setStatus("error");
    };

    loadImgSrc();
  }, [file]);

  if (status !== "loaded")
    return (
      <div className={className}>
        {status === "error" ? <p>Error</p> : <LinearProgress color="inherit" />}
      </div>
    );

  if (imgSrc) return <img className={className} src={imgSrc} alt="" />;

  return (
    <div className={cn(className, "flex fex-row")}>
      <span>{getExtension(file!.name)}</span>
      <span>{getBaseName(file!.name)}</span>
    </div>
  );
}
