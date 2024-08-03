"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { Send, Upload } from "lucide-react";
import FormFile from "./FormFile";
import useChatFormStore from "@/stores/ChatFormStore";
import useFileStore from "@/stores/FileStore";
import mongoose from "mongoose";
import useConversationStore from "@/stores/ConversationStore";
import { sendMessage } from "@/actions/sendMessage";
import Message from "@/types/Message";

export default function ChatForm() {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLFormElement>(null);
  const chatFormStore = useChatFormStore();
  const fileStore = useFileStore();
  const convStore = useConversationStore();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const fileIds = files.map(() => new mongoose.Types.ObjectId().toString());
    fileStore.addFiles(fileIds, files);
    chatFormStore.setFileIds(fileIds);
    textInputRef.current?.focus();
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const files = fileStore.getFiles(chatFormStore.fileIds) as File[];

    const formData = new FormData();
    if (convStore.id) formData.append("conversationId", convStore.id)
    formData.append("text", text);
    files.forEach((file) => formData.append("files", file));

    chatFormStore.setFileIds([]);
    setText("");
    const message: Message = {
      id: new mongoose.Types.ObjectId().toString(),
      type: "Request",
      text: text,
      fileIds: chatFormStore.fileIds,
    };
    convStore.addMessage(message);
    const resMessage = await sendMessage(formData)
    if (!resMessage) throw new Error("Error sending message")
    convStore.addMessage(resMessage);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-8 rounded-3xl bg-gray-300 md:w-1/2 w-5/6"
      ref={ref}
    >
      {chatFormStore.fileIds.length !== 0 && (
        <div className="p-4">
          {chatFormStore.fileIds.map((fileId) => (
            <FormFile key={fileId} fileId={fileId} />
          ))}
        </div>
      )}
      <div className="w-full flex flex-row">
        <IconButton size="large" onClick={() => fileInputRef.current?.click()}>
          <Upload />
        </IconButton>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
        <input
          className="bg-transparent outline-none w-full"
          type="text"
          spellCheck="false"
          required
          ref={textInputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" hidden />
        <IconButton size="large" type="submit" disabled={text.trim() === ""}>
          <Send />
        </IconButton>
      </div>
    </form>
  );
}
