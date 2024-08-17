"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { Send, Upload } from "lucide-react";

import Message from "@/types/Message";
import useFileStore from "@/stores/file-store";
import FormFile from "./form-file-preview";
import { IconButton } from "@mui/material";
import useMessageFormStore from "@/stores/message-form-store";
import useConvStore from "@/stores/conv-store";
import sendMessage from "@/actions/sendMessage";
import { useRouter } from "next/navigation";

export default function MessageForm() {
  const [text, setText] = useState<string>("");
  const { fileIds, setFileIds } = useMessageFormStore();
  const textInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileStore = useFileStore();
  const convStore = useConvStore();
  const router = useRouter();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const fileIds = files.map(() => crypto.randomUUID());
    fileStore.addFiles(fileIds, files);
    setFileIds(fileIds);
    textInputRef.current?.focus();
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reqMessage: Message = {
      id: crypto.randomUUID(),
      type: "Request",
      text,
      fileIds,
    };

    setText("");
    setFileIds([]);

    convStore.addMessage(reqMessage);
    setTimeout(() => convStore.setStatus("isResponding"), 500);

    const formData = new FormData();
    if (convStore.id) formData.set("conversationId", convStore.id);
    formData.set("text", reqMessage.text);
    const files = fileStore.getFiles(reqMessage.fileIds);
    files.forEach((file) => formData.set("files", file!));

    const response = await sendMessage(formData);

    if (response.conversationId) {
      convStore.setId(response.conversationId);
      router.push(`/chat/${response.conversationId}`)
      // history.pushState({}, "", `/chat/${response.conversationId}`);
    }

    // if (response.fileIds)
    //   fileStore.updateIds(reqMessage.fileIds, response.fileIds);

    if (response.message) {
      convStore.addMessage(response.message)
      convStore.setStatus("isIdle")
    } else {
      convStore.setStatus("isError")
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute flex flex-col bottom-12 rounded-[26px] md:w-1/2 w-11/12 bg-messageform"
      ref={formRef}
    >
      {fileIds.length !== 0 && (
        <div className="m-5 flex flex-wrap gap-6 max-h-64 overflow-y-scroll scroll-m-11 justify-between after:flex-auto">
          {fileIds.map((fileId) => (
            <FormFile key={fileId} fileId={fileId} />
          ))}
        </div>
      )}
      <div className="w-full h-full flex flex-row items-center justify-center">
        <IconButton
          size="large"
          color="inherit"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
        </IconButton>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          hidden
        />
        <input
          className="bg-transparent outline-none w-full"
          type="text"
          spellCheck="false"
          required
          value={text}
          ref={textInputRef}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" hidden />
        <IconButton
          size="large"
          color="inherit"
          type="submit"
          disabled={text.trim() === ""}
        >
          <Send />
        </IconButton>
      </div>
    </form>
  );
}
