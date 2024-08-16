import { cn } from "@/lib/utils";
import useFileStore from "@/stores/file-store";
import { createCanvasFromFile } from "@/utils/client/fabric";
import { readFileAsDataURL } from "@/utils/client/file";
import { getBaseName, getExtension } from "@/utils/file";
import { LinearProgress } from "@mui/material";
import React, { ComponentProps, useEffect, useState } from "react";

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
  const [status, setStatus] = useState<"isLoading" | "isError" | "isLoaded">(
    "isLoading",
  );
  const fileStore = useFileStore();

  useEffect(() => {
    const loadImgSrc = async () => {
      if (file === undefined) return;
      if (file === null) {
        setStatus("isError");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isCanvas = file.name.endsWith(".canvas");

      if (!isImage && !isCanvas) {
        setStatus("isLoaded");
        if (onLoaded) onLoaded(fileId);
        return;
      }

      const dataURL = fileStore.getDataURL(fileId);
      if (dataURL) {
        setImgSrc(dataURL);
        setStatus("isLoaded");
        if (onLoaded) onLoaded(fileId);
        return;
      }

      if (isImage) {
        let dataURL = await readFileAsDataURL(file);
        if (dataURL) {
          dataURL = dataURL.toString();
          setImgSrc(dataURL);
          fileStore.addDataURL(fileId, dataURL);
          setStatus("isLoaded");
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
          return;
        }
      }

      onError(fileId);
      setStatus("isError");
    };

    loadImgSrc();
  }, [file]);

  if (status !== "isLoaded")
    return (
      <div className={className}>
        {status === "isError" ? (
          <p>Error</p>
        ) : (
          <LinearProgress color="inherit" />
        )}
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
