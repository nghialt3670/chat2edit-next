"use client";

import { useEffect, useState } from "react";

import { XSquare } from "lucide-react";

import useFileStore from "@/stores/file-store";
import { Button } from "@/components/ui/button";
import FilePreview from "@/components/file-preview";
import useMessageFormStore from "@/stores/message-form-store";

export default function FormFile({ fileId }: { fileId: string }) {
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
    <div className="relative size-fit group">
      <Button
        className="absolute flex justify-center items-center size-7 top-0 -right-0.5 z-10 group-hover:opacity-60 md:opacity-0 hover:bg-transparent opacity-60"
        size={"icon"}
        variant={"ghost"}
        type={"button"}
        onClick={() => removeFileId(fileId)}
      >
        <XSquare />
      </Button>
      <FilePreview
        className="size-20 object-cover rounded-md opacity-60 shadow-sm"
        fileId={fileId}
        file={file}
        onError={handleError}
      />
    </div>
  );
}
