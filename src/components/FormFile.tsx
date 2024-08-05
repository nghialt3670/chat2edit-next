import { IconButton } from "@mui/material";
import { XCircle } from "lucide-react";
import React from "react";
import FilePreview from "./FilePreview";
import useChatFormStore from "@/stores/ChatFormStore";
import useFileStore from "@/stores/FileStore";

export default function FormFile({ fileId }: { fileId: string }) {
  const formStore = useChatFormStore();
  const fileStore = useFileStore();

  const handleRemoveClick = () => {
    formStore.removeFile(fileId);
    fileStore.removeFile(fileId);
  };

  return (
    <div className="relative size-fit rounded-xl overflow-hidden">
      <div className="absolute right-0 top-0 z-10">
        <IconButton onClick={handleRemoveClick}>
          <XCircle size={20} />
        </IconButton>
      </div>
      <FilePreview
        fileId={fileId}
        loadingSize={20}
        imageSize={20}
        opacity={60}
      />
    </div>
  );
}
