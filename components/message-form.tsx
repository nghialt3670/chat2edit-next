"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { nanoid } from "nanoid";
import { Send, Upload } from "lucide-react";

import Message from "@/types/Message";
import FormFile from "@/components/form-file";
import { usePathname } from "next/navigation";
import useFileStore from "@/stores/file-store";
import useChatStore from "@/stores/chat-store";
import sendMessage from "@/actions/sendMessage";
import { Button } from "@/components/ui/button";
import useMessageFormStore from "@/stores/message-form-store";

export default function MessageForm() {
  const [text, setText] = useState<string>("");
  const { fileIds, setFileIds } = useMessageFormStore();
  const textInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileStore = useFileStore();
  const chatStore = useChatStore();
  const pathname = usePathname();

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

    if (chatStore.status !== "idle") return;

    const reqMessage: Message = {
      id: nanoid(),
      text,
      fileIds,
    };

    setText("");
    setFileIds([]);

    chatStore.addMessage(reqMessage);
    setTimeout(() => chatStore.setStatus("responding"), 500);

    const formData = new FormData();
    if (pathname.startsWith("/chat/"))
      formData.set("chatId", pathname.split("/").pop()!);
    formData.set("text", reqMessage.text);
    const files = fileStore.getFiles(reqMessage.fileIds);
    files.forEach((file) => formData.append("files", file!));

    const response = await sendMessage(formData);

    if (response.newChatId)
      history.pushState({}, "", `/chat/${response.newChatId}`);

    if (!response.savedRequestMessage) {
      chatStore.setStatus("request_error");
      return;
    }

    if (!response.responseMessage) {
      chatStore.setStatus("response_error");
      return;
    }

    chatStore.addMessage({
      id: nanoid(),
      text: response.responseMessage.text,
      fileIds: response.responseMessage.fileIds,
    });
    chatStore.setStatus("idle");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute flex flex-col w-5/6 max-w-2xl min-w-64 bottom-24 rounded-lg bg-messageform shadow-sm"
      ref={formRef}
    >
      {fileIds.length !== 0 && (
        <div className="m-2 p-2 flex flex-wrap gap-6 max-h-64 overflow-y-scroll scroll-m-11 justify-between after:flex-auto">
          {fileIds.map((fileId) => (
            <FormFile key={fileId} fileId={fileId} />
          ))}
        </div>
      )}
      <div className="w-full h-full flex flex-row items-center justify-between">
        <Button
          size={"icon"}
          variant={"ghost"}
          type={"button"}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
        </Button>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          hidden
        />
        <input
          className="mx-2 bg-transparent outline-none w-[calc(100%-3rem)]"
          type="text"
          spellCheck="false"
          required
          value={text}
          ref={textInputRef}
          onChange={(e) => setText(e.target.value)}
        />
        <input className="z-50" type="submit" hidden />
        <Button
          size={"icon"}
          variant={"ghost"}
          type="submit"
          disabled={text.trim() === "" || chatStore.status !== "idle"}
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}