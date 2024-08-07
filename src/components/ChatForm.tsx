"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import mongoose from "mongoose";
import { Send, Upload } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import useFileStore from "@/stores/FileStore";
import { sendMessage } from "@/actions/sendMessage";
import { postMessage } from "@/actions/postMessage";
import useChatFormStore from "@/stores/ChatFormStore";
import { postTempMessage } from "@/actions/postTempMessage";
import { sendTempMessage } from "@/actions/sendTempMessage";
import { RESPONDING_MESSAGE_DELAY_MS } from "@/config/timer";
import useConversationStore from "@/stores/ConversationStore";

import FormFile from "./FormFile";

export default function ChatForm() {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const convStore = useConversationStore();
  const formStore = useChatFormStore();
  const fileStore = useFileStore();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    const updateConversation = async () => {
      if (convStore.messages.length % 2 === 0) return;
      if (convStore.status !== "Requesting") return;
      setTimeout(
        () => convStore.setStatus("Responding"),
        RESPONDING_MESSAGE_DELAY_MS,
      );

      const reqMessage = convStore.messages[convStore.messages.length - 1];
      const formData = new FormData();
      formData.set("conversationId", convStore.id!);
      formData.set("text", reqMessage.text);
      reqMessage.fileIds.forEach((fileId) => formData.set("fileIds", fileId));

      try {
        const resMessage = user.isSignedIn
          ? await sendMessage(formData)
          : await sendTempMessage(formData);
        convStore.setStatus("Idle");
        convStore.addMessage(resMessage);
        convStore.setTitle(resMessage.text);
      } catch (error) {
        convStore.setStatus("Error");
      }
    };
    updateConversation();
  }, [convStore.messages]);

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

    // Create form data for submitting
    const formData = new FormData();
    const files = fileStore.getFiles(formStore.fileIds) as File[];
    if (convStore.id) formData.set("conversationId", convStore.id);
    formData.set("text", text);
    files.forEach((file) => formData.set("files", file));

    // Post the message base on whether the user is signed in
    // convStore.setStatus("Requesting");
    const { conversationId, fileIds } = user.isSignedIn
      ? await postMessage(formData)
      : await postTempMessage(formData);

    // Update client file ids to sync with server
    fileStore.updateIds(formStore.fileIds, fileIds);

    // Set the conversation id and navigate if
    // it is the first message
    if (!convStore.id) {
      convStore.setId(conversationId);
      router.push(`/chat/conversations/${conversationId}`);
    } else {
      convStore.addMessage({
        id: new mongoose.Types.ObjectId().toString(),
        type: "Request",
        text,
        fileIds,
      });
    }

    // Reset input states
    formStore.setFileIds([]);
    setText("");

    convStore.setStatus("Requesting");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-8 rounded-3xl bg-white md:w-1/2 w-5/6 border-gray-400 border-2"
      ref={formRef}
    >
      {formStore.fileIds.length !== 0 && (
        <div className="m-5 mb-0 flex flex-wrap gap-6 max-h-64 overflow-y-scroll scroll-m-11 justify-between after:flex-auto">
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
        <IconButton
          size="large"
          type="submit"
          disabled={text.trim() === "" || convStore.status !== "Idle"}
        >
          <Send />
        </IconButton>
      </div>
    </form>
  );
}
