import { XCircle } from "lucide-react";

import { IconButton } from "@mui/material";
import useMessageFormStore from "@/stores/message-form-store";
import FilePreview from "./file-preview";
import { useEffect, useState } from "react";
import useFileStore from "@/stores/file-store";

export default function FormFilePreview({ fileId }: { fileId: string }) {
  const { removeFileId } = useMessageFormStore();
  const [file, setFile] = useState<File | null | undefined>();
  const fileStore = useFileStore();

  useEffect(() => {
    const loadFile = async () => {
      if (file !== undefined) return;

      const storedFile = fileStore.getFile(fileId);
      if (storedFile) {
        setFile(storedFile);
        return;
      }

      setFile(null);
    };

    loadFile();
  }, [fileId]);

  const handleError = () => {
    alert("Can not load file");
  };

  return (
    <div className="relative size-fit">
      <IconButton
        sx={{ position: "absolute", right: 0, top: 0, zIndex: 1 }}
        onClick={() => removeFileId(fileId)}
      >
        <XCircle />
      </IconButton>
      <FilePreview
        className="size-20 object-cover rounded-2xl opacity-60"
        fileId={fileId}
        file={file}
        onError={handleError}
      />
    </div>
  );
}
