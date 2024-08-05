"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

import mongoose from "mongoose";
import { Send, Upload } from "lucide-react";

import Message from "@/types/Message";
import { IconButton } from "@mui/material";
import useFileStore from "@/stores/FileStore";
import { sendMessage } from "@/actions/sendMessage";
import useChatFormStore from "@/stores/ChatFormStore";
import { RESPONDING_MESSAGE_DELAY_MS } from "@/config/timer";
import useConversationStore from "@/stores/ConversationStore";

import FormFile from "./FormFile";
import { initConversation } from "@/actions/initConversation";
import { useRouter } from "next/navigation";

export default function ChatForm() {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const convStore = useConversationStore();
  const formStore = useChatFormStore();
  const fileStore = useFileStore();
  const router = useRouter();

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const fileIds = files.map(() => new mongoose.Types.ObjectId().toString());
    fileStore.addFiles(fileIds, files);
    formStore.setFileIds(fileIds);
    textInputRef.current?.focus();
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Initialize a conversation on the server
    // and redirect to the route base on the id
    let convId = convStore.id;
    if (!convId) {
      convId = await initConversation();
      router.push(`/chat/conversations/${convId}`);
      convStore.setId(convId);
    }

    // Create form data for submitting
    const formData = new FormData();
    const files = fileStore.getFiles(formStore.fileIds) as File[];
    formData.set("text", text);
    files.forEach((file) => formData.set("files", file));
    formData.set("conversationId", convId!);
    console.log(convId)

    // Reset input states
    formStore.setFileIds([]);
    setText("");

    // Update conversation states
    const message: Message = {
      id: new mongoose.Types.ObjectId().toString(),
      type: "Request",
      text: text,
      fileIds: formStore.fileIds,
    };
    convStore.addMessage(message);
    setTimeout(
      () => convStore.setStatus("Responding"),
      RESPONDING_MESSAGE_DELAY_MS,
    );

    // Send message to server
    try {
      const resMessage = await sendMessage(formData);
      // Update conversation states
      convStore.setStatus("Idle");
      convStore.addMessage(resMessage);
    } catch (error) {
      throw new Error("Error sending message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-8 rounded-3xl bg-gray-300 md:w-1/2 w-5/6"
      ref={formRef}
    >
      {formStore.fileIds.length !== 0 && (
        <div className="p-4 flex flex-wrap gap-6 max-h-64 overflow-y-scroll scroll-m-11 justify-between after:flex-auto">
          {formStore.fileIds.map((fileId) => (
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
          value={text}
          ref={textInputRef}
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
