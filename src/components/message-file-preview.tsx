import { Download, Edit, Reply } from "lucide-react";

import { useRouter } from "next/navigation";
import useFileStore from "@/stores/file-store";
import { IconButton } from "@mui/material";
import FilePreview from "./file-preview";
import { useEffect, useState } from "react";
import getFile from "@/api/getFile";
import useMessageFormStore from "@/stores/message-form-store";
import useMessageListStore from "@/stores/message-list-store";

export default function MessageFilePreview({ fileId }: { fileId: string }) {
  const [file, setFile] = useState<File | null | undefined>();
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
  };

  return (
    <div className="w-64 rounded-2xl">
      <div className="flex h-fit p-1">
        <div className="ml-auto">
          <IconButton color="inherit" disabled={!file}>
            <Download size={16} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleEditClick}
            disabled={!file}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => addFileId(fileId)}
            disabled={!file}
          >
            <Reply size={16} />
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
