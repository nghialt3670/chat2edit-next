"use client";

import { Download, Edit, Reply } from "lucide-react";

import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import useFileStore from "@/stores/FileStore";
import useChatFormStore from "@/stores/ChatFormStore";

import FilePreview from "./FilePreview";

export default function MessageFile({ fileId }: { fileId: string }) {
  const formStore = useChatFormStore();
  const fileStore = useFileStore();
  const router = useRouter();

  const handleEditClick = () => {
    const file = fileStore.getFile(fileId);
    if (!file) return;
    if (file.type.startsWith("image/") || file.name.endsWith(".canvas"))
      router.push(`/edit/canvas/${fileId}`);
  };

  const handleReplyClick = () => {
    formStore.addFile(fileId);
  };

  return (
    <div className="relative rounded-xl mt-2 overflow-hidden w-fit">
      <div className="flex h-fit p-1 bg-gray-300">
        <div className="ml-auto">
          <IconButton>
            <Download size={16} />
          </IconButton>
          <IconButton onClick={handleEditClick}>
            <Edit size={16} />
          </IconButton>
          <IconButton onClick={handleReplyClick}>
            <Reply size={16} />
          </IconButton>
        </div>
      </div>
      <FilePreview fileId={fileId} loadingSize={32} imageWidth={64} />
    </div>
  );
}
