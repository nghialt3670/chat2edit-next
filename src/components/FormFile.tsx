"use client";

import useFileStore from "@/stores/FileStore";
import { readFileAsDataURL } from "@/utils/client/file";
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Delete, XCircle } from "lucide-react";
import useChatFormStore from "@/stores/ChatFormStore";

export default function FormFile({ fileId }: { fileId: string }) {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageDataURL, setImageDataURL] = useState<string>();
  const fileStore = useFileStore();
  const formStore = useChatFormStore();

  useEffect(() => {
    const file = fileStore.getFile(fileId);
    if (!file) throw new Error();

    const readAndSetFile = async () => {
      let dataURL = fileStore.getDataURL(fileId);
      if (!dataURL) {
        let newDataURL = await readFileAsDataURL(file);
        if (!newDataURL) {
          alert(`Error reading file: ${file.name}`);
          handleRemoveFile();
          return;
        }
        newDataURL = newDataURL.toString();
        setImageDataURL(newDataURL);
        fileStore.addDataURL(fileId, newDataURL);
      }
    };

    if (file.type.startsWith("image/")) {
      setShowImage(true);
      readAndSetFile();
    }
  }, [fileId]);

  const handleRemoveFile = () => {
    fileStore.removeFile(fileId);
    formStore.removeFile(fileId);
  };

  return (
    <div className="relative size-24 rounded-2xl bg-slate-400 overflow-hidden">
      <div className="h-1/3">
        <div className="absolute top-0 right-0">
          <IconButton size="small" onClick={handleRemoveFile}>
            <XCircle size={20} />
          </IconButton>
        </div>
      </div>
      <div className="h-2/3">
        {showImage ? <img src={imageDataURL} /> : <div>hihi</div>}
      </div>
    </div>
  );
}
