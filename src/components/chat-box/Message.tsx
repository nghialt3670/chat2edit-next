"use client";

import { useEffect, useState } from "react";

import getFile from "@/api/getFile";
import { Skeleton } from "@mui/material";
import useFileStore from "@/stores/FileStore";
import { readFileAsDataURL } from "@/utils/client/file";
import { createCanvasFromFile } from "@/utils/client/fabric";

import MessageFile from "./MessageFile";
import MessageAvatar from "./MessageAvatar";

export default function Message({
  type,
  text,
  fileIds,
  isResponding,
  isError,
  onFileReply,
}: {
  type: "Request" | "Response";
  text?: string;
  fileIds?: string[];
  isResponding?: boolean;
  isError?: boolean;
  onFileReply?: (fileId: string) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(
    (fileIds?.length ?? 0) > 0,
  );
  const fileStore = useFileStore();

  useEffect(() => {
    const updateFiles = async () => {
      if (!fileIds) return;
      if (fileStore.contains(fileIds[0])) {
        setIsLoading(false);
        return;
      }
      const files = await Promise.all(
        fileIds.map(async (id) => await getFile(id)),
      );

      const successFiles: File[] = [];
      const successFileIds: string[] = [];
      const imageFileIds: string[] = [];
      const imageDataURLs: string[] = [];

      await Promise.all(
        files.map(async (file, idx) => {
          if (!file) return;
          successFiles.push(file);
          successFileIds.push(fileIds[idx]);
          const isImage = file.type.startsWith("image/");
          const isCanvas = file.name.endsWith(".canvas");
          if (!isImage && !isCanvas) return;

          let dataURL;
          if (isImage) dataURL = await readFileAsDataURL(file);
          else if (isCanvas) {
            const canvas = await createCanvasFromFile(file);
            dataURL = canvas?.toDataURL();
          }
          if (dataURL) {
            imageFileIds.push(fileIds[idx]);
            imageDataURLs.push(dataURL.toString());
          }
        }),
      );

      fileStore.addFiles(successFileIds, successFiles);
      fileStore.addDataURLs(imageFileIds, imageDataURLs);
      setIsLoading(false);
    };
    updateFiles();
  }, [fileIds]);

  if (isError) {
    return <div>isError</div>;
  }

  return (
    <li className="flex flex-row md:w-1/2 w-5/6 mt-5 mb-5">
      <div className="size-10">
        <MessageAvatar type={type} />
      </div>
      <div className="w-11/12 mt-0.5">
        {isResponding || isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{text}</p>
            {fileIds && (
              <div className="mt-2">
                {fileIds.map((id) => (
                  <MessageFile key={id} fileId={id} onReply={onFileReply!} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
}
