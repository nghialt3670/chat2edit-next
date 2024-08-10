import { useEffect, useState } from "react";

import { XCircle } from "lucide-react";

import useFileStore from "@/stores/FileStore";
import { readFileAsDataURL } from "@/utils/client/file";
import { createCanvasFromFile } from "@/utils/client/fabric";
import { CircularProgress, IconButton } from "@mui/material";
import { getBaseName, getExtension } from "@/utils/file";

export default function FormFile({
  fileId,
  onError,
  onRemove,
}: {
  fileId: string;
  onError: (fileId: string) => void;
  onRemove: (fileId: string) => void;
}) {
  const fileStore = useFileStore();
  const [isError, setIsError] = useState<boolean>(false);
  const file = fileStore.getFile(fileId);

  useEffect(() => {
    const updateDataURL = async () => {
      if (!file) return;
      if (fileStore.getDataURL(fileId)) return;

      const isImage = file.type.startsWith("image/");
      const isCanvas = file.name.endsWith(".canvas");
      if (!isImage && !isCanvas) return;

      let dataURL;
      if (isImage) dataURL = await readFileAsDataURL(file);
      else if (isCanvas) {
        const canvas = await createCanvasFromFile(file);
        dataURL = canvas?.toDataURL();
      }

      if (!dataURL) {
        setIsError(true);
        return;
      }

      fileStore.addDataURL(fileId, dataURL.toString());
    };
    updateDataURL();
  }, [fileId]);

  if (!file || isError) {
    onError(fileId);
    return <div>Error loading file</div>;
  }

  const renderFile = () => {
    if (file.type.startsWith("image/") || file.name.endsWith(".canvas")) {
      const imgDataURL = fileStore.getDataURL(fileId);
      return (
        <div className="flex size-24 justify-center items-center rounded-2xl overflow-hidden bg-slate-200">
          {imgDataURL ? (
            <img
              className="size-full object-cover opacity-50"
              src={imgDataURL}
            />
          ) : (
            <CircularProgress size={50} disableShrink />
          )}
        </div>
      );
    }

    const extenstion = getExtension(file.name);
    const baseName = getBaseName(file.name);

    return (
      <div className="w-60 h-10 flex flex-row rounded-full overflow-hidden border-2 border-slate-500">
        <div className="flex justify-center items-center p-4 bg-slate-400">
          {extenstion.toUpperCase()}
        </div>
        <div className="w-full flex items-center p-4 bg-slate-300">
          <span className="w-32 truncate">{baseName}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
        onClick={() => onRemove(fileId)}
      >
        <XCircle />
      </IconButton>
      {renderFile()}
    </div>
  );
}
