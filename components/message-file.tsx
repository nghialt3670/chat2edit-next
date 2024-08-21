"use client";

import { ComponentProps, useEffect, useState } from "react";

import { Download, Edit, Reply } from "lucide-react";

import getFile from "@/api/getFile";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import useFileStore from "@/stores/file-store";
import FilePreview from "@/components/file-preview";
import useMessageFormStore from "@/stores/message-form-store";
import useMessageListStore from "@/stores/message-list-store";
import { cn } from "@/utils/client/styling";

export default function MessageFile({
  className,
  fileId,
}: ComponentProps<"div"> & { fileId: string }) {
  const [file, setFile] = useState<File | null | undefined>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { addFileId } = useMessageFormStore();
  const router = useRouter();
  const fileStore = useFileStore();
  const msgListStore = useMessageListStore();

  useEffect(() => {
    const loadFile = async () => {
      if (file) return;

      const storedFile = fileStore.getFile(fileId);
      if (storedFile) {
        setFile(storedFile);
        return;
      }

      const fetchedFile = await getFile(fileId);
      if (fetchedFile) {
        fileStore.addFile(fileId, fetchedFile);
        setFile(fetchedFile);
        return;
      }

      setFile(null);
    };

    loadFile();
  }, [fileId]);

  const handleEditClick = () => {
    if (!file) return;
    if (file.type.startsWith("image/") || file.name.endsWith(".canvas"))
      router.push(`/edit/canvas/${fileId}`);
  };

  const handleError = () => {};

  const handleLoaded = () => {
    msgListStore.scrollToBottom();
    setLoaded(true);
  };

  return (
    <div className={cn("flex flex-row rounded-2xl", className)}>
      <div
        className={cn(
          "flex items-center justify-center p-1",
          !loaded && "hidden",
        )}
      >
        <div className="flex flex-col">
          <IconButton color="inherit" disabled={!file}>
            <Download size={20} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleEditClick}
            disabled={!file}
          >
            <Edit size={20} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => addFileId(fileId)}
            disabled={!file}
          >
            <Reply size={20} />
          </IconButton>
        </div>
      </div>
      <FilePreview
        className="w-64 rounded-xl shadow-md"
        fileId={fileId}
        file={file}
        onError={handleError}
        onLoaded={handleLoaded}
      />
    </div>
  );
}
